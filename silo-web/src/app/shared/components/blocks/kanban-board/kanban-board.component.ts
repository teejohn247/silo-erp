import {
  Component,
  ChangeDetectionStrategy,
  Type,
  Injector,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { BehaviorSubject, combineLatest, map, debounceTime, distinctUntilChanged, shareReplay, Subject, fromEvent, takeUntil, filter } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { KanbanItem, KanbanMoveEvent, KanbanStage } from '@models/crm/deals-pipeline';


@Component({
  selector: 'kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent implements OnInit, OnChanges {
  @Input() stages: KanbanStage[] = [];
  @Input() items: KanbanItem[] = [];
  @Input() cardComponent!: Type<any>;

  /** If you want, you can set this to true to allow dropping only between some columns later */
  @Input() disableDrop = false;

  @Output() itemMoved = new EventEmitter<KanbanMoveEvent>();

  searchTerm = '';

  connectedStageIds: string[] = [];

  private stagesSubject = new BehaviorSubject<KanbanStage[]>([]);
  private itemsSubject = new BehaviorSubject<KanbanItem[]>([]);

  private search$ = new BehaviorSubject<string>('');
  private filter$ = new BehaviorSubject<((item: KanbanItem) => boolean) | null>(null);

  @ViewChild('scrollContainer', { static: false })
  scrollContainer?: ElementRef<HTMLElement>;

  private destroy$ = new Subject<void>();
  private isDragging = false;
  private rafId: number | null = null;

  private edgePx = 80;        // distance from edge to start scrolling
  private maxSpeed = 22;      // max px per frame
  private lastClientX = 0;

  constructor(private injector: Injector, private zone: NgZone) {}

  ngOnInit(): void {
    this.stagesSubject.next(this.stages ?? []);
    this.itemsSubject.next(this.items ?? []);
    this.rebuildConnections();

    // Listen to pointer movement while dragging and scroll accordingly
    this.zone.runOutsideAngular(() => {
      fromEvent<PointerEvent>(document, 'pointermove')
        .pipe(
          takeUntil(this.destroy$),
          filter(() => this.isDragging)
        )
        .subscribe((e) => {
          this.lastClientX = e.clientX;
          this.kickAutoScroll();
        });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stages']) {
      this.stagesSubject.next(this.stages ?? []);
      this.rebuildConnections();
    }
    if (changes['items']) {
      // copy to avoid parent mutation issues
      this.itemsSubject.next([...(this.items ?? [])]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.rafId != null) cancelAnimationFrame(this.rafId);
  }

  private filteredItems$ = combineLatest([
    this.itemsSubject.asObservable(),
    this.search$.pipe(debounceTime(250), distinctUntilChanged()),
    this.filter$.asObservable(),
  ]).pipe(
    map(([items, term, filter]) => {
      const t = (term || '').trim().toLowerCase();
      return items.filter((item) => {
        const matchesSearch =
          !t || JSON.stringify(item.data ?? {}).toLowerCase().includes(t);
        const matchesFilter = !filter || filter(item);
        return matchesSearch && matchesFilter;
      });
    }),
    shareReplay(1)
  );

  /** ViewModel = stages + items grouped */
  vm$ = combineLatest([this.stagesSubject.asObservable(), this.filteredItems$]).pipe(
    map(([stages, items]) => {
      const sortedStages = [...stages].sort((a, b) => a.order - b.order);

      console.log('Stages', sortedStages);

      // group items by stage
      const byStage = new Map<string, KanbanItem[]>();
      for (const it of items) {
        const arr = byStage.get(it.stageId) ?? [];
        arr.push(it);
        byStage.set(it.stageId, arr);
      }

      // optional: stable ordering
      for (const [k, arr] of byStage.entries()) {
        arr.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        byStage.set(k, arr);
      }

      let reqStages = sortedStages.map((s) => ({
        ...s,
        items: byStage.get(s._id) ?? [],
      }));

      console.log('Req', reqStages);

      return reqStages
    }),
    shareReplay(1)
  );

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value ?? '';
    this.searchTerm = value;
    this.search$.next(value);
  }

  /** Optional external filter */
  setFilter(fn: ((item: KanbanItem) => boolean) | null) {
    this.filter$.next(fn);
  }

  private rebuildConnections() {
    this.connectedStageIds = (this.stages ?? []).map((s) => s.id);
  }

  /** Call this on cdkDragStarted */
  onDragStarted() {
    this.isDragging = true;
  }

  /** Call this on cdkDragEnded */
  onDragEnded() {
    this.isDragging = false;
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /** Drop handler */
  onDrop(event: CdkDragDrop<KanbanItem[]>, targetStageId: string) {
    if (this.disableDrop) return;
    
    console.log('Drag Event', event);

    const item: KanbanItem = event.item.data;
    const fromStageId = event.previousContainer.id; // we set [id]="stage.id" on cdkDropList
    const toStageId = event.container.id;

    // Safety: sometimes people pass stageId param; trust container id first.
    const finalToStageId = toStageId || targetStageId;

    // 1) Update the visible arrays first (CDK expects this)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    // 2) Persist back into normalized itemsSubject (source of truth)
    this.persistFromColumnData(finalToStageId, item.id);

    // 3) Emit event to parent (API call happens there)
    this.itemMoved.emit({
      itemId: item.id,
      fromStageId: item.stageId ?? fromStageId,
      toStageId: finalToStageId,
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex,
      item: { ...item, stageId: finalToStageId },
    });

    // 4) Update dragged item's stageId so future moves are correct
    item.stageId = finalToStageId;
  }

  private kickAutoScroll() {
    if (this.rafId != null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.autoScrollStep();
      // keep stepping while dragging (smooth continuous scroll)
      if (this.isDragging) this.kickAutoScroll();
    });
  }

  private autoScrollStep() {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = this.lastClientX;

    const distLeft = x - rect.left;
    const distRight = rect.right - x;

    let delta = 0;

    if (distLeft < this.edgePx) {
      const intensity = (this.edgePx - distLeft) / this.edgePx; // 0..1
      delta = -Math.ceil(this.maxSpeed * intensity);
    } else if (distRight < this.edgePx) {
      const intensity = (this.edgePx - distRight) / this.edgePx; // 0..1
      delta = Math.ceil(this.maxSpeed * intensity);
    }

    if (delta !== 0) {
      el.scrollLeft += delta;
    }
  }

  /**
   * Persist ordering + stageIds back into normalized array based on current columns.
   * This keeps OnPush + vm$ consistent without fragile index math.
   */
  private persistFromColumnData(changedStageId: string, movedItemId: string) {
    const current = [...this.itemsSubject.value];

    // update the moved item stageId
    const idx = current.findIndex((x) => x.id === movedItemId);
    if (idx !== -1) {
      current[idx] = { ...current[idx], stageId: changedStageId };
    }

    // optional: recompute sortOrder per stage (helps backend persist order)
    const stageIds = this.connectedStageIds;
    for (const sid of stageIds) {
      const stageItems = current
        .filter((x) => x.stageId === sid)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      stageItems.forEach((it, i) => {
        const itIdx = current.findIndex((x) => x.id === it.id);
        current[itIdx] = { ...current[itIdx], sortOrder: i };
      });
    }

    this.itemsSubject.next(current);
  }

  /** Dynamic card injection */
  createInjector(item: KanbanItem) {
    return Injector.create({
      providers: [
        { provide: 'KANBAN_CARD_DATA', useValue: item.data },
        { provide: 'KANBAN_CARD_THEME', useValue: item.theme },
        { provide: 'KANBAN_ITEM_ID', useValue: item.id },
        { provide: 'KANBAN_STAGE_ID', useValue: item.stageId },
      ],
      parent: this.injector,
    });
  }

  trackStage = (_: number, s: KanbanStage) => s.id;
  trackItem = (_: number, i: KanbanItem) => i.id;
}
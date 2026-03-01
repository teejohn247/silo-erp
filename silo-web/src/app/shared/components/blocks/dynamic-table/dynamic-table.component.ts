import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  OnInit
} from '@angular/core';
import { IPaging, TableColumn } from '@models/general/table-data';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit {

  @Input() columns: TableColumn[] = [];
  @Input() data!: any;
  @Input() paging!: IPaging;
  @Input() loading = false;
  @Input() filters: any[] = [];
  @Input() displayFilters = true;
  @Input() showExport = false;
  @Input() showCheckbox = false;
  @Input() emptyDataImage:string = '';
  @Input() emptyDataMessage:string = 'No records exist';
  @Input() exportFields: string[] = []; 
  @Input() exportingData = false;
  @Input() bulkActions: { label: string; action: string; icon: any }[] = [];
  @Input() statusConfig: { [key: string]: { label: string; class: string } } = {
    pending: { label: 'Pending', class: 'table-status status-pending' },
    active: { label: 'Active', class: 'table-status status-active' },
    inactive: { label: 'Inactive', class: 'table-status status-inactive' },
  };

  @Output() pagingChange = new EventEmitter<IPaging>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() cellClick = new EventEmitter<{ row: any; column: TableColumn }>();
  @Output() bulkAction = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<any>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() actionClick = new EventEmitter<{action: string; row: any;}>();
  @Output() exportRequest = new EventEmitter<void>();

  selectedRows = new Set<any>();
  showFilter = false;

  searchTerm = '';
  private search$ = new Subject<string>();

  constructor() {
    // Debounce to prevent API spam
    this.search$.pipe(debounceTime(300)).subscribe(value => {
      this.searchChange.emit(value);
    });
  }

  ngOnInit(): void {
      
  }

  get showPagination(): boolean {
    if (!this.paging?.total || !this.paging?.pageSize) return false;

    const totalPages = Math.ceil(this.paging.total / this.paging.pageSize);
    return totalPages > 1;
  }

  toggleRow(row: any) {
    this.selectedRows.has(row) ? this.selectedRows.delete(row) : this.selectedRows.add(row);
    this.emitSelection();
  }

  toggleAll() {
    if (this.selectedRows.size === this.data.length) {
      this.selectedRows.clear();
    } 
    else {
      this.data.forEach((d:any) => this.selectedRows.add(d));
    }
    this.emitSelection();
  }

  onBulk(action: string) {
    this.bulkAction.emit(action);
  }

  trackByFn(index: number, item: any) {
    return item.id || index;
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    this.search$.next(value);
  }

  onPageChange(event:any) {
    //console.log('Page Changed', event)
    this.pagingChange.emit(event)
  }

  onExportClick() {
    this.exportRequest.emit();
  }

  handleCellClick(row: any, col: any, event: Event) {
    this.cellClick.emit({ row, column: col });
    event.stopPropagation();
  }

  handleActionClick(action: any, row: any, event: Event) {
    event.stopPropagation();

    // If callback exists → execute
    if (action.callback) {
      action.callback(row);
    }

    // If using actionKey → emit to parent
    if (action.actionKey) {
      this.actionClick.emit({
        action: action.actionKey,
        row
      });
    }
  }

  getValue(row: any, path: string): any {
    return path.split('.').reduce((obj, key) => obj?.[key], row);
  }

  getStatusKey(row: any, col: TableColumn): string {
    const value = row[col.key];

    // If a mapping exists, use it
    if (col.statusMap) {
      return col.statusMap[value];
    }

    // Otherwise assume direct match (string statuses)
    return value;
  }

  getStatusLabel(row: any, col: TableColumn): string {
    const key = this.getStatusKey(row, col);
    return this.statusConfig[key]?.label || key;
  }

  getStatusClass(row: any, col: TableColumn): string {
    const key = this.getStatusKey(row, col);
    return this.statusConfig[key]?.class || '';
  }

  emitSelection() {
    this.selectionChange.emit(Array.from(this.selectedRows));
  }
}
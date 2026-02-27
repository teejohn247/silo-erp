import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'date-scroll-selection',
  templateUrl: './date-scroll-selection.component.html',
  styleUrls: ['./date-scroll-selection.component.scss'],
  animations: [
    trigger('verticalSlide', [

      transition('* => up', [
        style({ transform: 'translateY(60px)', opacity: 0 }),
        animate('260ms cubic-bezier(.25,.8,.25,1)',
          style({ transform: 'translateY(0)', opacity: 1 }))
      ]),

      transition('* => down', [
        style({ transform: 'translateY(-60px)', opacity: 0 }),
        animate('260ms cubic-bezier(.25,.8,.25,1)',
          style({ transform: 'translateY(0)', opacity: 1 }))
      ])

    ])
  ]
})
export class DateScrollSelectionComponent
  implements OnInit, OnChanges {

  @Input() selectedDate?: Date;
  @Output() dateSelected = new EventEmitter<Date>();

  today = this.stripTime(new Date());

  visibleWeeks: Date[][] = [];

  animationDirection: 'up' | 'down' = 'up';
  animationKey = 0;

  readonly weekDayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  get allDays(): Date[] {
    return this.visibleWeeks.flat();
  }

  ngOnInit() {
    this.initializeWeeks(this.selectedDate ?? this.today);
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['selectedDate'] && this.selectedDate) {
    //   this.initializeWeeks(this.selectedDate);
    // }
  }

  /* ---------- INIT ---------- */

  private initializeWeeks(baseDate: Date) {
    const currentStart = this.getStartOfWeek(baseDate);
    const lastStart = this.addDays(currentStart, -7);

    this.visibleWeeks = [
      this.generateWeek(lastStart),   // previous week (left)
      this.generateWeek(currentStart) // current week (right)
    ];
  }

  generateWeek(start: Date): Date[] {
    return Array.from({ length: 7 }).map((_, i) => this.addDays(start, i));
  }

  /* ---------- NAVIGATION ---------- */

  previousWeek() {
    this.animationDirection = 'down';
    this.animationKey++;

    const firstStart = this.getStartOfWeek(this.visibleWeeks[0][0]);
    const newStart = this.addDays(firstStart, -7);

    // prepend new previous week
    this.visibleWeeks = [
      this.generateWeek(newStart),
      this.visibleWeeks[0]
    ];
  }

  nextWeek() {
    if (this.isCurrentWeekVisible()) return;

    this.animationDirection = 'up';
    this.animationKey++;

    const secondStart = this.getStartOfWeek(this.visibleWeeks[1][0]);
    const newStart = this.addDays(secondStart, 7);

    // append new next week
    this.visibleWeeks = [
      this.visibleWeeks[1],
      this.generateWeek(newStart)
    ];
  }

  /* ---------- SELECTION ---------- */

  selectDate(date: Date) {
    this.selectedDate = date;
    // console.log('Selected', date)
    this.dateSelected.emit(date);
  }

  /* ---------- HELPERS ---------- */

  addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return this.stripTime(d);
  }

  getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    return this.stripTime(d);
  }

  stripTime(date: Date): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

  isToday(date: Date) {
    return this.stripTime(date).getTime() === this.today.getTime();
  }

  isSelected(date: Date) {
    if (!this.selectedDate) return false;
    return this.stripTime(date).getTime() === this.stripTime(this.selectedDate).getTime();
  }

  isCurrentWeekVisible(): boolean {
    const currentStart = this.getStartOfWeek(this.today);

    return this.visibleWeeks.some(
      w => this.getStartOfWeek(w[0]).getTime() === currentStart.getTime()
    );
  }

  /* ---------- MONTH LABEL ---------- */

  get monthLabel(): string {
    const allDays = this.visibleWeeks.flat();

    const first = allDays[0];
    const last = allDays[allDays.length - 1];

    const m1 = first.toLocaleString('default',{month:'long'});
    const m2 = last.toLocaleString('default',{month:'long'});

    const y1 = first.getFullYear();
    const y2 = last.getFullYear();

    if (m1 === m2 && y1 === y2) {
      return `${m1} ${y1}`;
    }

    if (y1 === y2) {
      return `${m1} - ${m2} ${y1}`;
    }

    return `${m1} ${y1} - ${m2} ${y2}`;
  }
}
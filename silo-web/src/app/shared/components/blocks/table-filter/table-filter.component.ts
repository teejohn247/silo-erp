// filter.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FilterConfig } from '@models/general/table-data';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit, OnChanges {
  @Input() filters: FilterConfig[] = [];
  @Input() initialState: { [key: string]: any } = {};
  @Input() fWidth = '12rem'; // default width in px for each field
  @Input() fStyle = { 'font-size': '0.7rem' };
  @Output() filtersChange = new EventEmitter<{ [key: string]: any }>();

  public state: { [key: string]: any } = {};
  private change$ = new Subject<void>();

  ngOnInit() {
    this.initState();
    this.change$.pipe(debounceTime(250)).subscribe(() => {
      this.filtersChange.emit(this.getNormalizedState());
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters'] || changes['initialState']) {
      this.initState();
    }
  }

  private initState() {
    this.state = {};
    (this.filters || []).forEach(f => {
      if (this.initialState && this.initialState[f.key] !== undefined) {
        this.state[f.key] = this.initialState[f.key];
      } 
      else if (f.default !== undefined) {
        this.state[f.key] = f.default;
      } 
      else {
        this.state[f.key] = f.type === 'multiselect' ? [] : null;
      }
    });
  }

  onSelectChange(key: string, value: any) {
    this.state[key] = value;
    this.change$.next();
  }

  onTextChange(key: string, value: string) {
    this.state[key] = value;
    this.change$.next();
  }

  onDateChange(key: string, date: Date) {
    this.state[key] = date ? this.formatDate(date) : null;
    this.change$.next();
  }

  onRangeChange(key: string, part: 'start' | 'end', date: Date) {
    if (!this.state[key]) this.state[key] = { start: null, end: null };
    this.state[key][part] = date ? this.formatDate(date) : null;
    this.change$.next();
  }

  /** Normalized state ready for serialization */
  getNormalizedState() {
    // return a shallow copy to avoid mutation issues
    return { ...this.state };
  }

  /** Helper: format date as yyyy-MM-dd */
  private formatDate(d: Date): string {
    // Use local date portion only
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  /** Clear all filters to empty defaults and emit an empty initial state object */ 
  public clearAll(): void { 
    // set internal state to empty defaults 
    (this.filters || []).forEach(f => { this.state[f.key] = f.type === 'multiselect' ? [] : null; }); // emit cleared state immediately 
    this.filtersChange.emit({}); // parent expects an empty initial state 
  }
}



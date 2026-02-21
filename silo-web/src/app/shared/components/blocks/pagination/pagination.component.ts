import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { IPaging } from '@models/general/table-data';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() paging!: IPaging;
  @Input() pageSizeOptions: number[] = [5, 10, 15, 25, 50, 100];

  @Output() pagingChange = new EventEmitter<IPaging>();

  pages: number[] = [];
  totalPages = 0;

  ngOnInit(): void {
    //console.log('Init Paging', this.paging)
  }

  ngOnChanges() {
    this.buildPages();
  }

  private buildPages() {
    if (!this.paging?.total) return;

    this.totalPages = Math.ceil(this.paging.total / this.paging.pageSize);

    const current = this.paging.page;
    const range = 2;

    const start = Math.max(1, current - range);
    const end = Math.min(this.totalPages, current + range);

    this.pages = [];
    for (let i = start; i <= end; i++) {
      this.pages.push(i);
    }
  }

  goTo(page: number) {
    console.log('Page', page)
    if (page < 1 || page > this.totalPages) return;
    //console.log('Paging Comp', this.paging);
    this.pagingChange.emit({ ...this.paging, page });
  }

  changeSize(size: number) {
    this.pagingChange.emit({
      ...this.paging,
      pageSize: size,
      page: 1
    });
  }
}
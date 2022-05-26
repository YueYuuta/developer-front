import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  @Input() data: number = 0;
  @Input() pages: number = 10;
  pagination: number[] = [];
  paginationNumberTotal: number = 0;
  selectedPage = 1;
  @Input() limit = 5;
  @Input() prevText = 'Prev';
  @Input() nextText = 'Next';
  @Output() selectedPageEmitter: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.init();
  }
  private init(): void {
    if (this.data > 0) {
      this.paginationNumberTotal = this.calculatePaginationNumberTotal();
      this.pagination = this.createArray(1, this.limit);
    }
  }
  private calculatePaginationNumberTotal(): number {
    const total = Math.ceil(this.data / this.pages);
    return total;
  }

  private createArray(from: number, until: number): number[] {
    const request: number[] = [];
    for (let i = from; i <= until; i++) {
      request.push(i);
    }
    return request;
  }
  private halfPaginationBelow(): number {
    return Math.floor(this.limit / 2);
  }

  pageChange(page: number): void {
    this.selectedPage = page;
    const halfPagination = this.halfPaginationBelow();
    let from = page - halfPagination;
    const until = page + halfPagination;
    const sendArray = this.createArray(from, until);
    if (
      page > halfPagination &&
      page <= this.paginationNumberTotal - halfPagination
    ) {
      this.pagination = sendArray;
    } else if (page <= halfPagination) {
      this.pagination = this.createArray(1, this.limit);
    } else {
      from = this.paginationNumberTotal - this.limit;
      this.pagination = this.createArray(from, this.paginationNumberTotal);
    }
    this.selectedPageEmitter.emit(this.selectedPage);
  }

  prev(): void {
    const page = this.selectedPage - 1;
    this.pageChange(page);
  }
  next(): void {
    const page = this.selectedPage + 1;
    this.pageChange(page);
  }
}

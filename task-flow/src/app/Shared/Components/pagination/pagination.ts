import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-pagination',
  styleUrl: './pagination.css',
  templateUrl: './pagination.html',
})
export class Pagination {
  readonly currentPage = input(1);
  readonly totalPages = input(1);

  readonly pageChanged = output<number>();

  get pages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  goTo(page: number) {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.pageChanged.emit(page);
  }

  prev() {
    this.goTo(this.currentPage() - 1);
  }

  next() {
    this.goTo(this.currentPage() + 1);
  }
}
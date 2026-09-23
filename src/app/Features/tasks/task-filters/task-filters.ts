import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-task-filters',
  styleUrl: './task-filters.css',
  templateUrl: './task-filters.html',
})
export class TaskFilters {
  // Phase 1 — visual-only filter state, no actual filtering logic yet
  statusOptions = ['All', 'To Do', 'In Progress', 'Done'];
  activeStatus = 'All';

  // Parent can listen if/when real filtering is wired up later
  @Output() statusChanged = new EventEmitter<string>();

  selectStatus(status: string) {
    this.activeStatus = status;
    this.statusChanged.emit(status);
  }
}
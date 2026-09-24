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
  statusOptions = ['All', 'To Do', 'In Progress', 'Done'];
  activeStatus = 'All';

  priorityOptions = ['All Priorities', 'Low', 'Medium', 'High'];
  activePriority = 'All Priorities';

  searchText = '';

  @Output() statusChanged = new EventEmitter<string>();
  @Output() priorityChanged = new EventEmitter<string>();
  @Output() searchChanged = new EventEmitter<string>();

  selectStatus(status: string) {
    this.activeStatus = status;
    const normalized = status === 'To Do' ? 'Todo' : status;
    this.statusChanged.emit(normalized);
  }

  selectPriority(priority: string) {
    this.activePriority = priority;
    this.priorityChanged.emit(priority === 'All Priorities' ? 'All' : priority);
  }

  onSearchInput(value: string) {
    this.searchText = value;
    this.searchChanged.emit(value.trim().toLowerCase());
  }
}
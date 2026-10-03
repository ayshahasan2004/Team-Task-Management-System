import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../Core/services/task.service';
import { TaskStatus } from '../../../Core/models/task.model';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-task-filters',
  styleUrl: './task-filters.css',
  templateUrl: './task-filters.html',
})
export class TaskFilters {
  private taskService = inject(TaskService);

  // Live per-status counts, so a new status in the model shows up here automatically
  readonly statusCounts = this.taskService.statusCounts;

  statusOptions = ['All', 'To Do', 'In Progress', 'Review', 'Done'];
  activeStatus = 'All';

  priorityOptions = ['All Priorities', 'Low', 'Medium', 'High'];
  activePriority = 'All Priorities';

  searchText = '';

  readonly statusChanged = output<string>();
  readonly priorityChanged = output<string>();
  readonly searchChanged = output<string>();

  selectStatus(status: string) {
    this.activeStatus = status;
    this.statusChanged.emit(this.asTaskStatus(status));
  }

  // Maps the display label back to the TaskStatus used by the model
  asTaskStatus(status: string): TaskStatus {
    return (status === 'To Do' ? 'Todo' : status) as TaskStatus;
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
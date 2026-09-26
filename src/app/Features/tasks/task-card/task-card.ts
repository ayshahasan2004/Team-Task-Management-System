import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatusBadge } from '../task-status-badge/task-status-badge';
import { Task } from '../../../Core/models/task.model';
import { TaskService } from '../../../Core/services/task.service';

@Component({
  standalone: true,
  imports: [CommonModule, TaskStatusBadge],
  selector: 'app-task-card',
  styleUrl: './task-card.css',
  templateUrl: './task-card.html',
})
export class TaskCard {
  private taskService = inject(TaskService);

  readonly task = input.required<Task>();

  readonly detailsClicked = output<string>();

  onViewDetails(event: Event): void {
    event.stopPropagation();
    this.detailsClicked.emit(this.task().id);
  }

  get priorityClass(): string {
    return this.task().priority.toLowerCase();
  }

  get assigneeInitial(): string {
    return this.taskService.initialFor(this.task());
  }

  formatDueDate(date: Date | null): string {
    if (!date) {
      return 'No due date';
    }

    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
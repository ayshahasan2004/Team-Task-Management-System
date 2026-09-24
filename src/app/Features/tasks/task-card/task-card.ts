import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatusBadge } from '../task-status-badge/task-status-badge';
import { Task } from '../../../Core/models/task.model';

@Component({
  standalone: true,
  imports: [CommonModule, TaskStatusBadge],
  selector: 'app-task-card',
  styleUrl: './task-card.css',
  templateUrl: './task-card.html',
})
export class TaskCard {
  @Input() task!: Task;

  @Output() detailsClicked = new EventEmitter<string>();

  onViewDetails(event: Event): void {
    event.stopPropagation();
    this.detailsClicked.emit(this.task.id);
  }

  get priorityClass(): string {
    return this.task.priority.toLowerCase();
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
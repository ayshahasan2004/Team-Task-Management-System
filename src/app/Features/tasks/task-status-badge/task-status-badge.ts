import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatus } from '../../../Core/models/task.model';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-task-status-badge',
  styleUrl: './task-status-badge.css',
  templateUrl: './task-status-badge.html',
})
export class TaskStatusBadge {
  readonly status = input<TaskStatus>('Todo');

  get statusClass(): string {
    const normalized = this.status().toLowerCase();

    if (normalized === 'todo') {
      return 'to-do';
    }

    return normalized.replace(' ', '-');
  }
}
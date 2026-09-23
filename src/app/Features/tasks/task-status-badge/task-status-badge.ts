import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

@Component({
  imports: [CommonModule],
  selector: 'app-task-status-badge',
  styleUrl: './task-status-badge.css',
  templateUrl: './task-status-badge.html',
})
export class TaskStatusBadge {
  @Input() status: TaskStatus = 'To Do';

  get statusClass(): string {
    return this.status.toLowerCase().replace(' ', '-');
  }
}
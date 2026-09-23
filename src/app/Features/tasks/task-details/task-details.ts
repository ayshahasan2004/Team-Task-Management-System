import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatusBadge } from '../task-status-badge/task-status-badge';
import { Task } from '../task-card/task-card';

@Component({
  standalone: true,
  imports: [CommonModule, TaskStatusBadge],
  selector: 'app-task-details',
  styleUrl: './task-details.css',
  templateUrl: './task-details.html',
})
export class TaskDetails {
  // Phase 1 — mock fallback, real wiring (route param / service) comes later
  @Input() task: Task = {
    id: 'task-1',
    title: 'Update login UI',
    description:
      'Apply the new dark showcase theme to the login and signup pages, including mobile breakpoints and glassmorphism styling.',
    status: 'In Progress',
    priority: 'High',
    assigneeInitial: 'A',
    assigneeName: 'Aysha',
    dueDate: 'Sep 18',
  };
}
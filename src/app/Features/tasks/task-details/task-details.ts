import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatusBadge } from '../task-status-badge/task-status-badge';
import { Task } from '../../../Core/models/task.model';

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
    projectId: 'p1',
    title: 'Update login UI',
    description:
      'Apply the new dark showcase theme to the login and signup pages, including mobile breakpoints and glassmorphism styling.',
    status: 'In Progress',
    priority: 'High',
    assigneeId: 'm1',
    dueDate: new Date('2026-09-18'),
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
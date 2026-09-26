import { Component, OnInit, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskStatusBadge } from '../task-status-badge/task-status-badge';
import { Task, TaskPriority, TaskStatus } from '../../../Core/models/task.model';
import { TaskService } from '../../../Core/services/task.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TaskStatusBadge],
  selector: 'app-task-details',
  styleUrl: './task-details.css',
  templateUrl: './task-details.html',
})
export class TaskDetails implements OnInit {
  readonly task = input<Task | null>(null);

  readonly taskService = inject(TaskService);
  private route = inject(ActivatedRoute, { optional: true });

  // Local editable copy — starts from the route when no input was supplied
  currentTask: Task | null = null;

  isEditing = false;
  title = '';
  description = '';
  status: TaskStatus = 'Todo';
  priority: TaskPriority = 'Medium';
  dueDate = '';

  readonly statuses: TaskStatus[] = ['Todo', 'In Progress', 'Review', 'Done'];
  readonly priorities: TaskPriority[] = ['Low', 'Medium', 'High'];

  ngOnInit(): void {
    const taskId = this.route?.snapshot.paramMap.get('id');
    if (taskId) {
      this.currentTask = this.taskService.getById(taskId) ?? null;
    } else {
      this.currentTask = this.task();
    }
  }

  startEditing(): void {
    if (!this.currentTask) {
      return;
    }

    this.title = this.currentTask.title;
    this.description = this.currentTask.description;
    this.status = this.currentTask.status;
    this.priority = this.currentTask.priority;
    this.dueDate = this.currentTask.dueDate ? this.toDateInputValue(this.currentTask.dueDate) : '';
    this.isEditing = true;
  }

  saveChanges(): void {
    if (!this.currentTask || !this.title.trim()) {
      return;
    }

    this.taskService.update(this.currentTask.id, {
      title: this.title.trim(),
      description: this.description.trim(),
      status: this.status,
      priority: this.priority,
      dueDate: this.dueDate ? new Date(`${this.dueDate}T00:00:00`) : null,
    });

    this.currentTask = this.taskService.getById(this.currentTask.id) ?? null;
    this.isEditing = false;
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  private toDateInputValue(date: Date): string {
    const value = new Date(date);
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  }
}
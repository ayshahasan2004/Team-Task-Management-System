import { Component, Input, OnInit, inject } from '@angular/core';
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
  @Input() task: Task | null = null;

  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute, { optional: true });

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
      this.task = this.taskService.getById(taskId) ?? null;
    }
  }

  startEditing(): void {
    if (!this.task) {
      return;
    }

    this.title = this.task.title;
    this.description = this.task.description;
    this.status = this.task.status;
    this.priority = this.task.priority;
    this.dueDate = this.task.dueDate ? this.toDateInputValue(this.task.dueDate) : '';
    this.isEditing = true;
  }

  saveChanges(): void {
    if (!this.task || !this.title.trim()) {
      return;
    }

    this.taskService.update(this.task.id, {
      title: this.title.trim(),
      description: this.description.trim(),
      status: this.status,
      priority: this.priority,
      dueDate: this.dueDate ? new Date(`${this.dueDate}T00:00:00`) : null,
    });

    this.task = this.taskService.getById(this.task.id) ?? null;
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
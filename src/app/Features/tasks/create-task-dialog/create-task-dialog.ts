import { Component, Output, EventEmitter, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../Core/services/task.service';
import { TaskStatus, TaskPriority } from '../../../Core/models/task.model';

@Component({
  selector: 'app-create-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task-dialog.html',
  styleUrl: './create-task-dialog.css',
})
export class CreateTaskDialog {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  private taskService = inject(TaskService);

  // form fields — plain properties + ngModel, since Reactive Forms
  // is a later phase (per your original roadmap, Sprint 3/Phase 5)
  title = '';
  description = '';
  status: TaskStatus = 'Todo';
  priority: TaskPriority = 'Medium';
  dueDate = '';

  submit(): void {
    if (!this.title.trim()) return; // minimal guard for now

    const dueDate = this.dueDate ? new Date(`${this.dueDate}T00:00:00`) : null;

    this.taskService.create({
      projectId: 'p1', // hardcoded until a project-picker exists
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      assigneeId: null,
      dueDate,
      tags: [],
    });

    this.resetForm();
    this.created.emit();
  }

  cancel(): void {
    this.resetForm();
    this.closed.emit();
  }

  private resetForm(): void {
    this.title = '';
    this.description = '';
    this.status = 'Todo';
    this.priority = 'Medium';
    this.dueDate = '';
  }
}
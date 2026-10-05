import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../Core/services/task.service';
import { ProjectService } from '../../../Core/services/project.service';
import { TaskStatus, TaskPriority } from '../../../Core/models/task.model';

@Component({
  selector: 'app-create-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task-dialog.html',
  styleUrl: './create-task-dialog.css',
})
export class CreateTaskDialog {
  readonly isOpen = input(false);
  readonly closed = output<void>();
  readonly created = output<void>();

  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  readonly projects = this.projectService.projects;

  // form fields — plain properties + ngModel, since Reactive Forms
  // is a later phase (per your original roadmap, Sprint 3/Phase 5)
  title = '';
  description = '';
  status: TaskStatus = 'Todo';
  priority: TaskPriority = 'Medium';
  dueDate = '';
  projectId = '';
  isCreating = false;
  saveError = '';

  submit(): void {
    if (!this.title.trim() || !this.projectId) {
      this.saveError = this.projectId ? 'Enter a task title.' : 'Choose a project for this task.';
      return;
    }

    const dueDate = this.dueDate ? new Date(`${this.dueDate}T00:00:00`) : null;
    this.saveError = '';
    this.isCreating = true;

    this.taskService.create({
      projectId: this.projectId,
      title: this.title.trim(),
      description: this.description.trim(),
      status: this.status,
      priority: this.priority,
      assigneeId: null,
      dueDate,
      tags: [],
    }).subscribe({
      next: () => {
        this.resetForm();
        this.isCreating = false;
        this.created.emit();
      },
      error: () => {
        this.isCreating = false;
        this.saveError = 'Task could not be saved. Please try again.';
      },
    });
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
    this.projectId = '';
    this.saveError = '';
    this.isCreating = false;
  }
}
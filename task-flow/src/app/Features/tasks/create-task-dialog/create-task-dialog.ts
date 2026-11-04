import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../Core/services/task.service';
import { ProjectService } from '../../../Core/services/project.service';
import { TaskStatus, TaskPriority } from '../../../Core/models/task.model';

@Component({
  selector: 'app-create-task-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-task-dialog.html',
  styleUrl: './create-task-dialog.css',
})
export class CreateTaskDialog {
  readonly isOpen = input(false);
  readonly closed = output<void>();
  readonly created = output<void>();

  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);
  readonly projects = this.projectService.projects;

  isCreating = false;
  saveError = '';
  submitted = false;

  // Phase 5: Reactive Forms — every field has validators; the template reads
  // control state directly instead of ngModel two-way binding.
  form = this.fb.nonNullable.group({
    projectId: ['', Validators.required],
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', Validators.maxLength(500)],
    status: this.fb.nonNullable.control<TaskStatus>('Todo'),
    priority: this.fb.nonNullable.control<TaskPriority>('Medium'),
    dueDate: [''],
  });

  get projectId() {
    return this.form.controls.projectId;
  }

  get title() {
    return this.form.controls.title;
  }

  get description() {
    return this.form.controls.description;
  }

  get dueDate() {
    return this.form.controls.dueDate;
  }

  // Shows a field error only after the user touched it or tried to submit
  showError(control: { invalid: boolean; touched: boolean }): boolean {
    return control.invalid && (control.touched || this.submitted);
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.saveError = this.projectId.invalid ? 'Choose a project for this task.' : 'Please fix the errors above.';
      return;
    }

    const value = this.form.getRawValue();
    const dueDate = value.dueDate ? new Date(`${value.dueDate}T00:00:00`) : null;
    this.saveError = '';
    this.isCreating = true;

    this.taskService.create({
      projectId: value.projectId,
      title: value.title.trim(),
      description: value.description.trim(),
      status: value.status,
      priority: value.priority,
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
    this.form.reset({
      projectId: '',
      title: '',
      description: '',
      status: 'Todo' as TaskStatus,
      priority: 'Medium' as TaskPriority,
      dueDate: '',
    });
    this.saveError = '';
    this.isCreating = false;
    this.submitted = false;
  }
}
import { Component, OnChanges, SimpleChanges, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { Modal } from '../../../Shared/Components/modal/modal';
import { Loading } from '../../../Shared/Components/loading/loading';
import { ProjectService } from '../../../Core/services/project.service';
import { Project, ProjectStatus } from '../../../Core/models/project.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Modal, Loading],
  selector: 'app-create-project-dialog',
  styleUrl: './create-project-dialog.css',
  templateUrl: './create-project-dialog.html',
})
export class CreateProjectDialog implements OnChanges {
  readonly isOpen = input(false);
  readonly editingProject = input<Project | null>(null);// The project being edited, if any

  readonly closed = output<void>();
  readonly saved = output<void>();

  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);
  // Inject ProjectService to handle project creation and updates

  dueDateError = '';
  saveError = '';
  isCreating = false;
  submitted = false;

  // Phase 5: Reactive Forms — name is required; due date must be in the future
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    description: ['', Validators.maxLength(500)],
    status: this.fb.nonNullable.control<ProjectStatus>('Active'),
    dueDate: ['', this.dueDateInFuture()],
  });

  get name() {
    return this.form.controls.name;
  }

  get description() {
    return this.form.controls.description;
  }

  get dueDate() {
    return this.form.controls.dueDate;
  }

  // Custom validator: if set, the due date must be after today
  private dueDateInFuture(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) {
        return null; // due date is optional
      }
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const chosen = new Date(`${value}T00:00:00`);
      return chosen >= tomorrow ? null : { dueDateInPast: true };
    };
  }

  get minimumDueDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.toDateInputValue(tomorrow);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingProject'] || changes['isOpen']) {// Check if the editingProject or isOpen input has changed
      const editingProject = this.editingProject();
      if (editingProject) {// If editingProject is provided, populate the form with its data
        this.form.patchValue({
          name: editingProject.name,
          description: editingProject.description,
          status: editingProject.status,
          dueDate: editingProject.dueDate ? this.toDateInputValue(editingProject.dueDate) : '',
        });
        this.dueDateError = '';
        this.saveError = '';
      } else if (this.isOpen()) {
        this.resetForm();// If the dialog is opened for creating a new project, reset the form
      }
    }
  }

  get isEditMode(): boolean {// Determine if the dialog is in edit mode based on whether editingProject is provided
    return this.editingProject() !== null;// Return true if editingProject is not null, indicating edit mode
  }

  onClose() {
    this.resetForm();// Reset form fields when closing the dialog
    this.closed.emit();// Emit the closed event to notify the parent component that the dialog has been closed
  }

  // Shows a field error only after the user touched it or tried to submit
  showError(control: { invalid: boolean; touched: boolean }): boolean {
    return control.invalid && (control.touched || this.submitted);
  }

  onSubmit() {
    this.submitted = true;
    this.dueDateError = '';
    this.saveError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.isCreating = true;

    const dueDate = value.dueDate ? new Date(`${value.dueDate}T00:00:00`) : null;
    if (this.editingProject()) {
      this.projectService.update(this.editingProject()!.id, {
        name: value.name.trim(),
        description: value.description.trim(),
        status: value.status,
        dueDate,
      });
      this.completeSave();
      return;
    }

    this.projectService.create({
      name: value.name.trim(),
      description: value.description.trim(),
      status: value.status,
      memberIds: [],
      dueDate,
    }).subscribe({
      next: () => this.completeSave(),
      error: () => {
        this.isCreating = false;
        this.saveError = 'Project could not be saved. Please try again.';
      },
    });
  }

  private completeSave(): void {
    this.resetForm();
    this.isCreating = false;
    this.saved.emit();
  }

  private resetForm(): void {
    this.form.reset({ name: '', description: '', status: 'Active' as ProjectStatus, dueDate: '' });
    this.dueDateError = '';
    this.saveError = '';
    this.submitted = false;
  }

  private toDateInputValue(date: Date): string {
    const value = new Date(date);
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  }
}
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../../Shared/Components/modal/modal';
import { Loading } from '../../../Shared/Components/loading/loading';
import { ProjectService } from '../../../Core/services/project.service';
import { Project, ProjectStatus } from '../../../Core/models/project.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, Modal, Loading],
  selector: 'app-create-project-dialog',
  styleUrl: './create-project-dialog.css',
  templateUrl: './create-project-dialog.html',
})
export class CreateProjectDialog implements OnChanges {
  @Input() isOpen = false;
  @Input() editingProject: Project | null = null;// The project being edited, if any

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private projectService = inject(ProjectService);
// Inject ProjectService to handle project creation and updates
  name = '';
  description = '';
  status: ProjectStatus = 'Active';
  dueDate = '';
  dueDateError = '';
  isCreating = false;

  get minimumDueDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.toDateInputValue(tomorrow);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingProject'] || changes['isOpen']) {// Check if the editingProject or isOpen input has changed
      if (this.editingProject) {// If editingProject is provided, populate the form fields with its data
        this.name = this.editingProject.name;// Set the name field to the editing project's name
        this.description = this.editingProject.description;
        this.status = this.editingProject.status;
        this.dueDate = this.editingProject.dueDate ? this.toDateInputValue(this.editingProject.dueDate) : '';
        this.dueDateError = '';
      } else if (this.isOpen) {
        this.resetForm();// If the dialog is opened for creating a new project, reset the form fields
      }
    }
  }

  get isEditMode(): boolean {// Determine if the dialog is in edit mode based on whether editingProject is provided
    return this.editingProject !== null;// Return true if editingProject is not null, indicating edit mode
  }

  onClose() {
    this.resetForm();// Reset form fields when closing the dialog
    this.closed.emit();// Emit the closed event to notify the parent component that the dialog has been closed
  }

  onSubmit() {
    if (!this.name.trim()) {// Validate that the name field is not empty
      return;
    }

    if (this.dueDate && this.dueDate < this.minimumDueDate) {
      this.dueDateError = 'Due date must be later than today.';
      return;
    }

    this.dueDateError = '';

    this.isCreating = true;

    if (this.editingProject) {// If editingProject is provided, update the existing project
      this.projectService.update(this.editingProject.id, {// Update the project using the ProjectService
        name: this.name.trim(),
        description: this.description.trim(),
        status: this.status,
        dueDate: this.dueDate ? new Date(`${this.dueDate}T00:00:00`) : null,
      });
    } else {
      this.projectService.create({// If no editingProject is provided, create a new project
        name: this.name.trim(),
        description: this.description.trim(),
        status: this.status,
        memberIds: [],
        dueDate: this.dueDate ? new Date(`${this.dueDate}T00:00:00`) : null,
      });
    }

    this.resetForm();// Reset form fields after submission
    this.isCreating = false;
    this.saved.emit();// Emit the saved event to notify the parent
    //// component that a project has been created or updated
  }

  private resetForm(): void {
    this.name = '';
    this.description = '';
    this.status = 'Active';
    this.dueDate = '';
    this.dueDateError = '';
  }

  private toDateInputValue(date: Date): string {
    const value = new Date(date);
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  }
}
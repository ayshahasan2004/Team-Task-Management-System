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
  @Input() editingProject: Project | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private projectService = inject(ProjectService);

  name = '';
  description = '';
  status: ProjectStatus = 'Active';
  isCreating = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingProject'] || changes['isOpen']) {
      if (this.editingProject) {
        this.name = this.editingProject.name;
        this.description = this.editingProject.description;
        this.status = this.editingProject.status;
      } else if (this.isOpen) {
        this.resetForm();
      }
    }
  }

  get isEditMode(): boolean {
    return this.editingProject !== null;
  }

  onClose() {
    this.resetForm();// Reset form fields when closing the dialog
    this.closed.emit();
  }

  onSubmit() {
    if (!this.name.trim()) {
      return;
    }

    this.isCreating = true;

    if (this.editingProject) {
      this.projectService.update(this.editingProject.id, {
        name: this.name.trim(),
        description: this.description.trim(),
        status: this.status,
      });
    } else {
      this.projectService.create({
        name: this.name.trim(),
        description: this.description.trim(),
        status: this.status,
        memberIds: [],
      });
    }

    this.resetForm();
    this.isCreating = false;
    this.saved.emit();
  }

  private resetForm(): void {
    this.name = '';
    this.description = '';
    this.status = 'Active';
  }
}
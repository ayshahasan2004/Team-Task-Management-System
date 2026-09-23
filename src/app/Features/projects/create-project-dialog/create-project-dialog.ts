import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from '../../../Shared/Components/modal/modal';
import { Loading } from '../../../Shared/Components/loading/loading';

@Component({
  standalone: true,
  imports: [CommonModule, Modal, Loading],
  selector: 'app-create-project-dialog',
  styleUrl: './create-project-dialog.css',
  templateUrl: './create-project-dialog.html',
})
export class CreateProjectDialog {
  // Controlled by parent (Projects) — open/close state lives there
  @Input() isOpen = false;

  // Bubbled up to parent — no FormGroup/validators yet (Phase 1),
  // parent decides what "create" actually does once real logic exists
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  isCreating = false;

  onClose() {
    this.closed.emit();
  }

  onCreate() {
    this.isCreating = true;

    setTimeout(() => {
      this.isCreating = false;
      this.created.emit();
    }, 500);
  }
}
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-create-task-dialog',
  styleUrl: './create-task-dialog.css',
  templateUrl: './create-task-dialog.html',
})
export class CreateTaskDialog {
  @Input() isOpen = false;

  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  onClose() {
    this.closed.emit();
  }

  onCreate() {
    this.created.emit();
  }
}
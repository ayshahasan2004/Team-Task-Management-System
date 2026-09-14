import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-modal',
  styleUrl: './modal.css',
  templateUrl: './modal.html',
})
export class Modal {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() maxWidth = '440px';

  @Output() closed = new EventEmitter<void>();

  onClose() {
    this.closed.emit();
  }
}
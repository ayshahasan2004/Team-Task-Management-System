import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-modal',
  styleUrl: './modal.css',
  templateUrl: './modal.html',
})
export class Modal {
  readonly isOpen = input(false);
  readonly title = input('');
  readonly maxWidth = input('440px');

  readonly closed = output<void>();

  onClose() {
    this.closed.emit();
  }
}
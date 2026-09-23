import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  imports: [CommonModule],
  selector: 'app-button',
  styleUrl: './button.css',
  templateUrl: './button.html',
})
export class Button {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() type: 'button' | 'submit' = 'button';

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
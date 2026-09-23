import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-empty-state',
  styleUrl: './empty-state.css',
  templateUrl: './empty-state.html',
})
export class EmptyState {
  @Input() icon = '📭';
  @Input() title = 'Nothing here yet';
  @Input() description = '';
  @Input() actionLabel = '';

  @Output() actionClicked = new EventEmitter<void>();

  onAction() {
    this.actionClicked.emit();
  }
}
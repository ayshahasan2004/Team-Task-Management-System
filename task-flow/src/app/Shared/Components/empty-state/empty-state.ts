import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-empty-state',
  styleUrl: './empty-state.css',
  templateUrl: './empty-state.html',
})
export class EmptyState {
  readonly icon = input('📭');
  readonly title = input('Nothing here yet');
  readonly description = input('');
  readonly actionLabel = input('');

  readonly actionClicked = output<void>();

  onAction() {
    this.actionClicked.emit();
  }
}
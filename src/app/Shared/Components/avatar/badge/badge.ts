import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-badge',
  styleUrl: './badge.css',
  templateUrl: './badge.html',
})
export class Badge {
  readonly text = input('');
  readonly variant = input<BadgeVariant>('neutral');
}
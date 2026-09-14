import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
  imports: [CommonModule],
  selector: 'app-badge',
  styleUrl: './badge.css',
  templateUrl: './badge.html',
})
export class Badge {
  @Input() text = '';
  @Input() variant: BadgeVariant = 'neutral';
}
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-stat-card',
  styleUrl: './stat-card.css',
  templateUrl: './stat-card.html',
})
export class StatCard {
  // Reusable — receives everything via @Input() from parent (Dashboard)
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() icon = '📊';
  @Input() trend = ''; // e.g. "+12%" — optional
  @Input() trendPositive = true;
}
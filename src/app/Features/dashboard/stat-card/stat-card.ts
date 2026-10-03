import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-stat-card',
  styleUrl: './stat-card.css',
  templateUrl: './stat-card.html',
})
export class StatCard {
  // Reusable — receives everything via input() signals from parent (Dashboard)
  readonly label = input('');
  readonly value = input<string | number>('');
  readonly icon = input('📊');
  readonly trend = input(''); // e.g. "+12%" — optional
  readonly trendPositive = input(true);
}
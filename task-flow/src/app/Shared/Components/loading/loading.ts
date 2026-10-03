import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoadingSize = 'sm' | 'md' | 'lg';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-loading',
  styleUrl: './loading.css',
  templateUrl: './loading.html',
})
export class Loading {
  readonly size = input<LoadingSize>('md');
  readonly fullPage = input(false);
  readonly label = input('');
}
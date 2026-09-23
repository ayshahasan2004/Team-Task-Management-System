import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoadingSize = 'sm' | 'md' | 'lg';

@Component({
  imports: [CommonModule],
  selector: 'app-loading',
  styleUrl: './loading.css',
  templateUrl: './loading.html',
})
export class Loading {
  @Input() size: LoadingSize = 'md';
  @Input() fullPage = false;
  @Input() label = '';
}
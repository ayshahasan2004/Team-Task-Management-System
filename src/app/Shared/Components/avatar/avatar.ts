import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarStatus = 'online' | 'offline' | 'none';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-avatar',
  styleUrl: './avatar.css',
  templateUrl: './avatar.html',
})
export class Avatar {
  readonly initial = input('');
  readonly size = input<AvatarSize>('md');
  readonly status = input<AvatarStatus>('none');
}
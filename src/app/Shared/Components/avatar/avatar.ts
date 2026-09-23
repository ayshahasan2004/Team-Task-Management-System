import { Component, Input } from '@angular/core';
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
  @Input() initial = '';
  @Input() size: AvatarSize = 'md';
  @Input() status: AvatarStatus = 'none';
}
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface MockUser {
  name: string;
  email: string;
  avatarInitial: string;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-user-menu',
  styleUrl: './user-menu.css',
  templateUrl: './user-menu.html',
})
export class UserMenu {
  constructor(private router: Router) {}

  // Passed down from Header (parent -> child communication)
  @Input() user: MockUser = {
    name: 'Aysha',
    email: 'aysha@taskflow.dev',
    avatarInitial: 'A',
  };

  @Input() isOpen = false;

  // Bubbled up to Header (child -> parent communication)
  @Output() logoutClicked = new EventEmitter<void>();

  onSettings() {
    this.router.navigate(['/settings']);
  }

  onLogout() {
    this.logoutClicked.emit();
  }
}
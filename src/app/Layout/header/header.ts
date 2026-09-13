import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenu } from '../user-menu/user-menu';

@Component({
  imports: [CommonModule, UserMenu],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  // Phase 1 — static mock data
  pageTitle = 'Dashboard';

  user = {
    name: 'Aysha',
    email: 'aysha@taskflow.dev',
    avatarInitial: 'A',
  };

  isUserMenuOpen = false;

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  onLogout() {
    // Phase 1 — no real logout logic yet, just close the menu
    this.isUserMenuOpen = false;
  }
}
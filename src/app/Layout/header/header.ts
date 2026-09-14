import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { UserMenu } from '../user-menu/user-menu';

@Component({
  imports: [CommonModule, UserMenu],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  pageTitle = 'Dashboard';

  user = {
    name: 'Aysha',
    email: 'aysha@taskflow.dev',
    avatarInitial: 'A',
  };

  isUserMenuOpen = false;

  constructor(private router: Router) {
    this.updatePageTitle(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updatePageTitle(event.urlAfterRedirects);
      }
    });
  }

  private updatePageTitle(url: string) {
    const routeTitles: Record<string, string> = {
      dashboard: 'Dashboard',
      projects: 'Projects',
      tasks: 'Tasks',
      kanban: 'Kanban',
      team: 'Team',
    };

    const route = url.split('?')[0].split('/').filter(Boolean)[0] || 'dashboard';
    this.pageTitle = routeTitles[route] || 'TaskFlow';
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  onLogout() {
    // Phase 1 — no real logout logic yet, just close the menu
    this.isUserMenuOpen = false;
  }
}
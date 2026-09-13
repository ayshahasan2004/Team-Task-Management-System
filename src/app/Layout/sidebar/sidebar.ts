import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  imports: [CommonModule, RouterLink, RouterLinkActive],
  selector: 'app-sidebar',
  styleUrl: './sidebar.css',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  // Phase 1 — static mock nav data, no live/business logic
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { label: 'Projects', icon: '📁', path: '/projects' },
    { label: 'Tasks', icon: '✅', path: '/tasks' },
    { label: 'Kanban', icon: '📋', path: '/kanban' },
    { label: 'Team', icon: '👥', path: '/team' },
  ];
}
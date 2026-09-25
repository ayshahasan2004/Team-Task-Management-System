import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenu } from '../user-menu/user-menu';
import { MemberService } from '../../Core/services/member.service';

@Component({
  standalone: true,
  imports: [CommonModule, UserMenu],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  private memberService = inject(MemberService);
  user = computed(() => {
    const member = this.memberService.getById('m1');
    return {
      name: member?.name ?? 'Team member',
      email: member?.email ?? '',
      avatarInitial: member?.initial ?? '?',
    };
  });

  isUserMenuOpen = false;

  constructor() {
	document.documentElement.classList.remove('dark-theme');
	localStorage.setItem('taskflow-theme', 'light');
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  onLogout() {
    // Phase 1 — no real logout logic yet, just close the menu
    this.isUserMenuOpen = false;
  }
}
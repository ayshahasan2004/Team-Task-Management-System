import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import { UserMenu } from '../user-menu/user-menu';
import { MemberService } from '../../Core/services/member.service';

export type Theme = 'light' | 'dark';
const THEME_STORAGE_KEY = 'taskflow-theme';

@Component({
  standalone: true,
  imports: [CommonModule, UserMenu],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  private memberService = inject(MemberService);
  private router = inject(Router);
  private document = inject(DOCUMENT);

  user = computed(() => {
    const member = this.memberService.getById('m1');
    return {
      name: member?.name ?? 'Team member',
      email: member?.email ?? '',
      avatarInitial: member?.initial ?? '?',
    };
  });

  /** Title of the active page, derived from the current route. */
  pageTitle = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => this.titleFor(event.urlAfterRedirects)),
      startWith(this.titleFor(this.router.url)),
    ),
    { initialValue: 'Dashboard' },
  );

  private titleFor(url: string): string {
    const segment = url.split('?')[0].split('/').filter(Boolean)[0] ?? '';
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      projects: 'Projects',
      tasks: 'Tasks',
      kanban: 'Kanban Board',
      team: 'Team',
      settings: 'Settings',
    };
    return titles[segment] ?? 'Dashboard';
  }

  isUserMenuOpen = false;

  /** Active theme, restored from storage rather than forced to light. */
  readonly theme = signal<Theme>(this.readStoredTheme());

  constructor() {
    // Apply whatever preference the user already had; never overwrite it.
    this.applyTheme(this.theme());
  }

  toggleTheme(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    this.applyTheme(next);
    this.persistTheme(next);
  }

  private applyTheme(theme: Theme): void {
    const root = this.document?.documentElement;
    if (!root) {
      return;
    }
    root.classList.toggle('dark-theme', theme === 'dark');
  }

  /** SSR-safe: no window/localStorage access outside the browser. */
  private readStoredTheme(): Theme {
    const stored = this.storage?.getItem(THEME_STORAGE_KEY);
    return stored === 'dark' ? 'dark' : 'light';
  }

  private persistTheme(theme: Theme): void {
    this.storage?.setItem(THEME_STORAGE_KEY, theme);
  }

  private get storage(): Storage | null {
    try {
      return this.document?.defaultView?.localStorage ?? null;
    } catch {
      // Storage can throw in private mode / sandboxed iframes.
      return null;
    }
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  onLogout() {
    // Phase 1 — no real logout logic yet, just close the menu
    this.isUserMenuOpen = false;
  }
}
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import { UserMenu } from '../user-menu/user-menu';
import { MemberService } from '../../Core/services/member.service';
import { AuthService } from '../../Core/services/auth.service';
import { ProjectService } from '../../Core/services/project.service';
import { TaskService } from '../../Core/services/task.service';

interface SearchResult {
  type: 'Project' | 'Task' | 'Person';
  id: string;
  title: string;
  detail: string;
  route: string[];
  searchTerm?: string;
}

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
  private authService = inject(AuthService);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private document = inject(DOCUMENT);

  readonly searchQuery = signal('');
  readonly isSearchFocused = signal(false);
  readonly showSearchResults = computed(() =>
    this.isSearchFocused() && this.searchQuery().trim().length >= 2
  );
  readonly searchResults = computed<SearchResult[]>(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (query.length < 2) {
      return [];
    }

    const projects: SearchResult[] = this.projectService.projects()
      .filter(project => `${project.name} ${project.description} ${project.status}`.toLowerCase().includes(query))
      .map(project => ({
        type: 'Project',
        id: project.id,
        title: project.name,
        detail: project.description || project.status,
        route: ['/projects', project.id],
      }));
    const tasks: SearchResult[] = this.taskService.tasks()
      .filter(task => `${task.title} ${task.description} ${task.status}`.toLowerCase().includes(query))
      .map(task => ({
        type: 'Task',
        id: task.id,
        title: task.title,
        detail: task.description || task.status,
        route: ['/tasks', task.id],
      }));
    const people: SearchResult[] = this.memberService.members()
      .filter(member => `${member.name} ${member.email} ${member.role}`.toLowerCase().includes(query))
      .map(member => ({
        type: 'Person',
        id: member.id,
        title: member.name,
        detail: `${member.role} · ${member.email}`,
        route: ['/team'],
        searchTerm: member.name,
      }));

    return [...projects, ...tasks, ...people].slice(0, 8);
  });

  user = computed(() => {
    const member = this.memberService.getById('m1');
    const account = this.authService.currentUser();
    const name = account?.fullName?.trim() || member?.name || 'Team member';
    const avatarInitial = name
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();

    return {
      name,
      email: account?.email ?? member?.email ?? '',
      avatarInitial: avatarInitial || member?.initial || '?',
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

  onSearchInput(event: Event): void {
    this.isSearchFocused.set(true);
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.clearSearch();
    } else if (event.key === 'Enter') {
      const firstResult = this.searchResults()[0];
      if (firstResult) {
        this.openSearchResult(firstResult);
      }
    }
  }

  openSearchResult(result: SearchResult): void {
    this.clearSearch();
    this.router.navigate(result.route, result.searchTerm ? { queryParams: { search: result.searchTerm } } : undefined);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.isSearchFocused.set(false);
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
    this.isUserMenuOpen = false;
    this.authService.logout();
  }
}
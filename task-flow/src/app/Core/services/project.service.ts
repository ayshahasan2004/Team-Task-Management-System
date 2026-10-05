import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

import { Project, ProjectStatus } from '../models/project.model';
import { environment } from '../../../environments/environment';
import { ActivityService } from './activity.service';
import { TaskService } from './task.service';
import { AuthService } from './auth.service';

interface BackendProject {
  id: string;
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  memberIds: string[];
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

type BackendProjectCreate = Pick<BackendProject, 'name' | 'description' | 'status' | 'memberIds' | 'dueDate'>;

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private activityService = inject(ActivityService);
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private readonly _projects = signal<Project[]>([]);
  readonly projects = this._projects.asReadonly();

  readonly activeProjects = computed(() => this._projects().filter(p => p.status === 'Active'));
  readonly completedProjects = computed(() => this._projects().filter(p => p.status === 'Completed'));
  readonly archivedProjects = computed(() => this._projects().filter(p => p.status === 'Archived'));

  constructor() {
    effect(() => {
      const token = this.authService.token();
      if (!token) {
        this._projects.set([]);
        return;
      }

      this.refresh().subscribe({
        error: () => this._projects.set([]),
      });
    });
  }

  refresh(): Observable<Project[]> {
    return this.http.get<BackendProject[]>(`${environment.coreApiUrl}/projects`).pipe(
      map(projects => projects.map(project => this.toProject(project))),
      tap(projects => this._projects.set(projects))
    );
  }

  getById(id: string): Project | undefined {
    return this._projects().find(p => p.id === id);
  }

  private static readonly MAX_PROJECT_MEMBERS = 20;

  create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Observable<Project> {
    const memberIds = Array.from(new Set(project.memberIds)).slice(0, ProjectService.MAX_PROJECT_MEMBERS);

    const optimisticProject: Project = {
      ...project,
      memberIds,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this._projects.update(projects => [optimisticProject, ...projects]);
    return this.http.post<BackendProject>(`${environment.coreApiUrl}/projects`, this.toProjectCreateRequest(optimisticProject)).pipe(
      map(project => this.toProject(project)),
      tap(saved => {
        this._projects.update(items => items.map(item => item.id === optimisticProject.id ? saved : item));
        const userId = this.authService.currentUser()?.userId;
        if (userId) {
          this.activityService.add(userId, `created project "${saved.name}"`);
        }
      }),
      catchError(error => {
        this._projects.update(items => items.filter(item => item.id !== optimisticProject.id));
        return throwError(() => error);
      })
    );
  }

  update(id: string, changes: Partial<Project>): void {
    const project = this.getById(id);
    if (!project) {
      return;
    }

    const updatedProject: Project = {
      ...project,
      ...changes,
      memberIds: changes.memberIds ?? project.memberIds,
      dueDate: changes.dueDate ?? project.dueDate,
      updatedAt: new Date(),
    };

    this._projects.update(projects =>
      projects.map(p => (p.id === id ? updatedProject : p))
    );

    this.http.put<BackendProject>(`${environment.coreApiUrl}/projects/${id}`, this.toBackendProject(updatedProject)).pipe(
      map(project => this.toProject(project)),
      tap(saved => {
        this._projects.update(items => items.map(item => item.id === id ? saved : item));
      })
    ).subscribe();

    if (project) {
      this.activityService.add('m1', `updated project "${changes.name ?? project.name}"`);
    }
  }

  updateStatus(id: string, status: ProjectStatus): void {
    this.update(id, { status });
  }

  addMember(projectId: string, memberId: string): void {
    this._projects.update(projects =>
      projects.map(p =>
        p.id === projectId && !p.memberIds.includes(memberId)
          ? { ...p, memberIds: [...p.memberIds, memberId] }
          : p
      )
    );

    this.http.post<BackendProject>(`${environment.coreApiUrl}/projects/${projectId}/members/${memberId}`, {}).pipe(
      map(project => this.toProject(project)),
      tap(saved => {
        this._projects.update(items => items.map(item => item.id === projectId ? saved : item));
      })
    ).subscribe();
  }

  removeMember(projectId: string, memberId: string): void {
    this._projects.update(projects =>
      projects.map(p =>
        p.id === projectId
          ? { ...p, memberIds: p.memberIds.filter(id => id !== memberId) }
          : p
      )
    );

    this.http.delete<BackendProject>(`${environment.coreApiUrl}/projects/${projectId}/members/${memberId}`).pipe(
      map(project => this.toProject(project)),
      tap(saved => {
        this._projects.update(items => items.map(item => item.id === projectId ? saved : item));
      })
    ).subscribe();
  }

  delete(id: string): void {
    const project = this.getById(id);
    this._projects.update(projects => projects.filter(p => p.id !== id));
    this.taskService.removeTasksForProject(id);

    this.http.delete<void>(`${environment.coreApiUrl}/projects/${id}`).subscribe();

    if (project) {
      this.activityService.add('m1', `deleted project "${project.name}"`);
    }
  }

  private toProject(project: BackendProject): Project {
    return {
      id: project.id,
      name: project.name,
      description: project.description ?? '',
      status: mapProjectStatus(project.status),
      memberIds: project.memberIds ?? [],
      dueDate: project.dueDate ? new Date(project.dueDate) : null,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    };
  }

  private toBackendProject(project: Partial<Project> | Project): BackendProject {
    return {
      id: project.id ?? '',
      name: project.name ?? '',
      description: project.description ?? '',
      status: mapProjectStatusApi(project.status ?? 'Active'),
      memberIds: project.memberIds ?? [],
      dueDate: project.dueDate ? formatDateOnly(project.dueDate) : null,
      createdAt: project.createdAt ? formatDateTime(project.createdAt) : new Date().toISOString(),
      updatedAt: project.updatedAt ? formatDateTime(project.updatedAt) : new Date().toISOString(),
    };
  }

  private toProjectCreateRequest(project: Project): BackendProjectCreate {
    return {
      name: project.name,
      description: project.description,
      status: mapProjectStatusApi(project.status),
      memberIds: project.memberIds,
      dueDate: project.dueDate ? formatDateOnly(project.dueDate) : null,
    };
  }
}

function mapProjectStatus(status: string | undefined): ProjectStatus {
  switch (status) {
    case 'ACTIVE':
      return 'Active';
    case 'COMPLETED':
      return 'Completed';
    case 'ARCHIVED':
      return 'Archived';
    default:
      return 'Active';
  }
}

function mapProjectStatusApi(status: ProjectStatus): 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' {
  switch (status) {
    case 'Completed':
      return 'COMPLETED';
    case 'Archived':
      return 'ARCHIVED';
    default:
      return 'ACTIVE';
  }
}

function formatDateOnly(date: Date): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

function formatDateTime(date: Date): string {
  return new Date(date).toISOString();
}
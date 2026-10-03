import { Injectable, signal, computed, inject } from '@angular/core';
import { Project, ProjectStatus } from '../models/project.model';
import { ActivityService } from './activity.service';
import { TaskService } from './task.service';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private activityService = inject(ActivityService);
  private taskService = inject(TaskService);
  private readonly _projects = signal<Project[]>(MOCK_PROJECTS);//stores all projects in a reactive signal
  readonly projects = this._projects.asReadonly();

  readonly activeProjects = computed(() => this._projects().filter(p => p.status === 'Active'));
  readonly completedProjects = computed(() => this._projects().filter(p => p.status === 'Completed'));
  readonly archivedProjects = computed(() => this._projects().filter(p => p.status === 'Archived'));

  getById(id: string): Project | undefined {//returns the project with the given id, or undefined if not found
    return this._projects().find(p => p.id === id);
  }

  /** Maximum members a project can hold. */
  private static readonly MAX_PROJECT_MEMBERS = 20;

  create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    // Keep the caller's members, de-duplicated. Defaults are only used when the
    // caller supplied nobody — never force-merged, so progress reflects reality.
    const provided = Array.from(new Set(project.memberIds));
    const memberIds = (
      provided.length > 0 ? provided : DEFAULT_PROJECT_MEMBER_IDS
    ).slice(0, ProjectService.MAX_PROJECT_MEMBERS);

    const newProject: Project = {
      ...project,
      memberIds,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this._projects.update(projects => [...projects, newProject]);
    this.activityService.add('m1', `created project "${newProject.name}"`);
    return newProject;
  }

  update(id: string, changes: Partial<Project>): void {
    const project = this.getById(id);
    this._projects.update(projects =>
      projects.map(p => (p.id === id ? { ...p, ...changes, updatedAt: new Date() } : p))
    );
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
  }

  removeMember(projectId: string, memberId: string): void {
    this._projects.update(projects =>
      projects.map(p =>
        p.id === projectId
          ? { ...p, memberIds: p.memberIds.filter(id => id !== memberId) }//removes the member from the project
          : p
      )
    );
  }

  delete(id: string): void {
    const project = this.getById(id);
    this._projects.update(projects => projects.filter(p => p.id !== id));
    // Cascade: remove the project's tasks so no orphaned records remain.
    this.taskService.removeTasksForProject(id);
    if (project) {
      this.activityService.add('m1', `deleted project "${project.name}"`);
    }
  }
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1', name: 'TaskFlow Redesign', description: 'Internal tool revamp',
    status: 'Active', memberIds: ['m1', 'm2', 'm3', 'm4', 'm5'], dueDate: new Date('2026-10-15'), createdAt: new Date(), updatedAt: new Date(),
  },
];

const DEFAULT_PROJECT_MEMBER_IDS = ['m1', 'm2', 'm3'];//default members for new projects
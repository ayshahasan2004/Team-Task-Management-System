import { Injectable, signal, computed } from '@angular/core';
import { Project, ProjectStatus } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly _projects = signal<Project[]>(MOCK_PROJECTS);//stores all projects in a reactive signal
  readonly projects = this._projects.asReadonly();

  readonly activeProjects = computed(() => this._projects().filter(p => p.status === 'Active'));
  readonly completedProjects = computed(() => this._projects().filter(p => p.status === 'Completed'));
  readonly archivedProjects = computed(() => this._projects().filter(p => p.status === 'Archived'));

  getById(id: string): Project | undefined {//returns the project with the given id, or undefined if not found
    return this._projects().find(p => p.id === id);
  }

  create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const memberIds = Array.from(new Set([
      ...project.memberIds,
      ...DEFAULT_PROJECT_MEMBER_IDS,
    ])).slice(0, Math.max(20, project.memberIds.length));//ensures that the memberIds array contains unique values and limits the number of members to a maximum of 3, while also ensuring that at least 3 members are included if the provided memberIds array has fewer than 3 members.

    const newProject: Project = {
      ...project,
      memberIds,
      id: crypto.randomUUID(),////generate a unique id for the new item.
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this._projects.update(projects => [...projects, newProject]);///adds the new project to the list of projects
    return newProject;
  }

  update(id: string, changes: Partial<Project>): void {
    this._projects.update(projects =>
      projects.map(p => (p.id === id ? { ...p, ...changes, updatedAt: new Date() } : p))
    );
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
    this._projects.update(projects => projects.filter(p => p.id !== id));//removes the project with the given id from the list of projects
  }
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1', name: 'TaskFlow Redesign', description: 'Internal tool revamp',
    status: 'Active', memberIds: ['m1', 'm2', 'm3'], createdAt: new Date(), updatedAt: new Date(),
  },
];

const DEFAULT_PROJECT_MEMBER_IDS = ['m1', 'm2'];//default members for new projects
import { Injectable, signal, computed, inject } from '@angular/core';
import { Member, TeamGroup } from '../models/member.model';
import { ProjectService } from './project.service';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private projectService = inject(ProjectService);
  private readonly _teamGroups = signal<TeamGroup[]>(MOCK_TEAM_GROUPS);
  readonly teamGroups = this._teamGroups.asReadonly();

  // flattened, derived automatically — same idea as your old `members` getter,
  // now reactive instead of recalculated on every template read
  readonly members = computed(() => this._teamGroups().flatMap(t => t.members));

  readonly projectMemberIds = computed(() =>
    new Set(this.projectService.projects().flatMap(project => project.memberIds))
  );

  readonly projectMembers = computed(() =>
    this.members().filter(member => this.projectMemberIds().has(member.id))
  );

  getById(memberId: string): Member | undefined {
    return this.members().find(m => m.id === memberId);
  }

  getTeamGroupOf(memberId: string): TeamGroup | undefined {
    return this._teamGroups().find(t => t.members.some(m => m.id === memberId));
  }

  getMembersForProject(projectId: string): Member[] {
    const project = this.projectService.getById(projectId);
    if (!project) {
      return [];
    }

    const memberIds = new Set(project.memberIds);
    return this.members().filter(member => memberIds.has(member.id));
  }

  addTeam(name: string, members: Omit<Member, 'id'>[]): TeamGroup {
    const newTeam: TeamGroup = {
      id: crypto.randomUUID(),
      name,
      members: members.map(member => ({
        ...member,
        id: crypto.randomUUID(),
      })),
    };
    this._teamGroups.update(teams => [...teams, newTeam]);
    return newTeam;
  }

  removeTeam(teamId: string): void {
    this._teamGroups.update(teams => teams.filter(t => t.id !== teamId));
  }

  addMember(teamId: string, member: Omit<Member, 'id'>): Member {
    const newMember: Member = { ...member, id: crypto.randomUUID() };
    this._teamGroups.update(teams =>
      teams.map(t => (t.id === teamId ? { ...t, members: [...t.members, newMember] } : t))
    );
    return newMember;
  }

  updateMember(memberId: string, changes: Partial<Member>): void {
    this._teamGroups.update(teams =>
      teams.map(t => ({
        ...t,
        members: t.members.map(m => (m.id === memberId ? { ...m, ...changes } : m)),
      }))
    );
  }

  removeMember(memberId: string): void {
    this._teamGroups.update(teams =>
      teams.map(t => ({ ...t, members: t.members.filter(m => m.id !== memberId) }))
    );
  }
}

const MOCK_TEAM_GROUPS: TeamGroup[] = [
  {
    id: 'product-team', name: 'Product Team',
    members: [
      { id: 'm1', name: 'Aysha', initial: 'A', role: 'Frontend Developer', email: 'aysha@taskflow.dev', projectsCount: 3, status: 'Online' },
      { id: 'm2', name: 'Sara', initial: 'S', role: 'Designer', email: 'sara@taskflow.dev', projectsCount: 4, status: 'Online' },
      { id: 'm3', name: 'Nora', initial: 'N', role: 'Product Manager', email: 'nora@taskflow.dev', projectsCount: 4, status: 'Online' },
    ],
  },
  {
    id: 'engineering-team', name: 'Engineering Team',
    members: [
      { id: 'm4', name: 'Ahmad', initial: 'A', role: 'Project Lead', email: 'ahmad@taskflow.dev', projectsCount: 5, status: 'Online' },
      { id: 'm5', name: 'Mohammad', initial: 'M', role: 'Backend Developer', email: 'mohammad@taskflow.dev', projectsCount: 2, status: 'Offline' },
      { id: 'm6', name: 'Lina', initial: 'L', role: 'QA Engineer', email: 'lina@taskflow.dev', projectsCount: 2, status: 'Offline' },
      { id: 'm7', name: 'Omar', initial: 'O', role: 'DevOps Engineer', email: 'omar@taskflow.dev', projectsCount: 3, status: 'Online' },
    ],
  },
];
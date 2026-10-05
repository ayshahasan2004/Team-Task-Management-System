import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, tap } from 'rxjs';

import { Member, TeamGroup } from '../models/member.model';
import { environment } from '../../../environments/environment';
import { ProjectService } from './project.service';
import { AuthService } from './auth.service';

interface BackendMember {
  id: string;
  name: string;
  initial: string | null;
  role: string | null;
  teamName: string | null;
  email: string;
  status: 'ONLINE' | 'OFFLINE';
}

type BackendMemberCreate = Omit<BackendMember, 'id'>;

@Injectable({ providedIn: 'root' })
export class MemberService {
  private http = inject(HttpClient);
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);
  private readonly _teamGroups = signal<TeamGroup[]>([]);
  readonly teamGroups = this._teamGroups.asReadonly();

  readonly members = computed(() => this._teamGroups().flatMap(t => t.members));

  readonly projectMemberIds = computed(() =>
    new Set(this.projectService.projects().flatMap(project => project.memberIds))
  );

  readonly projectMembers = computed(() =>
    this.members().filter(member => this.projectMemberIds().has(member.id))
  );

  constructor() {
    effect(() => {
      const token = this.authService.token();
      if (!token) {
        this._teamGroups.set([{ id: 'all-members', name: 'Team Members', members: [] }]);
        return;
      }

      this.refresh().subscribe({
        error: () => this._teamGroups.set([{ id: 'all-members', name: 'Team Members', members: [] }]),
      });
    });
  }

  refresh(): Observable<Member[]> {
    return this.http.get<BackendMember[]>(`${environment.coreApiUrl}/members`).pipe(
      map(members => members.map(member => this.toMember(member))),
      tap(members => {
        this._teamGroups.set(groupMembers(members));
      })
    );
  }

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

  addTeam(name: string, members: Omit<Member, 'id'>[]): Observable<TeamGroup> {
    const teamName = name.trim();
    const requests = members.map(member => {
      const payload = this.toBackendMemberCreate({ ...member, teamName });
      return this.http.post<BackendMember>(`${environment.coreApiUrl}/members`, payload).pipe(
        map(saved => this.toMember(saved))
      );
    });

    return forkJoin(requests).pipe(
      map(savedMembers => ({
        id: teamGroupId(teamName),
        name: teamName,
        members: savedMembers,
      })),
      tap(savedTeam => {
        this._teamGroups.update(teams => {
          const existing = teams.find(team => team.id === savedTeam.id);
          if (existing) {
            return teams.map(team => team.id === savedTeam.id
              ? { ...team, members: [...team.members, ...savedTeam.members] }
              : team);
          }
          return [...teams, savedTeam];
        });
      })
    );
  }

  removeTeam(teamId: string): void {
    this._teamGroups.update(teams => teams.filter(t => t.id !== teamId));
  }

  addMember(teamId: string, member: Omit<Member, 'id'>): Member {
    const newMember: Member = { ...member, id: crypto.randomUUID() };
    this._teamGroups.update(teams =>
      teams.map(t => (t.id === teamId ? { ...t, members: [...t.members, newMember] } : t))
    );

    this.http.post<BackendMember>(`${environment.coreApiUrl}/members`, this.toBackendMember(newMember)).pipe(
      map(member => this.toMember(member)),
      tap(saved => {
        this._teamGroups.update(teams =>
          teams.map(t => (
            t.id === teamId
              ? { ...t, members: t.members.map(item => item.id === newMember.id ? saved : item) }
              : t
          ))
        );
      })
    ).subscribe();

    return newMember;
  }

  updateMember(memberId: string, changes: Partial<Member>): void {
    this._teamGroups.update(teams =>
      teams.map(t => ({
        ...t,
        members: t.members.map(m => (m.id === memberId ? { ...m, ...changes } : m)),
      }))
    );

    const member = this.getById(memberId);
    if (!member) {
      return;
    }

    const updatedMember = { ...member, ...changes };
    this.http.put<BackendMember>(`${environment.coreApiUrl}/members/${memberId}`, this.toBackendMember(updatedMember)).subscribe();
  }

  removeMember(memberId: string): void {
    this._teamGroups.update(teams =>
      teams.map(t => ({ ...t, members: t.members.filter(m => m.id !== memberId) }))
    );

    this.http.delete<void>(`${environment.coreApiUrl}/members/${memberId}`).subscribe();
  }

  private toMember(member: BackendMember): Member {
    const projectCount = this.projectService.projects().filter(project => project.memberIds.includes(member.id)).length;

    return {
      id: member.id,
      name: member.name,
      initial: member.initial ?? member.name.slice(0, 2).toUpperCase(),
      role: member.role ?? 'Team Member',
      email: member.email,
      teamName: member.teamName ?? undefined,
      projectsCount: projectCount,
      status: member.status === 'ONLINE' ? 'Online' : 'Offline',
    };
  }

  private toBackendMember(member: Partial<Member> | Member): BackendMember {
    return {
      id: member.id ?? '',
      name: member.name ?? '',
      initial: member.initial ?? (member.name ? member.name.slice(0, 2).toUpperCase() : null),
      role: member.role ?? 'Team Member',
      teamName: member.teamName ?? null,
      email: member.email ?? '',
      status: member.status === 'Online' ? 'ONLINE' : 'OFFLINE',
    };
  }

  private toBackendMemberCreate(member: Omit<Member, 'id'>): BackendMemberCreate {
    return {
      name: member.name,
      initial: member.initial,
      role: member.role,
      teamName: member.teamName ?? null,
      email: member.email,
      status: member.status === 'Online' ? 'ONLINE' : 'OFFLINE',
    };
  }
}

function groupMembers(members: Member[]): TeamGroup[] {
  const groups = new Map<string, TeamGroup>();
  for (const member of members) {
    const name = member.teamName?.trim() || 'Team Members';
    const id = teamGroupId(name);
    const group = groups.get(id) ?? { id, name, members: [] };
    group.members.push(member);
    groups.set(id, group);
  }
  return Array.from(groups.values());
}

function teamGroupId(name: string): string {
  return `team-${name.trim().toLowerCase()}`;
}
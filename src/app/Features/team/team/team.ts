import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberCard, Member } from '../member-card/member-card';
import { Search } from '../../Shared/search/search';
import { Pagination } from '../../Shared/pagination/pagination';
import { EmptyState } from '../../Shared/empty-state/empty-state';

export interface TeamGroup {
  id: string;
  name: string;
  members: Member[];
}

@Component({
  imports: [CommonModule, MemberCard, Search, Pagination, EmptyState],
  selector: 'app-team',
  styleUrl: './team.css',
  templateUrl: './team.html',
})
export class Team {
  searchTerm = '';
  currentPage = 1;
  readonly pageSize = 4;

  teamGroups: TeamGroup[] = [
    {
      id: 'product-team',
      name: 'Product Team',
      members: [
        {
          id: 'member-1',
          name: 'Aysha',
          initial: 'A',
          role: 'Frontend Developer',
          email: 'aysha@taskflow.dev',
          projectsCount: 3,
          status: 'Online',
        },
        {
          id: 'member-2',
          name: 'Sara',
          initial: 'S',
          role: 'Designer',
          email: 'sara@taskflow.dev',
          projectsCount: 4,
          status: 'Online',
        },
        {
          id: 'member-3',
          name: 'Nora',
          initial: 'N',
          role: 'Product Manager',
          email: 'nora@taskflow.dev',
          projectsCount: 4,
          status: 'Online',
        },
      ],
    },
    {
      id: 'engineering-team',
      name: 'Engineering Team',
      members: [
        {
          id: 'member-4',
          name: 'Ahmad',
          initial: 'A',
          role: 'Project Lead',
          email: 'ahmad@taskflow.dev',
          projectsCount: 5,
          status: 'Online',
        },
        {
          id: 'member-5',
          name: 'Mohammad',
          initial: 'M',
          role: 'Backend Developer',
          email: 'mohammad@taskflow.dev',
          projectsCount: 2,
          status: 'Offline',
        },
        {
          id: 'member-6',
          name: 'Lina',
          initial: 'L',
          role: 'QA Engineer',
          email: 'lina@taskflow.dev',
          projectsCount: 2,
          status: 'Offline',
        },
        {
          id: 'member-7',
          name: 'Omar',
          initial: 'O',
          role: 'DevOps Engineer',
          email: 'omar@taskflow.dev',
          projectsCount: 3,
          status: 'Online',
        },
      ],
    },
  ];

  get members(): Member[] {
    return this.teamGroups.flatMap((team) => team.members);
  }

  get filteredMembers(): Member[] {
    const query = this.searchTerm.trim().toLowerCase();

    if (!query) {
      return this.members;
    }

    return this.members.filter((member) =>
      [member.name, member.role, member.email].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredMembers.length / this.pageSize));
  }

  get pagedMembers(): Member[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredMembers.slice(start, start + this.pageSize);
  }

  membersForTeam(teamGroup: TeamGroup): Member[] {
    const visibleIds = new Set(this.pagedMembers.map((member) => member.id));
    return teamGroup.members.filter((member) => visibleIds.has(member.id));
  }

  onSearchChanged(value: string) {
    this.searchTerm = value;
    this.currentPage = 1;
  }

  onPageChanged(page: number) {
    this.currentPage = page;
  }

  clearSearch() {
    this.onSearchChanged('');
  }

  addTeam() {
    const teamNumber = this.teamGroups.length + 1;

    this.teamGroups = [
      ...this.teamGroups,
      {
        id: `new-team-${teamNumber}`,
        name: `New Team ${teamNumber}`,
        members: [
          {
            id: `new-member-${teamNumber}`,
            name: 'New member',
            initial: 'N',
            role: 'Team member',
            email: `member${teamNumber}@taskflow.dev`,
            projectsCount: 0,
            status: 'Online',
          },
        ],
      },
    ];
  }

  onCardClicked(memberId: string) {
    // Phase 1 — navigation to member details is a later-phase task
    console.log('Open member details for', memberId);
  }
}
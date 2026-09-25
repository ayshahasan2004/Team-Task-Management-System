import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemberCard } from '../member-card/member-card';
import { Member, TeamGroup } from '../../../Core/models/member.model';
import { MemberService } from '../../../Core/services/member.service';
import { Search } from '../../../Shared/Components/search/search';
import { Pagination } from '../../../Shared/Components/pagination/pagination';
import { EmptyState } from '../../../Shared/Components/empty-state/empty-state';
import { Modal } from '../../../Shared/Components/modal/modal';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, MemberCard, Search, Pagination, EmptyState, Modal],
  selector: 'app-team',
  styleUrl: './team.css',
  templateUrl: './team.html',
})
export class Team {
  private memberService = inject(MemberService);

  searchTerm = '';
  currentPage = 1;
  readonly pageSize = 4;
  isAddTeamOpen = false;
  newTeamName = '';
  newMemberNames = ['', '', ''];

  teamGroups = this.memberService.teamGroups;

  get members(): Member[] {
    return this.memberService.members();
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

  openAddTeam(): void {
    this.newTeamName = '';
    this.newMemberNames = ['', '', ''];
    this.isAddTeamOpen = true;
  }

  closeAddTeam(): void {
    this.isAddTeamOpen = false;
    this.newTeamName = '';
    this.newMemberNames = ['', '', ''];
  }

  addTeam(): void {
    const name = this.newTeamName.trim();
    const memberNames = this.newMemberNames.map(memberName => memberName.trim());

    if (!name || memberNames.some(memberName => !memberName)) {
      return;
    }

    this.memberService.addTeam(name, memberNames.map((memberName, index) => ({
      name: memberName,
      initial: memberName.charAt(0).toUpperCase(),
      role: 'Team member',
      email: `${memberName.toLowerCase().replace(/\s+/g, '.')}@taskflow.dev`,
      projectsCount: 0,
      status: 'Online',
    })));
    this.closeAddTeam();
  }

  get canCreateTeam(): boolean {
    return Boolean(this.newTeamName.trim() && this.newMemberNames.every(memberName => memberName.trim()));
  }

  onCardClicked(memberId: string) {
    // Phase 1 — navigation to member details is a later-phase task
    console.log('Open member details for', memberId);
  }
}
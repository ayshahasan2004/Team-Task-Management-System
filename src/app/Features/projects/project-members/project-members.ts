import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Avatar } from '../../../Shared/Components/avatar/avatar';
import { Modal } from '../../../Shared/Components/modal/modal';
import { Member } from '../../../Core/models/member.model';
import { MemberService } from '../../../Core/services/member.service';
import { ProjectService } from '../../../Core/services/project.service';

@Component({
  standalone: true,
  imports: [CommonModule, Avatar, Modal],
  selector: 'app-project-members',
  styleUrl: './project-members.css',
  templateUrl: './project-members.html',
})
export class ProjectMembers {
  private readonly memberService = inject(MemberService);
  private readonly projectService = inject(ProjectService);

  readonly projectId = input('');
  readonly members = input<Member[]>([]);

  readonly isAddMemberOpen = signal(false);
  readonly availableMembers = computed(() => {
    const assignedIds = new Set(this.members().map(member => member.id));
    return this.memberService.members().filter(member => !assignedIds.has(member.id));
  });

  openAddMember(): void {
    this.isAddMemberOpen.set(true);
  }

  closeAddMember(): void {
    this.isAddMemberOpen.set(false);
  }

  addMember(memberId: string): void {
    if (!this.projectId() || !memberId) {
      return;
    }

    this.projectService.addMember(this.projectId(), memberId);
    this.closeAddMember();
  }
}
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Avatar } from '../../../Shared/Components/avatar/avatar';
import { Member } from '../../../Core/models/member.model';

@Component({
  standalone: true,
  imports: [CommonModule, Avatar],
  selector: 'app-project-members',
  styleUrl: './project-members.css',
  templateUrl: './project-members.html',
})
export class ProjectMembers {
  @Input() members: Member[] = [];
}
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Avatar } from '../../Shared/avatar/avatar';

export interface Member {
  name: string;
  initial: string;
  role: string;
}

@Component({
  imports: [CommonModule, Avatar],
  selector: 'app-project-members',
  styleUrl: './project-members.css',
  templateUrl: './project-members.html',
})
export class ProjectMembers {
  // Data comes down from parent (ProjectDetails)
  @Input() members: Member[] = [];
}
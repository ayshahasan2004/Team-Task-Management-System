import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Member {
  name: string;
  initial: string;
  role: string;
}

@Component({
  imports: [CommonModule],
  selector: 'app-project-members',
  styleUrl: './project-members.css',
  templateUrl: './project-members.html',
})
export class ProjectMembers {
  // Data comes down from parent (ProjectDetails)
  @Input() members: Member[] = [];
}
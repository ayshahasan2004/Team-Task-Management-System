import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectMembers, Member } from '../project-members/project-members';
import { Project } from '../project-card/project-card';

@Component({
  standalone: true,
  imports: [CommonModule, ProjectMembers],
  selector: 'app-project-details',
  styleUrl: './project-details.css',
  templateUrl: './project-details.html',
})
export class ProjectDetails {
  // Phase 1 — accepts a project via @Input(); falls back to mock data
  // so this renders standalone during UI-only development.
  // Wiring this to a real :id route param is a later-phase task.
  @Input() project: Project = {
    id: 'proj-1',
    name: 'Website Redesign',
    description:
      'Complete overhaul of the marketing site, including new brand system, responsive layout, and CMS migration.',
    progress: 72,
    membersCount: 4,
    dueDate: 'Sep 20',
    status: 'On Track',
  };

  members: Member[] = [
    { name: 'Aysha', initial: 'A', role: 'Frontend Developer' },
    { name: 'Mohammad', initial: 'M', role: 'Backend Developer' },
    { name: 'Sara', initial: 'S', role: 'Designer' },
    { name: 'Ahmad', initial: 'A', role: 'Project Lead' },
  ];
}
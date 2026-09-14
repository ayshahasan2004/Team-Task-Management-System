import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCard, Project } from '../project-card/project-card';
import { CreateProjectDialog } from '../create-project-dialog/create-project-dialog';

@Component({
  imports: [CommonModule, ProjectCard, CreateProjectDialog],
  selector: 'app-projects',
  styleUrl: './projects.css',
  templateUrl: './projects.html',
})
export class Projects {
  // Phase 1 — static mock data
  projects: Project[] = [
    {
      id: 'proj-1',
      name: 'Website Redesign',
      description: 'Complete overhaul of the marketing site and new brand system.',
      progress: 72,
      membersCount: 4,
      dueDate: 'Sep 20',
      status: 'On Track',
    },
    {
      id: 'proj-2',
      name: 'Mobile App Launch',
      description: 'iOS and Android launch for the TaskFlow companion app.',
      progress: 45,
      membersCount: 6,
      dueDate: 'Oct 02',
      status: 'At Risk',
    },
    {
      id: 'proj-3',
      name: 'API Migration',
      description: 'Move legacy REST endpoints to the new GraphQL gateway.',
      progress: 90,
      membersCount: 3,
      dueDate: 'Sep 15',
      status: 'On Track',
    },
    {
      id: 'proj-4',
      name: 'Marketing Campaign',
      description: 'Q4 campaign assets, landing pages, and email sequences.',
      progress: 100,
      membersCount: 5,
      dueDate: 'Sep 01',
      status: 'Completed',
    },
  ];

  isCreateDialogOpen = false;

  openCreateDialog() {
    this.isCreateDialogOpen = true;
  }

  closeCreateDialog() {
    this.isCreateDialogOpen = false;
  }

  onProjectCreated() {
    // Phase 1 — no real creation logic yet
    this.isCreateDialogOpen = false;
  }

  onCardClicked(projectId: string) {
    // Phase 1 — navigation to /projects/:id wiring comes in a later phase
    console.log('Open project details for', projectId);
  }
}
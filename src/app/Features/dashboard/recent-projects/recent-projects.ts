import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../../Core/services/project.service';

interface ProjectSummary {
  id: string;
  name: string;
  progress: number;
  membersCount: number;
  dueDate: string;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-recent-projects',
  styleUrl: './recent-projects.css',
  templateUrl: './recent-projects.html',
})
export class RecentProjects {
  private projectService = inject(ProjectService);// Inject the ProjectService to access project data
  private router = inject(Router);

  projects = computed<ProjectSummary[]>(() =>// Create a computed property that returns an array of ProjectSummary objects
    this.projectService.projects().slice(0, 3).map(project => ({// Map the project data to the ProjectSummary interface
      id: project.id,
      name: project.name,
      progress: Math.min(100, project.memberIds.length * 25),// Assuming each member contributes 25% to the progress, capped at 100%
      membersCount: project.memberIds.length,// Count of members in the project
      dueDate: project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date',// Format the due date or show the fallback when it is not available
    }))
  );

  onViewDetails(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }
}
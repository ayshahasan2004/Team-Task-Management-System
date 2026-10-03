import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectCard } from '../project-card/project-card';
import { CreateProjectDialog } from '../create-project-dialog/create-project-dialog';
import { ProjectService } from '../../../Core/services/project.service';
import { Project, ProjectStatus } from '../../../Core/models/project.model';

@Component({
  standalone: true,
  imports: [CommonModule, ProjectCard, CreateProjectDialog],
  selector: 'app-projects',
  styleUrl: './projects.css',
  templateUrl: './projects.html',
})
export class Projects {
  private projectService = inject(ProjectService);
  private router = inject(Router);//inject Router to navigate to project details page

  projects = this.projectService.projects;

  isCreateDialogOpen = false;
  editingProject: Project | null = null;// Holds the project being edited, if any

  openCreateDialog(): void {
    this.editingProject = null;
    this.isCreateDialogOpen = true;
  }

  onEditClicked(projectId: string): void {
    const project = this.projectService.getById(projectId);
    if (project) {
      this.editingProject = project;
      this.isCreateDialogOpen = true;
    }
  }

  onDeleteClicked(projectId: string): void {
    if (confirm('Delete this project? This cannot be undone.')) {// Confirm deletion with the user
      this.projectService.delete(projectId);// Delete the project using the ProjectService
    }
  }

  onStatusChanged(change: { id: string; status: ProjectStatus }): void {
    this.projectService.updateStatus(change.id, change.status);
  }

  closeCreateDialog(): void {
    this.isCreateDialogOpen = false;// Close the create/edit project dialog
    this.editingProject = null;
  }

  onProjectSaved(): void {
    this.isCreateDialogOpen = false;
    this.editingProject = null;
  }

  onCardClicked(projectId: string): void {
    this.router.navigate(['/projects', projectId]);// Navigate to the project details page when a project card is clicked
  }
}
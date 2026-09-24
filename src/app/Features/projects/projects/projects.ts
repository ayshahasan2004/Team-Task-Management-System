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
  private router = inject(Router);

  projects = this.projectService.projects;

  isCreateDialogOpen = false;
  editingProject: Project | null = null;

  openCreateDialog() {
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
    if (confirm('Delete this project? This cannot be undone.')) {
      this.projectService.delete(projectId);
    }
  }

  onStatusChanged(change: { id: string; status: ProjectStatus }): void {
    this.projectService.updateStatus(change.id, change.status);
  }

  closeCreateDialog() {
    this.isCreateDialogOpen = false;
    this.editingProject = null;
  }

  onProjectSaved() {
    this.isCreateDialogOpen = false;
    this.editingProject = null;
  }

  onCardClicked(projectId: string) {
    this.router.navigate(['/projects', projectId]);
  }
}
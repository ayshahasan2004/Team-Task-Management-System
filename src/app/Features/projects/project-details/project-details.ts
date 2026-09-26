import { Component, OnInit, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProjectMembers } from '../project-members/project-members';
import { Project } from '../../../Core/models/project.model';
import { ProjectService } from '../../../Core/services/project.service';
import { MemberService } from '../../../Core/services/member.service';

@Component({
  standalone: true,
  imports: [CommonModule, ProjectMembers],
  selector: 'app-project-details',
  styleUrl: './project-details.css',
  templateUrl: './project-details.html',
})
export class ProjectDetails implements OnInit {
  readonly project = input<Project | null>(null);

  private projectService = inject(ProjectService);//inject ProjectService to fetch project details
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute, { optional: true });//inject ActivatedRoute to get the project ID from the URL

  isLoading = false;

  members = computed(() => {
    this.projectService.projects();
    const currentProject = this.projectService.getById(this.project()?.id ?? '');
    const memberIds = new Set(currentProject?.memberIds ?? []);
    return this.memberService.members().filter(member => memberIds.has(member.id));
  });

  // Resolved from the route when no project input was supplied by the parent
  routeProject: Project | null = null;

  get resolvedProject(): Project | null {
    return this.project() ?? this.routeProject;
  }

  get projectProgress(): number {
    return Math.min(100, (this.resolvedProject?.memberIds.length ?? 0) * 25);
  }

  ngOnInit(): void {
    this.isLoading = true;
    const projectId = this.route?.snapshot.paramMap.get('id');// Get the project ID from the route parameters
    if (projectId) {
      this.routeProject = this.projectService.getById(projectId) ?? null;// Fetch the project details using the ProjectService
    }
    this.isLoading = false;
  }
}
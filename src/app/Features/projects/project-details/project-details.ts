import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
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

  // Resolved from the route when no project input was supplied by the parent.
  // A signal so the members computed below react to it.//
  private readonly routeProject = signal<Project | null>(null);

  readonly resolvedProject = computed<Project | null>(
    () => this.project() ?? this.routeProject()
  );

  // Re-reads from ProjectService so members appear/disappear as the project changes
  readonly members = computed(() =>
    this.memberService.getMembersForProject(this.resolvedProject()?.id ?? '')
  );

  get projectProgress(): number {
    return Math.min(100, (this.resolvedProject()?.memberIds.length ?? 0) * 25);
  }

  ngOnInit(): void {
    this.isLoading = true;
    const projectId = this.route?.snapshot.paramMap.get('id');// Get the project ID from the route parameters
    if (projectId) {
      this.routeProject.set(this.projectService.getById(projectId) ?? null);// Fetch the project details using the ProjectService
    }
    this.isLoading = false;
  }
}
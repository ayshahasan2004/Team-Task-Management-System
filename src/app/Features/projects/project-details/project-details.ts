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

  // The route's project id, as a signal so everything below stays reactive.
  private readonly routeProjectId = signal<string | null>(null);

  // Always re-reads from ProjectService, so this detail page reflects live
  // edits (adding members, renaming, deleting) instead of a stale snapshot.
  readonly resolvedProject = computed<Project | null>(() => {
    const fromInput = this.project();
    if (fromInput) {
      return this.projectService.getById(fromInput.id) ?? fromInput;
    }

    const id = this.routeProjectId();
    return id ? this.projectService.getById(id) ?? null : null;
  });

  // Re-reads from MemberService so members appear/disappear as the project changes
  readonly members = computed(() =>
    this.memberService.getMembersForProject(this.resolvedProject()?.id ?? '')
  );

  get projectProgress(): number {
    return Math.min(100, (this.resolvedProject()?.memberIds.length ?? 0) * 25);
  }

  ngOnInit(): void {
    this.isLoading = true;
    const projectId = this.route?.snapshot.paramMap.get('id');// Get the project ID from the route parameters
    this.routeProjectId.set(projectId ?? null);
    this.isLoading = false;
  }
}
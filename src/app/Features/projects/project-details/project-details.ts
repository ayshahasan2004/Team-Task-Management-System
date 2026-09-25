import { Component, Input, OnInit, computed, inject } from '@angular/core';
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
  @Input() project: Project | null = null;

  private projectService = inject(ProjectService);//inject ProjectService to fetch project details
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute, { optional: true });//inject ActivatedRoute to get the project ID from the URL

  members = computed(() => {
    const memberIds = new Set(this.project?.memberIds ?? []);
    return this.memberService.members().filter(member => memberIds.has(member.id));
  });

  get projectProgress(): number {
    return Math.min(100, (this.project?.memberIds.length ?? 0) * 25);
  }

  ngOnInit(): void {
    const projectId = this.route?.snapshot.paramMap.get('id');// Get the project ID from the route parameters
    if (projectId) {
      this.project = this.projectService.getById(projectId) ?? null;// Fetch the project details using the ProjectService
    }
  }
}
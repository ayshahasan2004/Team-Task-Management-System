import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProjectMembers, Member } from '../project-members/project-members';
import { Project } from '../../../Core/models/project.model';
import { ProjectService } from '../../../Core/services/project.service';

@Component({
  standalone: true,
  imports: [CommonModule, ProjectMembers],
  selector: 'app-project-details',
  styleUrl: './project-details.css',
  templateUrl: './project-details.html',
})
export class ProjectDetails implements OnInit {
  @Input() project: Project | null = null;

  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute, { optional: true });

  members: Member[] = [
    { name: 'Aysha', initial: 'A', role: 'Frontend Developer' },
    { name: 'Mohammad', initial: 'M', role: 'Backend Developer' },
    { name: 'Sara', initial: 'S', role: 'Designer' },
    { name: 'Ahmad', initial: 'A', role: 'Project Lead' },
  ];

  get projectProgress(): number {
    return Math.min(100, (this.project?.memberIds.length ?? 0) * 25);
  }

  ngOnInit(): void {
    const projectId = this.route?.snapshot.paramMap.get('id');
    if (projectId) {
      this.project = this.projectService.getById(projectId) ?? null;
    }
  }
}
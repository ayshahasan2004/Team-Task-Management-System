import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../Core/services/member.service';
import { ProjectService } from '../../../Core/services/project.service';
import { TaskService } from '../../../Core/services/task.service';

interface MemberProject {
  name: string;
  progress: number;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-member-details',
  styleUrl: './member-details.css',
  templateUrl: './member-details.html',
})
export class MemberDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private memberService = inject(MemberService);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private memberId = signal<string | null>(null);

  readonly member = computed(() => {
    const id = this.memberId();
    return id ? this.memberService.getById(id) ?? null : null;
  });

  readonly projects = computed<MemberProject[]>(() => {
    const memberId = this.memberId();
    if (!memberId) {
      return [];
    }

    return this.projectService.projects()
      .filter(project => project.memberIds.includes(memberId))
      .map(project => {
        const tasks = this.taskService.getByProject(project.id);
        const completedTasks = tasks.filter(task => task.status === 'Done').length;
        return {
          name: project.name,
          progress: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0,
        };
      });
  });

  ngOnInit(): void {
    this.memberId.set(this.route.snapshot.paramMap.get('id'));
  }
}
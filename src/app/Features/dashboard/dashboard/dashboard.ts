import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCard } from '../stat-card/stat-card';
import { TaskSummary } from '../task-summary/task-summary';
import { RecentProjects } from '../recent-projects/recent-projects';
import { ActivityList } from '../activity-list/activity-list';
import { MemberService } from '../../../Core/services/member.service';
import { ProjectService } from '../../../Core/services/project.service';
import { TaskService } from '../../../Core/services/task.service';

interface Stat {
  label: string;
  value: string | number;
  icon: string;
  trend: string;
  trendPositive: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule, StatCard, TaskSummary, RecentProjects, ActivityList],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private memberService = inject(MemberService);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  stats = computed<Stat[]>(() => {
    const tasks = this.taskService.tasks();
    const now = new Date();
    const activeTasks = tasks.filter(task => task.status !== 'Done').length;
    const overdueTasks = tasks.filter(task => task.dueDate && task.dueDate < now && task.status !== 'Done').length;

    return [
    { label: 'Total Projects', value: this.projectService.projects().length, icon: '▣', trend: '', trendPositive: true },
    { label: 'Active Tasks', value: activeTasks, icon: '✓', trend: '', trendPositive: true },
    { label: 'Team Members', value: this.memberService.projectMembers().length, icon: '◎', trend: '', trendPositive: true },
    { label: 'Overdue', value: overdueTasks, icon: '◔', trend: '', trendPositive: false },
    ];
  });
}
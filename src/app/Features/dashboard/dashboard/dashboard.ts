import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCard } from '../stat-card/stat-card';
import { TaskSummary } from '../task-summary/task-summary';
import { RecentProjects } from '../recent-projects/recent-projects';
import { ActivityList } from '../activity-list/activity-list';

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
  // Phase 1 — static mock data, passed down to StatCard via @Input()
  stats: Stat[] = [
    { label: 'Total Projects', value: 12, icon: '📁', trend: '+2', trendPositive: true },
    { label: 'Active Tasks', value: 25, icon: '✅', trend: '+8', trendPositive: true },
    { label: 'Team Members', value: 9, icon: '👥', trend: '+1', trendPositive: true },
    { label: 'Overdue', value: 3, icon: '⏰', trend: '-2', trendPositive: false },
  ];
}
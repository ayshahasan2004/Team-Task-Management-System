import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TaskStatusGroup {
  label: string;
  count: number;
  color: string;
}

@Component({
  imports: [CommonModule],
  selector: 'app-task-summary',
  styleUrl: './task-summary.css',
  templateUrl: './task-summary.html',
})
export class TaskSummary {
  // Phase 1 — static mock data
  statusGroups: TaskStatusGroup[] = [
    { label: 'To Do', count: 8, color: '#98a19c' },
    { label: 'In Progress', count: 5, color: '#48b4ff' },
    { label: 'Done', count: 12, color: '#00d47e' },
  ];

  get total(): number {
    return this.statusGroups.reduce((sum, g) => sum + g.count, 0);
  }

  widthPercent(count: number): number {
    return this.total ? (count / this.total) * 100 : 0;
  }
}
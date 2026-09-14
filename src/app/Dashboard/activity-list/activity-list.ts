import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ActivityItem {
  userInitial: string;
  text: string;
  time: string;
}

@Component({
  imports: [CommonModule],
  selector: 'app-activity-list',
  styleUrl: './activity-list.css',
  templateUrl: './activity-list.html',
})
export class ActivityList {
  // Phase 1 — static mock data
  activities: ActivityItem[] = [
    { userInitial: 'A', text: 'Aysha completed task "Update login UI"', time: '10m ago' },
    { userInitial: 'M', text: 'Mohammad added a comment on "API Migration"', time: '32m ago' },
    { userInitial: 'S', text: 'Sara created project "Marketing Campaign"', time: '1h ago' },
    { userInitial: 'A', text: 'Ahmad reviewed pull request #42', time: '2h ago' },
    { userInitial: 'L', text: 'Lina moved "Kanban board" to In Progress', time: '3h ago' },
  ];
}
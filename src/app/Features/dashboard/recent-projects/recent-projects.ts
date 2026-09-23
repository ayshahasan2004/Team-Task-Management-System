import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProjectSummary {
  name: string;
  progress: number; // 0-100
  membersCount: number;
  dueDate: string;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-recent-projects',
  styleUrl: './recent-projects.css',
  templateUrl: './recent-projects.html',
})
export class RecentProjects {
  // Phase 1 — static mock data
  projects: ProjectSummary[] = [
    { name: 'Website Redesign', progress: 72, membersCount: 4, dueDate: 'Sep 20' },
    { name: 'Mobile App Launch', progress: 45, membersCount: 6, dueDate: 'Oct 02' },
    { name: 'API Migration', progress: 90, membersCount: 3, dueDate: 'Sep 15' },
    { name: 'Marketing Campaign', progress: 20, membersCount: 5, dueDate: 'Oct 10' },
  ];
}
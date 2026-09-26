import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../../Core/models/member.model';

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
export class MemberDetails {
  // Phase 1 — mock fallback, real wiring (route param / service) comes later
  readonly member = input<Member>({
    id: 'member-1',
    name: 'Aysha',
    initial: 'A',
    role: 'Frontend Developer',
    email: 'aysha@taskflow.dev',
    projectsCount: 3,
    status: 'Online',
  });

  // Phase 1 — static mock data
  projects: MemberProject[] = [
    { name: 'Website Redesign', progress: 72 },
    { name: 'Mobile App Launch', progress: 45 },
    { name: 'API Migration', progress: 90 },
  ];
}
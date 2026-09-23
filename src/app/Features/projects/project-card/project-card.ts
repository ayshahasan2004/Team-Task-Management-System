import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number; // 0-100
  membersCount: number;
  dueDate: string;
  status: 'On Track' | 'At Risk' | 'Completed';
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-project-card',
  styleUrl: './project-card.css',
  templateUrl: './project-card.html',
})
export class ProjectCard {
  // Data comes down from parent (Projects)
  @Input() project!: Project;

  // Click bubbles up to parent — parent decides what to do (open details, etc.)
  @Output() cardClicked = new EventEmitter<string>();

  onCardClick() {
    this.cardClicked.emit(this.project.id);
  }

  get statusClass(): string {
    return this.project.status.toLowerCase().replace(' ', '-');
  }
}
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectStatus } from '../../../Core/models/project.model';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-project-card',
  styleUrl: './project-card.css',
  templateUrl: './project-card.html',
})
export class ProjectCard {
  @Input({ required: true }) project!: Project;

  @Output() detailsClicked = new EventEmitter<string>();
  @Output() editClicked = new EventEmitter<string>();
  @Output() deleteClicked = new EventEmitter<string>();
  @Output() statusChanged = new EventEmitter<{ id: string; status: ProjectStatus }>();
  // Output event to notify parent component of status change

  onViewDetails(event: Event): void {
    event.stopPropagation();
    this.detailsClicked.emit(this.project.id);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.editClicked.emit(this.project.id);// Emit the edit event with the project ID
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.deleteClicked.emit(this.project.id);// Emit the delete event with the project ID
  }

  onStatusChange(event: Event): void {
    event.stopPropagation();// Prevent the click event from propagating to the card click handler
    const status = (event.target as HTMLSelectElement).value as ProjectStatus;// Get the selected status from the dropdown
    this.statusChanged.emit({ id: this.project.id, status });// Emit the status change event with the project ID and new status
  }

  get statusClass(): string {
    return this.project.status.toLowerCase().replace(' ', '-');
  }

  get projectProgress(): number {
    return Math.min(100, this.project.memberIds.length * 25);// Assuming each member contributes 25% to the progress, capped at 100%
  }

  formatDueDate(date: Date | null): string {
    return date
      ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'No due date';
  }
}
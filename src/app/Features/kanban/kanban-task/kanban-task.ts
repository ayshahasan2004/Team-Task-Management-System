import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../Core/models/task.model';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-kanban-task',
  styleUrl: './kanban-task.css',
  templateUrl: './kanban-task.html',
})
export class KanbanTask {
  @Input() task!: Task;

  @Output() cardClicked = new EventEmitter<string>();

  onCardClick() {
    this.cardClicked.emit(this.task.id);
  }

  get priorityClass(): string {
    return this.task.priority.toLowerCase();
  }

  formatDueDate(date: Date | null): string {
    if (!date) {
      return 'No due date';
    }

    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
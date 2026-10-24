import { Component, input, output, signal } from '@angular/core';
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
  readonly task = input.required<Task>();

  // Visual feedback while the card is being dragged
  readonly dragging = signal(false);

  readonly cardClicked = output<string>();

  onCardClick() {
    this.cardClicked.emit(this.task().id);
  }

  // Phase 7: drag & drop — carry the task id on the drag event
  onDragStart(event: DragEvent) {
    event.dataTransfer?.setData('text/plain', this.task().id);
    event.dataTransfer!.effectAllowed = 'move';
    this.dragging.set(true);
  }

  onDragEnd() {
    this.dragging.set(false);
  }

  get priorityClass(): string {
    return this.task().priority.toLowerCase();
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
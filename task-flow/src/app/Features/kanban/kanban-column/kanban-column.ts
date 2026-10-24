import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanTask } from '../kanban-task/kanban-task';
import { Task } from '../../../Core/models/task.model';

@Component({
  standalone: true,
  imports: [CommonModule, KanbanTask],
  selector: 'app-kanban-column',
  styleUrl: './kanban-column.css',
  templateUrl: './kanban-column.html',
})
export class KanbanColumn {
  // Display label for the column — not a TaskStatus ('Todo', 'In Progress'…).
  readonly title = input('Todo');
  readonly tasks = input<Task[]>([]);
  readonly accentColor = input('#98a19c');

  // The TaskStatus this column maps to — used as the drop target for drag & drop
  readonly status = input.required<string>();

  // Visual highlight while a card is hovering over the column
  readonly dragOver = signal(false);

  // Bubbles up to KanbanBoard

  readonly taskClicked = output<string>();
  // Phase 7: emitted when a card is dropped on this column (status name)
  readonly taskDropped = output<{ taskId: string; status: string }>();

  onTaskClick(taskId: string) {
    this.taskClicked.emit(taskId);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // required to allow a drop
    event.dataTransfer!.dropEffect = 'move';
    this.dragOver.set(true);
  }

  onDragLeave() {
    this.dragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(false);

    const taskId = event.dataTransfer?.getData('text/plain');
    if (taskId) {
      this.taskDropped.emit({ taskId, status: this.status() });
    }
  }
}
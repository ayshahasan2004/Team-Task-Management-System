import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { KanbanTask } from '../kanban-task/kanban-task';
import { Task } from '../../../Core/models/task.model';

@Component({
  standalone: true,
  imports: [CommonModule, KanbanTask, CdkDropList, CdkDrag],
  selector: 'app-kanban-column',
  styleUrl: './kanban-column.css',
  templateUrl: './kanban-column.html',
})
export class KanbanColumn {
  // Display label for the column — not a TaskStatus ('Todo', 'In Progress'…).
  readonly title = input('Todo');
  readonly tasks = input<Task[]>([]);
  readonly accentColor = input('#98a19c');

  // The TaskStatus this column maps to — used as the drop target for drag & drop.
  // Phase 7: now consumed by cdkDropList instead of native drag events.
  readonly status = input.required<string>();

  // Other column ids this drop list accepts cards from (linked drop lists).
  readonly connectedIds = input<string[]>([]);

  // Visual highlight while a card is hovering over the column
  readonly dragOver = signal(false);

  // Bubbles up to KanbanBoard
  readonly taskClicked = output<string>();

  // Phase 7: CDK emits the full CdkDragDrop event (source list, indexes).
  // The board uses it to distinguish "reorder within column" from "move across columns".
  readonly taskDropped = output<CdkDragDrop<Task[]>>();

  onTaskClick(taskId: string) {
    this.taskClicked.emit(taskId);
  }

  // CDK event handlers — replaced the native dragover/dragleave/drop plumbing.
  onDragEnter() {
    this.dragOver.set(true);
  }

  onDragLeave() {
    this.dragOver.set(false);
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    this.dragOver.set(false);

    if (event.previousContainer === event.container) {
      // Reorder within the same column — shuffle the local copy; the board
      // persists the new order via the service.
      const tasks = [...this.tasks()];
      moveItemInArray(tasks, event.previousIndex, event.currentIndex);
      event.container.data = tasks;
    }

    this.taskDropped.emit(event);
  }
}

import { Component, input, output } from '@angular/core';
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

  // Bubbles up to KanbanBoard
  readonly taskClicked = output<string>();

  onTaskClick(taskId: string) {
    this.taskClicked.emit(taskId);
  }
}
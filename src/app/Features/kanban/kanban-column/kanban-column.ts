import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanTask } from '../kanban-task/kanban-task';
import { Task, TaskStatus } from '../../../Core/models/task.model';

@Component({
  standalone: true,
  imports: [CommonModule, KanbanTask],
  selector: 'app-kanban-column',
  styleUrl: './kanban-column.css',
  templateUrl: './kanban-column.html',
})
export class KanbanColumn {
  // Data comes down from KanbanBoard
  readonly title = input<TaskStatus>('Todo');
  readonly tasks = input<Task[]>([]);
  readonly accentColor = input('#98a19c');

  // Bubbles up to KanbanBoard
  readonly taskClicked = output<string>();

  onTaskClick(taskId: string) {
    this.taskClicked.emit(taskId);
  }
}
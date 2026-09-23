import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanTask } from '../kanban-task/kanban-task';
import { Task } from '../../tasks/task-card/task-card';
import { TaskStatus } from '../../tasks/task-status-badge/task-status-badge';

@Component({
  standalone: true,
  imports: [CommonModule, KanbanTask],
  selector: 'app-kanban-column',
  styleUrl: './kanban-column.css',
  templateUrl: './kanban-column.html',
})
export class KanbanColumn {
  // Data comes down from KanbanBoard
  @Input() title: TaskStatus = 'To Do';
  @Input() tasks: Task[] = [];
  @Input() accentColor = '#98a19c';

  // Bubbles up to KanbanBoard
  @Output() taskClicked = new EventEmitter<string>();

  onTaskClick(taskId: string) {
    this.taskClicked.emit(taskId);
  }
}
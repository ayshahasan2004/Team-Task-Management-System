import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatusBadge, TaskStatus } from '../task-status-badge/task-status-badge';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeInitial: string;
  assigneeName: string;
  dueDate: string;
}

@Component({
  imports: [CommonModule, TaskStatusBadge],
  selector: 'app-task-card',
  styleUrl: './task-card.css',
  templateUrl: './task-card.html',
})
export class TaskCard {
  @Input() task!: Task;

  @Output() cardClicked = new EventEmitter<string>();

  onCardClick() {
    this.cardClicked.emit(this.task.id);
  }

  get priorityClass(): string {
    return this.task.priority.toLowerCase();
  }
}
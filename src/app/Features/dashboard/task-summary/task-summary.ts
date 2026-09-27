import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../Core/services/task.service';
import { TaskStatus } from '../../../Core/models/task.model';

interface TaskStatusGroup {
  label: string;
  count: number;
  color: string;
}

// Every status the model supports, in workflow order. Adding a status to
// TaskStatus means adding one line here — nothing else in this file changes.
const STATUS_GROUPS: readonly { status: TaskStatus; label: string; color: string }[] = [
  { status: 'Todo', label: 'To Do', color: '#98a19c' },
  { status: 'In Progress', label: 'In Progress', color: '#48b4ff' },
  { status: 'Review', label: 'Review', color: '#f5a623' },
  { status: 'Done', label: 'Done', color: '#f38eda' },
];

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-task-summary',
  styleUrl: './task-summary.css',
  templateUrl: './task-summary.html',
})
export class TaskSummary {
  private taskService = inject(TaskService);

  statusGroups = computed<TaskStatusGroup[]>(() => {
    const tasks = this.taskService.tasks();
    return STATUS_GROUPS.map(group => ({
      label: group.label,
      count: tasks.filter(task => task.status === group.status).length,
      color: group.color,
    }));
  });

  readonly total = computed(() =>
    this.statusGroups().reduce((sum, group) => sum + group.count, 0)
  );

  widthPercent(count: number): number {
    const total = this.total();
    return total ? (count / total) * 100 : 0;
  }
}
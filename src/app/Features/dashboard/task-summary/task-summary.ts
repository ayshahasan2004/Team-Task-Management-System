import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../Core/services/task.service';

interface TaskStatusGroup {
  label: string;
  count: number;
  color: string;
}

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
    return [
      { label: 'To Do', count: tasks.filter(task => task.status === 'Todo').length, color: '#98a19c' },
      { label: 'In Progress', count: tasks.filter(task => task.status === 'In Progress').length, color: '#48b4ff' },
      { label: 'Done', count: tasks.filter(task => task.status === 'Done').length, color: '#f38eda' },
    ];
  });

  total(): number {
    return this.statusGroups().reduce((sum, group) => sum + group.count, 0);
  }

  widthPercent(count: number): number {
    return this.total() ? (count / this.total()) * 100 : 0;
  }
}
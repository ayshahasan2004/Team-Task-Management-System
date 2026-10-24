import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../../../Core/services/task.service';
import { Task, TaskStatus } from '../../../Core/models/task.model';
import { TaskCard } from '../task-card/task-card';
import { TaskFilters } from '../task-filters/task-filters';
import { CreateTaskDialog } from '../create-task-dialog/create-task-dialog';

type TaskStatusFilter = 'All' | TaskStatus;

// Single source of truth for the statuses this page can filter by
const TASK_STATUS_OPTIONS: readonly TaskStatus[] = ['Todo', 'In Progress', 'Review', 'Done'];

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TaskCard, TaskFilters, CreateTaskDialog],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  private taskService = inject(TaskService);
  private router = inject(Router);

  tasks = this.taskService.tasks;
  selectedStatus = signal<TaskStatusFilter>('All');
  selectedPriority = signal<'All' | 'Low' | 'Medium' | 'High'>('All');
  searchText = signal('');

  // Phase 6: active sort mode for the task list
  activeSort = signal<'Due date' | 'Priority' | 'Newest' | 'Oldest'>('Due date');

  private static readonly PRIORITY_ORDER: Record<'Low' | 'Medium' | 'High', number> = {
    High: 0,
    Medium: 1,
    Low: 2,
  };

  filteredTasks = computed(() => {
    const status = this.selectedStatus();
    const priority = this.selectedPriority();
    const search = this.searchText();
    const sort = this.activeSort();
    const allTasks = this.taskService.tasks();

    const byStatus = status === 'All' ? allTasks : allTasks.filter(task => task.status === status);
    const byPriority = priority === 'All' ? byStatus : byStatus.filter(task => task.priority === priority);

    const normalizedSearch = search.trim().toLowerCase();
    const matched = normalizedSearch
      ? byPriority.filter(task =>
          task.title.toLowerCase().includes(normalizedSearch) ||
          task.description.toLowerCase().includes(normalizedSearch)
        )
      : byPriority;

    return this.sortTasks(matched, sort);
  });

  /** Phase 6: sorts tasks by due date, priority, or creation time. */
  private sortTasks(
    tasks: Task[],
    sort: 'Due date' | 'Priority' | 'Newest' | 'Oldest'
  ): Task[] {
    const sorted = [...tasks];
    switch (sort) {
      case 'Due date':
        // Soonest first; tasks without a due date sink to the bottom
        sorted.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        });
        break;
      case 'Priority':
        sorted.sort((a, b) =>
          Tasks.PRIORITY_ORDER[a.priority] - Tasks.PRIORITY_ORDER[b.priority]
        );
        break;
      case 'Newest':
        sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'Oldest':
        sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
    }
    return sorted;
  }

  isDialogOpen = signal(false);

  openCreateDialog(): void {
    this.isDialogOpen.set(true);
  }

  onDialogClosed(): void {
    this.isDialogOpen.set(false);
  }

  onTaskCreated(): void {
    this.isDialogOpen.set(false);
  }

  onCardClicked(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  onStatusFilterChanged(status: string): void {
    if (status === 'All' || TASK_STATUS_OPTIONS.includes(status as TaskStatus)) {
      this.selectedStatus.set(status as TaskStatusFilter);
    }
  }

  onPriorityFilterChanged(priority: string): void {
    if (priority === 'All' || priority === 'Low' || priority === 'Medium' || priority === 'High') {
      this.selectedPriority.set(priority);
    }
  }

  onSearchChanged(value: string): void {
    this.searchText.set(value);
  }

  onSortChanged(sort: string): void {
    if (sort === 'Due date' || sort === 'Priority' || sort === 'Newest' || sort === 'Oldest') {
      this.activeSort.set(sort);
    }
  }
}
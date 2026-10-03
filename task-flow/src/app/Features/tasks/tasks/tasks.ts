import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../../../Core/services/task.service';
import { TaskStatus } from '../../../Core/models/task.model';
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

  filteredTasks = computed(() => {
    const status = this.selectedStatus();
    const priority = this.selectedPriority();
    const search = this.searchText();
    const allTasks = this.taskService.tasks();

    const byStatus = status === 'All' ? allTasks : allTasks.filter(task => task.status === status);
    const byPriority = priority === 'All' ? byStatus : byStatus.filter(task => task.priority === priority);

    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return byPriority;
    }

    return byPriority.filter(task =>
      task.title.toLowerCase().includes(normalizedSearch) ||
      task.description.toLowerCase().includes(normalizedSearch)
    );
  });

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
}
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../Core/services/task.service';
import { TaskCard } from '../task-card/task-card';
import { TaskFilters } from '../task-filters/task-filters';
import { CreateTaskDialog } from '../create-task-dialog/create-task-dialog';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TaskCard, TaskFilters, CreateTaskDialog],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  private taskService = inject(TaskService);

  tasks = this.taskService.tasks;
  selectedStatus = signal<'All' | 'Todo' | 'In Progress' | 'Done'>('All');
  selectedPriority = signal<'All' | 'Low' | 'Medium' | 'High'>('All');
  searchText = signal('');

  filteredTasks = computed(() => {
    const status = this.selectedStatus();
    const priority = this.selectedPriority();
    const search = this.searchText();
    const allTasks = this.taskService.tasks();

    const byStatus = status === 'All' ? allTasks : allTasks.filter(task => task.status === status);
    const byPriority = priority === 'All' ? byStatus : byStatus.filter(task => task.priority === priority);

    if (!search) {
      return byPriority;
    }

    return byPriority.filter(task =>
      task.title.toLowerCase().includes(search) ||
      task.description.toLowerCase().includes(search)
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
    // route later if needed
  }

  onStatusFilterChanged(status: string): void {
    if (status === 'All' || status === 'Todo' || status === 'In Progress' || status === 'Done') {
      this.selectedStatus.set(status);
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
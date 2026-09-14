import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCard, Task } from '../task-card/task-card';
import { TaskFilters } from '../task-filters/task-filters';
import { CreateTaskDialog } from '../create-task-dialog/create-task-dialog';

@Component({
  imports: [CommonModule, TaskCard, TaskFilters, CreateTaskDialog],
  selector: 'app-tasks',
  styleUrl: './tasks.css',
  templateUrl: './tasks.html',
})
export class Tasks {
  // Phase 1 — static mock data
  tasks: Task[] = [
    {
      id: 'task-1',
      title: 'Update login UI',
      description: 'Apply the new dark showcase theme to login and signup pages.',
      status: 'In Progress',
      priority: 'High',
      assigneeInitial: 'A',
      assigneeName: 'Aysha',
      dueDate: 'Sep 18',
    },
    {
      id: 'task-2',
      title: 'Set up Kanban board layout',
      description: 'Build the three-column board structure with drag placeholders.',
      status: 'To Do',
      priority: 'Medium',
      assigneeInitial: 'M',
      assigneeName: 'Mohammad',
      dueDate: 'Sep 22',
    },
    {
      id: 'task-3',
      title: 'Write API documentation',
      description: 'Document the new GraphQL endpoints for the mobile team.',
      status: 'Done',
      priority: 'Low',
      assigneeInitial: 'S',
      assigneeName: 'Sara',
      dueDate: 'Sep 10',
    },
    {
      id: 'task-4',
      title: 'Fix responsive nav bug',
      description: 'Sidebar overlaps content on tablet breakpoints.',
      status: 'To Do',
      priority: 'High',
      assigneeInitial: 'L',
      assigneeName: 'Lina',
      dueDate: 'Sep 19',
    },
  ];

  isCreateDialogOpen = false;

  openCreateDialog() {
    this.isCreateDialogOpen = true;
  }

  closeCreateDialog() {
    this.isCreateDialogOpen = false;
  }

  onTaskCreated() {
    // Phase 1 — no real creation logic yet
    this.isCreateDialogOpen = false;
  }

  onCardClicked(taskId: string) {
    // Phase 1 — navigation to task details view is a later-phase task
    console.log('Open task details for', taskId);
  }

  onStatusFilterChanged(status: string) {
    // Phase 1 — visual only, no actual filtering wired up yet
    console.log('Filter by status:', status);
  }
}
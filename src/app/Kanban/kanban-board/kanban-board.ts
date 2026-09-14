import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanColumn } from '../kanban-column/kanban-column';
import { Task } from '../../Tasks/task-card/task-card';

@Component({
  imports: [CommonModule, KanbanColumn],
  selector: 'app-kanban-board',
  styleUrl: './kanban-board.css',
  templateUrl: './kanban-board.html',
})
export class KanbanBoard {
  // Phase 1 — static mock data, same shape as Tasks feature's Task interface
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
      description: 'Build the three-column board structure.',
      status: 'To Do',
      priority: 'Medium',
      assigneeInitial: 'M',
      assigneeName: 'Mohammad',
      dueDate: 'Sep 22',
    },
    {
      id: 'task-3',
      title: 'Write API documentation',
      description: 'Document the new GraphQL endpoints.',
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
    {
      id: 'task-5',
      title: 'Review pull request #42',
      description: 'Check component communication patterns.',
      status: 'Done',
      priority: 'Medium',
      assigneeInitial: 'A',
      assigneeName: 'Ahmad',
      dueDate: 'Sep 12',
    },
  ];

  get todoTasks(): Task[] {
    return this.tasks.filter((t) => t.status === 'To Do');
  }

  get inProgressTasks(): Task[] {
    return this.tasks.filter((t) => t.status === 'In Progress');
  }

  get doneTasks(): Task[] {
    return this.tasks.filter((t) => t.status === 'Done');
  }

  onTaskClicked(taskId: string) {
    // Phase 1 — opening task details is a later-phase task
    console.log('Open task details for', taskId);
  }
}
// features/kanban/kanban-board/kanban-board.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../../Core/services/task.service';
import { TaskStatus } from '../../../Core/models/task.model';
import { KanbanColumn } from '../kanban-column/kanban-column';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [KanbanColumn],
  styleUrl: './kanban-board.css',
  templateUrl: './kanban-board.html',
})
export class KanbanBoard {
  private taskService = inject(TaskService);
  private router = inject(Router);

  // BEFORE: todoTasks/inProgressTasks/doneTasks were getters over a
  // local mock array (per your reference file)
  // AFTER: same names, but pointing at the SAME service the Tasks page reads
  todoTasks = this.taskService.todoTasks;
  inProgressTasks = this.taskService.inProgressTasks;
  reviewTasks = this.taskService.reviewTasks;
  doneTasks = this.taskService.doneTasks;

  onTaskClicked(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  // Phase 7: drag & drop — move a task to the column it was dropped on.
  // The column carries the backend enum ('TODO'…); the service works with
  // frontend statuses ('Todo'…), so map before calling moveToStatus.
  onTaskDropped(event: { taskId: string; status: string }): void {
    const statusMap: Record<string, TaskStatus> = {
      'TODO': 'Todo',
      'IN_PROGRESS': 'In Progress',
      'REVIEW': 'Review',
      'DONE': 'Done',
    };

    const status = statusMap[event.status];
    if (status) {
      this.taskService.moveToStatus(event.taskId, status);
    }
  }
}
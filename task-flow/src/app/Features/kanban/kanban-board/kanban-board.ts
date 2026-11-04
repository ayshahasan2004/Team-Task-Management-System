// features/kanban/kanban-board/kanban-board.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../../Core/services/task.service';
import { Task, TaskStatus } from '../../../Core/models/task.model';
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

  todoTasks = this.taskService.todoTasks;
  inProgressTasks = this.taskService.inProgressTasks;
  reviewTasks = this.taskService.reviewTasks;
  doneTasks = this.taskService.doneTasks;

  // Phase 7: each column is a CDK drop list identified by the backend enum
  // ('TODO'…). All four are connected so cards can move between them.
  readonly dropListIds = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

  onTaskClicked(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  // Phase 7: CDK drag & drop. The column emits the full CdkDragDrop event;
  // here we translate it into a status change (cross-column) or a reorder
  // (within a column) and let the service handle the optimistic update +
  // rollback on API failure.
  onTaskDropped(event: CdkDragDrop<Task[]>): void {
    const statusMap: Record<string, TaskStatus> = {
      'TODO': 'Todo',
      'IN_PROGRESS': 'In Progress',
      'REVIEW': 'Review',
      'DONE': 'Done',
    };

    const taskId = event.item.data as string;
    const targetStatus = statusMap[event.container.id];
    if (!taskId || !targetStatus) {
      return;
    }

    const task = this.taskService.getById(taskId);
    if (!task) {
      return;
    }

    if (event.previousContainer === event.container) {
      // Reorder within the same column: only persist if the order changed.
      const columnTasks = event.container.data;
      const currentColumn = this.columnTasks(task.status);
      if (columnTasks[event.previousIndex]?.id !== currentColumn[event.currentIndex]?.id) {
        this.taskService.moveTask(taskId, targetStatus, event.currentIndex)?.subscribe({
          error: () => console.error('Failed to reorder task — board restored.'),
        });
      }
      return;
    }

    // Move across columns: source list loses the item, target gains it.
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
    this.taskService.moveTask(taskId, targetStatus, event.currentIndex)?.subscribe({
      error: () => console.error('Failed to move task — board restored.'),
    });
  }

  private columnTasks(status: TaskStatus): Task[] {
    switch (status) {
      case 'Todo':
        return this.todoTasks();
      case 'In Progress':
        return this.inProgressTasks();
      case 'Review':
        return this.reviewTasks();
      default:
        return this.doneTasks();
    }
  }
}

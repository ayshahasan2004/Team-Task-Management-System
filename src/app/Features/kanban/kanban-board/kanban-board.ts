// features/kanban/kanban-board/kanban-board.ts
import { Component, inject } from '@angular/core';
import { TaskService } from '../../../Core/services/task.service';
import { KanbanColumn } from '../kanban-column/kanban-column';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [KanbanColumn],
  templateUrl: './kanban-board.html',
})
export class KanbanBoard {
  private taskService = inject(TaskService);

  // BEFORE: todoTasks/inProgressTasks/doneTasks were getters over a
  // local mock array (per your reference file)
  // AFTER: same names, but pointing at the SAME service the Tasks page reads
  todoTasks = this.taskService.todoTasks;
  inProgressTasks = this.taskService.inProgressTasks;
  doneTasks = this.taskService.doneTasks;

  onTaskClicked(taskId: string): void {
    console.log('Task clicked:', taskId);
  }
}
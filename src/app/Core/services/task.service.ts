import { Injectable, signal, computed, inject } from '@angular/core';
import { Task, TaskStatus } from '../models/task.model';
import { ActivityService } from './activity.service';

// Keeps the Tasks page filter in sync with what the model actually supports
const TASK_STATUSES: readonly TaskStatus[] = ['Todo', 'In Progress', 'Review', 'Done'];

@Injectable({ providedIn: 'root' })
export class TaskService {
  private activityService = inject(ActivityService);
////_tasks ==> orginal tasks array, tasks ==> read-only access to the tasks,
////todoTasks ==> computed signal for tasks with status 'Todo',
////inProgressTasks ==> computed signal for tasks with status 'In Progress',
////reviewTasks ==> computed signal for tasks with status 'Review',
////doneTasks ==> computed signal for tasks with status 'Done'
////stores all tasks in a reactive signal
  private readonly _tasks = signal<Task[]>(MOCK_TASKS);
  // provides read-only access to the tasks
  readonly tasks = this._tasks.asReadonly();
  // returns only todo tasks
  readonly todoTasks = computed(() =>
    this._tasks().filter(t => t.status === 'Todo')
  );
  // returns only in progress tasks
  readonly inProgressTasks = computed(() =>
    this._tasks().filter(t => t.status === 'In Progress')
  );
  // returns only tasks waiting for review
  readonly reviewTasks = computed(() =>
    this._tasks().filter(t => t.status === 'Review')
  );
  // returns only completed tasks
  readonly doneTasks = computed(() =>
    this._tasks().filter(t => t.status === 'Done')
  );
  // finds a task by its id
  getById(id: string): Task | undefined {
    return this._tasks().find(t => t.id === id);
  }

  // Turns "m1" / "Aysha" / "Aysha Rahman" into a 2-letter avatar initial
  initialFor(task: Task): string {
    const assigneeId = task.assigneeId;
    if (!assigneeId) {
      return '?';
    }

    const parts = assigneeId.trim().split(/\s+/);
    const letters = parts.length > 1
      ? `${parts[0].charAt(0)}${parts[1].charAt(0)}`
      : assigneeId.slice(0, 2);

    return letters.toUpperCase();
  }
  // returns a short count per status so the UI never has to hardcode the status list
  readonly statusCounts = computed<Record<TaskStatus, number>>(() => {
    const tasks = this._tasks();
    return TASK_STATUSES.reduce(
      (counts, status) => {
        counts[status] = tasks.filter(t => t.status === status).length;
        return counts;
      },
      { Todo: 0, 'In Progress': 0, Review: 0, Done: 0 } as Record<TaskStatus, number>,
    );
  });
  // returns all tasks for a project
  getByProject(projectId: string): Task[] {
    return this._tasks().filter(t => t.projectId === projectId);
  }
  // creates and adds a new task
  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    // creates the new task with generated data
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // adds the new task to the list
    this._tasks.update(tasks => [...tasks, newTask]);/////copies all existing tasks and adds the new task(spread operator) to the end of the array
    this.activityService.add(newTask.assigneeId ?? 'm1', `created task "${newTask.title}"`);
    // returns the created task
    return newTask;
  }
  // updates an existing task
  update(id: string, changes: Partial<Task>): boolean {
    const task = this.getById(id);
    if (!task) {
      return false;
    }

    // updates only the task with the given id
    this._tasks.update(tasks =>
      tasks.map(t => (
        t.id === id
          ? { ...t, ...changes, updatedAt: new Date() }
          : t
      ))
    );
    this.activityService.add(task.assigneeId ?? 'm1', `updated task "${changes.title ?? task.title}"`);
    return true;
  }
  // changes the status of a task
  moveToStatus(id: string, status: TaskStatus): boolean {
    // reuses update to change the status
    return this.update(id, { status });
  }
  // deletes a task by its id
  delete(id: string): void {
    const task = this.getById(id);
    // removes the task from the list
    this._tasks.update(tasks =>
      tasks.filter(t => t.id !== id)
    );
    if (task) {
      this.activityService.add(task.assigneeId ?? 'm1', `deleted task "${task.title}"`);
    }
  }
}
// stores temporary task data
const MOCK_TASKS: Task[] = [
  {
    id: '1', projectId: 'p1', title: 'Set up CI pipeline',
    description: 'Configure GitHub Actions for build + lint', status: 'Todo',
    priority: 'High', assigneeId: 'Aysha', dueDate: new Date('2026-10-01'),
    tags: ['devops'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '2', projectId: 'p1', title: 'Design login page',
    description: 'Mockup + responsive layout', status: 'In Progress',
    priority: 'Medium', assigneeId: 'Sara', dueDate: new Date('2026-09-28'),
    tags: ['ui'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '3', projectId: 'p1', title: 'Code review — auth module',
    description: 'Review pull request #42 before merging', status: 'Review',
    priority: 'Medium', assigneeId: 'Aysha', dueDate: new Date('2026-09-30'),
    tags: ['review'], createdAt: new Date(), updatedAt: new Date(),
  },
];
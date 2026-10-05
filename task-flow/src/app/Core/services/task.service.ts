import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

import { Task, TaskStatus } from '../models/task.model';
import { environment } from '../../../environments/environment';
import { ActivityService } from './activity.service';
import { AuthService } from './auth.service';

interface BackendTask {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assigneeId: string | null;
  dueDate: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

type BackendTaskCreate = Omit<BackendTask, 'id' | 'createdAt' | 'updatedAt'>;

// Keeps the Tasks page filter in sync with what the model actually supports
const TASK_STATUSES: readonly TaskStatus[] = ['Todo', 'In Progress', 'Review', 'Done'];

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private activityService = inject(ActivityService);
  private authService = inject(AuthService);
  private readonly _tasks = signal<Task[]>([]);
  readonly tasks = this._tasks.asReadonly();

  readonly todoTasks = computed(() => this._tasks().filter(t => t.status === 'Todo'));
  readonly inProgressTasks = computed(() => this._tasks().filter(t => t.status === 'In Progress'));
  readonly reviewTasks = computed(() => this._tasks().filter(t => t.status === 'Review'));
  readonly doneTasks = computed(() => this._tasks().filter(t => t.status === 'Done'));

  constructor() {
    effect(() => {
      const token = this.authService.token();
      if (!token) {
        this._tasks.set([]);
        return;
      }

      this.refresh().subscribe({
        error: () => this._tasks.set([]),
      });
    });
  }

  refresh(): Observable<Task[]> {
    return this.http.get<BackendTask[]>(`${environment.coreApiUrl}/tasks`).pipe(
      map(tasks => tasks.map(task => this.toTask(task))),
      tap(tasks => this._tasks.set(tasks))
    );
  }

  getById(id: string): Task | undefined {
    return this._tasks().find(t => t.id === id);
  }

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

  getByProject(projectId: string): Task[] {
    return this._tasks().filter(t => t.projectId === projectId);
  }

  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
    const optimisticTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this._tasks.update(tasks => [...tasks, optimisticTask]);

    return this.http.post<BackendTask>(`${environment.coreApiUrl}/tasks`, this.toTaskCreateRequest(optimisticTask)).pipe(
      map(task => this.toTask(task)),
      tap(saved => {
        this._tasks.update(items => items.map(item => item.id === optimisticTask.id ? saved : item));
        const memberId = this.authService.currentUser()?.userId ?? saved.assigneeId;
        if (memberId) {
          this.activityService.add(memberId, `created task "${saved.title}"`);
        }
      }),
      catchError(error => {
        this._tasks.update(items => items.filter(item => item.id !== optimisticTask.id));
        return throwError(() => error);
      })
    );
  }

  update(id: string, changes: Partial<Task>): boolean {
    const task = this.getById(id);
    if (!task) {
      return false;
    }

    const updatedTask: Task = {
      ...task,
      ...changes,
      dueDate: changes.dueDate ?? task.dueDate,
      tags: changes.tags ?? task.tags,
      updatedAt: new Date(),
    };

    this._tasks.update(tasks =>
      tasks.map(t => (t.id === id ? updatedTask : t))
    );
    this.activityService.add(task.assigneeId ?? 'm1', `updated task "${changes.title ?? task.title}"`);

    this.http.put<BackendTask>(`${environment.coreApiUrl}/tasks/${id}`, this.toBackendTask(updatedTask)).pipe(
      map(task => this.toTask(task)),
      tap(saved => {
        this._tasks.update(items => items.map(item => item.id === id ? saved : item));
      })
    ).subscribe();

    return true;
  }

  moveToStatus(id: string, status: TaskStatus): boolean {
    return this.update(id, { status });
  }

  delete(id: string): Observable<void> {
    const task = this.getById(id);

    return this.http.delete<void>(`${environment.coreApiUrl}/tasks/${id}`).pipe(
      tap(() => {
        this._tasks.update(tasks => tasks.filter(item => item.id !== id));
        const memberId = this.authService.currentUser()?.userId ?? task?.assigneeId;
        if (task && memberId) {
          this.activityService.add(memberId, `deleted task "${task.title}"`);
        }
      })
    );
  }

  removeTasksForProject(projectId: string): void {
    this._tasks.update(tasks => tasks.filter(t => t.projectId !== projectId));
  }

  private toTask(task: BackendTask): Task {
    return {
      id: task.id,
      projectId: task.projectId,
      title: task.title,
      description: task.description ?? '',
      status: mapTaskStatus(task.status),
      priority: mapPriority(task.priority),
      assigneeId: task.assigneeId,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      tags: task.tags ?? [],
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    };
  }

  private toBackendTask(task: Partial<Task> | Task): BackendTask {
    return {
      id: task.id ?? '',
      projectId: task.projectId ?? '',
      title: task.title ?? '',
      description: task.description ?? '',
      status: mapTaskStatusApi(task.status ?? 'Todo'),
      priority: mapPriorityApi(task.priority ?? 'Medium'),
      assigneeId: task.assigneeId ?? null,
      dueDate: task.dueDate ? formatDateOnly(task.dueDate) : null,
      tags: task.tags ?? [],
      createdAt: task.createdAt ? formatDateTime(task.createdAt) : new Date().toISOString(),
      updatedAt: task.updatedAt ? formatDateTime(task.updatedAt) : new Date().toISOString(),
    };
  }

  private toTaskCreateRequest(task: Task): BackendTaskCreate {
    return {
      projectId: task.projectId,
      title: task.title,
      description: task.description,
      status: mapTaskStatusApi(task.status),
      priority: mapPriorityApi(task.priority),
      assigneeId: task.assigneeId,
      dueDate: task.dueDate ? formatDateOnly(task.dueDate) : null,
      tags: task.tags,
    };
  }
}

function mapTaskStatus(status: string | undefined): TaskStatus {
  switch (status) {
    case 'TODO':
      return 'Todo';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'REVIEW':
      return 'Review';
    case 'DONE':
      return 'Done';
    default:
      return 'Todo';
  }
}

function mapTaskStatusApi(status: TaskStatus): 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' {
  switch (status) {
    case 'In Progress':
      return 'IN_PROGRESS';
    case 'Review':
      return 'REVIEW';
    case 'Done':
      return 'DONE';
    default:
      return 'TODO';
  }
}

function mapPriority(priority: string | undefined): Task['priority'] {
  switch (priority) {
    case 'LOW':
      return 'Low';
    case 'HIGH':
      return 'High';
    default:
      return 'Medium';
  }
}

function mapPriorityApi(priority: Task['priority']): 'LOW' | 'MEDIUM' | 'HIGH' {
  switch (priority) {
    case 'Low':
      return 'LOW';
    case 'High':
      return 'HIGH';
    default:
      return 'MEDIUM';
  }
}

function formatDateOnly(date: Date): string {
  return new Date(date).toISOString().split('T')[0];
}

function formatDateTime(date: Date): string {
  return new Date(date).toISOString();
}
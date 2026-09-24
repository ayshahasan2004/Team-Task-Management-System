import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskStatus } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
////_tasks ==> orginal tasks array, tasks ==> read-only access to the tasks, 
////todoTasks ==> computed signal for tasks with status 'Todo', 
////inProgressTasks ==> computed signal for tasks with status 'In Progress',
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
  // returns only completed tasks
  readonly doneTasks = computed(() =>
    this._tasks().filter(t => t.status === 'Done')
  );
  // finds a task by its id
  getById(id: string): Task | undefined {
    return this._tasks().find(t => t.id === id);
  }
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
    // returns the created task
    return newTask;
  }
  // updates an existing task
  update(id: string, changes: Partial<Task>): void {
    // updates only the task with the given id
    this._tasks.update(tasks =>
      tasks.map(t => (
        t.id === id
          ? { ...t, ...changes, updatedAt: new Date() }
          : t
      ))
    );
  }
  // changes the status of a task
  moveToStatus(id: string, status: TaskStatus): void {
    // reuses update to change the status
    this.update(id, { status });
  }
  // deletes a task by its id
  delete(id: string): void {
    // removes the task from the list
    this._tasks.update(tasks =>
      tasks.filter(t => t.id !== id)
    );
  }
}
// stores temporary task data
const MOCK_TASKS: Task[] = [
  {
    id: '1', projectId: 'p1', title: 'Set up CI pipeline',
    description: 'Configure GitHub Actions for build + lint', status: 'Todo',
    priority: 'High', assigneeId: 'm1', dueDate: new Date('2026-10-01'),
    tags: ['devops'], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '2', projectId: 'p1', title: 'Design login page',
    description: 'Mockup + responsive layout', status: 'In Progress',
    priority: 'Medium', assigneeId: 'm2', dueDate: new Date('2026-09-28'),
    tags: ['ui'], createdAt: new Date(), updatedAt: new Date(),
  },
];
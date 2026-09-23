export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  dueDate: Date | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
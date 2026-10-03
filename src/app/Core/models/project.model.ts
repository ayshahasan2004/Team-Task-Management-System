export type ProjectStatus = 'Active' | 'Completed' | 'Archived';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  memberIds: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
}
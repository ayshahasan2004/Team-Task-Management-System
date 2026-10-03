import { Routes } from '@angular/router';
import { MainLayout } from './Layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./Features/auth/login/login').then(m => m.Login),
  },
  {
    path: 'signup',
    loadComponent: () => import('./Features/auth/signup/signup').then(m => m.Signup),
  },

  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./Features/dashboard/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'projects',
        loadComponent: () => import('./Features/projects/projects/projects').then(m => m.Projects),
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./Features/projects/project-details/project-details').then(m => m.ProjectDetails),
      },
      {
        path: 'tasks',
        loadComponent: () => import('./Features/tasks/tasks/tasks').then(m => m.Tasks),
      },
      {
        path: 'tasks/:id',
        loadComponent: () => import('./Features/tasks/task-details/task-details').then(m => m.TaskDetails),
      },
      {
        path: 'kanban',
        loadComponent: () => import('./Features/kanban/kanban-board/kanban-board').then(m => m.KanbanBoard),
      },
      {
        path: 'team',
        loadComponent: () => import('./Features/team/team/team').then(m => m.Team),
      },
      {
        path: 'team/:id',
        loadComponent: () => import('./Features/team/member-details/member-details').then(m => m.MemberDetails),
      },
      {
        path: 'settings',
        loadComponent: () => import('./Features/settings/settings/settings').then(m => m.Settings),
      },
    ],
  },

  { path: '**', loadComponent: () => import('./Shared/Components/NotFound/not-found/not-found').then(m => m.NotFound) },
];
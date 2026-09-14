import { Routes } from '@angular/router';
import { Login } from './Auth/login/login';
import { Signup } from './Auth/signup/signup';
import { MainLayout } from './Layout/main-layout/main-layout';
import { Dashboard } from './Dashboard/dashboard/dashboard';
import { Projects } from './Projects/projects/projects';
import { Tasks } from './Tasks/tasks/tasks';
import { KanbanBoard } from './Kanban/kanban-board/kanban-board';
import { Team } from './Team/team/team';

export const routes: Routes = [
  // Root route shows the dashboard inside the main layout
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Auth pages — full screen, no Sidebar/Header
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },

  // Dashboard and other app pages render inside MainLayout
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'projects', component: Projects },
      { path: 'tasks', component: Tasks },
      { path: 'kanban', component: KanbanBoard },
      { path: 'team', component: Team },
    ],
  },
];
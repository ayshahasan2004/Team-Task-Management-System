import { Routes } from '@angular/router';
import { Login } from './Auth/login/login';
import { Signup } from './Auth/signup/signup';
import { MainLayout } from './Layout/main-layout/main-layout';

export const routes: Routes = [
  // Redirect root to login FIRST, before MainLayout claims path: ''
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth pages — full screen, no Sidebar/Header
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },

  // Temporary preview route: show only the layout shell for design inspection
  {
    path: 'layout-preview',
    component: MainLayout,
    children: [
      { path: '', component: Login },
    ],
  },
];
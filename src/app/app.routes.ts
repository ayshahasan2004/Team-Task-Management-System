import { Routes } from '@angular/router';
import { Login } from './Auth/login/login';
import { Signup } from './Auth/signup/signup';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
    { path: '', redirectTo: 'login', pathMatch: 'full' },

];
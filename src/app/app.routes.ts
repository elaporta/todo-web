// dependencies
import { Routes } from '@angular/router';

// guards
import { authGuard, publicGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'auth', loadComponent: () => import('./pages/auth-page/auth-page.component'), canActivate: [publicGuard] },
  { path: 'tasks', loadComponent: () => import('./pages/tasks-page/tasks-page.component'), canActivate: [authGuard] },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' }
];
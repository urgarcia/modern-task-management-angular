import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { AuthGuard } from './features/auth/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: authRoutes
  },
  {
    path: 'tasks',
    loadChildren: () => import('./features/tasks/tasks.routes').then(m => m.tasksRoutes),
    canActivate: [AuthGuard]
  }
];

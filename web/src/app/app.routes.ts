import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'pets',
        loadComponent: () => import('./pages/pets-list/pets-list.component').then(m => m.PetsListComponent)
      },
      {
        path: 'pets/:id',
        loadComponent: () => import('./pages/pet-detail/pet-detail.component').then(m => m.PetDetailComponent)
      },
      {
        path: 'reminders',
        loadComponent: () => import('./pages/reminders/reminders.component').then(m => m.RemindersComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

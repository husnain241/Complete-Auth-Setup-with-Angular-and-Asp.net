import { Routes } from '@angular/router';
import { roleGuard, guestGuard } from './core/guards/role.guard';
import { UserListComponent } from './features/admin/admin-dashboard/user-list/user-list.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
                canActivate: [guestGuard]
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
                canActivate: [guestGuard]
            }
        ]
    },
    {
        path: 'admin',
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        canActivate: [roleGuard],
        data: { roles: ['Admin'] }
    },
    { path: 'admin/users', component: UserListComponent },
    {
        path: '**',
        redirectTo: ''
    }
];

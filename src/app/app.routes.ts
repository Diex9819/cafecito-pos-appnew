import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Sales } from './pages/sales/sales';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard, adminGuard, guestGuard } from './guards/auth-guard'

export const routes: Routes = [
    { path: 'login', component: Login, canActivate: [guestGuard] },
    { path: 'sales', component: Sales, canActivate: [authGuard] },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard, adminGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
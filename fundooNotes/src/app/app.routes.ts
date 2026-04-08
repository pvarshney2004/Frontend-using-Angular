import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { Trash } from './components/trash/trash';
import { Reminder } from './components/reminder/reminder';
import { Archive } from './components/archive/archive';
import { Layout } from './components/layout/layout';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'register', component: Register },
    {
        path: '',
        component: Layout,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'trash', component: Trash },
            { path: 'reminders', component: Reminder },
            { path: 'archive', component: Archive },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: '' }


];

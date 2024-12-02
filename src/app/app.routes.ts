import { Routes } from '@angular/router';
import { DashboardModule } from './dashboard/dashboard.module';
import {roleGuard} from '../auth/gaurds/role.guard';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule)},
  {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
  {path: 'register', component:RegisterComponent, canActivate: [roleGuard], data: {role: 'admin'}},
  {path:'profile', component:ProfileComponent, canActivate: [roleGuard]},
  { path: '**', redirectTo: '/login' }, // Fallback route


];

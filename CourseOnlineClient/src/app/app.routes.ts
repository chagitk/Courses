import { Routes } from '@angular/router';
import { AuthModule } from './auth/auth.module'; // ייבוא AuthModule

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'courses',
        loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule)
      },
      { path: '', redirectTo: '/auth', pathMatch: 'full' },
      { path: '**', redirectTo: '/auth' }
];

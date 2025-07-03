import { Routes } from '@angular/router';
import { CourseDetailsComponent } from '../components/course-details/course-details.component';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth.routes').then(m => m.AUTH_ROUTES)
      },
      {
        path: 'courses',
        loadChildren: () => import('./courses.routes').then(r => r.coursesRoutes)
      },
      { path: '', redirectTo: '/auth', pathMatch: 'full' },
      { path: '**', redirectTo: '/auth' }
      
      
];


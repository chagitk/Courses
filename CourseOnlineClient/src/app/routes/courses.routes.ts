import { Routes } from '@angular/router';
import { CourseListComponent } from '../components/course-list/course-list.component';
import { CourseDetailsComponent } from '../components/course-details/course-details.component';
import { TeacherCourseManagementComponent } from '../components/teacher-course-management/teacher-course-management.component';
import { TeacherGuard } from '../guards/teacher.guard';
import { authGuard } from '../guards/auth.guard';

export const coursesRoutes: Routes = [
  {
    path: '',
    component: CourseListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'details/:id',
    component: CourseDetailsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'teacher-management',
    component: TeacherCourseManagementComponent,
    canActivate: [TeacherGuard]
  }
];

// src/app/courses/courses-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseListComponent } from '../components/course-list/course-list.component';
import { CourseDetailsComponent } from '../components/course-details/course-details.component'; // ודא שהנתיב נכון
import { TeacherCourseManagementComponent } from '../components/teacher-course-management/teacher-course-management.component';
import { TeacherGuard } from '../guards/teacher.guard';
import { authGuard } from '../guards/auth.guard'; // Updated to functional guard

const routes: Routes = [
  {
    path: '',
    component: CourseListComponent,
    canActivate: [authGuard] // Updated to functional guard
  },
  {
    path: 'details/:id',
    component: CourseDetailsComponent,
    canActivate: [authGuard] // Updated to functional guard, הגן גם על נתיב הפרטים
  },
  {
    path: 'teacher-management',
    component: TeacherCourseManagementComponent,
    canActivate: [TeacherGuard]
  }
  // נתיבים נוספים
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
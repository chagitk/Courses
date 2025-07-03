import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // <-- ודא ששורה זו קיימת

import { CourseListComponent } from '../components/course-list/course-list.component';
import { CoursesRoutingModule } from './courses-routing.module';
import { CourseDetailsComponent } from '../components/course-details/course-details.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CourseListComponent, CourseDetailsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule, // <-- ודא ששורה זו קיימת במערך ה-imports
    RouterModule,
    CoursesRoutingModule
  ],
  exports: []
})
export class CoursesModule { }
// src/app/courses/components/course-details/course-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../courses.service';
//import { Course } from '../../course.model'; // ייבוא המודל
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Course } from '../../../course.model';
import { CommonModule } from '@angular/common';
import { Lesson } from '../../../lesson.model'; // ייבוא מודל שיעור

@Component({
  selector: 'app-course-details',
  standalone: false,
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit {
  course: Course | null = null;
  lessons: Lesson[] = []; // הוספת מערך שיעורים
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.coursesService.getCourseById(+id);
        } else {
          return of(null);
        }
      })
    ).subscribe(
      {
        next: (course) => {
          this.course = course;
        },
        // next: (data: { course: Course | null,}) => {
        // this.course = data.course;
        // this.lessons = data.lessons || []; // טעינת רשימת השיעורים
        // this.isLoading = false;
        // },
        error: (error) => {
          this.errorMessage = 'אירעה שגיאה בטעינת פרטי הקורס.';
          console.error(error);
          this.isLoading = false;
        }
      });

      this.route.paramMap.pipe(
        switchMap(params => {
          const id = params.get('id');
          if (id) {
            return this.coursesService.getLessosByCourseId(+id);
          } else {
            return of([]);
          }
        })
      ).subscribe(
        {
          next: (lessons) => {
            this.lessons = lessons;
          },
          // next: (data: { course: Course | null,}) => {
          // this.course = data.course;
          // this.lessons = data.lessons || []; // טעינת רשימת השיעורים
          // this.isLoading = false;
          // },
          error: (error) => {
            this.errorMessage = 'אירעה שגיאה בטעינת פרטי הקורס.';
            console.error(error);
            this.isLoading = false;
          }
        });
  }
}
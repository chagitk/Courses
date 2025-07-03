import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../courses.service';
import { Course } from '../../../course.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-course-list',
  standalone: false,
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private coursesService: CoursesService, 
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    const userId = this.authService.getUserId();

    const allCourses$ = this.coursesService.getCourses();
    const studentCourses$ = this.coursesService.getStudentCourses(userId);

    forkJoin([allCourses$, studentCourses$]).pipe(
      map(([allCourses, studentCourses]) => {
        const studentCourseIds = new Set(studentCourses.map(sc => sc.id));
        return allCourses.map(course => ({
          ...course,
          isEnrolled: studentCourseIds.has(course.id)
        }));
      })
    ).subscribe({
        next: (coursesWithEnrollmentStatus) => {
          this.courses = coursesWithEnrollmentStatus;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'אירעה שגיאה בעת טעינת הקורסים.';
          console.error(error);
          this.isLoading = false;
        }
      });
  }

  joinCourse(courseId: number): void {
    this.coursesService.joinCourse(courseId).subscribe({
      next: (response) => {
        // עדכן את רשימת הקורסים או את מצב ההרשמה של הקורס הספציפי
        this.loadCourses(); // טעינה מחדש של רשימת הקורסים
        console.log('הצטרף לקורס:', response);
      },
      error: (error) => {
        this.errorMessage = 'אירעה שגיאה בהצטרפות לקורס.';
        console.error(error);
      }
    });
  }

  leaveCourse(courseId: number): void {
    this.coursesService.leaveCourse(courseId).subscribe({
      next: (response) => {
        // עדכן את רשימת הקורסים או את מצב ההרשמה של הקורס הספציפי
        this.loadCourses(); // טעינה מחדש של רשימת הקורסים
        console.log('עזב את הקורס:', response);
      },
      error: (error) => {
        this.errorMessage = 'אירעה שגיאה בעזיבת הקורס.';
        console.error(error);
      }
    });
  }
}
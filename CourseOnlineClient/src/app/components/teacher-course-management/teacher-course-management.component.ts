import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Added MatDialog and MatDialogModule
import { ReactiveFormsModule } from '@angular/forms'; // Added ReactiveFormsModule

import { CoursesService } from '../../services/courses.service';
import { Course } from '../../models/course.model';
import { Lesson } from '../../models/lesson.model';
import { LessonFormDialogComponent } from '../lesson-form-dialog/lesson-form-dialog.component'; // Added LessonFormDialogComponent

@Component({
  selector: 'app-teacher-course-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    HttpClientModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatListModule,
    MatProgressBarModule,
    MatDialogModule, // Added MatDialogModule
    ReactiveFormsModule // Added ReactiveFormsModule
  ],
  templateUrl: './teacher-course-management.component.html',
  styleUrls: ['./teacher-course-management.component.css']
})
export class TeacherCourseManagementComponent implements OnInit {
  courses: Course[] = [];
  selectedCourseId: number | undefined = undefined;
  isLoading: boolean = true;
  lessonsByCourse = new Map<number, Lesson[]>();
  expandedCourseId: number | null = null;

  constructor(
    private authService: AuthService,
    private coursesService: CoursesService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog // Added MatDialog
  ) {}

  ngOnInit(): void {
    if (this.authService.getRole() !== 'teacher') {
      this.snackBar.open('Access denied. Only teachers can manage courses.', 'Close', { duration: 3000 });
      return;
    }
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.coursesService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        if (data.length === 0) {
          this.snackBar.open('No courses found.', 'Close', { duration: 3000 });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.snackBar.open('Failed to load courses. Please try again.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  addCourse(): void {
    const title = prompt('Enter course title:');
    if (!title) return;

    const description = prompt('Enter course description:');
    if (!description) return;

    this.coursesService.addCourse({ title, description }).subscribe({
      next: (response) => {
        this.snackBar.open('Course added successfully!', 'Close', { duration: 3000 });
        this.loadCourses();
      },
      error: (err) => {
        console.error('Error adding course:', err);
        this.snackBar.open(`Failed to add course: ${err.error?.message || 'Server error'}`, 'Close', { duration: 5000 });
      }
    });
  }

  deleteCourse(courseId: number): void {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    this.coursesService.deleteCourse(courseId).subscribe({
      next: () => {
        this.snackBar.open('Course deleted successfully!', 'Close', { duration: 3000 });
        this.loadCourses();
      },
      error: (err) => {
        console.error('Error deleting course:', err);
        this.snackBar.open(`Failed to delete course: ${err.error?.message || 'Server error'}`, 'Close', { duration: 5000 });
      }
    });
  }

  updateCourse(courseId: number): void {
    const course = this.courses.find(c => c.id === courseId);

    if (!course) {
      this.snackBar.open('Course not found.', 'Close', { duration: 3000 });
      return;
    }

    // Prompt for new title
    const newTitle = prompt('Enter new course title:', course.title);
    if (newTitle === null) return; // User cancelled or entered nothing

    // Prompt for new description
    const newDescription = prompt('Enter new course description:', course.description);
    if (newDescription === null) return; // User cancelled or entered nothing

    const updates: { title?: string, description?: string } = {}; // Initialize updates object

    // Check if title has changed
    if (newTitle !== course.title) {
      updates.title = newTitle;
    }

    // Check if description has changed
    if (newDescription !== course.description) {
      updates.description = newDescription;
    }

    // If nothing changed, no need to call API
    if (Object.keys(updates).length === 0) {
      this.snackBar.open('No changes detected.', 'Close', { duration: 3000 });
      return;
    }

    // Add teacherId to the updates payload, as the service expects it
    // and the server-side model's update function requires it.
    const payloadWithTeacherId = {
      ...updates,
      teacherId: course.teacherId // Now 'course' is in scope
    };

    this.coursesService.updateCourse(courseId, payloadWithTeacherId).subscribe({
      next: () => {
        this.snackBar.open('Course updated successfully!', 'Close', { duration: 3000 });
        this.loadCourses();
      },
      error: (err) => {
        console.error('Error updating course:', err);
        this.snackBar.open(`Failed to update course: ${err.error?.message || 'Server error'}`, 'Close', { duration: 5000 });
      }
    });
  }

  addLesson(courseId: number): void {
    this.selectedCourseId = courseId;
    const dialogRef = this.dialog.open(LessonFormDialogComponent, {
      width: '400px',
      data: { courseId: courseId, isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const lessonData: { title: string, content?: string } = result;
        this.coursesService.addLessonToCourse(courseId, lessonData).subscribe({
          next: (response) => {
            this.snackBar.open('Lesson added successfully!', 'Close', { duration: 3000 });
            if (this.expandedCourseId === courseId) {
              this.loadLessonsForCourse(courseId);
            }
          },
          error: (err) => {
            console.error('Error adding lesson:', err);
            this.snackBar.open(`Failed to add lesson: ${err.error?.message || 'Server error'}`, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  deleteLesson(courseId: number, lessonId: number): void {
    if (!confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      return;
    }

    this.coursesService.deleteLesson(courseId, lessonId).subscribe({
      next: () => {
        this.snackBar.open('Lesson deleted successfully!', 'Close', { duration: 3000 });
        // Refresh lessons for the current course if they are displayed
        if (this.expandedCourseId === courseId) {
          this.loadLessonsForCourse(courseId);
        }
      },
      error: (err) => {
        console.error('Error deleting lesson:', err);
        this.snackBar.open(`Failed to delete lesson: ${err.error?.message || 'Server error'}`, 'Close', { duration: 5000 });
      }
    });
  }

  openEditLessonDialog(courseId: number, lesson: Lesson): void {
    const dialogRef = this.dialog.open(LessonFormDialogComponent, {
      width: '400px',
      data: { lesson: { ...lesson }, courseId: courseId, isEditMode: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedLessonData: { title?: string, content?: string } = result;
        this.coursesService.updateLesson(courseId, lesson.id, updatedLessonData).subscribe({
          next: () => {
            this.snackBar.open('Lesson updated successfully!', 'Close', { duration: 3000 });
            if (this.expandedCourseId === courseId) {
              this.loadLessonsForCourse(courseId);
            }
          },
          error: (err) => {
            console.error('Error updating lesson:', err);
            this.snackBar.open(`Failed to update lesson: ${err.error?.message || 'Server error'}`, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  manageLessons(courseId: number): void {
    if (this.expandedCourseId === courseId) {
      this.expandedCourseId = null; // Collapse if already expanded
      this.lessonsByCourse.delete(courseId); // Optional: clear lessons when collapsing
    } else {
      this.loadLessonsForCourse(courseId);
    }
  }

  loadLessonsForCourse(courseId: number): void {
    this.isLoading = true; // Can use a more specific loading indicator for lessons
    this.coursesService.getLessonsForCourse(courseId).subscribe({
      next: (lessons) => {
        this.lessonsByCourse.set(courseId, lessons);
        this.expandedCourseId = courseId;
        this.isLoading = false;
        if (lessons.length === 0) {
          this.snackBar.open('No lessons found for this course.', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error(`Error loading lessons for course ${courseId}:`, err);
        this.snackBar.open('Failed to load lessons.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}

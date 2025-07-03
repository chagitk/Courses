import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Course } from '../../course.model'; // שימוש בנתיב שמצאנו כ- src/app/courses/models/course.model

@Component({
  selector: 'app-course-form-dialog',
  templateUrl: './course-form-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class CourseFormDialogComponent implements OnInit {
  courseForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CourseFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course?: Course } // נתונים שיועברו לדיאלוג
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data?.course;
    this.courseForm = this.fb.group({
      title: [this.data?.course?.title || '', Validators.required],
      description: [this.data?.course?.description || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      this.dialogRef.close(this.courseForm.value); // החזר את ערכי הטופס
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // סגור ללא החזרת נתונים
  }

  get f() { return this.courseForm.controls; }
}

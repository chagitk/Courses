import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TextFieldModule } from '@angular/cdk/text-field'; // Added TextFieldModule
import { Lesson } from '../../models/lesson.model';

@Component({
  selector: 'app-lesson-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TextFieldModule // Added TextFieldModule
  ],
  templateUrl: './lesson-form-dialog.component.html',
  // styleUrls: ['./lesson-form-dialog.component.css'] 
})
export class LessonFormDialogComponent implements OnInit {
  lessonForm: FormGroup;
  isEditMode: boolean;
  dialogTitle: string;

  constructor(
    public dialogRef: MatDialogRef<LessonFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { lesson?: Lesson, courseId: number, isEditMode: boolean },
    private fb: FormBuilder
  ) {
    this.isEditMode = data.isEditMode;
    this.dialogTitle = this.isEditMode ? 'Edit Lesson' : 'Add New Lesson';
    this.lessonForm = this.fb.group({
      title: [data.lesson?.title || '', Validators.required],
      content: [data.lesson?.content || '']
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.lessonForm.valid) {
      this.dialogRef.close(this.lessonForm.value);
    }
  }
}

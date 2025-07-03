import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = ''; // להצגת הודעות שגיאה
  successMessage: string = ''; // להצגת הודעות הצלחה

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['student', Validators.required] // ברירת מחדל: סטודנט
    });
  }

  ngOnInit(): void {
    // אם המשתמש כבר מחובר, ננתב אותו ישירות למסך הקורסים
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/courses']);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.errorMessage = ''; // איפוס הודעת השגיאה
      this.successMessage = ''; // איפוס הודעת ההצלחה
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('הרשמה הצליחה', response);
          this.successMessage = 'ההרשמה בוצעה בהצלחה! תוכל להתחבר כעת.';
          // לאחר מספר שניות, ננתב את המשתמש למסך ההתחברות
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000); // 3 שניות
        },
        error: (error) => {
          console.error('שגיאה בהרשמה', error);
          this.errorMessage = 'אירעה שגיאה בעת ההרשמה. נסה שוב.';
          // כאן אתה יכול לנתח את האובייקט error כדי להציג הודעות שגיאה ספציפיות מהשרת
          // לדוגמה, אם השרת מחזיר הודעה על אימייל קיים:
          // if (error?.error?.message === 'Email already exists') {
          //   this.errorMessage = 'כתובת הדוא"ל כבר רשומה במערכת.';
          // }
        }
      });
    } else {
      this.errorMessage = 'נא למלא את כל השדות כנדרש.';
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = ''; // להצגת הודעות שגיאה

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authService.isBrowser) {
      // אם המשתמש כבר מחובר, ננתב אותו ישירות למסך הקורסים (רק בצד הלקוח)
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/courses']);
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMessage = ''; // איפוס הודעת השגיאה
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('התחברות הצליחה', response);
          if (response.token) {
            this.router.navigate(['/courses']);
          } else {
            this.errorMessage = 'תגובת שרת לא תקינה';
            console.error('תגובת שרת לא תקינה', response);
          }
        },
        error: (error) => {
          console.error('שגיאה בהתחברות', error);
          this.errorMessage = 'שם המשתמש או הסיסמה שגויים.'; // הודעת שגיאה ידידותית יותר
          // כאן אתה יכול לנתח את האובייקט error כדי להציג הודעות שגיאה ספציפיות מהשרת
        }
      });
    } else {
      this.errorMessage = 'נא למלא את כל השדות.';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  // imports: [],
  standalone: false,
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

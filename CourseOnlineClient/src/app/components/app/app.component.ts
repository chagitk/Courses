import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; // ייבא גם RouterLink ו-RouterLinkActive אם אתה משתמש בהם ב-HTML
//import { AuthModule } from './auth/auth.module';
// import { LoginComponent } from './auth/components/login/login.component';
//import { CoursesModule } from './courses/courses.module';
import { HttpClientModule } from '@angular/common/http'; // ייבוא HttpClientModule
import { CourseListComponent } from '../course-list/course-list.component';
import { MatToolbarModule } from '@angular/material/toolbar'; // <-- ייבא את MatToolbarModule
import { MatButtonModule } from '@angular/material/button'; // <-- אם אתה משתמש ב-mat-button
import { MatIconModule } from '@angular/material/icon'; // <-- אם אתה משתמש ב-mat-icon
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // corrected styleUrl to styleUrls
})
export class AppComponent {
  title = 'CourseOnlineClient';
  constructor(private authService: AuthService) {}
getRole(): string {
  return this.authService.getRole() || '';
}
}
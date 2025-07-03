// src/app/courses.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';
import { AuthService } from './auth.service';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private apiUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient,  private authService: AuthService) { }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  joinCourse(courseId: number): Observable<any> {
    // return this.http.post(`${this.apiUrl}/${courseId}/join`, {}); // גוף בקשה ריק או פרטי משתמש
    return this.http.post(`${this.apiUrl}/${courseId}/enroll`,{userId : this.authService.getUserId()}, { headers: this.getAuthHeaders() }); // גוף בקשה ריק או פרטי משתמש

  }

  leaveCourse(courseId: number): Observable<any> {
    const userId = this.authService.getUserId();
    const options = {
      headers: this.getAuthHeaders(),
      body: { userId: userId }
    };
    return this.http.delete(`${this.apiUrl}/${courseId}/unenroll`, options);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  // courses.service.ts
// ...

getCourseByIdWithLessons(id: number): Observable<{ course: Course | null, lessons: Lesson[] }> {
  return this.http.get<{ course: Course | null, lessons: Lesson[] }>(`${this.apiUrl}/${id}/with-lessons`);
}

getLessosByCourseId(courseId: number): Observable<Lesson[]>{
  return this.http.get<Lesson[]>(`${this.apiUrl}/${courseId}/lessons`, { headers: this.getAuthHeaders() });
}

getStudentCourses(studentId: string | null): Observable<Course[]> {
  if (!studentId) {
    return new Observable<Course[]>(observer => {
      observer.next([]);
      observer.complete();
    });
  }
  return this.http.get<Course[]>(`${this.apiUrl}/student/${studentId}`, { headers: this.getAuthHeaders() });
}

  // מתודות לניהול קורסים (למורים)
  addCourse(courseData: { title: string, description: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, courseData, { headers: this.getAuthHeaders() });
  }

  updateCourse(courseId: number, updates: { title?: string, description?: string, teacherId?: number }): Observable<any> {
    // השרת מצפה לקבל teacherId בגוף הבקשה, גם אם הוא לא משתנה.
    // הנחת העבודה היא שהקומפוננטה שקוראת לפונקציה הזו תספק את ה-teacherId.
    // אם updates.teacherId לא מגיע מהקומפוננטה, יש לשקול דרך אחרת להשיגו.
    return this.http.put<any>(`${this.apiUrl}/${courseId}`, updates, { headers: this.getAuthHeaders() });
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${courseId}`, { headers: this.getAuthHeaders() });
  }

  //פונקציה שמצריכה לקבל את השיעורים לפי ה ID של הקורס

  // מתודות נוספות עבור ניהול קורסים (למורים) יגיעו בהמשך

  // מתודות לניהול שיעורים
  addLessonToCourse(courseId: number, lessonData: { title: string, content?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/lessons`, lessonData, { headers: this.getAuthHeaders() });
  }

  deleteLesson(courseId: number, lessonId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${courseId}/lessons/${lessonId}`, { headers: this.getAuthHeaders() });
  }

  updateLesson(courseId: number, lessonId: number, lessonData: { title?: string, content?: string }): Observable<any> {
    // השרת מצפה לקבל courseId בגוף הבקשה, גם אם הוא לא משתנה.
    const payload = {
      ...lessonData,
      courseId: courseId // הוספת courseId לגוף הבקשה
    };
    return this.http.put(`${this.apiUrl}/${courseId}/lessons/${lessonId}`, payload, { headers: this.getAuthHeaders() });
  }

  getLessonsForCourse(courseId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiUrl}/${courseId}/lessons`, { headers: this.getAuthHeaders() });
  }
}

  // מתודות נוספות לשירות (הוספה, עריכה, מחיקה וכו') יגיעו כאן

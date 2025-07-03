export interface Course {
    id: number;
    title: string;
    description: string;
    teacherId:number;
    isEnrolled?: boolean;
   // instructor: string; // הוסף את השורה הזו
    // שדות נוספים...
  }
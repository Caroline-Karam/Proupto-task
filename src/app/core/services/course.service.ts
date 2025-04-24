import { Injectable } from '@angular/core';
import { Course, Subcourse } from '../models/courses.models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private coursesData: Course[] = [];
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$ = this.coursesSubject.asObservable();

  constructor() {
    this.coursesData = []; 
    this.coursesSubject.next(this.coursesData);
  }

  getCourses() {
    return this.courses$;
  }

  addCourse(course: Course) {
    this.coursesData.push(course);
    this.coursesSubject.next(this.coursesData);
  }

  updateCourse(updated: Course) {
    const index = this.coursesData.findIndex(c => c.id === updated.id);
    if (index > -1) {
      this.coursesData[index] = updated;
      this.coursesSubject.next(this.coursesData);
    }
  }

  addSubcourse(courseId: number, subcourse: Subcourse) {
    const course = this.coursesData.find(c => c.id === courseId);
    if (course) {
      course.subcourses.push(subcourse);
      this.coursesSubject.next(this.coursesData);
    }
  }

  updateSubcourse(courseId: number, updated: Subcourse) {
    const course = this.coursesData.find(c => c.id === courseId);
    if (course) {
      const index = course.subcourses.findIndex(s => s.id === updated.id);
      if (index > -1) {
        course.subcourses[index] = updated;
        this.coursesSubject.next(this.coursesData);
      }
    }
  }
}

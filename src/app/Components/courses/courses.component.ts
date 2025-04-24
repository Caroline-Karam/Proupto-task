import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Course, Subcourse } from '../../core/models/courses.models';
import { Data_COURSES } from '../../core/data/courses.data';
import { CourseService } from '../../core/services/course.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CalendarModule,
    DialogModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  // Course and subcourse data
  courses: Course[] = Data_COURSES;
  selectedCourse: Course | null = null;

  // Track editing IDs
  editingCourseId: number | null = null;
  editingSubcourseId: number | null = null;

  // Dialog visibility
  courseDialogVisible: boolean = false;

  // Forms
  courseForm: FormGroup;
  subcourseForm: FormGroup;

  // Expanded row
  expandedRowKeys: { [key: number]: boolean } = {};

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.courseForm = this.fb.group(
      {
        name: ['', Validators.required],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
      },
      {
        validators: [this.dateRangeValidator],
      }
    );

    this.subcourseForm = this.fb.group(
      {
        name: ['', Validators.required],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
      },
      {
        validators: [this.subcourseDateValidator()],
      }
    );
  }

  // Validation: Course endDate must be after startDate
  dateRangeValidator(group: FormGroup): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    return start && end && end < start ? { dateInvalid: true } : null;
  }

  // Validation: Subcourse date logic
  subcourseDateValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get('startDate')?.value;
      const end = group.get('endDate')?.value;
      const parent = this.selectedCourse;
      const editingId = this.editingSubcourseId;

      if (!start || !end || !parent) return null;

      if (end <= start) {
        return { subDateInvalid: 'End date must be after start date.' };
      }

      if (start < parent.startDate || end > parent.endDate) {
        return { outOfCourseRange: 'Subcourse must be within course dates.' };
      }

      const overlap = parent.subcourses.some(
        (sub) =>
          sub.id !== editingId &&
          ((start >= sub.startDate && start < sub.endDate) ||
            (end > sub.startDate && end <= sub.endDate) ||
            (start <= sub.startDate && end >= sub.endDate))
      );

      return overlap
        ? { overlap: 'Subcourse dates overlap with another.' }
        : null;
    };
  }

  // Show dialog for new course
  onAddCourse(): void {
    this.courseForm.reset();
    this.selectedCourse = null;
    this.editingCourseId = null;
    this.courseDialogVisible = true;
  }

  // Show dialog to edit a course
  onEditCourse(course: Course): void {
    this.editingCourseId = course.id;
    this.selectedCourse = course;
    this.courseForm.patchValue({
      name: course.name,
      startDate: new Date(course.startDate),
      endDate: new Date(course.endDate),
    });
    this.courseDialogVisible = true;
  }

  // Save course (new or updated)
  saveCourse(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    const courseData = this.courseForm.value;

    if (this.editingCourseId !== null) {
      // Update existing course
      const updated: Course = {
        ...courseData,
        id: this.editingCourseId,
        subcourses: this.selectedCourse?.subcourses ?? [],
      };

      this.courses = this.courses.map((course) =>
        course.id === this.editingCourseId ? updated : course
      );

      this.messageService.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Course updated successfully',
      });
    } else {
      // Add new course
      const newCourse: Course = {
        id: Date.now(),
        ...courseData,
        subcourses: [],
      };

      this.courses = [...this.courses, newCourse]; // trigger change detection

      this.messageService.add({
        severity: 'success',
        summary: 'Added',
        detail: 'Course added successfully',
      });
    }

    this.resetForm();
  }

  // Reset form and close dialog
  resetForm(): void {
    this.courseForm.reset();
    this.selectedCourse = null;
    this.editingCourseId = null;
    this.courseDialogVisible = false;
  }

  // Toggle row expansion
  onRowExpand(event: any): void {
    const course: Course = event.data;
    this.expandedRowKeys[course.id] = true;
  }

  onRowCollapse(event: any): void {
    const course: Course = event.data;
    delete this.expandedRowKeys[course.id];
  }

  toggleRow(course: Course): void {
    this.expandedRowKeys[course.id]
      ? delete this.expandedRowKeys[course.id]
      : (this.expandedRowKeys[course.id] = true);
  }

  // Delete confirmation
  confirmDelete(event: Event, course: Course): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to delete the course "${course.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      accept: () => this.deleteCourse(course.id),
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Deletion cancelled',
        });
      },
    });
  }

  // Remove course
  deleteCourse(id: number): void {
    this.courses = this.courses.filter((c) => c.id !== id);
    this.messageService.add({
      severity: 'success',
      summary: 'Deleted',
      detail: 'Course deleted successfully',
    });
  }
}

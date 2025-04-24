import { Routes } from '@angular/router';
import { CoursesComponent } from './Components/courses/courses.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'courses', component: CoursesComponent,   },


];

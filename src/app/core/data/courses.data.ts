import { Course } from '../models/courses.models';

export const Data_COURSES: Course[] = [
  {
    id: 1,
    name: 'Frontend Development',
    startDate: new Date('2025-05-01'),
    endDate: new Date('2025-07-01'),
    subcourses: [
      {
        id: 101,
        name: 'HTML & CSS',
        startDate: new Date('2025-05-02'),
        endDate: new Date('2025-05-15'),
        courseId: 1,
      },
      {
        id: 102,
        name: 'JavaScript Basics',
        startDate: new Date('2025-05-16'),
        endDate: new Date('2025-06-01'),
        courseId: 2,
      },
    ],
  },

  {
    id: 2,
    name: 'Backend Development',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-08-01'),
    subcourses: [
      {
        id: 101,
        name: 'Sql & No Sql',
        startDate: new Date('2025-06-02'),
        endDate: new Date('2025-08-15'),
        courseId: 3,
      },
      {
        id: 102,
        name: 'Mongoose Basics',
        startDate: new Date('2025-05-16'),
        endDate: new Date('2025-06-01'),
        courseId: 4,
      },
    ],
  }
];
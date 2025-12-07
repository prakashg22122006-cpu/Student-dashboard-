
export enum View {
  DASHBOARD = 'DASHBOARD',
  // Academic
  COURSES = 'COURSES',
  ASSIGNMENTS = 'ASSIGNMENTS',
  EXAMS = 'EXAMS',
  GRADES = 'GRADES',
  // Productivity
  FOCUS = 'FOCUS',
  TASKS = 'TASKS',
  HABITS = 'HABITS',
  MATRIX = 'MATRIX',
  // Resources
  FILES = 'FILES',
  NOTES = 'NOTES',
  CODE = 'CODE',
  // Projects
  PROJECTS = 'PROJECTS',
  // Planning
  CALENDAR = 'CALENDAR',
  GOALS = 'GOALS',
  // Other
  ANALYTICS = 'ANALYTICS',
  SETTINGS = 'SETTINGS',
  HELP = 'HELP'
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  username: string;
}

export interface CourseResource {
  id: string;
  title: string; // e.g., "Syllabus", "Lab Manual"
  type: 'pdf' | 'link' | 'doc';
  url: string;
}

// Academic Schema
export interface Course {
  id: string;
  code: string;
  name: string;
  semester: string;
  credits: number;
  color?: string;
  progress?: number;
  grade?: string; // e.g., 'O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'
  attendance: {
    attended: number;
    total: number;
  };
  resources: CourseResource[];
}

export interface Exam {
  id: string;
  name: string; 
  courseName: string; 
  date: string; 
  syllabus: string;
  completed: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string; // Links to Course.id
  dueDate: string;
  status: 'Pending' | 'submitted' | 'graded';
  description?: string;
}

// Productivity Schema
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 1 | 2 | 3 | 4 | 5; 
  quadrant: 1 | 2 | 3 | 4; 
  dueDate?: string;
  tags?: string[];
  recurrence?: string;
  subtasks?: Subtask[];
  timeEstimate?: number;
  attachments?: string[];
  createdAt: string; // Added for Matrix Review
}

export interface Habit {
  id: string;
  name: string;
  category: 'Academic' | 'Health' | 'Productivity';
  streak: number;
  completedDates: string[]; 
  frequency: 'daily' | 'weekly';
  reminderTime?: string; // HH:mm
  chainAfter?: string; // "After [Habit Name]"
}

export interface FocusSession {
  id: string;
  startTime: number;
  duration: number; 
  goal: string;
  completed: boolean;
}

export type SoundType = 'none' | 'white-noise' | 'brown-noise' | 'pink-noise';

// File System Schema
export interface Folder {
  id: string;
  name: string;
  parentId: string | null; 
  createdAt: string;
}

export interface FileResource {
  id: string;
  name: string;
  type: 'link' | 'snippet'; 
  content: string; 
  folderId: string | null;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  color: string; // bg color class
}

// Project Manager Schema
export interface Project {
  id: string;
  name: string;
  status: 'Idea' | 'Planning' | 'Development' | 'Testing' | 'Done';
  techStack: string[];
  deadline?: string;
  description: string;
}

// Goal Tracker Schema
export interface Goal {
  id: string;
  title: string;
  target: number; 
  current: number;
  unit: string; 
  deadline: string;
  category: 'Academic' | 'Skill' | 'Project' | 'Personal';
}

// Code Repo Schema
export interface CodeSnippet {
  id: string;
  title: string;
  language: string; 
  code: string;
  tags: string[];
}

// Navigation Helper
export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  id: View;
  label: string;
  icon: string; 
}

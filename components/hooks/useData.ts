
import { useState, useEffect } from 'react';
import { Task, Habit, Folder, FileResource, Project, Goal, Exam, CodeSnippet, Course, Note, Assignment, CourseResource, FocusSession } from '../../types';

// Helper to get today's date string YYYY-MM-DD
export const getTodayString = () => new Date().toISOString().split('T')[0];

// Robust ID Generator (Safe for non-secure contexts)
const generateID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // Fallback if secure context check fails
    }
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const useData = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<FileResource[]>([]);
  
  // Phase 3 Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
  
  // Phase 3.5 Data States
  const [notes, setNotes] = useState<Note[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Focus History
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);

  // Load Initial Data
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('cs-organizer-tasks');
      const savedHabits = localStorage.getItem('cs-organizer-habits');
      const savedCourses = localStorage.getItem('cs-organizer-courses');
      const savedFolders = localStorage.getItem('cs-organizer-folders');
      const savedFiles = localStorage.getItem('cs-organizer-files');
      
      const savedProjects = localStorage.getItem('cs-organizer-projects');
      const savedGoals = localStorage.getItem('cs-organizer-goals');
      const savedExams = localStorage.getItem('cs-organizer-exams');
      const savedCode = localStorage.getItem('cs-organizer-code');
      
      const savedNotes = localStorage.getItem('cs-organizer-notes');
      const savedAssignments = localStorage.getItem('cs-organizer-assignments');
      const savedSessions = localStorage.getItem('cs-organizer-sessions');
      
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedHabits) setHabits(JSON.parse(savedHabits));
      if (savedCourses) setCourses(JSON.parse(savedCourses));
      if (savedFolders) setFolders(JSON.parse(savedFolders));
      if (savedFiles) setFiles(JSON.parse(savedFiles));

      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedExams) setExams(JSON.parse(savedExams));
      if (savedCode) setCodeSnippets(JSON.parse(savedCode));
      
      if (savedNotes) setNotes(JSON.parse(savedNotes));
      if (savedAssignments) setAssignments(JSON.parse(savedAssignments));
      if (savedSessions) setFocusSessions(JSON.parse(savedSessions));
      
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load data", error);
    }
  }, []);

  // Persist Data Handlers
  useEffect(() => { if (isLoaded) localStorage.setItem('cs-organizer-tasks', JSON.stringify(tasks)); }, [tasks, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('cs-organizer-habits', JSON.stringify(habits)); }, [habits, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('cs-organizer-courses', JSON.stringify(courses)); }, [courses, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('cs-organizer-folders', JSON.stringify(folders)); }, [folders, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('cs-organizer-files', JSON.stringify(files)); }, [files, isLoaded]);

  useEffect(() => { if (isLoaded) localStorage.setItem('cs-organizer-projects', JSON.stringify(projects)); }, [projects, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('cs-organizer-goals', JSON.stringify(goals)); }, [goals, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('cs-organizer-exams', JSON.stringify(exams)); }, [exams, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('cs-organizer-code', JSON.stringify(codeSnippets)); }, [codeSnippets, isLoaded]);
  
  useEffect(() => { if (isLoaded) localStorage.setItem('cs-organizer-notes', JSON.stringify(notes)); }, [notes, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('cs-organizer-assignments', JSON.stringify(assignments)); }, [assignments, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem('cs-organizer-sessions', JSON.stringify(focusSessions)); }, [focusSessions, isLoaded]);

  // Task Actions
  const addTask = (title: string, quadrant: 1 | 2 | 3 | 4, priority: 1 | 2 | 3 | 4 | 5 = 3, dueDate?: string) => {
    const newTask: Task = {
      id: generateID(),
      title,
      completed: false,
      priority,
      quadrant,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Smart Logic: If recurring task is completed, create next instance
    if (!task.completed && task.recurrence) {
       const nextTask = { 
         ...task, 
         id: generateID(), 
         completed: false,
         createdAt: new Date().toISOString()
       };
       // In a real app, calculate next date based on recurrence string. 
       setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t).concat(nextTask));
    } else {
       setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateTaskQuadrant = (id: string, quadrant: 1 | 2 | 3 | 4) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, quadrant } : t));
  };

  const addSubtask = (taskId: string, title: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const sub = { id: generateID(), title, completed: false };
      return { ...t, subtasks: [...(t.subtasks || []), sub] };
    }));
  };

  const toggleSubtask = (taskId: string, subId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: t.subtasks?.map(s => s.id === subId ? { ...s, completed: !s.completed } : s)
      };
    }));
  };

  const deleteSubtask = (taskId: string, subId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, subtasks: t.subtasks?.filter(s => s.id !== subId) };
    }));
  };

  // Habit Actions
  const addHabit = (name: string, category: Habit['category'], frequency: 'daily' | 'weekly' = 'daily', reminderTime?: string, chainAfter?: string) => {
    const newHabit: Habit = {
      id: generateID(),
      name,
      category,
      streak: 0,
      completedDates: [],
      frequency,
      reminderTime,
      chainAfter
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const toggleHabitForToday = (id: string) => {
    const today = getTodayString();
    setHabits(prev => prev.map(habit => {
      if (habit.id !== id) return habit;

      const hasCompletedToday = habit.completedDates.includes(today);
      let newDates = hasCompletedToday
        ? habit.completedDates.filter(d => d !== today)
        : [...habit.completedDates, today];
      
      // Simple streak calc
      let currentStreak = 0;
      if (newDates.includes(today)) {
        currentStreak = newDates.length; // Simplified for Phase 2
      }

      return {
        ...habit,
        completedDates: newDates,
        streak: currentStreak
      };
    }));
  };
  
  // Course Actions
  const addCourse = (c: Omit<Course, 'id' | 'attendance' | 'resources'>) => {
    const newCourse: Course = {
      id: generateID(),
      attendance: { attended: 0, total: 0 },
      resources: [],
      ...c
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const updateCourseGrade = (id: string, grade: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, grade } : c));
  };

  const updateCourseAttendance = (id: string, attended: number, total: number) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, attendance: { attended, total } } : c));
  };

  const addCourseResource = (courseId: string, title: string, url: string, type: 'pdf' | 'link' | 'doc') => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      const newResource: CourseResource = { id: generateID(), title, url, type };
      return { ...c, resources: [...c.resources, newResource] };
    }));
  };

  const deleteCourseResource = (courseId: string, resourceId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return { ...c, resources: c.resources.filter(r => r.id !== resourceId) };
    }));
  };

  // File Manager Actions
  const addFolder = (name: string, parentId: string | null) => {
    const newFolder: Folder = {
      id: generateID(),
      name,
      parentId,
      createdAt: new Date().toISOString()
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
    setFiles(prev => prev.filter(f => f.folderId !== id));
  };

  const addFile = (name: string, type: 'link' | 'snippet', content: string, folderId: string | null) => {
    const newFile: FileResource = {
      id: generateID(),
      name,
      type,
      content,
      folderId,
      createdAt: new Date().toISOString()
    };
    setFiles(prev => [...prev, newFile]);
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // --- Phase 3 Actions ---

  // Projects
  const addProject = (p: Omit<Project, 'id'>) => {
    setProjects(prev => [...prev, { id: generateID(), ...p }]);
  };
  const updateProjectStatus = (id: string, status: Project['status']) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };
  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Goals
  const addGoal = (g: Omit<Goal, 'id' | 'current'>) => {
    setGoals(prev => [...prev, { id: generateID(), current: 0, ...g }]);
  };
  const updateGoalProgress = (id: string, newCurrent: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, current: newCurrent } : g));
  };
  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Exams
  const addExam = (e: Omit<Exam, 'id' | 'completed'>) => {
    setExams(prev => [...prev, { id: generateID(), completed: false, ...e }]);
  };
  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  // Code Snippets
  const addCodeSnippet = (c: Omit<CodeSnippet, 'id'>) => {
    setCodeSnippets(prev => [...prev, { id: generateID(), ...c }]);
  };
  const deleteCodeSnippet = (id: string) => {
    setCodeSnippets(prev => prev.filter(c => c.id !== id));
  };
  
  // --- Phase 3.5 Actions ---
  
  // Notes
  const addNote = (n: Omit<Note, 'id' | 'createdAt'>) => {
    setNotes(prev => [...prev, { id: generateID(), createdAt: new Date().toISOString(), ...n }]);
  };
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };
  
  // Assignments
  const addAssignment = (a: Omit<Assignment, 'id' | 'status'>) => {
    setAssignments(prev => [...prev, { id: generateID(), status: 'Pending', ...a }]);
  };
  const updateAssignmentStatus = (id: string, status: Assignment['status']) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };
  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };
  
  // Focus Sessions
  const addFocusSession = (duration: number, goal: string) => {
    const session: FocusSession = {
      id: generateID(),
      startTime: Date.now(),
      duration,
      goal,
      completed: true
    };
    setFocusSessions(prev => [session, ...prev]);
  };

  return {
    isLoaded,
    tasks, addTask, toggleTask, deleteTask, updateTaskQuadrant, addSubtask, toggleSubtask, deleteSubtask,
    habits, addHabit, deleteHabit, toggleHabitForToday,
    courses, addCourse, deleteCourse, updateCourseGrade, updateCourseAttendance, addCourseResource, deleteCourseResource,
    folders, files, addFolder, deleteFolder, addFile, deleteFile,
    projects, addProject, updateProjectStatus, deleteProject,
    goals, addGoal, updateGoalProgress, deleteGoal,
    exams, addExam, deleteExam,
    codeSnippets, addCodeSnippet, deleteCodeSnippet,
    notes, addNote, deleteNote,
    assignments, addAssignment, updateAssignmentStatus, deleteAssignment,
    focusSessions, addFocusSession
  };
};


import React, { useState, useEffect } from 'react';
import { View } from './types';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { CoursesView } from './components/views/CoursesView';
import { FocusView } from './components/views/FocusView';
import { SettingsView } from './components/views/SettingsView';
import { HabitsView } from './components/views/HabitsView';
import { MatrixView } from './components/views/MatrixView';
import { TasksView } from './components/views/TasksView';
import { FilesView } from './components/views/FilesView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ProjectsView } from './components/views/ProjectsView';
import { GoalsView } from './components/views/GoalsView';
import { ExamsView } from './components/views/ExamsView';
import { CodeView } from './components/views/CodeView';
import { NotesView } from './components/views/NotesView';
import { AssignmentsView } from './components/views/AssignmentsView';
import { GradesView } from './components/views/GradesView';
import { HelpView } from './components/views/HelpView';
import { CalendarView } from './components/views/CalendarView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(() => {
    const savedView = localStorage.getItem('cs-organizer-last-view');
    return (savedView as View) || View.DASHBOARD;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('cs-organizer-last-view', currentView);
  }, [currentView]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <DashboardView onNavigate={setCurrentView} />;
      case View.COURSES:
        return <CoursesView />;
      case View.FOCUS:
        return <FocusView />;
      case View.SETTINGS:
        return <SettingsView theme={theme} toggleTheme={toggleTheme} />;
      case View.TASKS:
        return <TasksView />;
      case View.HABITS:
        return <HabitsView />;
      case View.MATRIX:
        return <MatrixView />;
      case View.FILES:
        return <FilesView />;
      case View.ANALYTICS:
        return <AnalyticsView />;
      case View.PROJECTS:
        return <ProjectsView />;
      case View.GOALS:
        return <GoalsView />;
      case View.EXAMS:
        return <ExamsView />;
      case View.CODE:
        return <CodeView />;
      case View.NOTES:
        return <NotesView />;
      case View.ASSIGNMENTS:
        return <AssignmentsView />;
      case View.GRADES:
        return <GradesView />;
      case View.HELP:
        return <HelpView />;
      case View.CALENDAR:
        return <CalendarView />;
      default:
        return <DashboardView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <header className="lg:hidden h-16 flex items-center justify-between px-4 bg-white dark:bg-[#1e293b] border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <i className="ti ti-menu-2 text-xl"></i>
          </button>
          <span className="font-bold text-lg">CS-Pro</span>
          <div className="w-8"></div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;


import React from 'react';
import { View, NavSection } from '../types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_STRUCTURE: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { id: View.DASHBOARD, label: 'Dashboard', icon: 'ti-dashboard' },
      { id: View.ANALYTICS, label: 'Analytics', icon: 'ti-chart-bar' },
      { id: View.PROJECTS, label: 'Projects', icon: 'ti-rocket' },
    ]
  },
  {
    title: 'Academic',
    items: [
      { id: View.COURSES, label: 'Courses', icon: 'ti-book' },
      { id: View.ASSIGNMENTS, label: 'Assignments', icon: 'ti-clipboard-list' },
      { id: View.EXAMS, label: 'Exams', icon: 'ti-school' },
      { id: View.GRADES, label: 'Grades', icon: 'ti-calculator' },
    ]
  },
  {
    title: 'Planning',
    items: [
      { id: View.CALENDAR, label: 'Calendar', icon: 'ti-calendar' },
      { id: View.GOALS, label: 'Goals', icon: 'ti-target' },
    ]
  },
  {
    title: 'Productivity',
    items: [
      { id: View.FOCUS, label: 'Focus Mode', icon: 'ti-clock-play' },
      { id: View.TASKS, label: 'Tasks', icon: 'ti-checkbox' },
      { id: View.HABITS, label: 'Habits', icon: 'ti-repeat' },
      { id: View.MATRIX, label: 'Priority Matrix', icon: 'ti-layout-grid' },
    ]
  },
  {
    title: 'Resources',
    items: [
      { id: View.FILES, label: 'File Manager', icon: 'ti-folder' },
      { id: View.NOTES, label: 'Notes', icon: 'ti-note' },
      { id: View.CODE, label: 'Code Repo', icon: 'ti-code' },
    ]
  },
  {
    title: 'System',
    items: [
      { id: View.SETTINGS, label: 'Settings', icon: 'ti-settings' },
      { id: View.HELP, label: 'Help & Docs', icon: 'ti-help' },
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onCloseMobile }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-[#1e293b] border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
          <i className="ti ti-brand-react text-primary text-2xl mr-2"></i>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CS-Pro
          </span>
        </div>

        {/* Navigation Content */}
        <div className="overflow-y-auto h-[calc(100vh-64px)] py-4 px-3 space-y-6">
          {NAV_STRUCTURE.map((section, idx) => (
            <div key={idx}>
              <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary/10 text-primary dark:text-blue-400' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <i className={`ti ${item.icon} text-lg`}></i>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* Bottom Padding */}
          <div className="h-12"></div>
        </div>
      </aside>
    </>
  );
};

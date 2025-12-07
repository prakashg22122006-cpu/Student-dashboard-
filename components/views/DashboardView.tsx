
import React, { useEffect, useState } from 'react';
import { View } from '../../types';
import { useData } from '../hooks/useData';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const Widget: React.FC<{ 
  title: string; 
  icon: string; 
  color: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ title, icon, color, children, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
  >
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-${color.split('-')[1]}-500`}>
          <i className={`ti ${icon} text-xl ${color.replace('bg-', 'text-')}`}></i>
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      </div>
      <i className="ti ti-arrow-right text-slate-400 group-hover:text-primary transition-colors"></i>
    </div>
    {children}
  </div>
);

const GRADE_POINTS: {[key: string]: number} = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0
};

export const DashboardView: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { tasks, habits, courses, exams } = useData();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('cs-organizer-username');
    if (savedName) setUsername(savedName);
  }, []);

  // Tasks Logic
  const pendingTasks = tasks.filter(t => !t.completed);
  const topPriorityTasks = pendingTasks.filter(t => t.priority >= 4).slice(0, 2);
  const tasksDueSoon = pendingTasks.filter(t => t.quadrant === 1).length;

  // Habits Logic
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const topHabit = habits.find(h => h.streak === maxStreak);

  // Grades Logic
  let totalCredits = 0;
  let totalPoints = 0;
  courses.forEach(c => {
    if (c.grade && GRADE_POINTS[c.grade] !== undefined) {
      totalCredits += c.credits;
      totalPoints += GRADE_POINTS[c.grade] * c.credits;
    }
  });
  const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  // Exams Logic
  const upcomingExams = exams.filter(e => !e.completed && new Date(e.date) >= new Date()).length;

  return (
    <div className="p-6 animate-fade-in max-w-7xl mx-auto pb-28">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {username ? `Welcome back, ${username}` : 'Dashboard'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Let's make today productive.
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-slate-600 dark:text-slate-300">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Focus Timer Widget */}
        <Widget 
          title="Focus Mode" 
          icon="ti-clock-play" 
          color="bg-blue-500"
          onClick={() => onNavigate(View.FOCUS)}
        >
          <div className="text-center py-4">
            <div className="text-4xl font-mono font-bold text-slate-800 dark:text-white mb-2">25:00</div>
            <p className="text-sm text-slate-500">Ready to start session</p>
            <div className="mt-4 flex justify-center space-x-2">
              <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                Pomodoro
              </span>
            </div>
          </div>
        </Widget>

        {/* Habit Tracker Widget */}
        <Widget 
          title="Habit Streaks" 
          icon="ti-flame" 
          color="bg-orange-500"
          onClick={() => onNavigate(View.HABITS)}
        >
          <div className="space-y-3">
            {habits.length > 0 ? (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-300 truncate w-24">{topHabit?.name || 'Habits'}</span>
                  <span className="font-bold text-orange-500">🔥 {maxStreak} days</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min(100, maxStreak * 10)}%` }}></div>
                </div>
                <div className="text-xs text-slate-400 text-center pt-1">
                  {habits.length} habits active
                </div>
              </>
            ) : (
               <div className="text-center text-sm text-slate-400 py-4">No habits tracked yet.</div>
            )}
          </div>
        </Widget>

        {/* Tasks Overview */}
        <Widget 
          title="My Tasks" 
          icon="ti-checkbox" 
          color="bg-emerald-500"
          onClick={() => onNavigate(View.TASKS)}
        >
          <div className="space-y-2">
            {topPriorityTasks.length > 0 ? (
              topPriorityTasks.map(t => (
                <div key={t.id} className="flex items-start space-x-2 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className={`w-4 h-4 mt-1 rounded-full border-2 ${t.quadrant === 1 ? 'border-red-500' : 'border-emerald-500'}`}></div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{t.title}</p>
                    <span className="text-xs text-slate-500">Priority {t.priority}</span>
                  </div>
                </div>
              ))
            ) : (
               <div className="text-center text-sm text-slate-400 py-4">No urgent tasks.</div>
            )}
            
            <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700 mt-2">
              <span>{pendingTasks.length} Pending</span>
              <span className="text-red-500 font-medium">{tasksDueSoon} Due Soon</span>
            </div>
          </div>
        </Widget>

        {/* Academics Overview */}
        <Widget 
          title="Academics" 
          icon="ti-school" 
          color="bg-purple-500"
          onClick={() => onNavigate(View.GRADES)}
        >
          <div className="text-center py-2">
            <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{sgpa}</div>
            <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Current SGPA</div>
            
            <div className="mt-4 flex justify-between text-xs">
              <div className="bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded text-purple-600 dark:text-purple-300">
                {courses.length} Courses
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded text-red-600 dark:text-red-300">
                {upcomingExams} Exams
              </div>
            </div>
          </div>
        </Widget>
      </div>
    </div>
  );
};
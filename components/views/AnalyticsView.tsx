
import React from 'react';
import { useData } from '../hooks/useData';

export const AnalyticsView: React.FC = () => {
  const { tasks, habits, focusSessions } = useData();

  // Task Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Quadrant Stats
  const q1Count = tasks.filter(t => t.quadrant === 1).length;
  const q2Count = tasks.filter(t => t.quadrant === 2).length;
  const q3Count = tasks.filter(t => t.quadrant === 3).length;
  const q4Count = tasks.filter(t => t.quadrant === 4).length;
  const maxQ = Math.max(q1Count, q2Count, q3Count, q4Count, 1);

  // Habit Stats
  const totalStreaks = habits.reduce((acc, curr) => acc + curr.streak, 0);
  const avgStreak = habits.length > 0 ? Math.round(totalStreaks / habits.length) : 0;

  // Focus Stats (New)
  const totalFocusMinutes = focusSessions.reduce((acc, curr) => acc + curr.duration, 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);
  const totalSessions = focusSessions.length;
  const avgSessionLength = totalSessions > 0 ? Math.round(totalFocusMinutes / totalSessions) : 0;

  return (
    <div className="p-6 animate-fade-in pb-28">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Analytics</h1>
        <p className="text-slate-500 dark:text-gray-400">Insights into your productivity patterns.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Productivity Score Card */}
        <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Task Completion</h2>
          <div className="flex items-center justify-between">
            <div className="relative w-32 h-32">
               {/* Simple SVG Donut Chart */}
               <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                 <path
                   className="text-slate-100 dark:text-gray-700"
                   d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="3"
                 />
                 <path
                   className="text-primary transition-all duration-1000 ease-out"
                   strokeDasharray={`${completionRate}, 100`}
                   d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="3"
                 />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center flex-col">
                 <span className="text-2xl font-bold text-slate-800 dark:text-white">{completionRate}%</span>
                 <span className="text-xs text-slate-500">Done</span>
               </div>
            </div>
            <div className="flex-1 ml-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Tasks</span>
                <span className="font-bold text-slate-800 dark:text-white">{totalTasks}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Completed</span>
                <span className="font-bold text-green-500">{completedTasks}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Pending</span>
                <span className="font-bold text-orange-500">{totalTasks - completedTasks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Stats Card (New) */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-6 text-white shadow-lg">
           <div className="flex justify-between items-start mb-6">
             <div>
               <h2 className="text-xl font-bold">Deep Work</h2>
               <p className="text-blue-100 text-sm opacity-80">Focus session history</p>
             </div>
             <i className="ti ti-brain text-3xl opacity-50"></i>
           </div>
           
           <div className="grid grid-cols-3 gap-4 text-center">
             <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
               <div className="text-2xl font-bold font-mono">{totalFocusHours}</div>
               <div className="text-[10px] uppercase opacity-70">Total Hours</div>
             </div>
             <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
               <div className="text-2xl font-bold font-mono">{totalSessions}</div>
               <div className="text-[10px] uppercase opacity-70">Sessions</div>
             </div>
             <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
               <div className="text-2xl font-bold font-mono">{avgSessionLength}m</div>
               <div className="text-[10px] uppercase opacity-70">Avg Length</div>
             </div>
           </div>
        </div>

        {/* Matrix Distribution */}
        <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Matrix Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-red-500 font-semibold">Do First</span>
                <span className="text-slate-500">{q1Count}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-gray-700 h-2 rounded-full">
                <div className="bg-red-500 h-2 rounded-full" style={{width: `${(q1Count/maxQ)*100}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-blue-500 font-semibold">Schedule</span>
                <span className="text-slate-500">{q2Count}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-gray-700 h-2 rounded-full">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(q2Count/maxQ)*100}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-orange-500 font-semibold">Delegate</span>
                <span className="text-slate-500">{q3Count}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-gray-700 h-2 rounded-full">
                <div className="bg-orange-500 h-2 rounded-full" style={{width: `${(q3Count/maxQ)*100}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 font-semibold">Eliminate</span>
                <span className="text-slate-500">{q4Count}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-gray-700 h-2 rounded-full">
                <div className="bg-gray-500 h-2 rounded-full" style={{width: `${(q4Count/maxQ)*100}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Habit Summary */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
           <div className="flex justify-between items-center">
             <div>
               <h2 className="text-xl font-bold mb-1">Habit Consistency</h2>
               <p className="text-purple-100 text-sm">You are building strong routines.</p>
             </div>
             <div className="text-right">
                <div className="text-3xl font-bold">{avgStreak}</div>
                <div className="text-xs uppercase opacity-80">Avg Streak</div>
             </div>
           </div>
           <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="bg-white/10 p-2 rounded text-center">
                 <div className="font-bold text-lg">{habits.filter(h => h.category==='Academic').length}</div>
                 <div className="text-[10px] opacity-70">Academic</div>
              </div>
              <div className="bg-white/10 p-2 rounded text-center">
                 <div className="font-bold text-lg">{habits.filter(h => h.category==='Productivity').length}</div>
                 <div className="text-[10px] opacity-70">Productivity</div>
              </div>
              <div className="bg-white/10 p-2 rounded text-center">
                 <div className="font-bold text-lg">{habits.filter(h => h.category==='Health').length}</div>
                 <div className="text-[10px] opacity-70">Health</div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

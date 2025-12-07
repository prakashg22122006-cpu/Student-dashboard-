
import React, { useState } from 'react';
import { useData, getTodayString } from '../hooks/useData';
import { Habit } from '../../types';

// Helper to get last 7 days for heatmap
const getLast7Days = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

// Calendar Helper
const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return d.toISOString().split('T')[0];
  });
};

export const HabitsView: React.FC = () => {
  const { habits, addHabit, deleteHabit, toggleHabitForToday } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  // Form State
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<Habit['category']>('Productivity');
  const [frequency, setFrequency] = useState<'daily'|'weekly'>('daily');
  const [reminderTime, setReminderTime] = useState('');
  const [chainAfter, setChainAfter] = useState('');

  const today = getTodayString();
  const last7Days = getLast7Days();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(
      newHabitName.trim(), 
      newHabitCategory, 
      frequency, 
      reminderTime || undefined, 
      chainAfter.trim() || undefined
    );
    // Reset Form
    setNewHabitName('');
    setFrequency('daily');
    setReminderTime('');
    setChainAfter('');
    setIsModalOpen(false);
  };

  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  return (
    <div className="p-6 animate-fade-in pb-28">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Habit Tracker</h1>
          <p className="text-slate-500 dark:text-gray-400">Build consistency, one day at a time.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all active:scale-95"
        >
          <i className="ti ti-plus"></i>
          <span className="hidden md:inline">New Habit</span>
        </button>
      </div>

      <div className="grid gap-4">
        {habits.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#1E1E1E] rounded-xl border border-dashed border-slate-300 dark:border-gray-700">
            <i className="ti ti-flame-off text-4xl text-slate-300 dark:text-gray-600 mb-3 block"></i>
            <p className="text-slate-500">No habits tracked yet.</p>
          </div>
        )}

        {habits.map(habit => {
          const isCompletedToday = habit.completedDates.includes(today);
          return (
            <div 
              key={habit.id} 
              onClick={() => setSelectedHabitId(habit.id)}
              className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm cursor-pointer hover:shadow-md transition-shadow relative group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleHabitForToday(habit.id); }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 z-10 ${
                      isCompletedToday 
                        ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg shadow-orange-500/30 scale-105' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <i className={`ti ${isCompletedToday ? 'ti-check' : 'ti-flame'}`}></i>
                  </button>
                  
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-gray-100 flex items-center gap-2">
                      {habit.name}
                      {habit.reminderTime && <span className="text-[10px] text-slate-400 border border-slate-200 dark:border-slate-700 px-1 rounded"><i className="ti ti-alarm mr-0.5"></i>{habit.reminderTime}</span>}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-gray-400 mt-1">
                      <span className={`px-2 py-0.5 rounded ${
                        habit.category === 'Academic' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                        habit.category === 'Health' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {habit.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center text-orange-500 font-medium">
                        <i className="ti ti-flame mr-1"></i> {habit.streak} Day Streak
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                   onClick={(e) => { e.stopPropagation(); deleteHabit(habit.id); }}
                   className="text-slate-300 hover:text-red-500 transition-colors p-2"
                >
                   <i className="ti ti-trash"></i>
                </button>
              </div>

              {/* Chaining Badge */}
              {habit.chainAfter && (
                <div className="mb-3 flex items-center gap-1 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded inline-block">
                  <i className="ti ti-link text-slate-400"></i>
                  After: <strong>{habit.chainAfter}</strong>
                </div>
              )}

              {/* Mini Heatmap */}
              <div className="flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 mr-2 uppercase tracking-wider">Last 7 Days</span>
                <div className="flex gap-1.5">
                  {last7Days.map(date => {
                    const done = habit.completedDates.includes(date);
                    return (
                      <div 
                        key={date} 
                        title={date}
                        className={`w-2.5 h-2.5 rounded-full ${done ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Habit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-gray-700">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Create New Habit</h2>
             <form onSubmit={handleSave} className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Habit Name</label>
                 <input 
                   type="text" 
                   required
                   value={newHabitName}
                   onChange={e => setNewHabitName(e.target.value)}
                   className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white outline-none"
                   placeholder="e.g., Code for 30 mins"
                 />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                   <select 
                     value={newHabitCategory}
                     onChange={e => setNewHabitCategory(e.target.value as Habit['category'])}
                     className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white outline-none"
                   >
                     <option value="Academic">Academic</option>
                     <option value="Productivity">Productivity</option>
                     <option value="Health">Health</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Frequency</label>
                   <select 
                     value={frequency}
                     onChange={e => setFrequency(e.target.value as any)}
                     className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white outline-none"
                   >
                     <option value="daily">Daily</option>
                     <option value="weekly">Weekly</option>
                   </select>
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reminder (Optional)</label>
                 <input 
                   type="time" 
                   value={reminderTime}
                   onChange={e => setReminderTime(e.target.value)}
                   className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white outline-none"
                 />
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Habit Chaining (Optional)</label>
                 <input 
                   type="text" 
                   value={chainAfter}
                   onChange={e => setChainAfter(e.target.value)}
                   placeholder="e.g. After brushing teeth"
                   className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white outline-none"
                 />
                 <p className="text-[10px] text-slate-400 mt-1">Link this habit to an existing routine.</p>
               </div>

               <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
                 <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium">Create Habit</button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* Detail / Calendar View Modal */}
      {selectedHabit && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast"
          onClick={() => setSelectedHabitId(null)}
        >
          <div 
            className="bg-white dark:bg-[#1E1E1E] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-gray-700 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
             <div className="flex justify-between items-start mb-4">
               <div>
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedHabit.name}</h2>
                 <p className="text-slate-500 text-sm">Monthly History</p>
               </div>
               <button onClick={() => setSelectedHabitId(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><i className="ti ti-x"></i></button>
             </div>
             
             {/* Calendar Grid */}
             <div className="grid grid-cols-7 gap-1 mb-4">
               {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-center text-xs text-slate-400 py-1">{d}</div>)}
               {getDaysInMonth(new Date()).map(dateStr => {
                 const done = selectedHabit.completedDates.includes(dateStr);
                 const dayNum = parseInt(dateStr.split('-')[2]);
                 return (
                   <div 
                     key={dateStr}
                     className={`aspect-square flex items-center justify-center text-xs rounded-lg border ${
                       done 
                         ? 'bg-green-500 text-white border-green-500' 
                         : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-transparent'
                     }`}
                   >
                     {dayNum}
                   </div>
                 );
               })}
             </div>
             
             <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Current Streak</div>
                <div className="text-3xl font-mono font-bold text-orange-500">🔥 {selectedHabit.streak} Days</div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

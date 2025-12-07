
import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { Goal } from '../../types';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, deleteGoal, updateGoalProgress } = useData();
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState<Goal['category']>('Academic');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && target) {
      addGoal({
        title: title.trim(),
        target: Number(target),
        unit: unit.trim() || '%',
        deadline: deadline || '',
        category
      });
      setShowModal(false);
      setTitle(''); setTarget(''); setUnit(''); setDeadline('');
    }
  };

  return (
    <div className="p-6 animate-fade-in pb-28">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Goal Tracker</h1>
          <p className="text-slate-500 dark:text-gray-400">Visualize your success.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white p-2 rounded-lg flex items-center justify-center">
          <i className="ti ti-plus text-xl"></i>
        </button>
      </div>

      <div className="space-y-4">
        {goals.map(goal => {
          const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
          return (
            <div key={goal.id} className="bg-white dark:bg-[#1E1E1E] p-5 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm">
               <div className="flex justify-between items-start mb-2">
                 <div>
                   <span className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1 block">{goal.category}</span>
                   <h3 className="text-lg font-bold text-slate-800 dark:text-white">{goal.title}</h3>
                 </div>
                 <button onClick={() => deleteGoal(goal.id)} className="text-slate-300 hover:text-red-500"><i className="ti ti-x"></i></button>
               </div>

               <div className="flex items-end justify-between mb-2">
                 <div className="text-3xl font-mono font-light text-primary">
                    {goal.current} <span className="text-sm text-slate-400">/ {goal.target} {goal.unit}</span>
                 </div>
                 <div className="flex space-x-2">
                   <button onClick={() => updateGoalProgress(goal.id, Math.max(0, goal.current - 1))} className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center">-</button>
                   <button onClick={() => updateGoalProgress(goal.id, goal.current + 1)} className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center">+</button>
                 </div>
               </div>

               <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden relative">
                 <div className="bg-primary h-full transition-all duration-500" style={{width: `${progress}%`}}></div>
               </div>
               
               <div className="flex justify-between mt-2 text-xs text-slate-400">
                 <span>{progress}% Completed</span>
                 <span>Due: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'N/A'}</span>
               </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-fast">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-sm rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Set New Goal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <input type="text" required placeholder="Goal Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
               <div className="flex space-x-2">
                 <input type="number" required placeholder="Target" value={target} onChange={e => setTarget(e.target.value)} className="w-2/3 bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
                 <input type="text" placeholder="Unit" value={unit} onChange={e => setUnit(e.target.value)} className="w-1/3 bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
               </div>
               <select value={category} onChange={e => setCategory(e.target.value as Goal['category'])} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none">
                 <option value="Academic">Academic</option>
                 <option value="Skill">Skill</option>
                 <option value="Project">Project</option>
                 <option value="Personal">Personal</option>
               </select>
               <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
               
               <div className="flex justify-end space-x-3 pt-2">
                 <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Set Goal</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

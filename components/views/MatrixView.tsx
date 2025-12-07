
import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { Task } from '../../types';

export const MatrixView: React.FC = () => {
  const { tasks, updateTaskQuadrant, toggleTask, deleteTask } = useData();
  const [showReview, setShowReview] = useState(false);

  // Filter active tasks only for the matrix
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Review Logic
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  // Old Q4 Tasks (Eliminate candidates)
  const staleQ4Tasks = activeTasks.filter(t => 
    t.quadrant === 4 && 
    t.createdAt && 
    new Date(t.createdAt) < sevenDaysAgo
  );

  const getTasksByQuadrant = (q: 1|2|3|4) => activeTasks.filter(t => t.quadrant === q);

  const calculateTotalTime = (q: 1|2|3|4) => {
    const totalMinutes = getTasksByQuadrant(q).reduce((acc, t) => acc + (t.timeEstimate || 0), 0);
    if (totalMinutes === 0) return null;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const QuadrantCard: React.FC<{ 
    id: 1|2|3|4, 
    title: string, 
    subtitle: string, 
    colorClass: string,
    bgClass: string 
  }> = ({ id, title, subtitle, colorClass, bgClass }) => {
    const qTasks = getTasksByQuadrant(id);
    const timeAllocation = calculateTotalTime(id);

    return (
      <div className={`flex flex-col h-full rounded-xl border ${bgClass} border-slate-200 dark:border-slate-700 overflow-hidden`}>
        <div className={`p-3 border-b border-slate-200 dark:border-slate-700 ${colorClass} bg-opacity-10 dark:bg-opacity-20 flex justify-between items-center`}>
          <div>
            <h3 className={`font-bold ${colorClass}`}>{title}</h3>
            <p className="text-[10px] uppercase tracking-wider opacity-70 font-semibold">{subtitle}</p>
          </div>
          <div className="text-right">
             <span className="text-xs font-mono bg-white dark:bg-black/20 px-2 py-1 rounded-full block text-center mb-1">{qTasks.length}</span>
             {timeAllocation && <span className="text-[10px] opacity-70 block font-mono">{timeAllocation}</span>}
          </div>
        </div>
        
        <div className="flex-1 p-2 overflow-y-auto space-y-2 bg-white/50 dark:bg-[#1E1E1E]/50">
          {qTasks.length === 0 && (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
              Empty
            </div>
          )}
          {qTasks.map(task => (
            <div key={task.id} className="bg-white dark:bg-[#2C2C2C] p-3 rounded shadow-sm border border-slate-100 dark:border-slate-700 group">
              <p className="text-sm text-slate-800 dark:text-gray-200 mb-2">{task.title}</p>
              
              {/* Simulating Drag & Drop with Action Buttons */}
              <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-700 pt-2 mt-1">
                <button onClick={() => toggleTask(task.id)} className="text-xs text-slate-400 hover:text-green-500" title="Complete">
                  <i className="ti ti-check"></i>
                </button>
                <div className="flex space-x-1">
                  {id !== 1 && <button onClick={() => updateTaskQuadrant(task.id, 1)} className="w-5 h-5 rounded hover:bg-red-100 text-red-500 flex items-center justify-center text-[10px]" title="Move to Do First">1</button>}
                  {id !== 2 && <button onClick={() => updateTaskQuadrant(task.id, 2)} className="w-5 h-5 rounded hover:bg-blue-100 text-blue-500 flex items-center justify-center text-[10px]" title="Move to Schedule">2</button>}
                  {id !== 3 && <button onClick={() => updateTaskQuadrant(task.id, 3)} className="w-5 h-5 rounded hover:bg-orange-100 text-orange-500 flex items-center justify-center text-[10px]" title="Move to Delegate">3</button>}
                  {id !== 4 && <button onClick={() => updateTaskQuadrant(task.id, 4)} className="w-5 h-5 rounded hover:bg-gray-100 text-gray-500 flex items-center justify-center text-[10px]" title="Move to Eliminate">4</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const cleanCompleted = () => {
    completedTasks.forEach(t => deleteTask(t.id));
    setShowReview(false);
  };
  
  const cleanStaleQ4 = () => {
    staleQ4Tasks.forEach(t => deleteTask(t.id));
    setShowReview(false);
  };

  return (
    <div className="p-4 h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      <header className="mb-4 flex-shrink-0 flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Priority Matrix</h1>
           <p className="text-sm text-slate-500 dark:text-gray-400">The Eisenhower Method</p>
        </div>
        <button 
           onClick={() => setShowReview(true)}
           className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
        >
           <i className="ti ti-analyze mr-1"></i> Weekly Review
        </button>
      </header>
      
      {/* Grid Container - 2x2 on Desktop, Stacked/Scroll on Mobile */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0 overflow-y-auto md:overflow-hidden pb-20 md:pb-0">
        <QuadrantCard 
          id={1} 
          title="Do First" 
          subtitle="Urgent & Important" 
          colorClass="text-red-600 dark:text-red-400"
          bgClass="bg-red-50 dark:bg-red-900/10"
        />
        <QuadrantCard 
          id={2} 
          title="Schedule" 
          subtitle="Not Urgent & Important" 
          colorClass="text-blue-600 dark:text-blue-400"
          bgClass="bg-blue-50 dark:bg-blue-900/10"
        />
        <QuadrantCard 
          id={3} 
          title="Delegate" 
          subtitle="Urgent & Not Important" 
          colorClass="text-orange-600 dark:text-orange-400"
          bgClass="bg-orange-50 dark:bg-orange-900/10"
        />
        <QuadrantCard 
          id={4} 
          title="Eliminate" 
          subtitle="Not Urgent & Not Important" 
          colorClass="text-slate-600 dark:text-slate-400"
          bgClass="bg-slate-50 dark:bg-slate-800/30"
        />
      </div>

      {/* Review Modal */}
      {showReview && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-md rounded-xl p-6 shadow-2xl">
               <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Matrix Review</h2>
               
               <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 text-center">
                     <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded">
                        <div className="text-2xl font-bold text-slate-800 dark:text-white">{activeTasks.length}</div>
                        <div className="text-[10px] uppercase text-slate-500">Active Tasks</div>
                     </div>
                     <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks.length}</div>
                        <div className="text-[10px] uppercase text-green-600 dark:text-green-400">Completed</div>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-300">Clean up {completedTasks.length} completed tasks?</span>
                        <button onClick={cleanCompleted} disabled={completedTasks.length===0} className="text-xs bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50">Delete All</button>
                     </div>
                     
                     <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                           <span className="text-sm text-slate-600 dark:text-slate-300">Eliminate old Q4 tasks?</span>
                           <span className="text-[10px] text-slate-400">Tasks older than 7 days in Eliminate</span>
                        </div>
                        <button onClick={cleanStaleQ4} disabled={staleQ4Tasks.length===0} className="text-xs bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50">Clear {staleQ4Tasks.length}</button>
                     </div>
                  </div>
               </div>

               <div className="mt-6 text-right">
                  <button onClick={() => setShowReview(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600">Close</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

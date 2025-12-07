

import React, { useState } from 'react';
import { Task, Subtask } from '../../types';
import { useData, getTodayString } from '../hooks/useData';

// --- Components ---

const TaskDetailModal: React.FC<{
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
}> = ({ task, onClose, onUpdate, onDelete, onToggleSubtask, onAddSubtask, onDeleteSubtask }) => {
  const [newSubtask, setNewSubtask] = useState('');

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      onAddSubtask(task.id, newSubtask.trim());
      setNewSubtask('');
    }
  };

  const completedSub = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSub = task.subtasks?.length || 0;
  const progress = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
          <div className="flex-1 mr-4">
             <div className="flex items-center gap-2 mb-2">
               <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                 task.priority >= 4 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
               }`}>Priority {task.priority}</span>
               {task.recurrence && (
                 <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-600">
                   <i className="ti ti-repeat mr-1"></i>{task.recurrence}
                 </span>
               )}
             </div>
             <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{task.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><i className="ti ti-x text-xl"></i></button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
           
           {/* Metadata Grid */}
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Due Date</label>
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-gray-300 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                   <i className="ti ti-calendar"></i>
                   {task.dueDate ? new Date(task.dueDate).toDateString() : 'No date set'}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Time Estimate</label>
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-gray-300 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                   <i className="ti ti-clock"></i>
                   {task.timeEstimate ? `${task.timeEstimate} mins` : '-'}
                </div>
              </div>
           </div>

           {/* Subtasks */}
           <div>
             <div className="flex justify-between items-end mb-2">
               <h3 className="text-sm font-bold text-slate-700 dark:text-gray-200">Subtasks</h3>
               <span className="text-xs text-slate-500">{progress}% Done</span>
             </div>
             
             <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mb-3">
               <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{width: `${progress}%`}}></div>
             </div>

             <div className="space-y-2 mb-3">
               {task.subtasks?.map(sub => (
                 <div key={sub.id} className="flex items-center gap-3 group">
                   <button 
                     onClick={() => onToggleSubtask(task.id, sub.id)}
                     className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${sub.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}
                   >
                     {sub.completed && <i className="ti ti-check text-xs"></i>}
                   </button>
                   <span className={`text-sm flex-1 ${sub.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-gray-300'}`}>{sub.title}</span>
                   <button onClick={() => onDeleteSubtask(task.id, sub.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500"><i className="ti ti-trash"></i></button>
                 </div>
               ))}
             </div>

             <form onSubmit={handleAddSub} className="flex gap-2">
               <input 
                 type="text" 
                 value={newSubtask} 
                 onChange={e => setNewSubtask(e.target.value)}
                 placeholder="Add subtask..."
                 className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary outline-none dark:text-white"
               />
               <button type="submit" disabled={!newSubtask} className="text-primary hover:text-blue-600 px-2"><i className="ti ti-plus"></i></button>
             </form>
           </div>

           {/* Attachments */}
           <div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-gray-200 mb-2">Attachments</h3>
              <div className="space-y-2">
                 {task.attachments?.map((link, i) => (
                   <div key={i} className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/10 p-2 rounded text-blue-600 dark:text-blue-400">
                      <i className="ti ti-link"></i>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="truncate flex-1 hover:underline">{link}</a>
                   </div>
                 ))}
                 {(!task.attachments || task.attachments.length === 0) && <p className="text-xs text-slate-400 italic">No links attached.</p>}
              </div>
           </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between bg-slate-50 dark:bg-[#1a2234] rounded-b-xl">
           <button onClick={onDelete} className="text-red-500 text-sm font-medium hover:underline">Delete Task</button>
           <button onClick={onClose} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-300">Close</button>
        </div>
      </div>
    </div>
  );
};

export const TasksView: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask, toggleSubtask, addSubtask, deleteSubtask } = useData();
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Quick Add State
  const [newTaskText, setNewTaskText] = useState('');
  const [priority, setPriority] = useState<number>(3);
  const [dueDate, setDueDate] = useState('');
  const [quadrant, setQuadrant] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    // Fix: Passing priority and dueDate correctly to useData
    addTask(newTaskText.trim(), quadrant as 1|2|3|4, priority as 1|2|3|4|5, dueDate || undefined);
    
    setNewTaskText('');
    setDueDate('');
    // Keep priority/quadrant as is for rapid entry or reset? Let's keep them.
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const getPriorityColor = (p: number) => {
    if (p >= 5) return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    if (p === 4) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
    if (p === 3) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    return 'text-slate-600 bg-slate-100 dark:bg-slate-800';
  };

  // --- Kanban Column ---
  const KanbanColumn: React.FC<{ title: string, qId: number, tasks: Task[] }> = ({ title, qId, tasks }) => (
    <div className="flex-1 min-w-[280px] bg-slate-50 dark:bg-[#1a2234] rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex flex-col h-full">
      <h3 className="font-bold text-slate-700 dark:text-gray-300 mb-3 px-1 flex justify-between">
        {title} <span className="bg-slate-200 dark:bg-slate-700 px-2 rounded-full text-xs py-0.5">{tasks.length}</span>
      </h3>
      <div className="space-y-2 overflow-y-auto flex-1 pr-1">
        {tasks.map(task => (
          <div key={task.id} onClick={() => setSelectedTask(task)} className="bg-white dark:bg-[#2C2C2C] p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary group">
            <div className="flex justify-between items-start mb-2">
               <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${getPriorityColor(task.priority)}`}>P{task.priority}</span>
               {task.dueDate && <span className="text-[10px] text-slate-400">{new Date(task.dueDate).getDate()}/{new Date(task.dueDate).getMonth()+1}</span>}
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-gray-100 mb-2 line-clamp-2">{task.title}</p>
            
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
               <div className="flex gap-2 text-xs text-slate-400">
                  {task.subtasks && task.subtasks.length > 0 && <span><i className="ti ti-list-check"></i> {task.subtasks.filter(s=>s.completed).length}/{task.subtasks.length}</span>}
                  {task.attachments && task.attachments.length > 0 && <span><i className="ti ti-link"></i></span>}
               </div>
               <button onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }} className="w-5 h-5 rounded-full border border-slate-300 hover:bg-green-500 hover:border-green-500 transition-colors"></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 animate-fade-in pb-28 h-screen flex flex-col">
      <header className="mb-6 flex-shrink-0 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Smart Tasks</h1>
          <p className="text-slate-500 dark:text-gray-400">Manage priorities & subtasks.</p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex text-sm">
           <button 
             onClick={() => setViewMode('list')}
             className={`px-3 py-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow text-primary dark:text-white' : 'text-slate-500'}`}
           >
             <i className="ti ti-list mr-1"></i>List
           </button>
           <button 
             onClick={() => setViewMode('kanban')}
             className={`px-3 py-1.5 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-600 shadow text-primary dark:text-white' : 'text-slate-500'}`}
           >
             <i className="ti ti-layout-kanban mr-1"></i>Board
           </button>
        </div>
      </header>

      {/* Quick Add Bar */}
      <div className="bg-white dark:bg-[#1E1E1E] p-3 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm mb-6 flex-shrink-0">
         <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
            <input 
              type="text" 
              value={newTaskText} 
              onChange={e => setNewTaskText(e.target.value)} 
              placeholder="Add a new task..." 
              className="flex-grow bg-slate-100 dark:bg-[#2C2C2C] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white"
            />
            <div className="flex gap-2">
               <select value={priority} onChange={e => setPriority(Number(e.target.value))} className="bg-slate-100 dark:bg-[#2C2C2C] rounded-lg px-2 py-2 text-xs border-none outline-none dark:text-gray-300" title="Priority">
                  <option value="5">P5 (Critical)</option>
                  <option value="4">P4 (High)</option>
                  <option value="3">P3 (Medium)</option>
                  <option value="2">P2 (Low)</option>
                  <option value="1">P1 (Trivial)</option>
               </select>
               <input 
                 type="date" 
                 value={dueDate} 
                 onChange={e => setDueDate(e.target.value)}
                 className="bg-slate-100 dark:bg-[#2C2C2C] rounded-lg px-2 py-2 text-xs border-none outline-none dark:text-gray-300"
               />
               <select value={quadrant} onChange={e => setQuadrant(Number(e.target.value))} className="bg-slate-100 dark:bg-[#2C2C2C] rounded-lg px-2 py-2 text-xs border-none outline-none dark:text-gray-300" title="Quadrant">
                  <option value="1">Do First</option>
                  <option value="2">Schedule</option>
                  <option value="3">Delegate</option>
                  <option value="4">Eliminate</option>
               </select>
               <button type="submit" disabled={!newTaskText.trim()} className="bg-primary text-white px-4 rounded-lg hover:bg-blue-600"><i className="ti ti-plus"></i></button>
            </div>
         </form>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        
        {viewMode === 'list' && (
          <div className="space-y-2">
            {activeTasks.map(task => (
              <div key={task.id} onClick={() => setSelectedTask(task)} className="group flex items-center justify-between bg-white dark:bg-[#1E1E1E] p-3 rounded-lg border border-slate-200 dark:border-gray-800 hover:border-primary/50 transition-all cursor-pointer">
                <div className="flex items-center space-x-3 overflow-hidden">
                   <div 
                     onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                     className={`w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all ${task.completed ? 'bg-green-500 border-green-500' : 'border-slate-300 hover:border-green-500'}`}
                   >
                      {task.completed && <i className="ti ti-check text-white text-[10px]"></i>}
                   </div>
                   
                   <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                         <span className="font-medium text-slate-800 dark:text-gray-200 truncate">{task.title}</span>
                         {task.subtasks && task.subtasks.length > 0 && (
                           <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 rounded text-slate-500">
                             {task.subtasks.filter(s=>s.completed).length}/{task.subtasks.length}
                           </span>
                         )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                         <span className={`${getPriorityColor(task.priority)} px-1.5 py-0.5 rounded text-[10px] font-bold`}>P{task.priority}</span>
                         {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                         {task.timeEstimate && <span><i className="ti ti-clock"></i> {task.timeEstimate}m</span>}
                         {task.recurrence && <span><i className="ti ti-repeat"></i> {task.recurrence}</span>}
                      </div>
                   </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                  className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="ti ti-trash"></i>
                </button>
              </div>
            ))}
            
            {completedTasks.length > 0 && (
               <div className="mt-8">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Completed</h3>
                  <div className="space-y-1 opacity-60">
                     {completedTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-2">
                           <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]">✓</div>
                           <span className="text-sm line-through text-slate-500">{task.title}</span>
                           <button onClick={() => deleteTask(task.id)} className="ml-auto text-slate-400 hover:text-red-500"><i className="ti ti-trash"></i></button>
                        </div>
                     ))}
                  </div>
               </div>
            )}
          </div>
        )}

        {viewMode === 'kanban' && (
          <div className="flex gap-4 h-full overflow-x-auto pb-4">
            <KanbanColumn title="Do First (Urgent)" qId={1} tasks={activeTasks.filter(t => t.quadrant === 1)} />
            <KanbanColumn title="Schedule" qId={2} tasks={activeTasks.filter(t => t.quadrant === 2)} />
            <KanbanColumn title="Delegate" qId={3} tasks={activeTasks.filter(t => t.quadrant === 3)} />
            <KanbanColumn title="Eliminate" qId={4} tasks={activeTasks.filter(t => t.quadrant === 4)} />
          </div>
        )}

      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(t) => { /* handled by useData hooks */ }}
          onDelete={() => { deleteTask(selectedTask.id); setSelectedTask(null); }}
          onAddSubtask={addSubtask}
          onToggleSubtask={toggleSubtask}
          onDeleteSubtask={deleteSubtask}
        />
      )}
    </div>
  );
};
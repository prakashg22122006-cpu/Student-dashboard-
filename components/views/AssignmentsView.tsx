
import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { Assignment } from '../../types';

export const AssignmentsView: React.FC = () => {
  const { assignments, courses, addAssignment, deleteAssignment, updateAssignmentStatus } = useData();
  const [showModal, setShowModal] = useState(false);
  
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && courseId && dueDate) {
      addAssignment({
        title: title.trim(),
        courseId,
        dueDate,
        description: desc
      });
      setShowModal(false);
      setTitle(''); setCourseId(''); setDueDate(''); setDesc('');
    }
  };

  const getCourseName = (id: string) => courses.find(c => c.id === id)?.name || 'Unknown Course';
  
  const pending = assignments.filter(a => a.status === 'Pending').sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const completed = assignments.filter(a => a.status !== 'Pending');

  return (
    <div className="p-6 animate-fade-in pb-28">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Assignments</h1>
          <p className="text-slate-500 dark:text-gray-400">Track submissions and due dates.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white p-2 rounded-lg">
          <i className="ti ti-plus text-xl"></i>
        </button>
      </div>

      {courses.length === 0 && (
         <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-orange-600 dark:text-orange-400 mb-6 text-sm">
           <i className="ti ti-alert-circle mr-2"></i>
           You need to add Courses before you can create Assignments.
         </div>
      )}

      <div className="space-y-6">
        {/* Pending Section */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Upcoming</h2>
          <div className="space-y-3">
             {pending.length === 0 && <p className="text-slate-400 text-sm italic">No pending assignments.</p>}
             {pending.map(a => (
               <div key={a.id} className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-gray-800 flex items-center justify-between group">
                  <div className="flex items-start space-x-4">
                     <div className="flex flex-col items-center bg-slate-100 dark:bg-slate-800 p-2 rounded text-center min-w-[3.5rem]">
                        <span className="text-xs text-red-500 font-bold uppercase">{new Date(a.dueDate).toLocaleString('en-IN', { month: 'short' })}</span>
                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{new Date(a.dueDate).getDate()}</span>
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-800 dark:text-white">{a.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{getCourseName(a.courseId)}</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-2">
                     <button onClick={() => updateAssignmentStatus(a.id, 'submitted')} className="px-3 py-1 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded text-sm font-medium hover:bg-green-200">
                       Mark Done
                     </button>
                     <button onClick={() => deleteAssignment(a.id)} className="p-2 text-slate-300 hover:text-red-500"><i className="ti ti-trash"></i></button>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Completed Section */}
        {completed.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Completed</h2>
            <div className="space-y-2 opacity-70">
               {completed.map(a => (
                 <div key={a.id} className="bg-slate-50 dark:bg-[#1E1E1E] p-3 rounded-xl border border-slate-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                       <span className="text-slate-600 dark:text-slate-400 line-through">{a.title}</span>
                    </div>
                    <button onClick={() => deleteAssignment(a.id)} className="p-2 text-slate-300 hover:text-red-500"><i className="ti ti-trash"></i></button>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-fast">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-sm rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add Assignment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <input type="text" required placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
               <select required value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none">
                  <option value="">Select Course...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
               <input type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
               <textarea placeholder="Description (optional)" rows={3} value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none"></textarea>
               
               <div className="flex justify-end space-x-3 pt-2">
                 <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Add</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

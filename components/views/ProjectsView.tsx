
import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { Project } from '../../types';

export const ProjectsView: React.FC = () => {
  const { projects, addProject, deleteProject, updateProjectStatus } = useData();
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [tech, setTech] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addProject({
        name: name.trim(),
        description: desc.trim(),
        techStack: tech.split(',').map(t => t.trim()).filter(Boolean),
        status: 'Idea',
        deadline: deadline || undefined
      });
      setShowModal(false);
      setName(''); setDesc(''); setTech(''); setDeadline('');
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Idea': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Planning': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Development': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Testing': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Done': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6 animate-fade-in pb-28">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-slate-500 dark:text-gray-400">Track your software portfolio.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all active:scale-95">
          <i className="ti ti-plus"></i>
          <span className="hidden md:inline">New Project</span>
        </button>
      </div>

      <div className="grid gap-4">
        {projects.length === 0 && (
          <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
             <i className="ti ti-rocket text-4xl mb-2 inline-block"></i>
             <p>No active projects.</p>
          </div>
        )}

        {projects.map(project => (
          <div key={project.id} className="bg-white dark:bg-[#1E1E1E] p-5 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm relative group">
            <button 
              onClick={() => deleteProject(project.id)}
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <i className="ti ti-trash"></i>
            </button>
            
            <div className="mb-3">
              <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{project.name}</h3>
            <p className="text-slate-600 dark:text-gray-300 text-sm mb-4">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.map((t, i) => (
                <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="text-xs text-slate-400">
                {project.deadline ? `Due: ${new Date(project.deadline).toLocaleDateString()}` : 'No deadline'}
              </span>
              
              <div className="flex space-x-1">
                {(['Idea', 'Planning', 'Development', 'Testing', 'Done'] as const).map((s) => (
                   <button 
                     key={s}
                     onClick={() => updateProjectStatus(project.id, s)}
                     className={`w-2 h-2 rounded-full transition-all ${project.status === s ? getStatusColor(s).split(' ')[0] + ' scale-150 ring-2 ring-offset-1 dark:ring-offset-[#1E1E1E]' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}
                     title={`Set status to ${s}`}
                   />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-fast">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-lg rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <input type="text" required placeholder="Project Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
               <textarea required placeholder="Description" rows={3} value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none"></textarea>
               <input type="text" placeholder="Tech Stack (comma separated)" value={tech} onChange={e => setTech(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
               <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
               
               <div className="flex justify-end space-x-3 pt-2">
                 <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Create</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

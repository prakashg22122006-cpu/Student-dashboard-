
import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { Note } from '../../types';

const COLORS = [
  'bg-white dark:bg-[#1E1E1E]', // Default
  'bg-red-50 dark:bg-red-900/20',
  'bg-orange-50 dark:bg-orange-900/20',
  'bg-yellow-50 dark:bg-yellow-900/20',
  'bg-green-50 dark:bg-green-900/20',
  'bg-blue-50 dark:bg-blue-900/20',
  'bg-purple-50 dark:bg-purple-900/20',
];

export const NotesView: React.FC = () => {
  const { notes, addNote, deleteNote } = useData();
  const [showModal, setShowModal] = useState(false);
  const [filterTag, setFilterTag] = useState('');

  // Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addNote({
        title: title.trim(),
        content: content,
        category: category.trim() || 'General',
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        color: selectedColor
      });
      setShowModal(false);
      setTitle(''); setContent(''); setCategory(''); setTags(''); setSelectedColor(COLORS[0]);
    }
  };

  const filteredNotes = filterTag 
    ? notes.filter(n => n.tags.includes(filterTag) || n.category === filterTag)
    : notes;

  return (
    <div className="p-6 animate-fade-in pb-28">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notes</h1>
          <p className="text-slate-500 dark:text-gray-400">Quick ideas and references.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white p-3 rounded-xl shadow-lg hover:bg-blue-600 transition-all active:scale-95">
          <i className="ti ti-plus text-xl"></i>
        </button>
      </div>

      {/* Tags Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
        <button onClick={() => setFilterTag('')} className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${filterTag === '' ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
           All
        </button>
        {Array.from(new Set(notes.map(n => n.category))).map(c => (
           <button key={c} onClick={() => setFilterTag(c)} className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${filterTag === c ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
             {c}
           </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.length === 0 && (
           <div className="col-span-full text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
             <i className="ti ti-note-off text-4xl mb-2 inline-block"></i>
             <p>No notes yet.</p>
           </div>
        )}
        
        {filteredNotes.map(note => (
          <div key={note.id} className={`p-5 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm relative group transition-all hover:shadow-md ${note.color}`}>
             <button onClick={() => deleteNote(note.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"><i className="ti ti-trash"></i></button>
             
             <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">{note.title}</h3>
             <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap mb-4 line-clamp-6">{note.content}</p>
             
             <div className="flex flex-wrap gap-1 mt-auto">
               <span className="text-[10px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/10 px-2 py-1 rounded text-slate-500 dark:text-slate-400">{note.category}</span>
               {note.tags.map((t, i) => (
                 <span key={i} className="text-[10px] bg-black/5 dark:bg-white/10 px-2 py-1 rounded text-slate-500 dark:text-slate-400">#{t}</span>
               ))}
             </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-fast">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-lg rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add Note</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <input type="text" required placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
               <textarea required placeholder="Note content..." rows={6} value={content} onChange={e => setContent(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none"></textarea>
               
               <div className="flex space-x-2">
                 <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="w-1/2 bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
                 <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} className="w-1/2 bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
               </div>

               <div>
                 <label className="text-xs text-slate-500 mb-2 block">Color</label>
                 <div className="flex gap-2">
                   {COLORS.map(c => (
                     <button
                       key={c}
                       type="button"
                       onClick={() => setSelectedColor(c)}
                       className={`w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 ${c} ${selectedColor === c ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-[#1E1E1E]' : ''}`}
                     />
                   ))}
                 </div>
               </div>
               
               <div className="flex justify-end space-x-3 pt-2">
                 <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Save Note</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

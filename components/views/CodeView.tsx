
import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { CodeSnippet } from '../../types';

export const CodeView: React.FC = () => {
  const { codeSnippets, addCodeSnippet, deleteCodeSnippet } = useData();
  const [showModal, setShowModal] = useState(false);
  const [filterLang, setFilterLang] = useState('All');

  // Form State
  const [title, setTitle] = useState('');
  const [lang, setLang] = useState('javascript');
  const [code, setCode] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && code.trim()) {
      addCodeSnippet({
        title: title.trim(),
        language: lang,
        code: code,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      setShowModal(false);
      setTitle(''); setCode(''); setTags('');
    }
  };

  const filteredSnippets = filterLang === 'All' 
    ? codeSnippets 
    : codeSnippets.filter(c => c.language.toLowerCase() === filterLang.toLowerCase());

  const uniqueLangs = Array.from(new Set(codeSnippets.map(c => c.language)));

  return (
    <div className="p-6 animate-fade-in pb-28">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Code Repo</h1>
          <p className="text-slate-500 dark:text-gray-400">Snippet library.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white p-2 rounded-lg">
          <i className="ti ti-plus text-xl"></i>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
         <button onClick={() => setFilterLang('All')} className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${filterLang === 'All' ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
           All
         </button>
         {uniqueLangs.map(l => (
           <button key={l} onClick={() => setFilterLang(l)} className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${filterLang === l ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
             {l}
           </button>
         ))}
      </div>

      <div className="grid gap-4">
        {filteredSnippets.map(snippet => (
          <div key={snippet.id} className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm overflow-hidden group relative">
             <button onClick={() => deleteCodeSnippet(snippet.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"><i className="ti ti-trash"></i></button>
             
             <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#1a2234]">
               <div className="flex justify-between items-start">
                 <div>
                   <h3 className="font-bold text-slate-800 dark:text-gray-200">{snippet.title}</h3>
                   <div className="flex gap-2 mt-1">
                     <span className="text-xs font-mono text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">{snippet.language}</span>
                     {snippet.tags.map((t,i) => <span key={i} className="text-[10px] text-slate-500 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">{t}</span>)}
                   </div>
                 </div>
               </div>
             </div>
             
             <div className="p-0 bg-[#282c34] overflow-x-auto">
               <pre className="text-xs font-mono text-slate-300 p-4 leading-relaxed">
                 {snippet.code}
               </pre>
             </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-fast">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-lg rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add Snippet</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <input type="text" required placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
               <div className="flex space-x-2">
                 <select value={lang} onChange={e => setLang(e.target.value)} className="w-1/2 bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none">
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="sql">SQL</option>
                 </select>
                 <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} className="w-1/2 bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
               </div>
               <textarea required placeholder="Paste code here..." rows={8} value={code} onChange={e => setCode(e.target.value)} className="w-full bg-[#282c34] text-slate-300 border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 font-mono text-sm outline-none"></textarea>
               
               <div className="flex justify-end space-x-3 pt-2">
                 <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Save Snippet</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

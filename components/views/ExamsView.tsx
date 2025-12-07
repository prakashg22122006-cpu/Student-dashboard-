
import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Exam } from '../../types';

export const ExamsView: React.FC = () => {
  const { exams, addExam, deleteExam } = useData();
  const [showModal, setShowModal] = useState(false);
  
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [date, setDate] = useState('');
  const [syllabus, setSyllabus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && date) {
      addExam({
        name: name.trim(),
        courseName: course.trim(),
        date,
        syllabus: syllabus.trim()
      });
      setShowModal(false);
      setName(''); setCourse(''); setDate(''); setSyllabus('');
    }
  };

  const getDaysLeft = (dateString: string) => {
    const diff = new Date(dateString).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
  };

  // Sort exams by date
  const sortedExams = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="p-6 animate-fade-in pb-28">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Exam Prep</h1>
          <p className="text-slate-500 dark:text-gray-400">Countdown to success.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white p-2 rounded-lg">
          <i className="ti ti-plus text-xl"></i>
        </button>
      </div>

      <div className="grid gap-4">
        {sortedExams.map(exam => {
          const daysLeft = getDaysLeft(exam.date);
          const isUrgent = daysLeft <= 3 && daysLeft >= 0;
          const isPast = daysLeft < 0;

          return (
            <div key={exam.id} className={`bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm relative overflow-hidden ${isUrgent ? 'border-l-4 border-l-red-500' : ''}`}>
               <button onClick={() => deleteExam(exam.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><i className="ti ti-trash"></i></button>
               
               <div className="flex items-center justify-between mb-4">
                 <div>
                   <h3 className="font-bold text-lg text-slate-800 dark:text-white">{exam.courseName}</h3>
                   <span className="text-sm text-slate-500">{exam.name}</span>
                 </div>
                 <div className={`text-center px-4 py-2 rounded-lg ${isUrgent ? 'bg-red-100 text-red-600' : isPast ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'}`}>
                    <div className="text-xl font-bold font-mono">{isPast ? 'DONE' : daysLeft}</div>
                    <div className="text-[10px] uppercase font-bold">{isPast ? '' : 'DAYS LEFT'}</div>
                 </div>
               </div>

               <div className="bg-slate-50 dark:bg-black/20 p-3 rounded-lg text-sm text-slate-600 dark:text-gray-400">
                 <strong className="block text-xs uppercase text-slate-400 mb-1">Syllabus</strong>
                 {exam.syllabus || 'No syllabus details added.'}
               </div>
               
               <div className="mt-2 text-right text-xs text-slate-400">
                 Date: {new Date(exam.date).toDateString()}
               </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-fast">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-sm rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add Exam</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <input type="text" required placeholder="Course (e.g., Data Structures)" value={course} onChange={e => setCourse(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
               <input type="text" required placeholder="Exam Name (e.g., Midterm)" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
               <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none" />
               <textarea placeholder="Syllabus / Topics" rows={3} value={syllabus} onChange={e => setSyllabus(e.target.value)} className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:text-white outline-none"></textarea>
               
               <div className="flex justify-end space-x-3 pt-2">
                 <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Add Exam</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

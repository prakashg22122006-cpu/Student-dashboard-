
import React from 'react';
import { useData } from '../hooks/useData';

const GRADE_POINTS: {[key: string]: number} = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0
};

export const GradesView: React.FC = () => {
  const { courses, updateCourseGrade } = useData();

  // Calculate SGPA
  let totalCredits = 0;
  let totalPoints = 0;
  let gradedCoursesCount = 0;

  courses.forEach(c => {
    if (c.grade && GRADE_POINTS[c.grade] !== undefined) {
      totalCredits += c.credits;
      totalPoints += GRADE_POINTS[c.grade] * c.credits;
      gradedCoursesCount++;
    }
  });

  const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  return (
    <div className="p-6 animate-fade-in pb-28">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Grades</h1>
        <p className="text-slate-500 dark:text-gray-400">GPA Calculator & Tracker.</p>
      </header>

      {/* SGPA Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl mb-8 flex justify-between items-center">
         <div>
           <h2 className="text-lg font-medium opacity-90">Current SGPA</h2>
           <p className="text-sm opacity-70 mt-1">Based on {gradedCoursesCount} graded courses</p>
         </div>
         <div className="text-right">
           <div className="text-5xl font-bold tracking-tight">{sgpa}</div>
           <div className="text-xs uppercase font-bold tracking-wider opacity-60 mt-1">/ 10.00</div>
         </div>
      </div>

      <div className="space-y-4">
        {courses.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <p>No courses found. Add courses in the Academic tab first.</p>
          </div>
        )}

        {courses.map(course => (
          <div key={course.id} className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-gray-800 flex items-center justify-between">
             <div>
               <div className="flex items-center space-x-2 mb-1">
                 <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-xs font-mono rounded text-slate-600 dark:text-slate-300">{course.code}</span>
                 <span className="text-xs text-slate-400">{course.credits} Credits</span>
               </div>
               <h3 className="font-bold text-slate-800 dark:text-white">{course.name}</h3>
             </div>
             
             <div className="relative">
               <select 
                 value={course.grade || ''} 
                 onChange={(e) => updateCourseGrade(course.id, e.target.value)}
                 className={`appearance-none w-16 text-center font-bold py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer ${
                   course.grade 
                     ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' 
                     : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                 }`}
               >
                 <option value="">-</option>
                 {Object.keys(GRADE_POINTS).map(g => (
                   <option key={g} value={g}>{g}</option>
                 ))}
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-inherit opacity-50">
                 <i className="ti ti-chevron-down text-xs"></i>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};


import React, { useState, FormEvent } from 'react';
import { Course } from '../../types';
import { useData } from '../hooks/useData';

// Modal for adding a new course
const AddCourseModal: React.FC<{
  onClose: () => void;
  onSave: (newCourse: Omit<Course, 'id' | 'attendance' | 'resources'>) => void;
}> = ({ onClose, onSave }) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [semester, setSemester] = useState('');
  const [credits, setCredits] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsedCredits = Number(credits);
    if (!code.trim() || !name.trim() || !semester.trim() || isNaN(parsedCredits) || parsedCredits <= 0) {
      alert('Please fill out all fields with valid information.');
      return;
    }
    onSave({ code, name, semester, credits: parsedCredits });
  };

  const inputStyles = "bg-slate-100 dark:bg-[#1E1E1E] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-3 w-full text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow";

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#2C2C2C] rounded-2xl border border-slate-200 dark:border-gray-700 w-full max-w-sm p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Add New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Course Code (e.g., CS101)" value={code} onChange={e => setCode(e.target.value)} className={inputStyles} required />
          <input type="text" placeholder="Course Name" value={name} onChange={e => setName(e.target.value)} className={inputStyles} required />
          <input type="text" placeholder="Semester (e.g., Fall 2024)" value={semester} onChange={e => setSemester(e.target.value)} className={inputStyles} required />
          <input type="number" placeholder="Credits" value={credits} onChange={e => setCredits(e.target.value)} className={inputStyles} required min="0" />
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-95 transition-all">Save Course</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for confirming course deletion
const ConfirmDeleteModal: React.FC<{
  course: Course;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ course, onCancel, onConfirm }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onCancel}
    >
      <div 
        className="bg-white dark:bg-[#2C2C2C] rounded-2xl border border-slate-200 dark:border-gray-700 w-full max-w-sm p-6 shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Course?</h2>
        <p className="text-slate-500 dark:text-gray-400 mb-6">
          Are you sure you want to permanently delete <span className="font-semibold text-slate-700 dark:text-gray-200">{course.name}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-4">
          <button onClick={onCancel} className="px-6 py-2 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700/50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 active:scale-95 transition-all">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal for Managing Resources
const ResourcesModal: React.FC<{
  course: Course;
  onClose: () => void;
  onAdd: (title: string, url: string, type: 'pdf' | 'link' | 'doc') => void;
  onDelete: (id: string) => void;
}> = ({ course, onClose, onAdd, onDelete }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'pdf' | 'link' | 'doc'>('link');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && url) {
      onAdd(title, url, type);
      setTitle('');
      setUrl('');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#2C2C2C] rounded-2xl border border-slate-200 dark:border-gray-700 w-full max-w-md p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Resources: {course.code}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><i className="ti ti-x text-xl"></i></button>
        </div>

        {/* List */}
        <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
          {(!course.resources || course.resources.length === 0) && (
            <p className="text-center text-sm text-slate-400 italic py-4">No resources (Syllabus, Manuals) added yet.</p>
          )}
          {course.resources?.map(res => (
            <div key={res.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-lg group">
               <div className="flex items-center space-x-3 overflow-hidden">
                 <i className={`ti ${res.type === 'pdf' ? 'ti-file-type-pdf text-red-500' : res.type === 'doc' ? 'ti-file-text text-blue-500' : 'ti-link text-slate-500'} text-lg`}></i>
                 <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:underline truncate">
                   {res.title}
                 </a>
               </div>
               <button onClick={() => onDelete(res.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><i className="ti ti-trash"></i></button>
            </div>
          ))}
        </div>

        {/* Add Form */}
        <form onSubmit={handleAdd} className="border-t border-slate-200 dark:border-gray-700 pt-4">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Add New Resource</p>
           <div className="flex space-x-2 mb-3">
             <input type="text" placeholder="Title (e.g. Syllabus)" value={title} onChange={e => setTitle(e.target.value)} required className="flex-1 bg-slate-100 dark:bg-[#1E1E1E] border border-slate-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-white outline-none" />
             <select value={type} onChange={e => setType(e.target.value as any)} className="w-24 bg-slate-100 dark:bg-[#1E1E1E] border border-slate-300 dark:border-gray-700 rounded-lg px-2 py-2 text-sm dark:text-white outline-none">
               <option value="link">Link</option>
               <option value="pdf">PDF</option>
               <option value="doc">Doc</option>
             </select>
           </div>
           <div className="flex space-x-2">
             <input type="url" placeholder="URL (Drive Link, etc.)" value={url} onChange={e => setUrl(e.target.value)} required className="flex-1 bg-slate-100 dark:bg-[#1E1E1E] border border-slate-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:text-white outline-none" />
             <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">Add</button>
           </div>
        </form>
      </div>
    </div>
  );
};

export const CoursesView: React.FC = () => {
  const { courses, addCourse, deleteCourse, updateCourseAttendance, addCourseResource, deleteCourseResource } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [resourceModalCourse, setResourceModalCourse] = useState<Course | null>(null);

  const handleSaveCourse = (newCourseData: Omit<Course, 'id' | 'attendance' | 'resources'>) => {
    addCourse(newCourseData);
    setIsModalOpen(false);
  };

  const handleDeleteCourse = (id: string) => {
    const course = courses.find(c => c.id === id);
    if (course) setCourseToDelete(course);
  };
  
  const handleConfirmDelete = () => {
    if (!courseToDelete) return;
    deleteCourse(courseToDelete.id);
    setCourseToDelete(null);
  };

  const handleAttendance = (id: string, type: 'attended' | 'missed') => {
    const course = courses.find(c => c.id === id);
    if (!course) return;

    const current = course.attendance || { attended: 0, total: 0 };
    const newTotal = current.total + 1;
    const newAttended = type === 'attended' ? current.attended + 1 : current.attended;
    
    updateCourseAttendance(id, newAttended, newTotal);
  };

  return (
    <div className="p-6 pb-28 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Courses</h1>
      
      <div className="grid gap-4">
        {courses.length > 0 ? (
          courses.map((course) => {
             const att = course.attendance || { attended: 0, total: 0 };
             const percentage = att.total > 0 ? Math.round((att.attended / att.total) * 100) : 0;
             let attColor = 'bg-slate-200 dark:bg-slate-700';
             if (att.total > 0) {
               if (percentage >= 85) attColor = 'bg-green-500';
               else if (percentage >= 75) attColor = 'bg-yellow-500';
               else attColor = 'bg-red-500';
             }

             return (
              <div key={course.id} className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-gray-800 p-4 relative group">
                <button 
                    onClick={() => handleDeleteCourse(course.id)}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-slate-100 dark:bg-gray-700 hover:bg-red-500/80 dark:hover:bg-red-500/50 rounded-full text-gray-500 dark:text-gray-400 hover:text-white transition-all text-sm opacity-0 group-hover:opacity-100"
                    aria-label="Delete course"
                  >
                    ✕
                  </button>
                
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="px-2 py-1 bg-blue-500/10 text-blue-500 dark:text-blue-400 text-xs rounded font-medium">
                    {course.code}
                  </div>
                  <span className="text-slate-500 dark:text-gray-500 text-xs mr-8">{course.credits} Credits</span>
                </div>
                
                <h3 className="text-xl font-semibold text-slate-800 dark:text-gray-100 mb-1 pr-8">{course.name}</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">{course.semester}</p>
                
                {/* Actions */}
                <div className="mb-4">
                  <button 
                    onClick={() => setResourceModalCourse(course)}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <i className="ti ti-folder"></i>
                    Resources ({course.resources?.length || 0})
                  </button>
                </div>
                
                {/* Attendance Control */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance</span>
                    <div className="text-xs font-mono">
                      <span className="font-bold text-slate-800 dark:text-white">{att.attended}</span>
                      <span className="text-slate-400">/{att.total}</span>
                      <span className={`ml-2 font-bold ${percentage < 75 ? 'text-red-500' : 'text-green-500'}`}>({percentage}%)</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-slate-100 dark:bg-black/30 h-2 rounded-full overflow-hidden mb-3">
                    <div className={`${attColor} h-full transition-all duration-500`} style={{width: `${percentage}%`}}></div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAttendance(course.id, 'attended')}
                      className="flex-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 py-1.5 rounded text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40"
                    >
                      + Present
                    </button>
                    <button 
                      onClick={() => handleAttendance(course.id, 'missed')}
                      className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-1.5 rounded text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40"
                    >
                      - Absent
                    </button>
                  </div>
                </div>
              </div>
             );
          })
        ) : (
           <div className="text-center text-slate-500 dark:text-gray-500 py-16 border-2 border-dashed border-slate-300 dark:border-gray-800 rounded-xl">
             <p className="text-lg mb-2">No courses yet!</p>
             <p>Tap the <span className="text-blue-500 dark:text-blue-400 font-bold">+</span> button to add your first course.</p>
           </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 rounded-full text-white text-3xl flex items-center justify-center shadow-lg hover:bg-blue-700 active:scale-90 transition-all z-40"
        aria-label="Add new course"
      >
        +
      </button>

      {/* Modal for adding a course */}
      {isModalOpen && <AddCourseModal onClose={() => setIsModalOpen(false)} onSave={handleSaveCourse} />}
      
      {/* Modal for confirming deletion */}
      {courseToDelete && (
        <ConfirmDeleteModal 
          course={courseToDelete}
          onCancel={() => setCourseToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Modal for Resources */}
      {resourceModalCourse && (
        <ResourcesModal 
          course={resourceModalCourse}
          onClose={() => setResourceModalCourse(null)}
          onAdd={(title, url, type) => addCourseResource(resourceModalCourse.id, title, url, type)}
          onDelete={(resId) => deleteCourseResource(resourceModalCourse.id, resId)}
        />
      )}
    </div>
  );
};

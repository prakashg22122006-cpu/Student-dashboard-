
import React, { useState } from 'react';

const HelpSection: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-[#1E1E1E] mb-4 shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <i className={`ti ${icon} text-xl text-primary`}></i>
          <span className="font-bold text-slate-800 dark:text-gray-200">{title}</span>
        </div>
        <i className={`ti ti-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-slate-400`}></i>
      </button>
      
      {isOpen && (
        <div className="p-5 text-slate-600 dark:text-gray-300 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 animate-fade-in-fast">
          {children}
        </div>
      )}
    </div>
  );
};

export const HelpView: React.FC = () => {
  return (
    <div className="p-6 animate-fade-in pb-28">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Help Center</h1>
        <p className="text-slate-500 dark:text-gray-400">User manual and feature guides.</p>
      </header>

      <div className="max-w-3xl">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Academic Suite</h2>
        
        <HelpSection title="Courses & Grades" icon="ti-book">
          <p className="mb-2"><strong>Adding Courses:</strong> Go to the Courses tab and tap the (+) button. Enter the course code, name, credits, and semester.</p>
          <p className="mb-2"><strong>Calculating GPA:</strong> Once courses are added, navigate to the <strong>Grades</strong> tab. Select the grade obtained for each course from the dropdown. The system automatically calculates your SGPA based on the credits weighted against the grade points.</p>
          <p><strong>Deleting:</strong> Tap the trash icon on any course card to remove it.</p>
        </HelpSection>

        <HelpSection title="Assignments" icon="ti-clipboard-list">
          <p className="mb-2">Track your homework and project deadlines.</p>
          <p className="mb-2"><strong>Status:</strong> Assignments start as 'Pending'. Click 'Mark Done' to move them to the completed list.</p>
          <p><strong>Prerequisite:</strong> You must create a Course before you can assign a task to it.</p>
        </HelpSection>

        <HelpSection title="Exams" icon="ti-school">
          <p className="mb-2">The Exam Prep module counts down the days to your tests.</p>
          <p><strong>Color Codes:</strong> <span className="text-red-500">Red</span> indicates an exam is within 3 days. <span className="text-blue-500">Blue</span> is for future exams. <span className="text-gray-500">Gray</span> means the exam date has passed.</p>
        </HelpSection>

        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1 mt-8">Productivity Suite</h2>

        <HelpSection title="Focus Timer" icon="ti-clock-play">
          <p className="mb-2"><strong>Pomodoro Technique:</strong> Uses 25-minute focus intervals followed by 5-minute breaks.</p>
          <p className="mb-2"><strong>Ambient Sound:</strong> Use the sound selector to play offline-generated White Noise or Rain sounds to mask distractions.</p>
          <p><strong>Note:</strong> The timer runs in the browser tab. Do not close the app while the timer is running.</p>
        </HelpSection>

        <HelpSection title="Priority Matrix" icon="ti-layout-grid">
          <p className="mb-2">Based on the Eisenhower Matrix method:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Q1 Do First (Red):</strong> Urgent & Important tasks.</li>
            <li><strong>Q2 Schedule (Blue):</strong> Important but not Urgent. Focus here for long-term success.</li>
            <li><strong>Q3 Delegate (Orange):</strong> Urgent but not Important.</li>
            <li><strong>Q4 Eliminate (Gray):</strong> Neither Urgent nor Important.</li>
          </ul>
          <p className="mt-2">Use the number buttons (1-4) on any task card to instantly move it between quadrants.</p>
        </HelpSection>

        <HelpSection title="Habit Tracker" icon="ti-flame">
          <p className="mb-2"><strong>Streaks:</strong> Tap the flame icon daily to maintain your streak. If you miss a day, the streak logic currently resets.</p>
          <p><strong>Categories:</strong> Classify habits as Academic, Health, or Productivity to visualize your balance in the Analytics tab.</p>
        </HelpSection>

        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1 mt-8">Resources & Data</h2>

        <HelpSection title="File Manager" icon="ti-folder">
          <p className="mb-2"><strong>Smart Storage:</strong> Since this is an offline web app, we don't store large PDF files directly to save space.</p>
          <p><strong>Links:</strong> Save URLs to your Google Drive, GitHub repos, or online articles.</p>
          <p><strong>Snippets:</strong> Save text-based notes or code blocks directly into folders.</p>
        </HelpSection>

        <HelpSection title="Backup & Restore" icon="ti-database">
          <p className="mb-2"><strong>Export:</strong> Go to Settings > Data Management. Click "Copy Data" to get a JSON string of all your app data.</p>
          <p><strong>Restore:</strong> Paste that JSON string into the text box and click Restore.</p>
          <p><strong>Warning:</strong> Clearing data in the "Danger Zone" is irreversible. Always backup first.</p>
        </HelpSection>
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl text-center text-sm">
          <p><strong>CS-Organizer Pro</strong></p>
          <p className="opacity-70">Version 2.0 (PWA Edition)</p>
          <p className="opacity-70 mt-1">Built for B.Sc Computer Science Students</p>
        </div>
      </div>
    </div>
  );
};

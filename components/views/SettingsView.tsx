
import React, { useState, useEffect } from 'react';

interface SettingsViewProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ theme, toggleTheme }) => {
  const [importJson, setImportJson] = useState('');
  const [feedback, setFeedback] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('cs-organizer-username');
    if (savedName) setUsername(savedName);
  }, []);

  const handleSaveProfile = () => {
    if (username.trim()) {
      localStorage.setItem('cs-organizer-username', username.trim());
      showFeedback('Profile updated successfully!');
    }
  };

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleExportData = () => {
    try {
      const dataToExport: { [key: string]: string | null } = {};
      const keys = [
        'cs-organizer-courses', 'cs-organizer-tasks', 'cs-organizer-habits',
        'cs-organizer-folders', 'cs-organizer-files', 'cs-organizer-projects',
        'cs-organizer-goals', 'cs-organizer-exams', 'cs-organizer-code',
        'cs-organizer-notes', 'cs-organizer-assignments', 'cs-organizer-username',
        'theme'
      ];
      
      keys.forEach(key => {
        dataToExport[key] = localStorage.getItem(key);
      });

      const jsonString = JSON.stringify(dataToExport, null, 2);
      navigator.clipboard.writeText(jsonString);
      showFeedback('📋 Data copied to clipboard!');

    } catch (error) {
      console.error("Failed to export data", error);
      alert('Error: Could not copy data.');
    }
  };

  const handleImportData = () => {
    if (!importJson.trim()) {
      alert('Please paste your backup data into the text area first.');
      return;
    }
    
    if (window.confirm('Are you sure you want to restore data? This will overwrite all current data.')) {
      try {
        const data = JSON.parse(importJson);
        if (typeof data !== 'object' || data === null) {
          throw new Error('Invalid data format');
        }

        Object.keys(data).forEach(key => {
          if (typeof data[key] === 'string') {
            localStorage.setItem(key, data[key]);
          }
        });
        
        alert('Data restored successfully! The app will now reload.');
        window.location.reload();

      } catch (error) {
        console.error("Failed to import data", error);
        alert('Invalid JSON data! Please check the format and try again.');
      }
    }
  };

  const handleClearData = () => {
    if (window.confirm('DANGER: Are you absolutely sure you want to delete ALL data? This cannot be undone.')) {
      if (window.confirm('FINAL CONFIRMATION: This will permanently erase everything. Proceed?')) {
        localStorage.clear();
        alert('All data has been cleared. The app will now reload.');
        window.location.reload();
      }
    }
  };


  return (
    <div className="p-6 animate-fade-in pb-28">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Settings</h1>
      
      <div className="space-y-8">
        
        {/* Profile Section */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">User Profile</h2>
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-gray-800 p-4 flex gap-4">
             <div className="flex-grow">
               <label className="block text-xs font-medium text-slate-500 mb-1">Display Name</label>
               <input 
                 type="text" 
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 placeholder="Enter your name"
                 className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
               />
             </div>
             <button 
               onClick={handleSaveProfile}
               className="self-end px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
             >
               Save
             </button>
          </div>
        </section>

        {/* Appearance Section */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Appearance</h2>
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-gray-800 p-4">
             <p className="text-slate-500 dark:text-gray-400 mb-3">Choose how the application looks.</p>
             <button
                id="theme-btn"
                onClick={toggleTheme}
                className="w-full px-5 py-3 rounded-lg bg-slate-200 dark:bg-gray-700 text-slate-800 dark:text-gray-200 font-semibold hover:bg-slate-300 dark:hover:bg-gray-600 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
                <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
              </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Data Management</h2>
          
          {/* Export Card */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-gray-800 p-4 mb-4">
            <p className="text-slate-500 dark:text-gray-400 mb-3">Backup all your data. Copies JSON to clipboard.</p>
            <button
              id="export-btn"
              onClick={handleExportData}
              className="w-full px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-95 transition-all"
            >
              Copy Data to Clipboard
            </button>
          </div>

          {/* Import Card */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-gray-800 p-4">
            <p className="text-slate-500 dark:text-gray-400 mb-3">Restore your data from a backup string.</p>
            <textarea
              id="import-area"
              rows={4}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='Paste your JSON backup data here...'
              className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg p-3 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 font-mono text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-shadow mb-3"
            ></textarea>
            <button
              id="import-btn"
              onClick={handleImportData}
              className="w-full px-5 py-3 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 active:scale-95 transition-all disabled:bg-gray-500"
              disabled={!importJson.trim()}
            >
              ⚠️ Restore Data
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
           <h2 className="text-xl font-semibold text-red-500 mb-4">Danger Zone</h2>
           <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-red-500/20 dark:border-red-500/30 p-4">
              <p className="text-slate-500 dark:text-gray-400 mb-3">Permanently delete all data from this device.</p>
              <button
                id="clear-btn"
                onClick={handleClearData}
                className="w-full px-5 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 active:scale-95 transition-all"
              >
                Clear All Data
              </button>
           </div>
        </section>

        {/* Feedback Toast */}
        {feedback && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in-fast z-50">
            {feedback}
          </div>
        )}

        <div className="text-center text-slate-400 dark:text-gray-600 text-xs pt-4">
          <span>Version 2.0.0</span>
        </div>
      </div>
    </div>
  );
};

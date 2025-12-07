
import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { Folder, FileResource } from '../../types';

export const FilesView: React.FC = () => {
  const { folders, files, addFolder, deleteFolder, addFile, deleteFile } = useData();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  
  // Modal States
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [newFileType, setNewFileType] = useState<'link' | 'snippet'>('link');

  // Navigation Logic
  const currentFolder = folders.find(f => f.id === currentFolderId);
  const currentFolders = folders.filter(f => f.parentId === currentFolderId);
  const currentFiles = files.filter(f => f.folderId === currentFolderId);

  // Breadcrumb generation
  const getBreadcrumbs = () => {
    const crumbs = [{ id: null, name: 'Home' }];
    if (!currentFolderId) return crumbs;

    const path: Folder[] = [];
    let curr = folders.find(f => f.id === currentFolderId);
    while (curr) {
      path.unshift(curr);
      curr = folders.find(f => f.id === curr?.parentId);
    }
    
    return [...crumbs, ...path.map(f => ({ id: f.id, name: f.name }))];
  };

  // Handlers
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      addFolder(newItemName.trim(), currentFolderId);
      setNewItemName('');
      setShowFolderModal(false);
    }
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim() && newFileContent.trim()) {
      addFile(newItemName.trim(), newFileType, newFileContent.trim(), currentFolderId);
      setNewItemName('');
      setNewFileContent('');
      setShowFileModal(false);
    }
  };

  return (
    <div className="p-6 animate-fade-in pb-28">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Resource Manager</h1>
        <p className="text-slate-500 dark:text-gray-400">Organize your links, notes, and references.</p>
      </header>

      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm mb-6 overflow-x-auto pb-2">
        {getBreadcrumbs().map((crumb, index, arr) => (
          <React.Fragment key={index}>
            <button 
              onClick={() => setCurrentFolderId(crumb.id as string | null)}
              className={`hover:text-primary whitespace-nowrap ${index === arr.length - 1 ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-400'}`}
            >
              {crumb.name}
            </button>
            {index < arr.length - 1 && <span className="text-slate-400">/</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        
        {/* Folders Grid */}
        {currentFolders.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Folders</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentFolders.map(folder => (
                <div 
                  key={folder.id}
                  onClick={() => setCurrentFolderId(folder.id)}
                  className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-gray-800 hover:border-primary/50 cursor-pointer transition-all active:scale-95 group relative"
                >
                  <i className="ti ti-folder-filled text-3xl text-yellow-400 mb-2 block"></i>
                  <span className="font-medium text-slate-800 dark:text-gray-200 truncate block">{folder.name}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                  >
                    <i className="ti ti-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files List */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Resources</h3>
          {currentFiles.length === 0 && currentFolders.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-xl">
              <i className="ti ti-folder-off text-3xl text-slate-300 dark:text-gray-600 mb-2 block"></i>
              <p className="text-slate-500 dark:text-gray-500">This folder is empty.</p>
            </div>
          )}
          
          <div className="space-y-3">
            {currentFiles.map(file => (
              <div key={file.id} className="bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-slate-200 dark:border-gray-800 flex items-start justify-between group">
                <div className="flex items-start space-x-3 overflow-hidden">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    file.type === 'link' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' 
                      : 'bg-green-50 dark:bg-green-900/20 text-green-500'
                  }`}>
                    <i className={`ti ${file.type === 'link' ? 'ti-link' : 'ti-code'} text-xl`}></i>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-slate-800 dark:text-gray-200 truncate">{file.name}</h4>
                    {file.type === 'link' ? (
                      <a href={file.content} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline truncate block">
                        {file.content}
                      </a>
                    ) : (
                      <div className="text-sm text-slate-500 dark:text-gray-400 font-mono bg-slate-50 dark:bg-black/30 p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap max-h-24">
                        {file.content}
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => deleteFile(file.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <i className="ti ti-trash"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 items-end">
        <button 
          onClick={() => setShowFileModal(true)}
          className="bg-secondary text-white p-3 rounded-full shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center"
          title="Add Resource"
        >
          <i className="ti ti-file-plus text-xl"></i>
        </button>
        <button 
          onClick={() => setShowFolderModal(true)}
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
          title="Create Folder"
        >
          <i className="ti ti-folder-plus text-2xl"></i>
        </button>
      </div>

      {/* Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-fast">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-sm rounded-xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">New Folder</h3>
            <form onSubmit={handleCreateFolder}>
              <input 
                autoFocus
                type="text" 
                placeholder="Folder Name"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 mb-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowFolderModal(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Modal */}
      {showFileModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-fast">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-sm rounded-xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add Resource</h3>
            <form onSubmit={handleCreateFile}>
              <div className="flex space-x-2 mb-4">
                <button 
                  type="button"
                  onClick={() => setNewFileType('link')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border ${newFileType === 'link' ? 'bg-primary text-white border-primary' : 'border-slate-300 dark:border-gray-700 text-slate-500'}`}
                >
                  Link / URL
                </button>
                <button 
                  type="button"
                  onClick={() => setNewFileType('snippet')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border ${newFileType === 'snippet' ? 'bg-primary text-white border-primary' : 'border-slate-300 dark:border-gray-700 text-slate-500'}`}
                >
                  Text Snippet
                </button>
              </div>

              <input 
                autoFocus
                type="text" 
                placeholder="Title (e.g., React Docs)"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 mb-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              
              {newFileType === 'link' ? (
                <input 
                  type="url" 
                  placeholder="https://example.com"
                  value={newFileContent}
                  onChange={e => setNewFileContent(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 mb-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <textarea 
                  rows={3}
                  placeholder="Paste code or notes here..."
                  value={newFileContent}
                  onChange={e => setNewFileContent(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-[#2C2C2C] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-2 mb-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                ></textarea>
              )}

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowFileModal(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

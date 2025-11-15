
import React, { useState, useContext } from 'react';
import type { Writing } from '../types';
import WritingModal from './WritingModal';
import { ArrowLeft, PlusCircle, Edit, Trash, Eye, EyeOff } from './Icons';
import { VaultContext, AuthContext } from '../App';

// --- Reusable Confirmation Modal ---
const ConfirmationModal: React.FC<{ onConfirm: () => void; onCancel: () => void; message: string; }> = ({ onConfirm, onCancel, message }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-sm animate-scale-in">
            <p className="text-center text-lg mb-6">{message}</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">Cancel</button>
                <button onClick={onConfirm} className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition-colors">Confirm</button>
            </div>
        </div>
    </div>
);

// --- Writing Form Modal ---
const WritingFormModal: React.FC<{
    onClose: () => void;
    onSave: (writing: Omit<Writing, 'id'>) => void;
    writing?: Writing | null;
}> = ({ onClose, onSave, writing }) => {
    const [title, setTitle] = useState(writing?.title || '');
    const [content, setContent] = useState(writing?.content || '');
    const [isPublic, setIsPublic] = useState(writing?.isPublic ?? true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, content, isPublic });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{writing ? 'Edit Writing' : 'Add Writing'}</h2>
                <form onSubmit={handleSubmit} className="flex-grow flex flex-col gap-4">
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content..." required className="w-full flex-grow px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
                    <div className="flex items-center justify-between">
                         <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            <span className="text-sm font-medium">{isPublic ? 'Public' : 'Private'}</span>
                        </label>
                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">Cancel</button>
                            <button type="submit" className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Writings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedWriting, setSelectedWriting] = useState<Writing | null>(null);
  const [editingWriting, setEditingWriting] = useState<Writing | null>(null);
  const [deletingWriting, setDeletingWriting] = useState<Writing | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const { isAdmin } = useContext(AuthContext);
  const { writings, addWriting, updateWriting, deleteWriting } = useContext(VaultContext)!;

  const visibleWritings = isAdmin ? writings : writings.filter(w => w.isPublic);

  const handleSaveNew = (writing: Omit<Writing, 'id'>) => addWriting(writing);
  const handleSaveUpdate = (writing: Omit<Writing, 'id'>) => {
    if (editingWriting) updateWriting({ ...editingWriting, ...writing });
  };
  
  const toggleVisibility = (writing: Writing) => {
    updateWriting({ ...writing, isPublic: !writing.isPublic });
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
        <button onClick={onBack} className="flex items-center gap-2 mb-8 text-indigo-400 hover:text-indigo-300 transition-colors duration-200 z-20">
            <ArrowLeft /> Back to Home
        </button>

      <div className="flex justify-between items-center mb-8">
        <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-200">My Writings</h2>
            <p className="text-indigo-300 mt-2">Select a title to read.</p>
        </div>
        {isAdmin && (
            <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors duration-200">
                <PlusCircle /> Add Writing
            </button>
        )}
      </div>
      
      {visibleWritings.length > 0 ? (
        <div className="flex flex-col gap-4">
            {visibleWritings.map((writing) => (
            <div key={writing.id} className="group w-full text-left p-5 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-indigo-400/50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-indigo-500 relative">
                <button onClick={() => setSelectedWriting(writing)} className="w-full h-full absolute inset-0 focus:outline-none" aria-label={`Read ${writing.title}`}></button>
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-xl text-gray-200">{writing.title}</h3>
                    {isAdmin && (
                        <div className="flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button onClick={() => toggleVisibility(writing)} title={writing.isPublic ? 'Make Private' : 'Make Public'} className="p-2 rounded-full hover:bg-white/20">{writing.isPublic ? <Eye /> : <EyeOff />}</button>
                            <button onClick={() => setEditingWriting(writing)} className="p-2 rounded-full hover:bg-white/20"><Edit /></button>
                            <button onClick={() => setDeletingWriting(writing)} className="p-2 rounded-full hover:bg-white/20"><Trash /></button>
                        </div>
                    )}
                </div>
            </div>
            ))}
        </div>
      ) : (
          <div className="text-center py-16 px-6 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-xl font-semibold text-gray-300">No Writings Here Yet</h3>
              <p className="text-gray-400 mt-2">{isAdmin ? "Click 'Add Writing' to share your thoughts." : "Come back later to read some amazing content!"}</p>
          </div>
      )}

      {selectedWriting && ( <WritingModal writing={selectedWriting} onClose={() => setSelectedWriting(null)} /> )}
      {isAdding && <WritingFormModal onClose={() => setIsAdding(false)} onSave={handleSaveNew} />}
      {editingWriting && <WritingFormModal onClose={() => setEditingWriting(null)} onSave={handleSaveUpdate} writing={editingWriting} />}
      {deletingWriting && <ConfirmationModal onConfirm={() => { deleteWriting(deletingWriting.id); setDeletingWriting(null); }} onCancel={() => setDeletingWriting(null)} message="Are you sure you want to delete this writing?"/>}
    </div>
  );
};

export default Writings;

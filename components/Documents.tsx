
import React, { useState, useContext } from 'react';
import type { DocumentItem } from '../types';
import PasswordModal from './PasswordModal';
import { VaultContext, AuthContext } from '../App';
import { ArrowLeft, Download, PlusCircle, Edit, Trash } from './Icons';

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

// --- Document Form Modal ---
const DocumentFormModal: React.FC<{
    onClose: () => void;
    onSave: (name: string, dataUrl: string) => void;
    document?: DocumentItem | null;
}> = ({ onClose, onSave, document }) => {
    const [name, setName] = useState(document?.name || '');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            if (!name) setName(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            setError('Document name is required.');
            return;
        }
        if (!document && !file) {
            setError('A file must be selected for new documents.');
            return;
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    onSave(name, event.target.result as string);
                    onClose();
                } else {
                    setError('Failed to read the file.');
                }
            };
            reader.onerror = () => setError('Error reading file.');
            reader.readAsDataURL(file);
        } else if (document) {
            onSave(name, document.dataUrl); // Save with new name, old data
            onClose();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-lg animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{document ? 'Edit Document' : 'Add Document'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="doc-name" className="block text-sm font-medium text-gray-300 mb-2">Document Name</label>
                        <input id="doc-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Web Development Certificate" className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="doc-file" className="block text-sm font-medium text-gray-300 mb-2">File</label>
                        <input id="doc-file" type="file" onChange={handleFileChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"/>
                        {document && <p className="text-xs text-gray-400 mt-1">Leave blank to keep the existing file.</p>}
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Document Card ---
const DocumentCard: React.FC<{ item: DocumentItem }> = ({ item }) => {
    const { isAdmin } = useContext(AuthContext);
    const { updateDocument, deleteDocument } = useContext(VaultContext)!;
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSave = (name: string, dataUrl: string) => {
        updateDocument({ ...item, name, dataUrl });
    };

    const handleDelete = () => {
        deleteDocument(item.id);
        setShowDeleteConfirm(false);
    };
    
    return (
        <>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 transform transition-all duration-300 hover:scale-105 hover:bg-white/10 group">
                <h3 className="font-semibold text-lg text-gray-200 pr-16">{item.name}</h3>
                <div className="flex items-center justify-between mt-4">
                    <a href={item.dataUrl} download={item.name} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500">
                        <Download />
                        Download
                    </a>
                    {isAdmin && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-white/20"><Edit /></button>
                            <button onClick={() => setShowDeleteConfirm(true)} className="p-2 rounded-full hover:bg-white/20"><Trash /></button>
                        </div>
                    )}
                </div>
            </div>
            {isEditing && <DocumentFormModal onClose={() => setIsEditing(false)} onSave={handleSave} document={item} />}
            {showDeleteConfirm && <ConfirmationModal onConfirm={handleDelete} onCancel={() => setShowDeleteConfirm(false)} message="Are you sure you want to delete this document?" />}
        </>
    );
};

const Documents: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { isAdmin, login } = useContext(AuthContext);
    const { documents, addDocument } = useContext(VaultContext)!;
    const [isAdding, setIsAdding] = useState(false);

    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
        login();
    };
    
    const handleSaveNew = (name: string, dataUrl: string) => {
        addDocument({ name, dataUrl });
    };

    if (!isAuthenticated) {
        return <PasswordModal onSuccess={handleAuthSuccess} onBack={onBack} />;
    }

    return (
        <div className="w-full animate-fade-in-up">
            <button onClick={onBack} className="flex items-center gap-2 mb-8 text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                <ArrowLeft /> Back to Home
            </button>

            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold border-l-4 border-indigo-500 pl-4">Documents</h2>
                    {isAdmin && (
                        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors duration-200">
                            <PlusCircle /> Add Document
                        </button>
                    )}
                </div>
                {documents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((item) => <DocumentCard key={item.id} item={item} />)}
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="text-xl font-semibold text-gray-300">Your Document Vault is Empty</h3>
                        <p className="text-gray-400 mt-2">{isAdmin ? "Click 'Add Document' to upload your first file." : "No documents have been uploaded yet."}</p>
                    </div>
                )}
            </section>
            {isAdding && <DocumentFormModal onClose={() => setIsAdding(false)} onSave={handleSaveNew} />}
        </div>
    );
};

export default Documents;

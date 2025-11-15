
import React, { useEffect } from 'react';
import type { Writing } from '../types';
import { X } from './Icons';

interface WritingModalProps {
  writing: Writing;
  onClose: () => void;
}

const WritingModal: React.FC<WritingModalProps> = ({ writing, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
           window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close writing"
        >
          <X />
        </button>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-4 pr-8">
          {writing.title}
        </h2>
        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {writing.content}
        </p>
      </div>
    </div>
  );
};

export default WritingModal;
   
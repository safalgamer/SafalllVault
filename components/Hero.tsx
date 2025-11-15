import React from 'react';
import { Page } from '../types';
import { FileText, Feather } from './Icons';

interface HeroProps {
  onNavigate: (page: Page) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in-up">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-purple-700 via-blue-600 to-transparent rounded-full blur-3xl opacity-20 -z-10"></div>
      
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-500">
        Safalll
      </h1>
      <p className="mt-2 text-xl md:text-2xl text-indigo-300 font-light tracking-wide">
        Personal Vault & Writings
      </p>
      
      <div className="mt-12 flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => onNavigate(Page.DOCUMENTS)}
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gray-800/80 rounded-xl backdrop-blur-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 hover:border-indigo-400/50 hover:shadow-[0_0_20px_theme(colors.indigo.500)]"
        >
          <span className="relative flex items-center gap-3">
            <FileText />
            Documents
          </span>
        </button>
        <button
          onClick={() => onNavigate(Page.WRITINGS)}
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gray-800/80 rounded-xl backdrop-blur-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 hover:border-purple-400/50 hover:shadow-[0_0_20px_theme(colors.purple.500)]"
        >
          <span className="relative flex items-center gap-3">
            <Feather />
            Writings
          </span>
        </button>
      </div>
    </div>
  );
};

export default Hero;
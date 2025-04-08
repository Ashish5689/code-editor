'use client';

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

const Header = ({ theme, toggleTheme }: HeaderProps) => {
  return (
    <header className="w-full bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Code Surfer
          </div>
          <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">Beta</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label={theme === 'vs-dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'vs-dark' ? (
              <SunIcon className="h-5 w-5 text-yellow-300" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm hover:text-blue-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;

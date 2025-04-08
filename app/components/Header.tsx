'use client';

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, CodeBracketIcon, BeakerIcon, CogIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
  onLogoClick?: () => void;
  showThemeToggle?: boolean;
}

const Header = ({ theme, toggleTheme, onLogoClick, showThemeToggle = true }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-opacity-80" style={{ background: 'var(--header-bg)' }}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Link 
            href="/"
            className="flex items-center cursor-pointer" 
            onClick={onLogoClick}
            role="button"
            tabIndex={0}
            aria-label="Go to home page"
          >
            <CodeBracketIcon className="h-6 w-6 text-blue-500 mr-2" />
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              CodeSurfer
            </div>
          </Link>
          <span className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 px-2 py-1 rounded-full text-white">Beta</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm hover:text-blue-400 transition-colors flex items-center">
            <CodeBracketIcon className="h-4 w-4 mr-1" />
            Code
          </Link>
          <Link href="/frontend" className="text-sm hover:text-blue-400 transition-colors flex items-center">
            <BeakerIcon className="h-4 w-4 mr-1" />
            Frontend
          </Link>
          <a href="#" className="text-sm hover:text-blue-400 transition-colors flex items-center">
            <CogIcon className="h-4 w-4 mr-1" />
            Settings
          </a>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm hover:text-blue-400 transition-colors"
          >
            GitHub
          </a>
        </nav>
        
        <div className="flex items-center space-x-4">
          {showThemeToggle && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
              aria-label={theme === 'vs-dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'vs-dark' ? (
                <SunIcon className="h-5 w-5 text-yellow-300" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-300" />
              )}
            </button>
          )}
          
          <button className="hidden sm:block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-all">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

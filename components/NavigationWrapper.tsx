'use client';

import { useState, useEffect } from 'react';
import Navigation from './Navigation';

export default function NavigationWrapper() {
  const [theme, setTheme] = useState('vs-dark');

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('editorTheme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'vs-dark' ? 'vs-light' : 'vs-dark';
    setTheme(newTheme);
    localStorage.setItem('editorTheme', newTheme);
  };

  return (
    <Navigation theme={theme} toggleTheme={toggleTheme} />
  );
}

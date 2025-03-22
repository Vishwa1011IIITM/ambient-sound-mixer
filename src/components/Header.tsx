"use client"

import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

export default function Header() {
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);

  return (
    <header className="py-4 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Ambient Sound Mixer
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setPresetMenuOpen(!presetMenuOpen)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
          >
            Presets
          </button>
          
          {presetMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
              <button className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                Rainy Cafe
              </button>
              <button className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                Forest Morning
              </button>
              <button className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                Cozy Fireplace
              </button>
              <button className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                Ocean Waves
              </button>
            </div>
          )}
        </div>
        
        <ThemeToggle />
      </div>
    </header>
  );
}
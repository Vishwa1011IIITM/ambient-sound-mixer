"use client";

import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  presets: string[];
  onPresetSelect: (name: string) => void;
}

export default function Header({ presets, onPresetSelect }: HeaderProps) {
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);

  return (
    <header className="py-4 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Ambient Sound Mixer
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setPresetMenuOpen(!presetMenuOpen)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Presets
          </button>
          
          {presetMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    onPresetSelect(preset);
                    setPresetMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  {preset}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <ThemeToggle />
      </div>
    </header>
  );
}
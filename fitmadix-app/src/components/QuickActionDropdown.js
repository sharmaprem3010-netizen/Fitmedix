'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function QuickActionDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleActionSelect = (actionType) => {
    setIsOpen(false);
    console.log(`Action selected: ${actionType}`);
    // Placeholder: You can trigger modals or route navigation here later
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        <span>Log Health</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
          <div className="py-1">
            <button
              onClick={() => handleActionSelect('Log Meal')}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 text-left"
            >
              <span className="text-xl mr-3">🍎</span>
              <span className="font-medium">Log Meal</span>
            </button>
            
            <button
              onClick={() => handleActionSelect('Add Workout')}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-150 text-left"
            >
              <span className="text-xl mr-3">🏋️</span>
              <span className="font-medium">Add Workout</span>
            </button>

            <button
              onClick={() => handleActionSelect('Log Medication')}
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-150 text-left"
            >
              <span className="text-xl mr-3">💊</span>
              <span className="font-medium">Log Medication</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

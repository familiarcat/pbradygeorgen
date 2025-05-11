'use client';

import React from 'react';
import { useAdmin } from '@/contexts/AdminContext';

/**
 * AdminToggleButton Component
 * 
 * A toggle switch for enabling/disabling admin mode.
 * This component follows the Salinger philosophy of simplicity and authenticity.
 */
const AdminToggleButton: React.FC = () => {
  const { isAdminMode, toggleAdminMode } = useAdmin();
  
  return (
    <label className="inline-flex items-center cursor-pointer">
      <span className="mr-3 text-sm font-medium">User Mode</span>
      <div className="relative">
        <input 
          type="checkbox" 
          checked={isAdminMode} 
          onChange={toggleAdminMode}
          className="sr-only peer" 
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </div>
      <span className="ml-3 text-sm font-medium">Admin Mode</span>
    </label>
  );
};

export default AdminToggleButton;

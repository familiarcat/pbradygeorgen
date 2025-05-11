'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAdmin } from '@/contexts/AdminContext';
import { useSalingerTheme } from '@/components/SalingerThemeProvider';

// Dynamically import the EnvironmentTester component to avoid SSR issues
const EnvironmentTester = dynamic(() => import('@/components/EnvironmentTester'), {
  ssr: false,
  loading: () => <p>Loading environment tester...</p>
});

/**
 * EnvironmentTesterWrapper Component
 *
 * This is a client component wrapper for the EnvironmentTester component.
 * It handles the toggle functionality and dynamic loading.
 */
export default function EnvironmentTesterWrapper() {
  const [isVisible, setIsVisible] = useState(false);
  const { isAdminMode } = useAdmin();
  const salingerTheme = useSalingerTheme();

  // Only render if admin mode is enabled
  if (!isAdminMode) {
    return null;
  }

  // Get colors from theme
  const backgroundColor = salingerTheme.accentColor || '#4caf50';
  const textColor = '#ffffff';

  return (
    <>
      {/* Environment Tester */}
      {isVisible && (
        <div style={{ padding: '2rem' }}>
          <EnvironmentTester />
        </div>
      )}

      {/* Toggle button for Environment Tester */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 15px',
          backgroundColor: backgroundColor,
          color: textColor,
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        {isVisible ? 'Hide' : 'Test'} Environment
      </button>
    </>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import AdminToggle from './AdminToggle';
import { useAdmin } from '@/contexts/AdminContext';
import { useSalingerTheme } from '@/components/SalingerThemeProvider';
import { DanteLogger } from '@/utils/DanteLogger';

/**
 * AdminControls Component
 *
 * This component displays the admin toggle and other admin-only controls.
 * It follows the Salinger philosophy of simplicity and authenticity.
 */
const AdminControls: React.FC = () => {
  const { isAdminMode } = useAdmin();
  const salingerTheme = useSalingerTheme();

  // Handle regenerate click
  const handleRegenerate = () => {
    DanteLogger.info.system('Regenerate clicked');
    // Force a refresh of the page
    window.location.reload();
  };

  // Styles for the admin controls container
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: isAdminMode ? '40px' : '0', // Increased height for better visibility
    backgroundColor: isAdminMode ? (salingerTheme.accentColor || '#4caf50') + '55' : 'transparent', // More opacity for better visibility
    borderBottom: isAdminMode ? `2px solid ${salingerTheme.accentColor || '#4caf50'}` : 'none',
    zIndex: 1000,
    transition: 'height 0.3s ease, background-color 0.3s ease',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: isAdminMode ? '0 15px' : '0',
    boxShadow: isAdminMode ? '0 2px 4px rgba(0, 0, 0, 0.15)' : 'none', // Enhanced shadow for better visibility
  };

  // Styles for the admin controls buttons
  const buttonStyle: React.CSSProperties = {
    backgroundColor: salingerTheme.accentColor || '#4caf50',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 10px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginRight: '12px',
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
  };

  // Styles for the admin controls label
  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: salingerTheme.textColor || '#333333',
    marginRight: '15px',
    textShadow: '0 1px 1px rgba(255, 255, 255, 0.5)',
  };

  return (
    <>
      {/* Always show the admin toggle */}
      <AdminToggle />

      {/* Admin controls bar */}
      <div style={containerStyle}>
        <span style={labelStyle}>Admin Controls:</span>

        {/* Regenerate button */}
        <button
          style={buttonStyle}
          onClick={handleRegenerate}
          title="Regenerate the page content"
        >
          Regenerate
        </button>

        {/* Color Theme Editor button */}
        <Link href="/color-theme">
          <button
            style={{
              ...buttonStyle,
              backgroundColor: '#2196f3',
            }}
            title="Edit Color Theme"
            onClick={() => DanteLogger.info.system('Color Theme Editor clicked')}
          >
            Color Theme
          </button>
        </Link>

        {/* Content Status button */}
        <Link href="/content-status">
          <button
            style={{
              ...buttonStyle,
              backgroundColor: '#ff9800',
            }}
            title="View Content Status"
            onClick={() => DanteLogger.info.system('Content Status clicked')}
          >
            Content Status
          </button>
        </Link>
      </div>
    </>
  );
};

export default AdminControls;

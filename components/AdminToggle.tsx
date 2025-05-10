'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useSalingerTheme } from '@/components/SalingerThemeProvider';

/**
 * AdminToggle Component
 *
 * A toggle switch for enabling/disabling admin mode.
 * This component follows the Salinger philosophy of simplicity and authenticity.
 */
const AdminToggle: React.FC = () => {
  const { isAdminMode, toggleAdminMode } = useAdmin();
  const salingerTheme = useSalingerTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Determine colors based on theme and state
  const backgroundColor = isAdminMode
    ? salingerTheme.accentColor || '#4caf50'
    : '#ccc';

  const toggleColor = isAdminMode
    ? salingerTheme.backgroundColor || '#ffffff'
    : '#ffffff';

  const textColor = isAdminMode
    ? salingerTheme.textColor || '#333333'
    : '#666666';

  // Styles for the toggle container
  const toggleContainerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '45px', // Increased top spacing to avoid overlapping with other elements
    right: '15px',
    zIndex: 1001,
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '6px',
    backgroundColor: isHovered
      ? isAdminMode
        ? 'rgba(76, 175, 80, 0.2)'
        : 'rgba(0, 0, 0, 0.15)'
      : isAdminMode
        ? 'rgba(76, 175, 80, 0.1)'
        : 'rgba(0, 0, 0, 0.08)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    userSelect: 'none',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
    border: isAdminMode ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
  };

  // Styles for the toggle switch
  const toggleSwitchStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: '40px',
    height: '20px',
    marginLeft: '8px',
  };

  // Styles for the toggle slider
  const toggleSliderStyle: React.CSSProperties = {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor,
    borderRadius: '20px',
    transition: 'background-color 0.2s ease',
  };

  // Styles for the toggle knob
  const toggleKnobStyle: React.CSSProperties = {
    position: 'absolute',
    content: '""',
    height: '16px',
    width: '16px',
    left: isAdminMode ? '22px' : '2px',
    bottom: '2px',
    backgroundColor: toggleColor,
    borderRadius: '50%',
    transition: 'left 0.2s ease',
  };

  // Styles for the label
  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 'bold',
    color: textColor,
    marginRight: '8px',
    letterSpacing: '0.5px',
  };

  return (
    <div
      className="admin-toggle"
      style={toggleContainerStyle}
      onClick={() => {
        console.log('AdminToggle clicked, current state:', isAdminMode);
        toggleAdminMode();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={isAdminMode ? "Disable Admin Mode" : "Enable Admin Mode"}
    >
      <span style={labelStyle}>
        {isAdminMode ? "Admin" : "User"}
      </span>
      <div style={toggleSwitchStyle}>
        <div style={toggleSliderStyle}>
          <div style={toggleKnobStyle} />
        </div>
      </div>
    </div>
  );
};

export default AdminToggle;

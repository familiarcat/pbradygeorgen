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
    top: '5px',
    right: '10px',
    zIndex: 1001,
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer',
    userSelect: 'none',
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
    fontSize: '12px',
    fontWeight: 'bold',
    color: textColor,
    marginRight: '4px',
  };
  
  return (
    <div 
      className="admin-toggle"
      style={toggleContainerStyle}
      onClick={toggleAdminMode}
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

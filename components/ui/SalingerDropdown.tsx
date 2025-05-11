'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePlatformInfo } from '@/utils/PlatformDetector';
import styles from '@/styles/SalingerUI.module.css';

export interface DropdownOption {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent | React.TouchEvent) => void;
  disabled?: boolean;
}

export interface DropdownGroup {
  id: string;
  options: DropdownOption[];
}

export interface SalingerDropdownProps {
  trigger: React.ReactNode;
  options?: DropdownOption[];
  groups?: DropdownGroup[];
  position?: 'left' | 'right' | 'center';
  width?: number | string;
  maxHeight?: number | string;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

/**
 * SalingerDropdown - A cross-platform dropdown component following the Salinger philosophy
 * 
 * Features:
 * - Works consistently across desktop, tablet, and mobile devices
 * - Special handling for iOS and Android touch events
 * - Proper positioning based on available space
 * - Follows the Salinger philosophy of simplified interfaces
 * - Supports grouped options with icons
 */
export const SalingerDropdown: React.FC<SalingerDropdownProps> = ({
  trigger,
  options = [],
  groups = [],
  position = 'left',
  width = 'auto',
  maxHeight = '80vh',
  className = '',
  triggerClassName = '',
  menuClassName = '',
  onOpen,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Detect platform to apply platform-specific optimizations
  const { isMobile, isTablet, isIOS, isAndroid } = usePlatformInfo();
  
  // Toggle the dropdown
  const toggleDropdown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = !isOpen;
    setIsOpen(newState);
    
    if (newState && onOpen) {
      onOpen();
    } else if (!newState && onClose) {
      onClose();
    }
    
    // Log for debugging
    console.log(`Dropdown ${newState ? 'opened' : 'closed'}`);
  };
  
  // Handle option click
  const handleOptionClick = (e: React.MouseEvent | React.TouchEvent, option: DropdownOption) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (option.disabled) return;
    
    if (option.onClick) {
      option.onClick(e);
    }
    
    setIsOpen(false);
    if (onClose) onClose();
  };
  
  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Position the dropdown based on available space
  useEffect(() => {
    if (isOpen && menuRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Check if dropdown would go off-screen to the right
      if (position === 'left' && rect.left + menuRect.width > viewportWidth) {
        menuRef.current.style.left = 'auto';
        menuRef.current.style.right = '0';
      }
      
      // Check if dropdown would go off-screen to the left
      if (position === 'right' && rect.right - menuRect.width < 0) {
        menuRef.current.style.right = 'auto';
        menuRef.current.style.left = '0';
      }
      
      // Check if dropdown would go off-screen at the bottom
      if (rect.bottom + menuRect.height > viewportHeight) {
        menuRef.current.style.top = 'auto';
        menuRef.current.style.bottom = '100%';
        menuRef.current.style.marginTop = '0';
        menuRef.current.style.marginBottom = '0.5rem';
      }
    }
  }, [isOpen, position]);
  
  // Determine the appropriate class names based on props and platform
  const containerClasses = [
    styles.dropdown,
    isMobile ? styles.dropdownMobile : '',
    isTablet ? styles.dropdownTablet : '',
    isIOS ? styles.dropdownIOS : '',
    isAndroid ? styles.dropdownAndroid : '',
    className
  ].filter(Boolean).join(' ');
  
  const triggerClasses = [
    styles.dropdownTrigger,
    isMobile ? styles.dropdownTriggerMobile : '',
    isTablet ? styles.dropdownTriggerTablet : '',
    triggerClassName
  ].filter(Boolean).join(' ');
  
  const menuClasses = [
    styles.dropdownMenu,
    styles[`dropdownMenu-${position}`],
    isOpen ? styles.dropdownMenuVisible : '',
    isMobile ? styles.dropdownMenuMobile : '',
    isTablet ? styles.dropdownMenuTablet : '',
    isIOS ? styles.dropdownMenuIOS : '',
    isAndroid ? styles.dropdownMenuAndroid : '',
    menuClassName
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={containerRef} className={containerClasses}>
      <div 
        className={triggerClasses}
        onClick={toggleDropdown}
        onTouchStart={(e) => {
          // For iOS devices, ensure touch events work properly
          if (isIOS) e.stopPropagation();
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>
      
      <div 
        ref={menuRef}
        className={menuClasses}
        style={{ 
          width: typeof width === 'number' ? `${width}px` : width,
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
        }}
      >
        {/* Render options directly if no groups */}
        {options.length > 0 && (
          <div className={styles.dropdownGroup}>
            {options.map((option) => (
              <button
                key={option.id}
                className={`${styles.dropdownOption} ${option.disabled ? styles.dropdownOptionDisabled : ''}`}
                onClick={(e) => handleOptionClick(e, option)}
                onTouchStart={(e) => {
                  // For iOS devices, ensure touch events work properly
                  if (isIOS) e.stopPropagation();
                }}
                disabled={option.disabled}
                aria-disabled={option.disabled}
              >
                {option.icon && <span className={styles.dropdownOptionIcon}>{option.icon}</span>}
                <span className={styles.dropdownOptionLabel}>{option.label}</span>
              </button>
            ))}
          </div>
        )}
        
        {/* Render grouped options */}
        {groups.length > 0 && groups.map((group) => (
          <div key={group.id} className={styles.dropdownGroup}>
            {group.options.map((option) => (
              <button
                key={option.id}
                className={`${styles.dropdownOption} ${option.disabled ? styles.dropdownOptionDisabled : ''}`}
                onClick={(e) => handleOptionClick(e, option)}
                onTouchStart={(e) => {
                  // For iOS devices, ensure touch events work properly
                  if (isIOS) e.stopPropagation();
                }}
                disabled={option.disabled}
                aria-disabled={option.disabled}
              >
                {option.icon && <span className={styles.dropdownOptionIcon}>{option.icon}</span>}
                <span className={styles.dropdownOptionLabel}>{option.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

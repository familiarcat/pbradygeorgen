'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { usePlatformInfo } from '@/utils/PlatformDetector';
import styles from '@/styles/SalingerUI.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'icon';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface SalingerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

/**
 * SalingerButton - A cross-platform button component following the Salinger philosophy
 * 
 * Features:
 * - Adapts to different platforms (mobile, tablet, desktop)
 * - Handles touch events properly on iOS and Android
 * - Provides appropriate feedback based on the input method (touch vs mouse)
 * - Maintains consistent styling across platforms
 * - Follows the Salinger philosophy of simplified interfaces
 */
export const SalingerButton = forwardRef<HTMLButtonElement, SalingerButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      icon,
      iconPosition = 'left',
      fullWidth = false,
      isLoading = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Detect platform to apply platform-specific optimizations
    const { isMobile, isTablet, isIOS, isAndroid } = usePlatformInfo();
    
    // Determine the appropriate class names based on props and platform
    const buttonClasses = [
      styles.button,
      styles[`button-${variant}`],
      styles[`button-${size}`],
      fullWidth ? styles.buttonFullWidth : '',
      isLoading ? styles.buttonLoading : '',
      isMobile ? styles.buttonMobile : '',
      isTablet ? styles.buttonTablet : '',
      isIOS ? styles.buttonIOS : '',
      isAndroid ? styles.buttonAndroid : '',
      className
    ].filter(Boolean).join(' ');
    
    // Handle touch events differently on mobile devices
    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
      // Prevent default behavior on iOS to avoid delays
      if (isIOS) {
        e.currentTarget.style.opacity = '0.7';
      }
      
      // Call the original onTouchStart if provided
      if (props.onTouchStart) {
        props.onTouchStart(e);
      }
    };
    
    const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
      // Reset styles on iOS
      if (isIOS) {
        e.currentTarget.style.opacity = '1';
      }
      
      // Call the original onTouchEnd if provided
      if (props.onTouchEnd) {
        props.onTouchEnd(e);
      }
    };
    
    return (
      <button
        ref={ref}
        className={buttonClasses}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {isLoading ? (
          <span className={styles.buttonLoadingSpinner} aria-hidden="true" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className={styles.buttonIconLeft}>{icon}</span>
            )}
            {children && <span className={styles.buttonText}>{children}</span>}
            {icon && iconPosition === 'right' && (
              <span className={styles.buttonIconRight}>{icon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

SalingerButton.displayName = 'SalingerButton';

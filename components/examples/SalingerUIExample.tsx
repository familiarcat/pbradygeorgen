'use client';

import React from 'react';
import { SalingerButton } from '@/components/ui/SalingerButton';
import { SalingerDropdown } from '@/components/ui/SalingerDropdown';
import { usePlatformInfo } from '@/utils/PlatformDetector';
import styles from '@/styles/SalingerUIExample.module.css';

/**
 * SalingerUIExample - A component showcasing the Salinger UI components
 * 
 * This component demonstrates how to use the Salinger UI components
 * across different platforms while maintaining the Salinger philosophy.
 */
export const SalingerUIExample: React.FC = () => {
  const platformInfo = usePlatformInfo();
  
  // Example dropdown options
  const downloadOptions = [
    {
      id: 'pdf',
      label: 'PDF Format',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <path d="M12 18v-6"></path>
          <path d="M8 15h8"></path>
        </svg>
      ),
      onClick: () => console.log('PDF download clicked')
    },
    {
      id: 'markdown',
      label: 'Markdown Format',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      onClick: () => console.log('Markdown download clicked')
    },
    {
      id: 'text',
      label: 'Text Format',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      onClick: () => console.log('Text download clicked')
    }
  ];
  
  // Example dropdown groups
  const previewGroups = [
    {
      id: 'preview-group',
      options: [
        {
          id: 'pdf-preview',
          label: 'PDF Preview',
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          ),
          onClick: () => console.log('PDF preview clicked')
        },
        {
          id: 'markdown-preview',
          label: 'Markdown Preview',
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          ),
          onClick: () => console.log('Markdown preview clicked')
        }
      ]
    },
    {
      id: 'download-group',
      options: downloadOptions
    }
  ];
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Salinger UI Components</h2>
      
      <div className={styles.platformInfo}>
        <h3>Current Platform:</h3>
        <ul>
          <li>Platform: {platformInfo.platform}</li>
          <li>OS: {platformInfo.os}</li>
          <li>Browser: {platformInfo.browser}</li>
          <li>Touch Device: {platformInfo.isTouchDevice ? 'Yes' : 'No'}</li>
        </ul>
      </div>
      
      <div className={styles.section}>
        <h3>Buttons</h3>
        <div className={styles.buttonGrid}>
          <SalingerButton variant="primary">Primary Button</SalingerButton>
          <SalingerButton variant="secondary">Secondary Button</SalingerButton>
          <SalingerButton variant="tertiary">Tertiary Button</SalingerButton>
          <SalingerButton 
            variant="primary" 
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            }
          >
            With Icon
          </SalingerButton>
          <SalingerButton 
            variant="icon"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            }
            aria-label="Info"
          />
          <SalingerButton variant="primary" isLoading>Loading</SalingerButton>
        </div>
      </div>
      
      <div className={styles.section}>
        <h3>Dropdowns</h3>
        <div className={styles.dropdownGrid}>
          <SalingerDropdown
            trigger={
              <SalingerButton 
                variant="primary"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                }
              >
                Download
              </SalingerButton>
            }
            options={downloadOptions}
          />
          
          <SalingerDropdown
            trigger={
              <SalingerButton 
                variant="secondary"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                }
              >
                Preview
              </SalingerButton>
            }
            groups={previewGroups}
            position="right"
          />
        </div>
      </div>
    </div>
  );
};

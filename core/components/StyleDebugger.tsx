'use client';

import React, { useEffect, useState } from 'react';

interface CssVariable {
  name: string;
  value: string;
  category: string;
}

/**
 * StyleDebugger component
 *
 * This component displays all CSS variables currently set on the :root element,
 * grouped by category. It's useful for debugging styling issues and ensuring
 * that all variables are being set correctly.
 */
const StyleDebugger: React.FC = () => {
  const [cssVariables, setCssVariables] = useState<CssVariable[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [stylesLoaded, setStylesLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Function to load CSS variables
    const loadCssVariables = () => {
    if (typeof window !== 'undefined') {
      // Get all CSS variables from the root element
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const variables: CssVariable[] = [];

      // Log the loading status
      const pdfStylesLoaded = document.body.classList.contains('pdf-styles-loaded');
      const themeLoaded = document.body.classList.contains('theme-loaded');
      const dataAttributeSet = document.documentElement.getAttribute('data-pdf-styles-loaded') === 'true';
      const directStylesInjected = !!document.getElementById('direct-injected-pdf-styles');

      console.log('StyleDebugger: Checking for PDF styles loaded class:', pdfStylesLoaded);
      console.log('StyleDebugger: Checking for theme loaded class:', themeLoaded);
      console.log('StyleDebugger: Checking for data-pdf-styles-loaded attribute:', dataAttributeSet);
      console.log('StyleDebugger: Checking for direct-injected-pdf-styles element:', directStylesInjected);

      // Update the styles loaded state
      setStylesLoaded(pdfStylesLoaded || themeLoaded || dataAttributeSet || directStylesInjected);

      // Extract all CSS variables
      for (let i = 0; i < computedStyle.length; i++) {
        const property = computedStyle[i];
        if (property.startsWith('--')) {
          const value = computedStyle.getPropertyValue(property).trim();

          // Determine the category based on the variable name
          let category = 'Other';
          if (property.startsWith('--pdf-')) {
            category = 'PDF';
          } else if (property.startsWith('--dynamic-')) {
            category = 'Dynamic';
          } else if (property.startsWith('--font-')) {
            category = 'Font';
          } else if (property.startsWith('--bg-') || property.startsWith('--background-')) {
            category = 'Background';
          } else if (property.startsWith('--text-')) {
            category = 'Text';
          } else if (property.startsWith('--border-')) {
            category = 'Border';
          } else if (property.startsWith('--cta-')) {
            category = 'CTA';
          } else if (property.startsWith('--state-')) {
            category = 'State';
          }

          variables.push({
            name: property,
            value,
            category
          });
        }
      }

      // Sort variables by category and name
      variables.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
      });

      // Log the number of variables found
      console.log(`StyleDebugger: Found ${variables.length} CSS variables`);

      // Log some key variables for debugging
      const keyVariables = [
        '--pdf-heading-font',
        '--font-heading',
        '--dynamic-heading-font',
        '--pdf-body-font',
        '--font-body',
        '--dynamic-primary-font'
      ];

      console.log('StyleDebugger: Key variables:');
      keyVariables.forEach(varName => {
        console.log(`  ${varName}: ${computedStyle.getPropertyValue(varName).trim() || '(not set)'}`);
      });

      setCssVariables(variables);
    }
    };

    // Load CSS variables initially
    loadCssVariables();

    // Set up event listener for style changes
    const handleStylesLoaded = () => {
      console.log('StyleDebugger: Detected pdf-styles-loaded event, refreshing variables');
      loadCssVariables();
    };

    document.addEventListener('pdf-styles-loaded', handleStylesLoaded);

    // Clean up event listener
    return () => {
      document.removeEventListener('pdf-styles-loaded', handleStylesLoaded);
    };
  }, [refreshCount]);

  // Group variables by category
  const groupedVariables: Record<string, CssVariable[]> = {};
  cssVariables.forEach(variable => {
    if (filter && !variable.name.includes(filter) && !variable.value.includes(filter)) {
      return;
    }

    if (!groupedVariables[variable.category]) {
      groupedVariables[variable.category] = [];
    }
    groupedVariables[variable.category].push(variable);
  });

  // Function to render a color preview
  const renderColorPreview = (value: string) => {
    // Check if the value is a color
    const isColor = value.startsWith('#') ||
                   value.startsWith('rgb') ||
                   value.startsWith('hsl') ||
                   value.match(/^[a-z]+$/i); // Simple color names like 'red', 'blue', etc.

    if (isColor) {
      return (
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: value,
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginRight: '8px'
          }}
        />
      );
    }

    return null;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'var(--font-mono, monospace)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading, sans-serif)', margin: 0 }}>
          CSS Variables Debugger
        </h1>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: stylesLoaded ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
          padding: '8px 16px',
          borderRadius: '4px',
          border: `1px solid ${stylesLoaded ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)'}`
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: stylesLoaded ? 'var(--success, #28a745)' : 'var(--error, #dc3545)'
          }}></div>
          <span style={{
            fontFamily: 'var(--font-body, sans-serif)',
            fontSize: '14px',
            color: stylesLoaded ? 'var(--success, #28a745)' : 'var(--error, #dc3545)'
          }}>
            {stylesLoaded ? 'PDF Styles Loaded' : 'PDF Styles Not Loaded'}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Filter variables..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            width: '100%',
            maxWidth: '400px',
            border: '1px solid var(--border-color, #ccc)',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setRefreshCount(prev => prev + 1)}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--primary, #3a6ea5)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Refresh Variables
          </button>
          <button
            onClick={() => {
              // Force re-injection of styles
              const event = new Event('force-style-injection');
              document.dispatchEvent(event);
              // Refresh after a short delay
              setTimeout(() => setRefreshCount(prev => prev + 1), 500);
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--accent, #ff6700)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Force Style Injection
          </button>
        </div>
      </div>

      {Object.keys(groupedVariables).map(category => (
        <div key={category} style={{ marginBottom: '30px' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading, sans-serif)',
            borderBottom: '1px solid var(--border-color, #ccc)',
            paddingBottom: '8px',
            marginBottom: '16px'
          }}>
            {category} Variables ({groupedVariables[category].length})
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {groupedVariables[category].map(variable => (
              <div
                key={variable.name}
                style={{
                  padding: '10px',
                  border: '1px solid var(--border-color, #eee)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-secondary, #f9f9f9)',
                  fontSize: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  {renderColorPreview(variable.value)}
                  <span style={{ fontWeight: 'bold', wordBreak: 'break-all' }}>
                    {variable.name}
                  </span>
                </div>
                <div style={{
                  color: 'var(--text-secondary, #666)',
                  wordBreak: 'break-all'
                }}>
                  {variable.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(groupedVariables).length === 0 && (
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--bg-secondary, #f9f9f9)',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          No variables found matching "{filter}"
        </div>
      )}
    </div>
  );
};

export default StyleDebugger;

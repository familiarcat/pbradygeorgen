'use client';

import React, { useEffect, useState } from 'react';

export default function ClientSideVariables() {
  const [cssVars, setCssVars] = useState({
    primary: '',
    secondary: '',
    accent: '',
    background: '',
    text: '',
    textSecondary: '',
    border: '',
    ctaPrimary: '',
    ctaSecondary: '',
    hoverBg: '',
    activeBg: '',
    headingFont: '',
    bodyFont: '',
    monoFont: '',
    buttonFont: '',
  });

  useEffect(() => {
    // This code only runs in the browser
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    setCssVars({
      primary: computedStyle.getPropertyValue('--pdf-primary-color').trim(),
      secondary: computedStyle.getPropertyValue('--pdf-secondary-color').trim(),
      accent: computedStyle.getPropertyValue('--pdf-accent-color').trim(),
      background: computedStyle.getPropertyValue('--pdf-background-color').trim(),
      text: computedStyle.getPropertyValue('--pdf-text-color').trim(),
      textSecondary: computedStyle.getPropertyValue('--pdf-text-secondary').trim(),
      border: computedStyle.getPropertyValue('--pdf-border-color').trim(),
      ctaPrimary: computedStyle.getPropertyValue('--cta-primary-bg').trim(),
      ctaSecondary: computedStyle.getPropertyValue('--cta-secondary-bg').trim(),
      hoverBg: computedStyle.getPropertyValue('--hover-bg').trim(),
      activeBg: computedStyle.getPropertyValue('--active-bg').trim(),
      headingFont: computedStyle.getPropertyValue('--pdf-heading-font').trim(),
      bodyFont: computedStyle.getPropertyValue('--pdf-body-font').trim(),
      monoFont: computedStyle.getPropertyValue('--pdf-mono-font').trim(),
      buttonFont: computedStyle.getPropertyValue('--font-button').trim(),
    });
  }, []);

  return (
    <div className="mt-8 p-4 rounded" style={{ backgroundColor: 'var(--pdf-info-color, #17a2b8)', color: '#fff' }}>
      <h3 className="font-bold mb-2">Current CSS Variables</h3>
      <pre className="text-xs overflow-auto" style={{ maxHeight: '300px' }}>
{`
/* Color Variables */
--pdf-primary-color: ${cssVars.primary}
--pdf-secondary-color: ${cssVars.secondary}
--pdf-accent-color: ${cssVars.accent}
--pdf-background-color: ${cssVars.background}
--pdf-text-color: ${cssVars.text}
--pdf-text-secondary: ${cssVars.textSecondary}
--pdf-border-color: ${cssVars.border}

/* CTA Variables */
--cta-primary-bg: ${cssVars.ctaPrimary}
--cta-secondary-bg: ${cssVars.ctaSecondary}
--hover-bg: ${cssVars.hoverBg}
--active-bg: ${cssVars.activeBg}

/* Font Variables */
--pdf-heading-font: ${cssVars.headingFont}
--pdf-body-font: ${cssVars.bodyFont}
--pdf-mono-font: ${cssVars.monoFont}
--font-button: ${cssVars.buttonFont}
`}
      </pre>
    </div>
  );
}

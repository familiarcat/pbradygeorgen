// Debug script to log computed styles
console.log('=== DEBUG STYLES ===');

// Log the background color of html and body
const htmlBgColor = getComputedStyle(document.documentElement).backgroundColor;
const bodyBgColor = getComputedStyle(document.body).backgroundColor;

console.log('HTML background color:', htmlBgColor);
console.log('Body background color:', bodyBgColor);

// Log CSS variables
const cssVars = [
  '--pdf-background-color',
  '--pdf-primary-color',
  '--pdf-secondary-color',
  '--pdf-accent-color',
  '--pdf-text-color',
  '--pdf-border-color',
  '--header-bg',
  '--background-rgb',
  '--foreground-rgb'
];

console.log('CSS Variables:');
cssVars.forEach(variable => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable);
  console.log(`${variable}: ${value}`);
});

// Log the background color of key elements
const elements = [
  '.pdf-content-layout',
  '.salinger-theme',
  '.salingerHeader'
];

console.log('Element background colors:');
elements.forEach(selector => {
  const element = document.querySelector(selector);
  if (element) {
    const bgColor = getComputedStyle(element).backgroundColor;
    console.log(`${selector}: ${bgColor}`);
  } else {
    console.log(`${selector}: not found`);
  }
});

// Log the extracted color theme
fetch('/extracted/color_theme.json')
  .then(response => response.json())
  .then(data => {
    console.log('Extracted color theme:', data);
  })
  .catch(error => {
    console.error('Error fetching color theme:', error);
  });

console.log('=== END DEBUG STYLES ===');

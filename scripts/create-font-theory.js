const fs = require('fs');
const path = require('path');

// Create the extracted directory if it doesn't exist
const extractedDir = path.join(process.cwd(), 'public', 'extracted');
if (!fs.existsSync(extractedDir)) {
  fs.mkdirSync(extractedDir, { recursive: true });
}

// Create a default font theory
const fontTheory = {
  heading: 'Arial, sans-serif',
  body: 'Helvetica, Arial, sans-serif',
  mono: 'monospace',
  allFonts: ['Arial', 'Helvetica', 'Courier']
};

// Save the font theory to a JSON file
const fontTheoryPath = path.join(extractedDir, 'font_theory.json');
fs.writeFileSync(fontTheoryPath, JSON.stringify(fontTheory, null, 2));
console.log(`Font theory saved to: ${fontTheoryPath}`);

// Create a default color theory if it doesn't exist
const colorTheoryPath = path.join(extractedDir, 'color_theory.json');
if (!fs.existsSync(colorTheoryPath)) {
  const colorTheory = {
    primary: '#3a6ea5',
    secondary: '#004e98',
    accent: '#ff6700',
    background: '#f6f6f6',
    text: '#333333',
    textSecondary: '#666666',
    border: '#dddddd',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
    allColors: ['#3a6ea5', '#004e98', '#ff6700']
  };
  
  fs.writeFileSync(colorTheoryPath, JSON.stringify(colorTheory, null, 2));
  console.log(`Color theory saved to: ${colorTheoryPath}`);
} else {
  console.log(`Color theory already exists at: ${colorTheoryPath}`);
}

/**
 * This script cleans up the package.json file for AWS Amplify deployment
 */

const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Update the engines field
packageJson.engines = {
  "node": ">=14.0.0",
  "npm": ">=6.0.0"
};

// Update the overrides field
packageJson.overrides = {
  "pdfjs-dist": "^3.11.174"
};

// Add resolutions field for Yarn
packageJson.resolutions = {
  "pdfjs-dist": "^3.11.174"
};

// Add Amplify specific configuration
packageJson.amplify = {
  "framework": "next",
  "baseDirectory": ".next",
  "nodeVersion": "20",
  "packageManager": "npm"
};

// Write the updated package.json file
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('Updated package.json file for AWS Amplify deployment');

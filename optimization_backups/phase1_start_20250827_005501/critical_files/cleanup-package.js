/**
 * This script cleans up the package.json file to ensure compatibility with Node.js 14
 */

const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

// Update the engines field
packageJson.engines = {
  "node": ">=14.0.0",
  "npm": ">=6.0.0"
};

// Update the overrides field
packageJson.overrides = {
  "pdfjs-dist": "^3.11.174"
};

// Add or update the main field
packageJson.main = "server.js";

// Add or update the amplify field
packageJson.amplify = {
  "baseDirectory": "dist",
  "framework": "next",
  "nodeVersion": "14",
  "packageManager": "npm"
};

// Remove any problematic dependencies
const problematicDeps = [
  // Add any problematic dependencies here
];

for (const dep of problematicDeps) {
  if (packageJson.dependencies && packageJson.dependencies[dep]) {
    delete packageJson.dependencies[dep];
    console.log(`Removed problematic dependency: ${dep}`);
  }
  if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
    delete packageJson.devDependencies[dep];
    console.log(`Removed problematic dev dependency: ${dep}`);
  }
}

// Write the updated package.json file
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('Updated package.json file');

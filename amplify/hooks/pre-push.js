// pre-push.js - Custom hook that runs before amplify push
const fs = require('fs');
const path = require('path');

// Function to update app ID in a file
function updateAppId(filePath, oldAppId, newAppId) {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(oldAppId)) {
        content = content.replace(new RegExp(oldAppId, 'g'), newAppId);
        fs.writeFileSync(filePath, content);
        console.log(`Updated app ID in ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

// Main function
function main() {
  console.log('Running pre-push hook...');
  
  const oldAppId = 'd2gv0gd3awxys0';
  const newAppId = 'd3vvlp7umhc1qr';
  
  // Update app ID in all relevant files
  const filesToUpdate = [
    path.join(__dirname, '..', 'team-provider-info.json'),
    path.join(__dirname, '..', 'backend', 'amplify-meta.json'),
    path.join(__dirname, '..', '#current-cloud-backend', 'amplify-meta.json')
  ];
  
  filesToUpdate.forEach(file => updateAppId(file, oldAppId, newAppId));
  
  console.log('Pre-push hook completed successfully');
}

// Run the main function
main();

/**
 * Update Content Script
 * 
 * This script manually updates the analyzed content with a timestamp
 * to test if the application picks up the changes.
 */

const fs = require('fs');
const path = require('path');

// Read the current analyzed content
const analyzedPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.json');

if (!fs.existsSync(analyzedPath)) {
  console.error(`❌ Analyzed content file not found at ${analyzedPath}`);
  process.exit(1);
}

// Read the analyzed content
const analyzed = JSON.parse(fs.readFileSync(analyzedPath, 'utf8'));

// Create a backup
const backupPath = path.join(process.cwd(), 'public', 'extracted', 'resume_content_analyzed.backup.json');
fs.writeFileSync(backupPath, JSON.stringify(analyzed, null, 2));
console.log(`📄 Backup created at ${backupPath}`);

// Add a timestamp to verify updates
const timestamp = new Date().toISOString();
analyzed.structuredContent.summary = `Updated summary with timestamp: ${timestamp}`;

// Add a note to the name to make it obvious
analyzed.structuredContent.name = `${analyzed.structuredContent.name} (Updated: ${new Date().toLocaleTimeString()})`;

// Write the updated content
fs.writeFileSync(analyzedPath, JSON.stringify(analyzed, null, 2));

// Update the build info to reflect the change
const buildInfoPath = path.join(process.cwd(), 'public', 'extracted', 'build_info.json');

if (fs.existsSync(buildInfoPath)) {
  const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
  buildInfo.buildTimestamp = timestamp;
  buildInfo.manualUpdate = true;
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  console.log(`📄 Build info updated at ${buildInfoPath}`);
}

console.log(`✅ Content updated with timestamp: ${timestamp}`);
console.log('📄 Updated name:', analyzed.structuredContent.name);
console.log('📄 Updated summary:', analyzed.structuredContent.summary);

// Create a log entry
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logEntry = {
  timestamp,
  action: 'manual-content-update',
  details: {
    name: analyzed.structuredContent.name,
    summary: analyzed.structuredContent.summary
  }
};

fs.appendFileSync(
  path.join(logsDir, 'content-updates.log'),
  JSON.stringify(logEntry) + '\n'
);

console.log('📝 Log entry created');
console.log('✅ Done');

// Exit with success
process.exit(0);

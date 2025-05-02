/**
 * Simple script to copy extracted files to the standalone directory
 */

const fs = require('fs');
const path = require('path');

// Define source and destination directories for extracted files
const sourceExtractedDir = path.join(__dirname, 'public', 'extracted');
const destExtractedDir = path.join(__dirname, '.next', 'standalone', 'public', 'extracted');

// Define source and destination for default_resume.pdf
const sourceResumeFile = path.join(__dirname, 'public', 'default_resume.pdf');
const destResumeFile = path.join(__dirname, '.next', 'standalone', 'public', 'default_resume.pdf');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destExtractedDir)) {
  console.log(`Creating directory: ${destExtractedDir}`);
  fs.mkdirSync(destExtractedDir, { recursive: true });
}

// Copy default_resume.pdf
if (fs.existsSync(sourceResumeFile)) {
  console.log(`Copying default_resume.pdf to standalone directory`);
  fs.copyFileSync(sourceResumeFile, destResumeFile);
  console.log('default_resume.pdf copied successfully');
} else {
  console.error(`Source resume file does not exist: ${sourceResumeFile}`);
}

// Copy files from extracted directory to destination
if (fs.existsSync(sourceExtractedDir)) {
  console.log(`Copying files from ${sourceExtractedDir} to ${destExtractedDir}`);

  try {
    // List files in the source directory
    const files = fs.readdirSync(sourceExtractedDir);
    console.log(`Found ${files.length} files to copy`);

    // Copy each file
    files.forEach(file => {
      const sourcePath = path.join(sourceExtractedDir, file);
      const destPath = path.join(destExtractedDir, file);

      if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isFile()) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${file}`);
      }
    });

    console.log('All extracted files copied successfully');
  } catch (error) {
    console.error('Error copying files:', error);
  }
} else {
  console.error(`Source extracted directory does not exist: ${sourceExtractedDir}`);
}

/**
 * compare-build-outputs.js
 *
 * This script compares the local build output with the Amplify build output
 * to identify any differences that might cause issues in production.
 *
 * It follows Derrida's philosophy of difference analysis to identify
 * technical inconsistencies between the two build processes.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create a simple logger to avoid dependency issues
const DanteLogger = {
  info: {
    system: (message) => console.log(`ℹ️ [System] ${message}`),
  },
  success: {
    system: (message) => console.log(`✅ [System] ${message}`),
  },
  warning: {
    system: (message) => console.warn(`⚠️ [System] ${message}`),
  },
  error: {
    system: (message) => console.error(`❌ [System] ${message}`),
  },
  debug: {
    system: (message) => console.debug(`🔍 [System] ${message}`),
  },
};

// Define the paths to compare
const LOCAL_BUILD_PATH = path.join(process.cwd(), '.next/standalone');
const AMPLIFY_BUILD_PATH = path.join(process.cwd(), 'logs/local-build/standalone');

// Function to check if a path exists
function pathExists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch (err) {
    return false;
  }
}

// Function to get file stats
function getFileStats(filePath) {
  try {
    return fs.statSync(filePath);
  } catch (err) {
    return null;
  }
}

// Function to compare two files
function compareFiles(file1, file2) {
  try {
    const content1 = fs.readFileSync(file1, 'utf8');
    const content2 = fs.readFileSync(file2, 'utf8');

    if (content1 === content2) {
      return { identical: true };
    }

    // Count the number of different lines
    const lines1 = content1.split('\n');
    const lines2 = content2.split('\n');

    let diffCount = 0;
    const maxLines = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLines; i++) {
      if (lines1[i] !== lines2[i]) {
        diffCount++;
      }
    }

    return {
      identical: false,
      totalLines: maxLines,
      differentLines: diffCount,
      percentageDifferent: ((diffCount / maxLines) * 100).toFixed(2) + '%'
    };
  } catch (err) {
    return { error: err.message };
  }
}

// Function to recursively compare directories
function compareDirectories(dir1, dir2, relativePath = '') {
  const results = {
    identical: true,
    differences: [],
    missingInLocal: [],
    missingInAmplify: [],
    fileComparisons: []
  };

  // Check if both directories exist
  if (!pathExists(dir1)) {
    DanteLogger.error.system(`Local directory does not exist: ${dir1}`);
    return { error: `Local directory does not exist: ${dir1}` };
  }

  if (!pathExists(dir2)) {
    DanteLogger.error.system(`Amplify directory does not exist: ${dir2}`);
    return { error: `Amplify directory does not exist: ${dir2}` };
  }

  // Get the contents of both directories
  const files1 = fs.readdirSync(dir1);
  const files2 = fs.readdirSync(dir2);

  // Check for files in dir1 that are not in dir2
  for (const file of files1) {
    const filePath1 = path.join(dir1, file);
    const filePath2 = path.join(dir2, file);
    const relativeFilePath = path.join(relativePath, file);

    const stats1 = getFileStats(filePath1);

    if (!stats1) continue;

    if (!pathExists(filePath2)) {
      results.identical = false;
      results.missingInAmplify.push(relativeFilePath);
      continue;
    }

    const stats2 = getFileStats(filePath2);

    if (stats1.isDirectory() && stats2.isDirectory()) {
      // Recursively compare subdirectories
      const subResults = compareDirectories(filePath1, filePath2, relativeFilePath);

      if (subResults.error) {
        results.differences.push({
          path: relativeFilePath,
          error: subResults.error
        });
        results.identical = false;
      } else if (!subResults.identical) {
        results.identical = false;
        results.differences.push({
          path: relativeFilePath,
          type: 'directory',
          details: subResults
        });

        // Add missing files to the parent results
        results.missingInLocal = results.missingInLocal.concat(
          subResults.missingInLocal.map(p => path.join(relativeFilePath, p))
        );

        results.missingInAmplify = results.missingInAmplify.concat(
          subResults.missingInAmplify.map(p => path.join(relativeFilePath, p))
        );
      }
    } else if (stats1.isFile() && stats2.isFile()) {
      // Compare files
      const comparison = compareFiles(filePath1, filePath2);

      if (comparison.error || !comparison.identical) {
        results.identical = false;
        results.differences.push({
          path: relativeFilePath,
          type: 'file',
          details: comparison
        });
      }

      results.fileComparisons.push({
        path: relativeFilePath,
        result: comparison
      });
    } else {
      // One is a file and one is a directory
      results.identical = false;
      results.differences.push({
        path: relativeFilePath,
        type: 'type_mismatch',
        details: {
          local: stats1.isFile() ? 'file' : 'directory',
          amplify: stats2.isFile() ? 'file' : 'directory'
        }
      });
    }
  }

  // Check for files in dir2 that are not in dir1
  for (const file of files2) {
    const filePath1 = path.join(dir1, file);
    const relativeFilePath = path.join(relativePath, file);

    if (!pathExists(filePath1)) {
      results.identical = false;
      results.missingInLocal.push(relativeFilePath);
    }
  }

  return results;
}

// Main function
function main() {
  console.log('🔍 Comparing local build output with Amplify build output...');
  console.log(`Local build path: ${LOCAL_BUILD_PATH}`);
  console.log(`Amplify build path: ${AMPLIFY_BUILD_PATH}`);

  // Create logs directory if it doesn't exist
  const logsDir = path.join(process.cwd(), 'logs');
  if (!pathExists(logsDir)) {
    console.log(`Creating logs directory: ${logsDir}`);
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Check if both directories exist
  if (!pathExists(LOCAL_BUILD_PATH)) {
    DanteLogger.error.system(`Local build directory does not exist: ${LOCAL_BUILD_PATH}`);
    console.log(`❌ Local build directory does not exist: ${LOCAL_BUILD_PATH}`);
    console.log('Run "npm run build" to create the local build output.');
    console.log('Then run "npm run fix:standalone" to ensure the standalone directory is created.');
    return;
  }

  if (!pathExists(AMPLIFY_BUILD_PATH)) {
    DanteLogger.error.system(`Amplify build directory does not exist: ${AMPLIFY_BUILD_PATH}`);
    console.log(`❌ Amplify build directory does not exist: ${AMPLIFY_BUILD_PATH}`);
    console.log('Run "npm run test:e2e" to create the Amplify build output.');

    // Create the directory structure for future use
    console.log(`Creating directory structure for future comparison: ${AMPLIFY_BUILD_PATH}`);
    fs.mkdirSync(path.join(process.cwd(), 'logs', 'local-build'), { recursive: true });

    return;
  }

  // Compare the directories
  const results = compareDirectories(LOCAL_BUILD_PATH, AMPLIFY_BUILD_PATH);

  if (results.error) {
    DanteLogger.error.system(`Error comparing directories: ${results.error}`);
    console.log(`❌ Error comparing directories: ${results.error}`);
    return;
  }

  // Save the results to a file
  const outputPath = path.join(process.cwd(), 'logs', `build-comparison-${new Date().toISOString().replace(/:/g, '-')}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  // Print a summary
  console.log('\n📊 BUILD COMPARISON SUMMARY');
  console.log('=========================');

  if (results.identical) {
    DanteLogger.success.system('Build outputs are identical! 🎉');
    console.log('✅ Build outputs are identical! 🎉');
  } else {
    DanteLogger.warning.system(`Build outputs have differences. See ${outputPath} for details.`);
    console.log(`⚠️ Build outputs have differences. See ${outputPath} for details.`);

    console.log(`\nDifferences found: ${results.differences.length}`);
    console.log(`Files missing in local build: ${results.missingInLocal.length}`);
    console.log(`Files missing in Amplify build: ${results.missingInAmplify.length}`);

    // Print the first 5 differences
    if (results.differences.length > 0) {
      console.log('\nSample differences:');
      results.differences.slice(0, 5).forEach((diff, i) => {
        console.log(`${i + 1}. ${diff.path} (${diff.type})`);
      });

      if (results.differences.length > 5) {
        console.log(`... and ${results.differences.length - 5} more`);
      }
    }

    // Print the first 5 missing files
    if (results.missingInLocal.length > 0) {
      console.log('\nSample files missing in local build:');
      results.missingInLocal.slice(0, 5).forEach((file, i) => {
        console.log(`${i + 1}. ${file}`);
      });

      if (results.missingInLocal.length > 5) {
        console.log(`... and ${results.missingInLocal.length - 5} more`);
      }
    }

    if (results.missingInAmplify.length > 0) {
      console.log('\nSample files missing in Amplify build:');
      results.missingInAmplify.slice(0, 5).forEach((file, i) => {
        console.log(`${i + 1}. ${file}`);
      });

      if (results.missingInAmplify.length > 5) {
        console.log(`... and ${results.missingInAmplify.length - 5} more`);
      }
    }
  }

  console.log(`\nDetailed comparison saved to: ${outputPath}`);
  console.log('\nRecommendations:');
  console.log('1. Review the differences to identify potential issues');
  console.log('2. Update the build scripts to ensure consistency between local and Amplify builds');
  console.log('3. Test both deployment methods to verify functionality');
}

// Run the main function
main();

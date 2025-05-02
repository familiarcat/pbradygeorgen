/**
 * Setup Git Hooks
 * 
 * This script sets up Git hooks for the project, including:
 * - pre-commit: Run tests before committing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const gitHooksDir = path.join(__dirname, '..', '.git', 'hooks');
const preCommitHookPath = path.join(gitHooksDir, 'pre-commit');
const preCommitScriptPath = path.join(__dirname, 'pre-commit-test.sh');

// Check if .git directory exists
if (!fs.existsSync(path.join(__dirname, '..', '.git'))) {
  console.error('❌ Error: .git directory not found. Make sure you are in a git repository.');
  process.exit(1);
}

// Make sure the hooks directory exists
if (!fs.existsSync(gitHooksDir)) {
  console.log('📁 Creating git hooks directory...');
  fs.mkdirSync(gitHooksDir, { recursive: true });
}

// Make the pre-commit script executable
try {
  console.log('🔑 Making pre-commit script executable...');
  execSync(`chmod +x "${preCommitScriptPath}"`);
} catch (error) {
  console.error(`❌ Error making script executable: ${error.message}`);
  process.exit(1);
}

// Create the pre-commit hook
const preCommitHook = `#!/bin/sh
# Pre-commit hook that runs our test script

# Path to the pre-commit test script
PRE_COMMIT_SCRIPT="${preCommitScriptPath}"

# Check if the script exists
if [ ! -f "$PRE_COMMIT_SCRIPT" ]; then
  echo "❌ Error: Pre-commit script not found at $PRE_COMMIT_SCRIPT"
  exit 1
fi

# Run the script
echo "🧪 Running pre-commit tests..."
"$PRE_COMMIT_SCRIPT"

# Check the exit code
if [ $? -ne 0 ]; then
  echo "❌ Pre-commit tests failed. Commit aborted."
  exit 1
fi

# All good
echo "✅ Pre-commit tests passed."
exit 0
`;

// Write the pre-commit hook
try {
  console.log('📝 Creating pre-commit hook...');
  fs.writeFileSync(preCommitHookPath, preCommitHook);
  execSync(`chmod +x "${preCommitHookPath}"`);
  console.log('✅ Pre-commit hook created successfully!');
} catch (error) {
  console.error(`❌ Error creating pre-commit hook: ${error.message}`);
  process.exit(1);
}

console.log('🎉 Git hooks setup complete!');
console.log('The pre-commit hook will now run tests before each commit.');

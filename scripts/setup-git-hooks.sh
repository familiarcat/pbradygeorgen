#!/bin/bash
# Setup Git hooks
# Following Dante's philosophy of guiding through different stages with clear logging

echo "👑🌊 [Dante:Purgatorio] Setting up Git hooks..."

# Get the repository root directory
REPO_ROOT=$(git rev-parse --show-toplevel)

# Create the pre-commit hook
PRE_COMMIT_HOOK="$REPO_ROOT/.git/hooks/pre-commit"
echo "👑🌊 [Dante:Purgatorio] Creating pre-commit hook at $PRE_COMMIT_HOOK"

cat > "$PRE_COMMIT_HOOK" << 'EOF'
#!/bin/sh
# Pre-commit hook that runs our test script

# Path to the pre-commit test script (using relative path)
PRE_COMMIT_SCRIPT="$(git rev-parse --show-toplevel)/scripts/pre-commit-test.sh"

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
EOF

# Make the pre-commit hook executable
chmod +x "$PRE_COMMIT_HOOK"

# Create the pre-commit test script if it doesn't exist
PRE_COMMIT_TEST_SCRIPT="$REPO_ROOT/scripts/pre-commit-test.sh"
if [ ! -f "$PRE_COMMIT_TEST_SCRIPT" ]; then
    echo "👑🌊 [Dante:Purgatorio] Creating pre-commit test script at $PRE_COMMIT_TEST_SCRIPT"
    
    cat > "$PRE_COMMIT_TEST_SCRIPT" << 'EOF'
#!/bin/bash
# Pre-commit test script
# Following Dante's philosophy of guiding through different stages with clear logging

echo "👑🌊 [Dante:Purgatorio] Running pre-commit tests..."

# Check if there are any TypeScript errors
echo "👑🌊 [Dante:Purgatorio] Checking for TypeScript errors..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "👑🔥 [Dante:Inferno:Error] TypeScript errors found. Please fix them before committing."
    exit 1
fi

echo "👑⭐ [Dante:Paradiso] No TypeScript errors found."

# Check if there are any ESLint errors
echo "👑🌊 [Dante:Purgatorio] Checking for ESLint errors..."
npx eslint --ext .js,.jsx,.ts,.tsx .

if [ $? -ne 0 ]; then
    echo "👑🔥 [Dante:Inferno:Warning] ESLint errors found. Consider fixing them before committing."
    # We don't exit with error here to allow commits even with linting issues
    # exit 1
fi

# Check if the PDF reference manager script exists and run it
if [ -f "scripts/manage-pdf-references.js" ]; then
    echo "👑🌊 [Dante:Purgatorio] Running PDF reference manager..."
    node scripts/manage-pdf-references.js

    if [ $? -ne 0 ]; then
        echo "👑🔥 [Dante:Inferno:Warning] PDF reference manager failed, but continuing..."
    else
        echo "👑⭐ [Dante:Paradiso] PDF references managed successfully."
    fi
fi

echo "👑⭐ [Dante:Paradiso] Pre-commit tests completed successfully."
exit 0
EOF

    # Make the pre-commit test script executable
    chmod +x "$PRE_COMMIT_TEST_SCRIPT"
fi

echo "👑⭐ [Dante:Paradiso] Git hooks setup completed successfully."

#!/bin/bash
# Script to run git commands with ESLint disabled
# Following Dante's philosophy of guiding through different stages with clear logging

echo "👑🌊 [Dante:Purgatorio] Running git command with ESLint disabled..."

# Disable ESLint
node scripts/disable-eslint-for-git.js disable

# Set environment variable to prevent git from opening an editor
export GIT_EDITOR=true

# Special handling for commit command with message
if [ "$1" = "commit" ] && [ "$2" = "-m" ]; then
    echo "👑🌊 [Dante:Purgatorio] Running git commit with message: $3"
    git commit -m "$3"
elif [ "$1" = "commit" ] && [ "$2" != "-m" ]; then
    echo "👑🔥 [Dante:Inferno:Warning] Commit without message will open an editor. Please use -m flag."
    echo "👑🌊 [Dante:Purgatorio] Example: ./scripts/git-with-eslint-disabled.sh commit -m \"Your message\""
    exit 1
else
    # Run the git command
    echo "👑🌊 [Dante:Purgatorio] Running git command: git $@"
    git "$@"
fi
GIT_EXIT_CODE=$?

# Restore ESLint
echo "👑🌊 [Dante:Purgatorio] Restoring ESLint configuration..."
node scripts/disable-eslint-for-git.js restore

# Exit with the same code as the git command
if [ $GIT_EXIT_CODE -ne 0 ]; then
    echo "👑🔥 [Dante:Inferno:Error] Git command failed with exit code $GIT_EXIT_CODE."
    exit $GIT_EXIT_CODE
fi

echo "👑⭐ [Dante:Paradiso] Git command completed successfully."
exit 0

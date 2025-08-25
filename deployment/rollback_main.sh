#!/bin/bash

# KATRA-ALEXAI | Emergency rollback script
# Reverts an accidental push to `main` and moves changes to a new milestone branch.

# Step 1: Confirm current branch is main
echo "🚨 Starting emergency rollback of main branch..."
git checkout main || {
    echo "❌ Failed to checkout main. Aborting."
    exit 1
}

# Step 2: Show recent commits
echo "🔍 Last 5 commits on main:"
git log --oneline -n 5

# Step 3: Ask for the commit hash to reset to
read -p "🧠 Enter the hash of the LAST GOOD COMMIT (before the bad merge): " GOOD_COMMIT

# Step 4: Confirm milestone branch name
read -p "📛 Enter a name for the new milestone branch (e.g. milestone/recover-katra-integration-20250528): " MILESTONE_BRANCH

# Step 5: Create the milestone branch from current state
echo "📦 Creating milestone branch from current main..."
git checkout -b "$MILESTONE_BRANCH" || {
    echo "❌ Failed to create milestone branch. Aborting."
    exit 1
}
git push -u origin "$MILESTONE_BRANCH"

# Step 6: Reset main to the last good commit
git checkout main
git reset --hard "$GOOD_COMMIT" || {
    echo "❌ Invalid commit hash. Aborting."
    exit 1
}

# Step 7: Force push main to overwrite remote
echo "⚠️ About to force push main to restore its previous state..."
read -p "🔐 Type 'YES' to confirm force push to main: " CONFIRM

if [ "$CONFIRM" = "YES" ]; then
    git push origin main --force
    echo "✅ Main has been restored to commit $GOOD_COMMIT"
else
    echo "❌ Operation aborted. Main was NOT modified."
fi

#!/bin/bash
# deploy.sh - Helper script for deploying to Amplify

# Check if the branch name is provided
if [ -z "$1" ]; then
  echo "Usage: ./deploy.sh <branch-name>"
  echo "Example: ./deploy.sh pdf-next.js"
  exit 1
fi

BRANCH=$1

# Ensure we have the latest code
echo "Fetching latest changes..."
git fetch

# Check if the branch exists
if ! git show-ref --verify --quiet refs/heads/$BRANCH; then
  echo "Branch $BRANCH doesn't exist locally. Creating it..."
  git checkout -b $BRANCH
else
  echo "Checking out branch $BRANCH..."
  git checkout $BRANCH
fi

# Run the build locally to verify it works
echo "Running local build to verify..."
./build.sh

# If the build succeeded, commit and push
if [ $? -eq 0 ]; then
  echo "Build successful! Ready to push to Amplify."
  echo "Do you want to push to Amplify now? (y/n)"
  read answer
  
  if [ "$answer" == "y" ]; then
    echo "Pushing to Amplify..."
    git push origin $BRANCH
    echo "Deployment initiated. Check the Amplify Console for build status."
  else
    echo "Deployment cancelled. You can push manually with: git push origin $BRANCH"
  fi
else
  echo "Build failed. Please fix the issues before deploying."
  exit 1
fi

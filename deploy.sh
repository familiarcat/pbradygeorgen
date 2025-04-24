#!/bin/bash
# deploy.sh - Quick deployment script for AWS Amplify

# Print current git branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $CURRENT_BRANCH"

# Check if there are any uncommitted changes
if [[ -n $(git status -s) ]]; then
  echo "There are uncommitted changes. Committing them now..."
  git add .
  git commit -m "Quick deployment: $(date)"
  echo "Changes committed."
else
  echo "No uncommitted changes."
fi

# Run a quick local build to verify
echo "Running quick build verification..."
NODE_ENV=production npm run build

# If build succeeds, push to the current branch
if [ $? -eq 0 ]; then
  echo "Build verification successful!"
  echo "Pushing to $CURRENT_BRANCH..."
  git push origin $CURRENT_BRANCH

  echo "Push complete. Your changes should now be deploying to AWS Amplify."
  echo "Check your Amplify console for deployment status."
  echo "Deployment URL: https://pdf-nextjs.pbradygeorgen.com/"
else
  echo "Build verification failed. Please fix the issues before deploying."
  exit 1
fi

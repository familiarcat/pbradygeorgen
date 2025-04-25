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

# Check if the PDF file exists and extract content
echo "Checking PDF file..."
if [ -f "public/pbradygeorgen_resume.pdf" ]; then
  echo "PDF file found: public/pbradygeorgen_resume.pdf"
  echo "Last modified: $(stat -c %y public/pbradygeorgen_resume.pdf 2>/dev/null || stat -f "%Sm" public/pbradygeorgen_resume.pdf)"

  # Create the extracted directory if it doesn't exist
  mkdir -p public/extracted

  # Extract content from the PDF
  echo "Extracting content from PDF..."
  node scripts/extract-pdf-text-improved.js public/pbradygeorgen_resume.pdf

  if [ $? -eq 0 ]; then
    echo "PDF content extracted successfully"

    # Add the extracted content to git
    git add public/extracted/*
    if [[ -n $(git status -s) ]]; then
      git commit -m "Update extracted PDF content"
      echo "Extracted content committed."
    fi
  else
    echo "Warning: PDF extraction failed, but continuing deployment"
  fi
else
  echo "Warning: PDF file not found at public/pbradygeorgen_resume.pdf"
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

#!/bin/bash
# Deploy to AWS Amplify
# This script deploys the current branch to AWS Amplify

set -e # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting deployment to AWS Amplify"

# Check if the AWS CLI is installed
if ! command -v aws &> /dev/null; then
  echo "❌ AWS CLI is not installed. Please install it first."
  exit 1
fi

# Check if the user is logged in to AWS
aws sts get-caller-identity > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "❌ You are not logged in to AWS. Please run 'aws configure' first."
  exit 1
fi

# Get the current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📋 Current branch: $CURRENT_BRANCH"

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️ You have uncommitted changes. Do you want to continue? (y/n)"
  read -r CONTINUE
  if [ "$CONTINUE" != "y" ]; then
    echo "❌ Deployment aborted."
    exit 1
  fi
  
  # Commit the changes
  echo "📝 Committing changes..."
  git add .
  git commit -m "Auto-commit before deployment to AWS Amplify"
fi

# Push the changes to the remote repository
echo "📤 Pushing changes to remote repository..."
git push origin $CURRENT_BRANCH

# Get the Amplify app ID
AMPLIFY_APP_ID="d25hjzqcr0podj"
echo "📋 Amplify app ID: $AMPLIFY_APP_ID"

# Start the build
echo "🔨 Starting build in AWS Amplify..."
aws amplify start-job --app-id $AMPLIFY_APP_ID --branch-name $CURRENT_BRANCH --job-type RELEASE

# Check if the build was started successfully
if [ $? -eq 0 ]; then
  echo "✅ Build started successfully. You can check the status in the AWS Amplify console."
  echo "🌐 https://us-east-1.console.aws.amazon.com/amplify/home?region=us-east-1#/$AMPLIFY_APP_ID"
else
  echo "❌ Failed to start the build. Please check your AWS credentials and try again."
  exit 1
fi

echo "✅ Deployment to AWS Amplify completed"

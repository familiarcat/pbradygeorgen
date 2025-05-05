#!/bin/bash
# View AWS Amplify Build Logs
# This script retrieves and displays the build logs from AWS Amplify

set -e # Exit immediately if a command exits with a non-zero status

echo "🔍 Retrieving AWS Amplify build logs"

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

# Get the Amplify app ID
AMPLIFY_APP_ID="d25hjzqcr0podj"
echo "📋 Amplify app ID: $AMPLIFY_APP_ID"

# Get the latest job ID
echo "🔍 Getting the latest job ID..."
LATEST_JOB=$(aws amplify list-jobs --app-id $AMPLIFY_APP_ID --branch-name $CURRENT_BRANCH --max-results 1 --query 'jobSummaries[0].jobId' --output text)

if [ "$LATEST_JOB" == "None" ] || [ -z "$LATEST_JOB" ]; then
  echo "❌ No jobs found for branch $CURRENT_BRANCH"
  exit 1
fi

echo "📋 Latest job ID: $LATEST_JOB"

# Get the job details
echo "🔍 Getting job details..."
aws amplify get-job --app-id $AMPLIFY_APP_ID --branch-name $CURRENT_BRANCH --job-id $LATEST_JOB

# Get the job logs
echo "📜 Getting job logs..."
aws amplify get-job-log --app-id $AMPLIFY_APP_ID --branch-name $CURRENT_BRANCH --job-id $LATEST_JOB --query 'logUrl' --output text > amplify_log_url.txt

# Open the log URL in the browser
echo "🌐 Opening log URL in browser..."
LOG_URL=$(cat amplify_log_url.txt)
echo "Log URL: $LOG_URL"

# Try to open the URL in the browser
if command -v open &> /dev/null; then
  open "$LOG_URL"
elif command -v xdg-open &> /dev/null; then
  xdg-open "$LOG_URL"
elif command -v start &> /dev/null; then
  start "$LOG_URL"
else
  echo "⚠️ Could not open the URL automatically. Please open it manually."
fi

# Clean up
rm amplify_log_url.txt

echo "✅ AWS Amplify build logs retrieved"

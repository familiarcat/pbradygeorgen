#!/bin/bash

# Dante Logger colors and emojis
DANTE_INFERNO="👑🔥 [Dante:Inferno"
DANTE_PURGATORIO="👑🌊 [Dante:Purgatorio]"
DANTE_PARADISO="👑⭐ [Dante:Paradiso]"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "${DANTE_INFERNO}:Error] AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "${DANTE_INFERNO}:Error] AWS credentials are not configured. Please run 'aws configure' first."
    exit 1
fi

# Get the app ID (you'll need to replace this with your actual app ID)
APP_ID=$1

if [ -z "$APP_ID" ]; then
    echo "${DANTE_INFERNO}:Error] Please provide an Amplify app ID as the first argument."
    echo "Usage: $0 <app-id> [branch-name]"
    echo "Example: $0 d1234abcd fix-download-test"
    
    # Try to list available apps
    echo "${DANTE_PURGATORIO} Attempting to list available Amplify apps..."
    aws amplify list-apps --query "apps[*].[name,appId,defaultDomain]" --output table
    
    exit 1
fi

# Get the branch name (default to fix-download-test if not provided)
BRANCH_NAME=${2:-fix-download-test}

echo "${DANTE_PURGATORIO} Checking build status for app ID: $APP_ID, branch: $BRANCH_NAME"

# List recent jobs
echo "${DANTE_PURGATORIO} Recent builds:"
aws amplify list-jobs --app-id $APP_ID --branch-name $BRANCH_NAME --max-results 5 --query "jobSummaries[*].[jobId,status,startTime,endTime]" --output table

# Get the most recent job
LATEST_JOB=$(aws amplify list-jobs --app-id $APP_ID --branch-name $BRANCH_NAME --max-results 1 --query "jobSummaries[0].jobId" --output text)

if [ -z "$LATEST_JOB" ] || [ "$LATEST_JOB" == "None" ]; then
    echo "${DANTE_INFERNO}:Warning] No jobs found for this app and branch."
    exit 1
fi

echo "${DANTE_PURGATORIO} Details for latest job ($LATEST_JOB):"
aws amplify get-job --app-id $APP_ID --branch-name $BRANCH_NAME --job-id $LATEST_JOB --query "job.[summary,steps]" --output json

# Get the app URL
APP_URL=$(aws amplify get-app --app-id $APP_ID --query "app.defaultDomain" --output text)

echo "${DANTE_PARADISO} Your app will be available at: https://${BRANCH_NAME}.${APP_URL}"
echo "${DANTE_PARADISO} You can monitor the build status in the AWS Amplify Console:"
echo "https://console.aws.amazon.com/amplify/home?region=us-east-1#/$APP_ID/$BRANCH_NAME"

exit 0

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

# Check if amplify CLI is installed
if ! command -v amplify &> /dev/null; then
    echo "${DANTE_INFERNO}:Error] Amplify CLI is not installed. Please install it first with 'npm install -g @aws-amplify/cli'."
    exit 1
fi

# Get the current branch name
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
echo "${DANTE_PURGATORIO} Current branch: $BRANCH_NAME"

# Ensure we have the latest code
echo "${DANTE_PURGATORIO} Pulling latest changes..."
git pull origin $BRANCH_NAME

# Run a local build to verify everything works
echo "${DANTE_PURGATORIO} Running local build to verify..."
npm run build

if [ $? -ne 0 ]; then
    echo "${DANTE_INFERNO}:Error] Local build failed. Please fix the issues before deploying."
    exit 1
fi

# Initialize Amplify if not already initialized
if [ ! -d "amplify/.config" ]; then
    echo "${DANTE_PURGATORIO} Initializing Amplify..."
    amplify init
fi

# Check if the app is already deployed to Amplify
APP_ID=$(aws amplify list-apps --query "apps[?name=='alexai'].appId" --output text)

if [ -z "$APP_ID" ]; then
    # Create a new Amplify app
    echo "${DANTE_PURGATORIO} Creating new Amplify app..."
    APP_ID=$(aws amplify create-app --name alexai --platform WEB --query "app.appId" --output text)
    
    echo "${DANTE_PARADISO} Created new Amplify app with ID: $APP_ID"
    
    # Create a new branch
    echo "${DANTE_PURGATORIO} Creating branch $BRANCH_NAME..."
    aws amplify create-branch --app-id $APP_ID --branch-name $BRANCH_NAME
else
    echo "${DANTE_PURGATORIO} Found existing Amplify app with ID: $APP_ID"
    
    # Check if branch exists
    BRANCH_EXISTS=$(aws amplify get-branch --app-id $APP_ID --branch-name $BRANCH_NAME 2>/dev/null)
    
    if [ $? -ne 0 ]; then
        # Create a new branch
        echo "${DANTE_PURGATORIO} Creating branch $BRANCH_NAME..."
        aws amplify create-branch --app-id $APP_ID --branch-name $BRANCH_NAME
    else
        echo "${DANTE_PURGATORIO} Branch $BRANCH_NAME already exists."
    fi
fi

# Set up environment variables
echo "${DANTE_PURGATORIO} Setting up environment variables..."
ENV_VARS=$(cat << EOF
{
  "environmentVariables": {
    "OPENAI_API_KEY": "${OPENAI_API_KEY}",
    "NEXT_PUBLIC_OPENAI_API_KEY": "${NEXT_PUBLIC_OPENAI_API_KEY}",
    "USE_OPENAI": "true",
    "NODE_ENV": "production"
  }
}
EOF
)

aws amplify update-branch --app-id $APP_ID --branch-name $BRANCH_NAME --environment-variables "$ENV_VARS"

# Set up S3 backend
echo "${DANTE_PURGATORIO} Setting up S3 backend..."
BUCKET_NAME="alexai-pdf-storage-$(date +%s)"

# Create S3 bucket if it doesn't exist
aws s3api create-bucket --bucket $BUCKET_NAME --region us-east-1

# Set bucket policy for public read access to PDFs
BUCKET_POLICY=$(cat << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForGetBucketObjects",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/public/*"
    }
  ]
}
EOF
)

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy "$BUCKET_POLICY"

# Update environment variables with S3 bucket name
ENV_VARS=$(cat << EOF
{
  "environmentVariables": {
    "OPENAI_API_KEY": "${OPENAI_API_KEY}",
    "NEXT_PUBLIC_OPENAI_API_KEY": "${NEXT_PUBLIC_OPENAI_API_KEY}",
    "USE_OPENAI": "true",
    "NODE_ENV": "production",
    "S3_BUCKET_NAME": "${BUCKET_NAME}"
  }
}
EOF
)

aws amplify update-branch --app-id $APP_ID --branch-name $BRANCH_NAME --environment-variables "$ENV_VARS"

# Push to Amplify
echo "${DANTE_PURGATORIO} Pushing to Amplify..."
git push origin $BRANCH_NAME

# Start the build
echo "${DANTE_PURGATORIO} Starting Amplify build..."
aws amplify start-job --app-id $APP_ID --branch-name $BRANCH_NAME --job-type RELEASE

# Get the Amplify app URL
APP_URL=$(aws amplify get-app --app-id $APP_ID --query "app.defaultDomain" --output text)

echo "${DANTE_PARADISO} Deployment initiated successfully!"
echo "${DANTE_PARADISO} Your app will be available at: https://${BRANCH_NAME}.${APP_URL}"
echo "${DANTE_PARADISO} You can monitor the build status in the AWS Amplify Console."

# Provide command to check build status
echo "${DANTE_PURGATORIO} To check build status, run:"
echo "aws amplify list-jobs --app-id $APP_ID --branch-name $BRANCH_NAME"

exit 0

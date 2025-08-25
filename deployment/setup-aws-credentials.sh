#!/bin/bash
# Script to set up AWS credentials for Amplify environment variable synchronization

echo "Setting up AWS credentials for Amplify environment variable synchronization"
echo "============================================================================"
echo ""
echo "This script will help you set up AWS credentials for the AWS CLI."
echo "These credentials will be used to synchronize environment variables between"
echo "your local development environment and AWS Amplify."
echo ""
echo "You will need the following information:"
echo "  - AWS Access Key ID"
echo "  - AWS Secret Access Key"
echo "  - AWS Region (default: us-east-1)"
echo ""

# Prompt for AWS credentials
read -p "Enter your AWS Access Key ID: " AWS_ACCESS_KEY_ID
read -p "Enter your AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY
read -p "Enter your AWS Region [us-east-1]: " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

# Create AWS credentials directory if it doesn't exist
mkdir -p ~/.aws

# Create or update AWS credentials file
cat > ~/.aws/credentials << EOF
[default]
aws_access_key_id = ${AWS_ACCESS_KEY_ID}
aws_secret_access_key = ${AWS_SECRET_ACCESS_KEY}
EOF

# Create or update AWS config file
cat > ~/.aws/config << EOF
[default]
region = ${AWS_REGION}
output = json
EOF

echo ""
echo "AWS credentials have been set up successfully!"
echo ""
echo "You can now use the following commands to synchronize environment variables:"
echo "  - npm run env:pull - Pull environment variables from AWS Amplify"
echo "  - npm run env:push - Push environment variables to AWS Amplify"
echo "  - npm run env:list - List environment variables in AWS Amplify"
echo ""
echo "Make sure you have the correct Amplify app ID and branch in amplify-env-config.json"

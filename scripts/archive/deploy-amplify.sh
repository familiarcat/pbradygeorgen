#!/bin/bash
# AlexAI Amplify Deployment Script
# Following Derrida's philosophy of deconstruction, this script breaks down the deployment process
# into discrete, analyzable components that can be understood and modified independently.

set -e

# Color codes for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Dante-inspired logging
log_info() {
  echo -e "👑🌊 [Dante:Purgatorio] ${BLUE}$1${NC}"
}

log_success() {
  echo -e "👑⭐ [Dante:Paradiso] ${GREEN}$1${NC}"
}

log_warning() {
  echo -e "👑🔥 [Dante:Inferno:Warning] ${YELLOW}$1${NC}"
}

log_error() {
  echo -e "👑🔥 [Dante:Inferno:Error] ${RED}$1${NC}"
}

# Configuration variables
AMPLIFY_APP_NAME="AlexAI"
AMPLIFY_ENV_NAME="production"
AWS_REGION=${AWS_REGION:-"us-east-2"}
GITHUB_REPO=${GITHUB_REPO:-"https://github.com/familiarcat/pbradygeorgen.git"}
GITHUB_BRANCH=${GITHUB_BRANCH:-"main"}

# Check if AWS CLI is installed and configured
check_aws_cli() {
  log_info "Checking AWS CLI configuration..."
  if ! command -v aws &> /dev/null; then
    log_error "AWS CLI is not installed. Please install it first."
    exit 1
  fi
  
  # Check if AWS credentials are configured
  if ! aws sts get-caller-identity &> /dev/null; then
    log_error "AWS credentials are not configured or are invalid."
    exit 1
  fi
  
  log_success "AWS CLI is properly configured."
}

# Check if Amplify CLI is installed
check_amplify_cli() {
  log_info "Checking Amplify CLI installation..."
  if ! command -v amplify &> /dev/null; then
    log_warning "Amplify CLI is not installed. Installing now..."
    npm install -g @aws-amplify/cli
  fi
  
  log_success "Amplify CLI is installed."
}

# Create or update Amplify app
create_or_update_amplify_app() {
  log_info "Creating or updating Amplify app..."
  
  # Check if app already exists
  APP_ID=$(aws amplify list-apps --query "apps[?name=='${AMPLIFY_APP_NAME}'].appId" --output text)
  
  if [ -z "$APP_ID" ] || [ "$APP_ID" == "None" ]; then
    log_info "Creating new Amplify app: ${AMPLIFY_APP_NAME}..."
    
    # Create the app
    APP_RESULT=$(aws amplify create-app --name "${AMPLIFY_APP_NAME}" \
      --repository "${GITHUB_REPO}" \
      --platform WEB \
      --build-spec "$(cat amplify.yml)" \
      --description "AlexAI PDF Processing Application" \
      --output json)
    
    APP_ID=$(echo $APP_RESULT | jq -r '.app.appId')
    log_success "Created Amplify app with ID: ${APP_ID}"
  else
    log_info "Amplify app already exists with ID: ${APP_ID}"
    
    # Update the app
    aws amplify update-app --app-id "${APP_ID}" \
      --build-spec "$(cat amplify.yml)" \
      --description "AlexAI PDF Processing Application"
    
    log_success "Updated Amplify app configuration."
  fi
  
  # Export the APP_ID for later use
  export APP_ID=$APP_ID
}

# Create or update Amplify branch
create_or_update_branch() {
  log_info "Creating or updating branch: ${GITHUB_BRANCH}..."
  
  # Check if branch already exists
  BRANCH_EXISTS=$(aws amplify get-branch --app-id "${APP_ID}" --branch-name "${GITHUB_BRANCH}" 2>/dev/null || echo "false")
  
  if [ "$BRANCH_EXISTS" == "false" ]; then
    log_info "Creating new branch: ${GITHUB_BRANCH}..."
    
    # Create the branch
    aws amplify create-branch --app-id "${APP_ID}" \
      --branch-name "${GITHUB_BRANCH}" \
      --framework "Next.js - SSR" \
      --stage PRODUCTION \
      --enable-auto-build
    
    log_success "Created branch: ${GITHUB_BRANCH}"
  else
    log_info "Branch already exists: ${GITHUB_BRANCH}"
    
    # Update the branch
    aws amplify update-branch --app-id "${APP_ID}" \
      --branch-name "${GITHUB_BRANCH}" \
      --framework "Next.js - SSR" \
      --stage PRODUCTION \
      --enable-auto-build
    
    log_success "Updated branch: ${GITHUB_BRANCH}"
  fi
}

# Create or update Amplify backend environment
create_or_update_backend_env() {
  log_info "Setting up Amplify backend environment..."
  
  # Initialize Amplify project if not already initialized
  if [ ! -d "amplify/.config" ]; then
    log_info "Initializing Amplify project..."
    
    # Run Amplify init with predefined answers
    amplify init \
      --name "${AMPLIFY_APP_NAME}" \
      --envName "${AMPLIFY_ENV_NAME}" \
      --yes
    
    log_success "Initialized Amplify project."
  else
    log_info "Amplify project already initialized."
  fi
  
  # Add auth resource if not already added
  if [ ! -d "amplify/backend/auth" ]; then
    log_info "Adding auth resource..."
    amplify add auth \
      --service cognito \
      --identityPoolName "${AMPLIFY_APP_NAME}IdentityPool" \
      --allowUnauthenticatedIdentities true \
      --userPoolName "${AMPLIFY_APP_NAME}UserPool" \
      --emailVerificationSubject "Your verification code" \
      --emailVerificationMessage "Your verification code is {####}" \
      --defaultPasswordPolicy false \
      --mfaConfiguration OFF \
      --usernameAttributes email \
      --yes
    
    log_success "Added auth resource."
  fi
  
  # Add storage resource if not already added
  if [ ! -d "amplify/backend/storage" ]; then
    log_info "Adding storage resource..."
    amplify add storage \
      --service S3 \
      --resourceName pdfStorage \
      --bucketName "${AMPLIFY_APP_NAME}-pdf-storage-${AWS_REGION}" \
      --authPolicyName "s3_amplify_${AMPLIFY_APP_NAME}" \
      --unauthPolicyName "s3_amplify_${AMPLIFY_APP_NAME}_unauth" \
      --authAccess "CREATE_AND_UPDATE" \
      --unauthAccess "READ" \
      --yes
    
    log_success "Added storage resource."
  fi
  
  # Push Amplify changes
  log_info "Pushing Amplify changes..."
  amplify push --yes
  
  log_success "Amplify backend environment setup complete."
}

# Set up environment variables
setup_environment_variables() {
  log_info "Setting up environment variables..."
  
  # Get the Cognito User Pool ID
  USER_POOL_ID=$(aws cognito-idp list-user-pools --max-results 60 --query "UserPools[?Name=='${AMPLIFY_APP_NAME}UserPool'].Id" --output text)
  
  # Get the Cognito User Pool Client ID
  USER_POOL_CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[0].ClientId" --output text)
  
  # Get the Cognito Identity Pool ID
  IDENTITY_POOL_ID=$(aws cognito-identity list-identity-pools --max-results 60 --query "IdentityPools[?IdentityPoolName=='${AMPLIFY_APP_NAME}IdentityPool'].IdentityPoolId" --output text)
  
  # Get the S3 bucket name
  S3_BUCKET=$(aws s3api list-buckets --query "Buckets[?starts_with(Name, '${AMPLIFY_APP_NAME}-pdf-storage-')].Name" --output text)
  
  # Set environment variables in Amplify app
  log_info "Setting environment variables in Amplify app..."
  aws amplify update-branch --app-id "${APP_ID}" \
    --branch-name "${GITHUB_BRANCH}" \
    --environment-variables "{
      \"NEXT_PUBLIC_USER_POOL_ID\":\"${USER_POOL_ID}\",
      \"NEXT_PUBLIC_USER_POOL_CLIENT_ID\":\"${USER_POOL_CLIENT_ID}\",
      \"NEXT_PUBLIC_IDENTITY_POOL_ID\":\"${IDENTITY_POOL_ID}\",
      \"NEXT_PUBLIC_STORAGE_BUCKET\":\"${S3_BUCKET}\",
      \"NEXT_PUBLIC_REGION\":\"${AWS_REGION}\"
    }"
  
  log_success "Environment variables set successfully."
  
  # Save environment variables to a local file for reference
  cat > .env.amplify <<EOL
NEXT_PUBLIC_USER_POOL_ID=${USER_POOL_ID}
NEXT_PUBLIC_USER_POOL_CLIENT_ID=${USER_POOL_CLIENT_ID}
NEXT_PUBLIC_IDENTITY_POOL_ID=${IDENTITY_POOL_ID}
NEXT_PUBLIC_STORAGE_BUCKET=${S3_BUCKET}
NEXT_PUBLIC_REGION=${AWS_REGION}
EOL
  
  log_success "Environment variables saved to .env.amplify"
}

# Start a build
start_build() {
  log_info "Starting build for branch: ${GITHUB_BRANCH}..."
  
  aws amplify start-job --app-id "${APP_ID}" \
    --branch-name "${GITHUB_BRANCH}" \
    --job-type RELEASE
  
  log_success "Build started successfully."
}

# Main execution
main() {
  log_info "Starting AlexAI Amplify deployment process..."
  
  check_aws_cli
  check_amplify_cli
  create_or_update_amplify_app
  create_or_update_branch
  create_or_update_backend_env
  setup_environment_variables
  start_build
  
  log_success "Deployment process completed successfully!"
  log_info "You can monitor the build status in the Amplify Console:"
  log_info "https://${AWS_REGION}.console.aws.amazon.com/amplify/home?region=${AWS_REGION}#/${APP_ID}"
}

# Execute main function
main

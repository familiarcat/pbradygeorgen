#!/bin/bash
# Script to deploy the application to AWS Amplify
# Following Dante's philosophy of guiding through different stages with clear logging

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

# Configuration
APP_ID="d25hjzqcr0podj"
BRANCH="fix-download-test"
REGION="us-east-1"

# Main function
main() {
  log_info "Starting deployment to AWS Amplify..."
  
  # Check if AWS CLI is installed
  if ! command -v aws &> /dev/null; then
    log_error "AWS CLI is not installed. Please install it first."
    exit 1
  fi
  
  # Check if AWS credentials are configured
  if ! aws sts get-caller-identity &> /dev/null; then
    log_error "AWS credentials are not configured or are invalid."
    exit 1
  }
  
  # Check if Git is installed
  if ! command -v git &> /dev/null; then
    log_error "Git is not installed. Please install it first."
    exit 1
  }
  
  # Check if we're in a Git repository
  if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    log_error "Not in a Git repository. Please run this script from a Git repository."
    exit 1
  }
  
  # Get the current branch
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  
  if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    log_warning "Current branch is $CURRENT_BRANCH, but deployment branch is $BRANCH."
    read -p "Do you want to switch to $BRANCH? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      log_info "Switching to branch $BRANCH..."
      git checkout $BRANCH
      
      if [ $? -ne 0 ]; then
        log_error "Failed to switch to branch $BRANCH."
        exit 1
      }
      
      log_success "Switched to branch $BRANCH."
    else
      log_warning "Continuing with current branch $CURRENT_BRANCH."
      BRANCH=$CURRENT_BRANCH
    fi
  }
  
  # Check for uncommitted changes
  if [ -n "$(git status --porcelain)" ]; then
    log_warning "There are uncommitted changes in the repository."
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      log_info "Committing changes..."
      read -p "Enter commit message: " COMMIT_MESSAGE
      
      git add .
      git commit -m "$COMMIT_MESSAGE"
      
      if [ $? -ne 0 ]; then
        log_error "Failed to commit changes."
        exit 1
      }
      
      log_success "Changes committed successfully."
    else
      log_warning "Continuing with uncommitted changes."
    fi
  }
  
  # Push changes to remote repository
  log_info "Pushing changes to remote repository..."
  git push origin $BRANCH
  
  if [ $? -ne 0 ]; then
    log_error "Failed to push changes to remote repository."
    exit 1
  }
  
  log_success "Changes pushed to remote repository."
  
  # Start the deployment
  log_info "Starting deployment to AWS Amplify..."
  
  # Check if the app exists
  if ! aws amplify get-app --app-id $APP_ID --region $REGION &> /dev/null; then
    log_error "Amplify app with ID $APP_ID does not exist."
    exit 1
  }
  
  # Start the job
  JOB_ID=$(aws amplify start-job --app-id $APP_ID --branch-name $BRANCH --job-type RELEASE --region $REGION --query 'jobSummary.jobId' --output text)
  
  if [ -z "$JOB_ID" ] || [ "$JOB_ID" == "None" ]; then
    log_error "Failed to start deployment job."
    exit 1
  }
  
  log_success "Deployment job started with ID: $JOB_ID"
  
  # Wait for the job to complete
  log_info "Waiting for deployment to complete..."
  
  while true; do
    JOB_STATUS=$(aws amplify get-job --app-id $APP_ID --branch-name $BRANCH --job-id $JOB_ID --region $REGION --query 'job.summary.status' --output text)
    
    if [ "$JOB_STATUS" == "SUCCEED" ]; then
      log_success "Deployment completed successfully!"
      break
    elif [ "$JOB_STATUS" == "FAILED" ]; then
      log_error "Deployment failed."
      
      # Get the job details
      aws amplify get-job --app-id $APP_ID --branch-name $BRANCH --job-id $JOB_ID --region $REGION
      
      exit 1
    elif [ "$JOB_STATUS" == "CANCELLED" ]; then
      log_warning "Deployment was cancelled."
      exit 1
    else
      log_info "Deployment status: $JOB_STATUS"
      sleep 10
    fi
  done
  
  # Get the app URL
  APP_URL=$(aws amplify get-app --app-id $APP_ID --region $REGION --query 'app.defaultDomain' --output text)
  
  log_success "Application deployed successfully!"
  log_info "You can access the application at: https://$BRANCH.$APP_URL"
}

# Run the main function
main

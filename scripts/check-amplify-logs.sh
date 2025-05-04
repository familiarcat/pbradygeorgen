#!/bin/bash
# Script to check Amplify deployment logs
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
  log_info "Checking Amplify deployment logs for app ${APP_ID} on branch ${BRANCH}..."
  
  # Check if AWS CLI is installed
  if ! command -v aws &> /dev/null; then
    log_error "AWS CLI is not installed. Please install it first."
    log_info "You can check the deployment status manually at:"
    log_info "https://us-east-1.console.aws.amazon.com/amplify/home?region=us-east-1#/${APP_ID}/${BRANCH}/1"
    exit 1
  fi
  
  # Check if AWS credentials are configured
  if ! aws sts get-caller-identity &> /dev/null; then
    log_error "AWS credentials are not configured or are invalid."
    log_info "You can check the deployment status manually at:"
    log_info "https://us-east-1.console.aws.amazon.com/amplify/home?region=us-east-1#/${APP_ID}/${BRANCH}/1"
    exit 1
  fi
  
  # Get the latest job ID
  log_info "Getting the latest job ID..."
  JOB_ID=$(aws amplify list-jobs --app-id ${APP_ID} --branch-name ${BRANCH} --region ${REGION} --query "jobSummaries[0].jobId" --output text)
  
  if [ "$JOB_ID" == "None" ] || [ -z "$JOB_ID" ]; then
    log_error "No deployment jobs found for branch ${BRANCH}."
    log_info "You can check the deployment status manually at:"
    log_info "https://us-east-1.console.aws.amazon.com/amplify/home?region=us-east-1#/${APP_ID}/${BRANCH}/1"
    exit 1
  fi
  
  log_success "Found job ID: ${JOB_ID}"
  
  # Get the job details
  log_info "Getting job details..."
  JOB_DETAILS=$(aws amplify get-job --app-id ${APP_ID} --branch-name ${BRANCH} --job-id ${JOB_ID} --region ${REGION})
  
  # Extract job status
  JOB_STATUS=$(echo ${JOB_DETAILS} | jq -r '.job.summary.status')
  JOB_STEPS=$(echo ${JOB_DETAILS} | jq -r '.job.steps')
  
  log_info "Job status: ${JOB_STATUS}"
  
  # Get the logs
  log_info "Getting deployment logs..."
  aws amplify get-job-details --app-id ${APP_ID} --branch-name ${BRANCH} --job-id ${JOB_ID} --region ${REGION} > amplify-job-logs.json
  
  # Extract and display the logs
  log_info "Deployment logs:"
  echo "----------------------------------------"
  cat amplify-job-logs.json | jq -r '.jobDetails.logUrl'
  echo "----------------------------------------"
  
  # Display job steps
  log_info "Job steps:"
  echo ${JOB_STEPS} | jq -r '.[] | "- \(.stepName): \(.status)"'
  
  # Display job summary
  if [ "$JOB_STATUS" == "SUCCEED" ]; then
    log_success "Deployment completed successfully!"
  elif [ "$JOB_STATUS" == "FAILED" ]; then
    log_error "Deployment failed."
    log_info "Check the logs for more details."
  else
    log_warning "Deployment is still in progress (${JOB_STATUS})."
    log_info "Check back later for the final status."
  fi
  
  log_info "You can check the deployment details at:"
  log_info "https://us-east-1.console.aws.amazon.com/amplify/home?region=us-east-1#/${APP_ID}/${BRANCH}/${JOB_ID}"
}

# Run the main function
main

#!/bin/bash
# Script to monitor AWS Amplify deployment logs
# Following Dante's philosophy of guiding through different stages with clear logging

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
APP_ID=${APP_ID:-"d25hjzqcr0podj"}
BRANCH=${BRANCH:-"main"}
AWS_REGION=${AWS_REGION:-"us-east-2"}
POLL_INTERVAL=${POLL_INTERVAL:-10} # seconds

# Check if AWS CLI is installed and configured
check_aws_cli() {
  log_info "Checking AWS CLI configuration..."
  if ! command -v aws &>/dev/null; then
    log_error "AWS CLI is not installed. Please install it first."
    exit 1
  fi

  # Check if AWS credentials are configured
  if ! aws sts get-caller-identity &>/dev/null; then
    log_error "AWS credentials are not configured or are invalid."
    exit 1
  fi

  log_success "AWS CLI is properly configured."
}

# Get the latest job ID
get_latest_job_id() {
  log_info "Getting latest job ID for app ${APP_ID}, branch ${BRANCH}..."

  JOBS=$(aws amplify list-jobs --app-id "${APP_ID}" --branch-name "${BRANCH}" --region "${AWS_REGION}")

  # Check if there are any jobs
  if [ -z "$JOBS" ] || [ "$JOBS" == "null" ]; then
    log_error "No jobs found for app ${APP_ID}, branch ${BRANCH}."
    exit 1
  fi

  # Get the latest job ID
  JOB_ID=$(echo $JOBS | jq -r '.jobSummaries[0].jobId')

  if [ -z "$JOB_ID" ] || [ "$JOB_ID" == "null" ]; then
    log_error "Failed to get latest job ID."
    exit 1
  fi

  log_success "Latest job ID: ${JOB_ID}"
  echo $JOB_ID
}

# Get job status
get_job_status() {
  JOB_ID=$1

  JOB=$(aws amplify get-job --app-id "${APP_ID}" --branch-name "${BRANCH}" --job-id "${JOB_ID}" --region "${AWS_REGION}")

  # Check if job exists
  if [ -z "$JOB" ] || [ "$JOB" == "null" ]; then
    log_error "Job ${JOB_ID} not found."
    exit 1
  fi

  # Get job status
  STATUS=$(echo $JOB | jq -r '.job.summary.status')

  echo $STATUS
}

# Get job logs
get_job_logs() {
  JOB_ID=$1

  log_info "Getting logs for job ${JOB_ID}..."

  LOGS=$(aws amplify get-job-details --app-id "${APP_ID}" --branch-name "${BRANCH}" --job-id "${JOB_ID}" --region "${AWS_REGION}")

  # Check if logs exist
  if [ -z "$LOGS" ] || [ "$LOGS" == "null" ]; then
    log_warning "No logs found for job ${JOB_ID}."
    return
  fi

  # Get log URL
  LOG_URL=$(echo $LOGS | jq -r '.jobDetails.logUrl')

  if [ -z "$LOG_URL" ] || [ "$LOG_URL" == "null" ]; then
    log_warning "No log URL found for job ${JOB_ID}."
    return
  fi

  # Download logs
  log_info "Downloading logs from ${LOG_URL}..."
  curl -s "${LOG_URL}" >"amplify-job-${JOB_ID}.log"

  log_success "Logs downloaded to amplify-job-${JOB_ID}.log"

  # Display the last 20 lines of the log
  log_info "Last 20 lines of the log:"
  tail -n 20 "amplify-job-${JOB_ID}.log"
}

# Monitor job status
monitor_job() {
  JOB_ID=$1

  log_info "Monitoring job ${JOB_ID}..."

  while true; do
    STATUS=$(get_job_status "${JOB_ID}")

    case $STATUS in
    "PENDING")
      log_info "Job ${JOB_ID} is pending..."
      ;;
    "PROVISIONING")
      log_info "Job ${JOB_ID} is provisioning..."
      ;;
    "RUNNING")
      log_info "Job ${JOB_ID} is running..."
      ;;
    "SUCCEED")
      log_success "Job ${JOB_ID} succeeded!"
      get_job_logs "${JOB_ID}"
      break
      ;;
    "FAILED")
      log_error "Job ${JOB_ID} failed!"
      get_job_logs "${JOB_ID}"
      break
      ;;
    "CANCELLED")
      log_warning "Job ${JOB_ID} was cancelled."
      get_job_logs "${JOB_ID}"
      break
      ;;
    *)
      log_warning "Unknown job status: ${STATUS}"
      ;;
    esac

    sleep $POLL_INTERVAL
  done
}

# Start a new build
start_build() {
  log_info "Starting a new build for app ${APP_ID}, branch ${BRANCH}..."

  BUILD=$(aws amplify start-job --app-id "${APP_ID}" --branch-name "${BRANCH}" --job-type RELEASE --region "${AWS_REGION}")

  # Check if build started
  if [ -z "$BUILD" ] || [ "$BUILD" == "null" ]; then
    log_error "Failed to start build."
    exit 1
  fi

  # Get job ID
  JOB_ID=$(echo $BUILD | jq -r '.jobSummary.jobId')

  if [ -z "$JOB_ID" ] || [ "$JOB_ID" == "null" ]; then
    log_error "Failed to get job ID."
    exit 1
  fi

  log_success "Build started with job ID: ${JOB_ID}"
  echo $JOB_ID
}

# Main function
main() {
  log_info "Starting Amplify deployment monitoring..."

  check_aws_cli

  # Check if we should start a new build
  if [ "$1" == "start" ]; then
    JOB_ID=$(start_build)
  else
    JOB_ID=$(get_latest_job_id)
  fi

  monitor_job "${JOB_ID}"

  log_success "Monitoring completed."
}

# Execute main function with arguments
main "$@"

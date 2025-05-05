#!/bin/bash
# Script to deploy to AWS Amplify and monitor the deployment
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
BRANCH=${1:-"pdf-nextjs"}
COMMIT_MESSAGE=${2:-"Update application with latest changes"}
APP_ID=${APP_ID:-"d25hjzqcr0podj"}
AWS_REGION=${AWS_REGION:-"us-east-2"}

# Check if git is installed
check_git() {
  log_info "Checking git installation..."
  if ! command -v git &>/dev/null; then
    log_error "git is not installed. Please install it first."
    exit 1
  fi

  log_success "git is properly installed."
}

# Check if the branch exists
check_branch() {
  log_info "Checking if branch ${BRANCH} exists..."

  # Check if the branch exists locally
  if ! git show-ref --verify --quiet refs/heads/${BRANCH}; then
    log_warning "Branch ${BRANCH} does not exist locally."

    # Check if the branch exists remotely
    if git ls-remote --exit-code --heads origin ${BRANCH}; then
      log_info "Branch ${BRANCH} exists remotely. Creating local branch..."
      git checkout -b ${BRANCH} origin/${BRANCH}
    else
      log_warning "Branch ${BRANCH} does not exist remotely. Creating new branch..."
      git checkout -b ${BRANCH}
    fi
  else
    log_info "Branch ${BRANCH} exists locally. Checking out..."
    git checkout ${BRANCH}
  fi

  log_success "Now on branch ${BRANCH}."
}

# Commit changes
commit_changes() {
  log_info "Committing changes..."

  # Check if there are any changes to commit
  if git diff-index --quiet HEAD --; then
    log_warning "No changes to commit."
    return
  fi

  # Add all changes
  git add .

  # Commit changes
  git commit -m "${COMMIT_MESSAGE}"

  log_success "Changes committed with message: ${COMMIT_MESSAGE}"
}

# Push changes
push_changes() {
  log_info "Pushing changes to remote..."

  # Push changes
  git push origin ${BRANCH}

  log_success "Changes pushed to remote."
}

# Monitor deployment
monitor_deployment() {
  log_info "Monitoring deployment..."

  # Wait for a few seconds to allow the webhook to trigger
  log_info "Waiting for webhook to trigger..."
  sleep 10

  # Monitor deployment
  ./scripts/monitor-amplify-logs.sh start
}

# Main function
main() {
  log_info "Starting deployment process..."

  check_git
  check_branch
  commit_changes
  push_changes
  monitor_deployment

  log_success "Deployment process completed."
}

# Execute main function
main

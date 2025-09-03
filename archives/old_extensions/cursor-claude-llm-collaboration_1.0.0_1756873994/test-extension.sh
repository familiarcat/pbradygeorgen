#!/bin/zsh

# Extension Testing Script - Robust zsh implementation
# Follows best practices from codebase to avoid shell malformation

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Function to print colored messages (single echo per call)
print_message() {
  local color=$1
  local prefix=$2
  local message=$3
  echo -e "${color}${BOLD}[${prefix}]${NC} ${message}"
}

# Function to run a command and check its exit status
run_command() {
  local command=$1
  local description=$2
  
  print_message "${BLUE}" "RUN" "$description"
  echo "$ $command"
  
  eval $command
  local exit_code=$?
  
  if [ $exit_code -eq 0 ]; then
    print_message "${GREEN}" "SUCCESS" "Command completed successfully"
    return 0
  else
    print_message "${RED}" "ERROR" "Command failed with exit code $exit_code"
    return 1
  fi
}

# Function to check if a file exists
check_file() {
  local file_path=$1
  local file_name=$(basename "$file_path")
  
  if [ -f "$file_path" ]; then
    print_message "${GREEN}" "CHECK" "✓ $file_name exists"
    return 0
  else
    print_message "${RED}" "CHECK" "✗ $file_name does not exist"
    return 1
  fi
}

# Print test header
echo -e "\n${BOLD}${CYAN}=== Extension Testing Protocol ===${NC}\n"
print_message "${BLUE}" "INFO" "Starting robust extension testing protocol"

# Step 1: Extension Compilation
print_message "${CYAN}" "STEP 1" "Extension Compilation"
if ! run_command "npm run compile" "Compiling TypeScript extension"; then
  print_message "${RED}" "ERROR" "Compilation failed"
  exit 1
fi

# Step 2: Extension Packaging
print_message "${CYAN}" "STEP 2" "Extension Packaging"
if ! run_command "npm run package" "Packaging extension"; then
  print_message "${RED}" "ERROR" "Packaging failed"
  exit 1
fi

# Step 3: Extension Installation
print_message "${CYAN}" "STEP 3" "Extension Installation"
if ! run_command "code --uninstall-extension pbradygeorgen.cursor-claude-llm-collaboration" "Uninstalling old extension"; then
  print_message "${YELLOW}" "WARNING" "Uninstall failed (may not be installed)"
fi

if ! run_command "code --install-extension cursor-claude-llm-collaboration-1.0.0.vsix" "Installing new extension"; then
  print_message "${RED}" "ERROR" "Installation failed"
  exit 1
fi

# Step 4: Installation Verification
print_message "${CYAN}" "STEP 4" "Installation Verification"
if ! run_command "ls ~/.vscode/extensions/ | grep pbradygeorgen" "Checking VS Code installation"; then
  print_message "${RED}" "ERROR" "VS Code installation not found"
  exit 1
fi

if ! run_command "ls ~/.cursor/extensions/ | grep pbradygeorgen" "Checking Cursor installation"; then
  print_message "${RED}" "ERROR" "Cursor installation not found"
  exit 1
fi

# Step 5: Configuration Verification
print_message "${CYAN}" "STEP 5" "Configuration Verification"
if ! check_file "package.json"; then
  print_message "${RED}" "ERROR" "package.json not found"
  exit 1
fi

if ! run_command "grep -A 3 'viewsContainers' package.json" "Checking sidebar configuration"; then
  print_message "${RED}" "ERROR" "Sidebar configuration not found"
  exit 1
fi

# Step 6: Final Status
print_message "${CYAN}" "STEP 6" "Final Status Summary"
echo "✅ Extension compiled successfully"
echo "✅ Extension packaged successfully"
echo "✅ Extension installed in VS Code and Cursor"
echo "✅ Sidebar configuration verified"
echo "🚀 READY FOR RESTART TEST!"

print_message "${GREEN}" "SUCCESS" "Extension testing protocol completed successfully"
print_message "${BLUE}" "NEXT" "Restart Cursor to see the 🚀 LLM Collaboration icon in sidebar"


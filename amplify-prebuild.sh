#!/bin/bash
# This script ensures the correct Node.js version is used for Amplify builds

# Print current Node.js and npm versions
echo "Initial Node version: $(node -v)"
echo "Initial NPM version: $(npm -v)"

# Setup NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 18 if not already installed
nvm install 18

# Use Node.js 18
nvm use 18

# Print updated Node.js and npm versions
echo "Updated Node version: $(node -v)"
echo "Updated NPM version: $(npm -v)"

# Exit with success
exit 0

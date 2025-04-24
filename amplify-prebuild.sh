#!/bin/bash
# This script ensures the correct Node.js version is used for Amplify builds

# Print current Node.js and npm versions
echo "Initial Node version: $(node -v)"
echo "Initial NPM version: $(npm -v)"

# Setup NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 20 if not already installed
nvm install 20

# Use Node.js 20
nvm use 20

# Print updated Node.js and npm versions
echo "Updated Node version: $(node -v)"
echo "Updated NPM version: $(npm -v)"

# Exit with success
exit 0

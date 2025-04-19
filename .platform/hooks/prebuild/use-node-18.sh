#!/bin/bash
# Use Node.js 18 for the build

# Setup NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 18 if not already installed
nvm install 18

# Use Node.js 18
nvm use 18

# Print Node.js and npm versions
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Exit with success
exit 0

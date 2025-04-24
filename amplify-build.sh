#!/bin/bash
# Custom build script for AWS Amplify

echo "Starting custom build script for AWS Amplify"

# Print current environment
echo "Current directory: $(pwd)"
echo "Initial Node version: $(node -v)"
echo "Initial NPM version: $(npm -v)"

# Setup NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Force Node.js 20 installation
echo "Installing Node.js 20"
nvm install 20
nvm use 20
nvm alias default 20

# Print updated environment
echo "Updated Node version: $(node -v)"
echo "Updated NPM version: $(npm -v)"

# Install dependencies
echo "Installing dependencies"
npm ci --production=false

# Build the application
echo "Building the application"
NODE_ENV=production npm run build

# Print build completion
echo "Build completed successfully"

# Exit with success
exit 0

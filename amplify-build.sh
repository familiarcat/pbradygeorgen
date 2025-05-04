#!/bin/bash
# Custom build script for AWS Amplify
# Following Dante's philosophy of guiding through different stages with clear logging

echo "👑🌊 [Dante:Purgatorio] Starting custom build script for AWS Amplify"

# Print current environment
echo "👑🌊 [Dante:Purgatorio] Current directory: $(pwd)"
echo "👑🌊 [Dante:Purgatorio] Initial Node version: $(node -v)"
echo "👑🌊 [Dante:Purgatorio] Initial NPM version: $(npm -v)"

# Setup NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Force Node.js 18 installation - try multiple approaches
echo "👑🌊 [Dante:Purgatorio] Installing Node.js 18 using multiple approaches"

# Approach 1: Use NVM
echo "👑🌊 [Dante:Purgatorio] Approach 1: Using NVM"
nvm install 18 || true
nvm use 18 || true
nvm alias default 18 || true

# Approach 2: Use n (Node version manager)
echo "👑🌊 [Dante:Purgatorio] Approach 2: Using n (if available)"
if command -v n &>/dev/null; then
    n 18 || true
fi

# Approach 3: Direct download if needed
echo "👑🌊 [Dante:Purgatorio] Approach 3: Direct download if needed"
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" != "18" ]; then
    echo "👑🌊 [Dante:Purgatorio] Node.js 18 not installed via NVM or n, attempting direct download"
    mkdir -p $HOME/nodejs
    curl -o $HOME/nodejs/node-v18.19.1-linux-x64.tar.xz https://nodejs.org/dist/v18.19.1/node-v18.19.1-linux-x64.tar.xz
    tar -xJf $HOME/nodejs/node-v18.19.1-linux-x64.tar.xz -C $HOME/nodejs
    export PATH=$HOME/nodejs/node-v18.19.1-linux-x64/bin:$PATH
fi

# Print updated environment
echo "👑⭐ [Dante:Paradiso] Updated Node version: $(node -v)"
echo "👑⭐ [Dante:Paradiso] Updated NPM version: $(npm -v)"

# Verify Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" != "18" ]; then
    echo "👑🔥 [Dante:Inferno:Error] Failed to install Node.js 18. Current version: $(node -v)"
    echo "👑🌊 [Dante:Purgatorio] Attempting to continue anyway..."
fi

# Set up Amplify environment
echo "👑🌊 [Dante:Purgatorio] Setting up Amplify environment..."
node scripts/setup-amplify-env.js

if [ $? -eq 0 ]; then
    echo "👑⭐ [Dante:Paradiso] Amplify environment set up successfully"
else
    echo "👑🔥 [Dante:Inferno:Warning] Amplify environment setup failed, but continuing build"
fi

# Install dependencies with increased memory limit
echo "👑🌊 [Dante:Purgatorio] Installing dependencies"
export NODE_OPTIONS=--max_old_space_size=4096
echo "👑🌊 [Dante:Purgatorio] Creating .npmrc file"
echo "engine-strict=false" >.npmrc
echo "ignore-engines=true" >>.npmrc
cat .npmrc

# Run the prebuild script
echo "👑🌊 [Dante:Purgatorio] Running prebuild script..."
./amplify-prebuild.sh

if [ $? -ne 0 ]; then
    echo "👑🔥 [Dante:Inferno:Warning] Prebuild script failed, but continuing"
fi

# Try different npm install approaches
echo "👑🌊 [Dante:Purgatorio] Approach 1: npm ci with --ignore-engines"
npm ci --production=false --ignore-engines || true

echo "👑🌊 [Dante:Purgatorio] Approach 2: npm install with --force"
npm install --force || true

echo "👑🌊 [Dante:Purgatorio] Approach 3: npm install with specific packages"
npm install uuid@9.0.1 glob@10.3.10 rimraf@5.0.5 lru-cache@10.2.0 --force || true

# Build the application
echo "👑🌊 [Dante:Purgatorio] Building the application"
NODE_ENV=production npm run build

if [ $? -eq 0 ]; then
    echo "👑⭐ [Dante:Paradiso] Build completed successfully"
else
    echo "👑🔥 [Dante:Inferno:Error] Build failed"
    exit 1
fi

# Exit with success
exit 0

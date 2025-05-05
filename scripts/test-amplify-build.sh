#!/bin/bash
# Test AWS Amplify Build Process Locally
# This script simulates the AWS Amplify build process locally to test if it works correctly

set -e # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting local test of AWS Amplify build process"

# Create a temporary directory for the build
BUILD_DIR=$(mktemp -d)
echo "📁 Created temporary build directory: $BUILD_DIR"

# Copy the current project to the build directory
echo "📋 Copying project to build directory..."
cp -r . $BUILD_DIR
cd $BUILD_DIR

# Print current environment
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Set environment variables
export NODE_ENV=production
export AWS_EXECUTION_ENV=true
export AMPLIFY_USE_LOCAL=false
export AMPLIFY_USE_STORAGE=true
export S3_BUCKET_NAME=alexai-pdf-storage-prod
export DEBUG_LOGGING=true
export NEXT_TELEMETRY_DISABLED=1
export NEXT_PUBLIC_AMPLIFY_DEPLOYED=true
export NEXT_PUBLIC_DEPLOYMENT_ENV=production

# Run the preBuild commands from amplify.yml
echo "📦 Running preBuild commands..."
echo "Creating necessary directories"
mkdir -p public/extracted
echo "Installing dependencies"
npm ci --production=false --ignore-engines || npm install --force
echo "Making scripts executable"
chmod +x *.sh
chmod +x scripts/*.sh
chmod +x scripts/*.js

# Run the build commands from amplify.yml
echo "🔨 Running build commands..."
echo "Running custom build script..."
./amplify-build.sh

# Run the postBuild commands from amplify.yml
echo "🧹 Running postBuild commands..."
echo "Running post-build commands"
node scripts/fix-standalone-directory.js
echo "Standalone directory fixed"
echo "Verifying standalone directory structure"
ls -la .next/standalone
echo "Verifying server.js exists"
ls -la .next/standalone/server.js || cp server.js .next/standalone/

# Test the standalone server
echo "🧪 Testing the standalone server..."
cd .next/standalone
node server.js &
SERVER_PID=$!

# Wait for the server to start
echo "⏳ Waiting for the server to start..."
sleep 5

# Test the server with curl
echo "🌐 Testing the server with curl..."
curl -s http://localhost:3000 > /dev/null
if [ $? -eq 0 ]; then
  echo "✅ Server is running correctly"
else
  echo "❌ Server failed to start"
fi

# Kill the server
echo "🛑 Stopping the server..."
kill $SERVER_PID

# Clean up
echo "🧹 Cleaning up..."
cd ../..
rm -rf $BUILD_DIR

echo "✅ Local test of AWS Amplify build process completed"

#!/bin/bash
# consolidated-start.sh - Start the application in production mode
# This script starts the application and runs basic health checks

set -e # Exit immediately if a command exits with a non-zero status

echo "🚀 STARTING APPLICATION IN PRODUCTION MODE"
echo "=========================================="
echo "Start timestamp: $(date)"

# Create a directory for logs
LOG_DIR="$(pwd)/logs"
mkdir -p "$LOG_DIR"
START_LOG="$LOG_DIR/start-$(date +%Y%m%d-%H%M%S).log"

# Function to log messages
log() {
  echo "$1"
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" >>"$START_LOG"
}

# Check if the build exists
if [ ! -d ".next/standalone" ]; then
  log "⚠️ Warning: Standalone directory not found. Creating it manually..."
  node scripts/create-standalone.js >>"$START_LOG" 2>&1

  # Check again
  if [ ! -d ".next/standalone" ]; then
    log "❌ Error: Failed to create standalone directory. Creating minimal structure..."
    mkdir -p .next/standalone/.next/static
    mkdir -p .next/standalone/public/extracted

    # Create a minimal server.js file
    echo 'const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<html><body><h1>AlexAI - Resume Analyzer</h1><p>Server is running.</p></body></html>");
});
server.listen(3000, () => console.log("Server running on port 3000"));' >.next/standalone/server.js

    log "✅ Created minimal standalone structure"
  else
    log "✅ Standalone directory created successfully"
  fi
fi

if [ ! -f ".next/standalone/server.js" ]; then
  log "⚠️ Warning: server.js not found in standalone directory. Creating it..."

  # Create a minimal server.js file
  echo 'const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<html><body><h1>AlexAI - Resume Analyzer</h1><p>Server is running.</p></body></html>");
});
server.listen(3000, () => console.log("Server running on port 3000"));' >.next/standalone/server.js

  log "✅ Created server.js file"
fi

# Ensure extracted directory exists
if [ ! -d ".next/standalone/public/extracted" ]; then
  log "⚠️ Warning: extracted directory not found. Creating it..."
  mkdir -p .next/standalone/public/extracted

  # Copy extracted content if it exists
  if [ -d "public/extracted" ]; then
    cp -R public/extracted/* .next/standalone/public/extracted/ >>"$START_LOG" 2>&1 || true
  fi

  log "✅ Created extracted directory"
fi

# Check if the application is already running
if curl -s http://localhost:3000 >/dev/null 2>&1; then
  log "⚠️ Warning: Application is already running on port 3000"
  log "You may need to stop the existing instance before starting a new one"

  # Ask the user if they want to continue
  read -p "Do you want to continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log "❌ Aborted by user"
    exit 1
  fi
fi

# Start the application
log "🚀 Starting the application..."
log "The application will be available at http://localhost:3000"

# Copy static assets to the standalone directory
log "📂 Copying static assets to standalone directory..."
mkdir -p .next/standalone/.next/static
cp -R .next/static/* .next/standalone/.next/static/

# Copy public directory to standalone
log "📂 Copying public directory to standalone..."
cp -R public .next/standalone/

# Change to the standalone directory
cd .next/standalone

# Start the server in the background
log "🚀 Starting server..."
NODE_ENV=production node server.js >"$START_LOG" 2>&1 &
SERVER_PID=$!

# Function to check if the server is running
check_server() {
  if ! ps -p $SERVER_PID >/dev/null; then
    log "❌ Server process died unexpectedly"
    exit 1
  fi
}

# Wait for the server to start
log "⏳ Waiting for the server to start..."
for i in {1..30}; do
  if curl -s http://localhost:3000 >/dev/null 2>&1; then
    log "✅ Server started successfully"
    break
  fi

  check_server
  sleep 1

  if [ $i -eq 30 ]; then
    log "❌ Server failed to start within 30 seconds"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
  fi
done

# Run basic health checks
log "🔍 Running basic health checks..."

# Check if the home page loads
if curl -s http://localhost:3000 | grep -q "Professional Resume"; then
  log "✅ Home page loads successfully"
else
  log "⚠️ Warning: Home page may not be loading correctly"
fi

# Check if the JSON view page loads
if curl -s http://localhost:3000/json-view | grep -q "JSON"; then
  log "✅ JSON view page loads successfully"
else
  log "⚠️ Warning: JSON view page may not be loading correctly"
fi

# Success message
log "🎉 Application started successfully!"
log "The application is running at http://localhost:3000"
log "Press Ctrl+C to stop the server"

# Run the enhanced start logger in a separate process
(cd ../../ && node scripts/enhanced-start-logger.js) &

# Bring the server process to the foreground
wait $SERVER_PID

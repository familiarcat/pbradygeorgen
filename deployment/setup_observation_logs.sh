#!/bin/bash

echo "🖖 Initializing AlexAI Observation Lounge Log Migration and Setup..."

# Step 1: Create logs directory if it doesn't exist
LOG_DIR="alexai/logs/observation_lounge"
if [ ! -d "$LOG_DIR" ]; then
  echo "📁 Creating logs directory at $LOG_DIR"
  mkdir -p "$LOG_DIR"
else
  echo "✅ Logs directory already exists at $LOG_DIR"
fi

# Step 2: Copy existing logs from /mnt/data/ to project directory (if available)
MNT_LOG_DIR="/mnt/data/observation_lounge_logs"
if [ -d "$MNT_LOG_DIR" ]; then
  echo "📦 Copying logs from $MNT_LOG_DIR to $LOG_DIR"
  cp "$MNT_LOG_DIR"/*.json "$LOG_DIR"/ 2>/dev/null || echo "⚠️ No .json logs found to copy."
else
  echo "⚠️ No /mnt/data/observation_lounge_logs directory found. Skipping copy step."
fi

# Step 3: Reminder to update future script paths
echo "🔧 Please ensure all future Observation Lounge logs are written to: $LOG_DIR"

echo "✅ Setup complete. Logs are now stored at: $LOG_DIR"

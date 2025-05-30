#!/bin/bash

# Ensure we are in the root of the AlexAI project
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCENARIO_PATH="$PROJECT_ROOT/alexai/scenarios/observation_lounge_scenarios.json"
LOG_DIR="$PROJECT_ROOT/alexai/logs/observation_lounge"

# Check if scenario file exists
if [ ! -f "$SCENARIO_PATH" ]; then
    echo "[ERROR] Scenario file not found at $SCENARIO_PATH"
    exit 1
fi

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Run the simulation
echo "[INFO] Running Observation Lounge simulation with scenarios from $SCENARIO_PATH..."
# Placeholder for actual run command, assumed to be `node run_observation_lounge.js`
# You should replace this with the actual command your project uses
node run_observation_lounge.js --scenarios "$SCENARIO_PATH" --log-dir "$LOG_DIR"

echo "[INFO] Logs saved to $LOG_DIR"

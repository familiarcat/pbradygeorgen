#!/bin/bash

echo "[INFO] Starting advanced Observation Lounge Simulation..."

# Define paths
PROJECT_ROOT=$(pwd)
SIM_SCRIPT="$PROJECT_ROOT/alexai/simulation/simulateObservationLounge.ts"
SCENARIO_FILE="$PROJECT_ROOT/alexai/scenarios/observation_lounge_scenarios.json"
LOG_DIR="$PROJECT_ROOT/alexai/logs/observation_lounge"

# Check if simulation script exists
if [ ! -f "$SIM_SCRIPT" ]; then
  echo "[ERROR] Simulation script not found at $SIM_SCRIPT"
  exit 1
fi

# Check if scenario file exists
if [ ! -f "$SCENARIO_FILE" ]; then
  echo "[ERROR] Scenario file not found at $SCENARIO_FILE"
  exit 1
fi

# Ensure logs directory exists
mkdir -p "$LOG_DIR"

# Run the simulation with mock mode and shared context
echo "[INFO] Running simulation with mock API and shared crew context..."
npx ts-node "$SIM_SCRIPT" --scenario "$SCENARIO_FILE" --log "$LOG_DIR" --mock --crew_context

echo "[INFO] Simulation complete. Logs available at $LOG_DIR"

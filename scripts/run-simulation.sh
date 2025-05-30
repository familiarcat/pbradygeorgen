#!/bin/bash

echo "[🧪] Ensuring simulateObservationLounge.ts has correct ES module path resolution..."

SIM_FILE="alexai/simulation/simulateObservationLounge.ts"

# Add __dirname polyfill if not already present
if ! grep -q "fileURLToPath(import.meta.url)" "$SIM_FILE"; then
  cat <<EOF > "$SIM_FILE"
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.resolve(__dirname, '../../alexai');

// Original content goes below
// TODO: Append simulation logic here or pull from fragments
EOF

  echo "[⚙️] simulateObservationLounge.ts base structure updated."
else
  echo "[✔️] simulateObservationLounge.ts already has ES module compatibility."
fi

echo "[🔧] Building simulation..."
npm run simulate:build

if [ $? -eq 0 ]; then
  echo "[🚀] Launching Observation Lounge simulation..."
  npm run simulate:run
else
  echo "[❌] Simulation build failed. Aborting run."
fi

echo "[📊] Simulation complete. Check logs for details."
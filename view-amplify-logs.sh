#!/bin/bash
# Script to view simulated Amplify build logs

echo "👑🌊 [Dante:Purgatorio] Viewing Amplify build logs..."
echo ""

# Check if the log file exists
if [ ! -f "amplify-build-simulation.log" ]; then
  echo "👑🔥 [Dante:Inferno:Error] Amplify build log file not found."
  exit 1
fi

# Display the log file with colors
echo "=== Amplify Build Log ==="
echo ""

# Read the log file line by line
while IFS= read -r line; do
  # Color the log levels
  if [[ $line == *"[INFO]"* ]]; then
    # Blue for INFO
    echo -e "\033[34m$line\033[0m"
  elif [[ $line == *"[WARNING]"* ]]; then
    # Yellow for WARNING
    echo -e "\033[33m$line\033[0m"
  elif [[ $line == *"[ERROR]"* ]]; then
    # Red for ERROR
    echo -e "\033[31m$line\033[0m"
  elif [[ $line == *"[SUCCESS]"* ]]; then
    # Green for SUCCESS
    echo -e "\033[32m$line\033[0m"
  elif [[ $line == *"[Dante:Purgatorio]"* ]]; then
    # Cyan for Dante:Purgatorio
    echo -e "\033[36m$line\033[0m"
  elif [[ $line == *"[Dante:Paradiso]"* ]]; then
    # Green for Dante:Paradiso
    echo -e "\033[32m$line\033[0m"
  elif [[ $line == *"[Dante:Inferno"* ]]; then
    # Red for Dante:Inferno
    echo -e "\033[31m$line\033[0m"
  else
    # Default color
    echo "$line"
  fi
done < "amplify-build-simulation.log"

echo ""
echo "=== End of Amplify Build Log ==="
echo ""
echo "👑⭐ [Dante:Paradiso] Build completed successfully!"
echo "👑🌊 [Dante:Purgatorio] You can view the deployed application at: https://fix-download-test.d25hjzqcr0podj.amplifyapp.com"

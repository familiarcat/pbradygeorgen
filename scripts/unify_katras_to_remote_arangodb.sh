#!/bin/bash

# === AlexAI Unify Katras Script ===

ARANGO_PASS="secretpassword"
KATRA_DIR=""
SEED_FILE="./katras_seed.json"

# === Force AWS Profile ===
# Always default to AmplifyUser unless explicitly passed
AWS_PROFILE="${AWS_PROFILE:-AmplifyUser}"

# === Locate katra directory ===
if [ -d "./alexai/katras" ]; then
  KATRA_DIR="./alexai/katras"
elif [ -d "./katra" ]; then
  KATRA_DIR="./katra"
else
  echo "[ERROR] ❌ No katra directory found in ./alexai/katras or ./katra"
  exit 1
fi

echo "[START] 🚀 Unifying katras to remote ArangoDB"
echo "[GEN] 🧬 Generating $SEED_FILE from $KATRA_DIR"

# Generate valid JSON array of katras
jq -s '.' "$KATRA_DIR"/*.katra.json > "$SEED_FILE"

if [ $? -ne 0 ]; then
  echo "[ERROR] ❌ Failed to generate JSON seed file"
  exit 1
fi

# === Get remote EC2 IP ===
REMOTE_IP=$(aws ec2 describe-instances \
  --profile "$AWS_PROFILE" \
  --filters "Name=tag:Name,Values=AlexAI-ArangoDB" "Name=instance-state-name,Values=running" \
  --query "Reservations[].Instances[].PublicIpAddress" \
  --output text)

if [[ -z "$REMOTE_IP" || "$REMOTE_IP" == "None" ]]; then
  echo "[ERROR] ❌ Could not retrieve EC2 IP using profile '$AWS_PROFILE'"
  exit 1
fi

ARANGO_URL="http://$REMOTE_IP:8529"

# === Create collection if needed ===
echo "[CREATE] 🗂️ Creating 'katras' collection at $ARANGO_URL"
curl -s -u root:$ARANGO_PASS -X POST "$ARANGO_URL/_db/_system/_api/collection" \
  -H "Content-Type: application/json" \
  -d '{"name": "katras"}' > /dev/null

# === Upload katras ===
echo "[UPLOAD] 📤 Uploading $SEED_FILE to $ARANGO_URL"
curl -s -u root:$ARANGO_PASS -X POST \
  "$ARANGO_URL/_db/_system/_api/import?collection=katras&overwrite=true" \
  -H "Content-Type: application/json" \
  --data-binary @"$SEED_FILE" | jq

echo "[DONE] ✅ Remote ArangoDB updated with unified katras."

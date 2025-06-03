#!/bin/bash

# === AlexAI ArangoDB CLI ===
# Usage:
#   ./arangodb-cli.sh local                      -> seed to local ArangoDB
#   ./arangodb-cli.sh remote                     -> seed to remote EC2 ArangoDB
#   ./arangodb-cli.sh query-local                -> list katras from local ArangoDB
#   ./arangodb-cli.sh query-remote               -> list katras from EC2 ArangoDB
#   ./arangodb-cli.sh remote --profile MyProfile -> use specific AWS CLI profile

ARANGO_PASS="secretpassword"
LOCAL_URL="http://localhost:8529"
AWS_PROFILE="AmplifyUser"  # Default profile

# --- Parse arguments ---
ACTION="$1"
shift

# Optional: --profile MyProfile
while [[ "$1" != "" ]]; do
  case $1 in
    --profile )
      shift
      AWS_PROFILE="$1"
      ;;
  esac
  shift
done

# --- Get EC2 IP only if needed ---
if [[ "$ACTION" == "remote" || "$ACTION" == "query-remote" ]]; then
  REMOTE_URL=$(aws ec2 describe-instances \
    --profile "$AWS_PROFILE" \
    --filters "Name=tag:Name,Values=AlexAI-ArangoDB" "Name=instance-state-name,Values=running" \
    --query "Reservations[].Instances[].PublicIpAddress" --output text)

  if [[ -z "$REMOTE_URL" || "$REMOTE_URL" == "None" ]]; then
    echo "[ERROR] ❌ Could not retrieve EC2 IP using profile '$AWS_PROFILE'"
    exit 1
  fi

  ARANGO_URL="http://$REMOTE_URL:8529"
else
  ARANGO_URL="$LOCAL_URL"
fi

# --- Define tasks ---
create_collection() {
  echo "[CREATE] 🗂️ Creating 'katras' collection in ArangoDB at $ARANGO_URL"
  curl -s -u root:$ARANGO_PASS -X POST "$ARANGO_URL/_db/_system/_api/collection" \
    -H "Content-Type: application/json" \
    -d '{"name": "katras"}' | jq
}

seed_katras() {
  echo "[SEED] 🌱 Seeding AlexAI katras into ArangoDB from ./katras_seed.json"
  curl -s -u root:$ARANGO_PASS -X POST "$ARANGO_URL/_db/_system/_api/import?collection=katras&overwrite=false" \
    -H "Content-Type: application/json" \
    --data-binary "@katras_seed.json" | jq
}

query_katras() {
  echo "[QUERY] 🔍 Querying all katras in $ARANGO_URL"
  curl -s -u root:$ARANGO_PASS "$ARANGO_URL/_db/_system/_api/cursor" \
    -H "Content-Type: application/json" \
    -d '{"query": "FOR doc IN katras RETURN doc"}' | jq
}

# --- Router ---
case "$ACTION" in
  local)
    create_collection
    seed_katras
    ;;
  remote)
    create_collection
    seed_katras
    ;;
  query-local)
    query_katras
    ;;
  query-remote)
    query_katras
    ;;
  *)
    echo "Usage:"
    echo "  ./arangodb-cli.sh local                      -> seed to local ArangoDB"
    echo "  ./arangodb-cli.sh remote                     -> seed to remote EC2 ArangoDB"
    echo "  ./arangodb-cli.sh query-local                -> list katras from local ArangoDB"
    echo "  ./arangodb-cli.sh query-remote               -> list katras from EC2 ArangoDB"
    echo "  ./arangodb-cli.sh remote --profile MyProfile -> use a specific AWS CLI profile"
    ;;
esac

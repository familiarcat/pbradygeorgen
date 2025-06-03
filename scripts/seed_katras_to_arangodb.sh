#!/bin/bash
set -e

EC2_PUBLIC_IP=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=AlexAI-ArangoDB" "Name=instance-state-name,Values=running" \
  --query "Reservations[*].Instances[*].PublicIpAddress" --output text --profile AmplifyUser)

ARANGO_URL="http://$EC2_PUBLIC_IP:8529"
AUTH="root:secretpassword"
DB="_system"
COLLECTION="katras"
KATRA_SEED="./katras_seed.json"

echo "[SEED] 🌱 Seeding AlexAI katras into ArangoDB at $ARANGO_URL"

# Ensure katras collection exists
curl -s -o /dev/null -w "%{http_code}" -u $AUTH \
  -X POST "$ARANGO_URL/_db/$DB/_api/collection" \
  -H "Content-Type: application/json" \
  --data '{"name":"katras"}' || true

# POST the entire katra_seed.json
cat "$KATRA_SEED" | jq -c '.[]' | while read -r katra; do
  id=$(echo "$katra" | jq -r '.id')
  echo "[SEED] 🚀 Sending $id"
  curl -s -u $AUTH -X POST "$ARANGO_URL/_db/$DB/_api/document/$COLLECTION" \
    -H "Content-Type: application/json" \
    --data "$katra" > /dev/null
done

echo "[COMPLETE] ✅ All katras transmitted to remote ArangoDB"

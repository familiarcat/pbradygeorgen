#!/bin/bash
ARANGO_URL="http://localhost:8529"
AUTH="root:secretpassword"
DB="_system"
COLLECTION="katras"

echo "[CREATE] 🗂️ Creating 'katras' collection in ArangoDB"

RESPONSE=$(curl -s -X POST -u $AUTH \
  -H "Content-Type: application/json" \
  --data '{"name":"katras"}' \
  "$ARANGO_URL/_db/$DB/_api/collection")

echo "[CREATE] ✅ Collection 'katras' created (or already exists)."
echo "$RESPONSE"

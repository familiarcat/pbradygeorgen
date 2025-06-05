#!/bin/bash
echo '🛠️ Patching crew-comission route to explicitly type crew array...'

ROUTE_FILE="./app/alexai/crew-comission/route.ts"
BACKUP_FILE="$ROUTE_FILE.bak"

if [ ! -f "$ROUTE_FILE" ]; then
  echo "❌ Route file not found: $ROUTE_FILE"
  exit 1
fi

cp "$ROUTE_FILE" "$BACKUP_FILE"
echo "📦 Backup created at $BACKUP_FILE"

# Use sed to replace 'let crew = []' with 'let crew: CrewMember[] = []'
sed -i '' 's/let crew = \[\]/let crew: CrewMember[] = \[\]/' "$ROUTE_FILE"

echo "✅ crew array explicitly typed. Patch complete: $ROUTE_FILE"

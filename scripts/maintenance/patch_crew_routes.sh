#!/bin/bash
set -e

echo "🛠️ Patching crew-conversations and crew-comission route files..."

# Define paths
CREW_CONVERSATIONS_PATH="./app/alexai/crew-conversations/route.ts"
CREW_COMMISSION_PATH="./app/alexai/crew-comission/route.ts"

# Patch crew-conversations/route.ts: Fix default import issue
sed -i '' 's|import openai from '''@/lib/server/openai'''|import { openai } from '''@/lib/server/openai'''|' "$CREW_CONVERSATIONS_PATH" || echo "⚠️ Could not patch crew-conversations import."

# Patch crew-comission/route.ts: Add CrewMember interface and fix typing
if grep -q "const crew =" "$CREW_COMMISSION_PATH"; then
  sed -i '' '/const crew =/i\
interface CrewMember {\
  name: string;\
  specialization: string;\
  katraFile: string;\
}\
' "$CREW_COMMISSION_PATH"

  sed -i '' 's|const crew = JSON.parse|const crew: CrewMember[] = JSON.parse|' "$CREW_COMMISSION_PATH"
  echo "✅ Patched crew-comission typings."
else
  echo "⚠️ Could not locate expected line in crew-comission for patching."
fi

echo "✅ Patch complete. You may now run 'npm run build' again."

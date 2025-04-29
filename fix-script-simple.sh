#!/bin/bash
# Create a backup of the original file
cp app/api/format-content/route.ts app/api/format-content/route.ts.bak

# Use awk to fix the specific lines
awk '
NR == 656 { print "  return await formatWithOpenAI(content, systemPrompt, \"markdown\");" }
NR == 1027 { print "  return await formatWithOpenAI(content, systemPrompt, \"text\");" }
NR != 656 && NR != 1027 { print }
' app/api/format-content/route.ts.bak > app/api/format-content/route.ts

echo "Fixed the file"

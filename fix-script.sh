#!/bin/bash
# Create a temporary file
cp app/api/format-content/route.ts app/api/format-content/route.ts.tmp

# Fix the first error (line 656)
sed -i '' '656s/return await formatWithOpenAI(content, systemPrompt, '\''markdown'\'');/return await formatWithOpenAI(content, systemPrompt, '\''markdown'\'');/' app/api/format-content/route.ts.tmp

# Fix the second error (line 1027)
sed -i '' '1027s/return await formatWithOpenAI(content, systemPrompt, '\''text'\'');/return await formatWithOpenAI(content, systemPrompt, '\''text'\'');/' app/api/format-content/route.ts.tmp

# Replace the original file with the fixed version
mv app/api/format-content/route.ts.tmp app/api/format-content/route.ts

echo "Fixed the file"

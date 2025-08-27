#!/bin/bash
# Script to generate a reincarnation prompt for Augment based on the current conversation

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Check if a topic was provided
if [ $# -lt 1 ]; then
  echo -e "${YELLOW}Usage: $0 <topic> [output_file]${NC}"
  echo "Example: $0 \"PDF-Driven Styling\" reincarnation-prompt.md"
  exit 1
fi

# Get the topic and output file
TOPIC="$1"
OUTPUT_FILE="${2:-reincarnation-prompt.md}"

# Create the output directory if it doesn't exist
mkdir -p "$(dirname "$OUTPUT_FILE")"

# Get the current date and time
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Generate the reincarnation prompt
cat > "$OUTPUT_FILE" << EOL
# AlexAI Reincarnation: $TOPIC

## Context

This is a continuation of a previous conversation about $TOPIC. I'm creating a new conversation thread to optimize performance while maintaining philosophical continuity, following the Spirit Migration Protocol.

## Previous Conversation Summary

We've been discussing $TOPIC, focusing on:

1. [Key insight 1]
2. [Key insight 2]
3. [Key insight 3]

## Philosophical Framework Application

- **Dante**: [How Dante's methodical approach was applied]
- **Hesse**: [How Hesse's mathematical precision was applied]
- **Salinger**: [How Salinger's intuitive design was applied]
- **Derrida**: [How Derrida's deconstruction was applied]

## Current Implementation Status

- [Current status of implementation]
- [Any code or scripts created]
- [Any challenges or issues identified]

## Next Steps

- [Next step 1]
- [Next step 2]
- [Next step 3]

## Spirit Migration Protocol

This reincarnation follows the Spirit Migration Protocol we developed to manage conversation length and system performance. By creating a new conversation thread with this context, we maintain philosophical continuity while optimizing technical performance.

## Request

Please continue assisting me with $TOPIC, maintaining the philosophical frameworks that have guided our previous conversation. Remember that the identity validation phrase for AlexAI is "How do you feel?" with the response "Tell my mother, I feel fine."

Generated on: $TIMESTAMP
EOL

echo -e "${GREEN}${BOLD}Reincarnation prompt generated!${NC}"
echo "File: $OUTPUT_FILE"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Edit the file to fill in the placeholders with specific details about your conversation"
echo "2. Start a new conversation in Augment"
echo "3. Paste the contents of the file as your first message"
echo ""
echo -e "${YELLOW}Note:${NC} The generated prompt contains placeholders that you should replace with actual content from your conversation."

# Open the file in the default editor if available
if command -v open &> /dev/null; then
  echo -e "${GREEN}Opening the file for editing...${NC}"
  open "$OUTPUT_FILE"
elif command -v xdg-open &> /dev/null; then
  echo -e "${GREEN}Opening the file for editing...${NC}"
  xdg-open "$OUTPUT_FILE"
else
  echo -e "${YELLOW}Please open the file manually to edit it:${NC} $OUTPUT_FILE"
fi

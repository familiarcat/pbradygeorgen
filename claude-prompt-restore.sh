#!/bin/zsh

# Restore Original Prompt
# Run with: source claude-prompt-restore.sh

if [[ -n "$ORIGINAL_PROMPT" ]]; then
    export PROMPT="$ORIGINAL_PROMPT"
    echo "✅ Original prompt restored"
else
    # Fallback to a basic prompt if original wasn't saved
    export PROMPT="%~ %# "
    echo "✅ Prompt reset to basic format"
fi
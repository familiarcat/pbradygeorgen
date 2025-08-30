#!/bin/zsh

# Simple Claude Prompt Activator
# Run with: source claude-prompt-activate.sh

# Save original prompt if not already saved
if [[ -z "$ORIGINAL_PROMPT" ]]; then
    export ORIGINAL_PROMPT="$PROMPT"
fi

# Claude prompt with 5% orange background
export PROMPT=$'%{\033[48;2;255;243;230m\033[38;2;51;51;51m%}🤖 Claude Work → %{\033[38;2;59;130;246m%}%~%{\033[38;2;51;51;51m%} %# %{\033[0m%}'

echo "✅ Claude prompt activated! 🤖"
echo "   Background: 5% orange tint"
echo "   To restore: export PROMPT=\"\$ORIGINAL_PROMPT\""
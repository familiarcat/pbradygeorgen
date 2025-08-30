#!/bin/zsh

# Claude Prompt Activator for Oh My Zsh
# Run with: source claude-prompt-activate-ohmyzsh.sh

# Save original theme if not already saved
if [[ -z "$ORIGINAL_ZSH_THEME" ]]; then
    export ORIGINAL_ZSH_THEME="$ZSH_THEME"
fi

# Temporarily disable Oh My Zsh theme
export ZSH_THEME=""

# Set Claude prompt with 5% orange background
export PROMPT=$'%{\033[48;2;255;243;230m\033[38;2;51;51;51m%}🤖 Claude Work → %{\033[38;2;59;130;246m%}%~%{\033[38;2;51;51;51m%} %# %{\033[0m%}'

echo "✅ Claude prompt activated! 🤖"
echo "   Background: 5% orange tint"
echo "   Oh My Zsh theme temporarily disabled"
echo "   To restore: export ZSH_THEME=\"\$ORIGINAL_ZSH_THEME\" && source ~/.zshrc"

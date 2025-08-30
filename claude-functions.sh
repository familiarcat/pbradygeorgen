#!/bin/zsh

# 🤖 Claude Functions for Oh My Zsh

claude-ohmyzsh() {
    # Save original theme if not already saved
    if [[ -z "$ORIGINAL_ZSH_THEME" ]]; then
        export ORIGINAL_ZSH_THEME="$ZSH_THEME"
    fi
    
    # Temporarily disable Oh My Zsh theme
    export ZSH_THEME=""
    
    # Set Claude prompt with 5% orange background
    export PROMPT="🤖 Claude Work → %~ %# "
    
    echo "✅ Claude prompt activated! 🤖"
    echo "   Oh My Zsh theme temporarily disabled"
    echo "   To restore: claude-restore"
}

claude-restore() {
    if [[ -n "$ORIGINAL_ZSH_THEME" ]]; then
        export ZSH_THEME="$ORIGINAL_ZSH_THEME"
        source ~/.zshrc
        echo "✅ Claude prompt restored! Original theme: $ORIGINAL_ZSH_THEME"
    else
        echo "❌ No Claude prompt to restore. Use 'claude-ohmyzsh' first."
    fi
}

# Auto-activate Claude prompt (runs automatically)
claude-auto() {
    # You can add conditions here, for example:
    # if [[ "$PWD" == *"workspace"* ]]; then
    #     claude-ohmyzsh
    # fi
    
    # For now, always activate
    claude-ohmyzsh
}

# Simple alias for the new function
alias claude="claude-ohmyzsh"

#!/bin/bash

# Claude Terminal Prompt Setup
# Adds a 5% orange background to distinguish Claude work sessions

# Color codes for 5% orange background and complementary text
ORANGE_BG="\033[48;2;255;243;230m"  # Very light orange background (5% orange tint)
DARK_TEXT="\033[38;2;51;51;51m"     # Dark gray text for contrast
BLUE_TEXT="\033[38;2;59;130;246m"   # Blue accent for path
RESET="\033[0m"                     # Reset all colors

# Custom Claude prompt function
setup_claude_prompt() {
    # Save original prompt
    if [[ -z "$ORIGINAL_PS1" ]]; then
        export ORIGINAL_PS1="$PS1"
        export ORIGINAL_PROMPT="$PROMPT"
    fi
    
    # Set custom PS1 for bash compatibility
    export PS1="${ORANGE_BG}${DARK_TEXT}🤖 Claude Work → ${BLUE_TEXT}\\w${DARK_TEXT} \\$ ${RESET}"
    
    # Set custom PROMPT for zsh
    export PROMPT="${ORANGE_BG}${DARK_TEXT}🤖 Claude Work → ${BLUE_TEXT}%~${DARK_TEXT} %# ${RESET}"
    
    echo "✅ Claude prompt activated! 🤖"
    echo "   - 5% orange background enabled"
    echo "   - Use 'restore_prompt' to return to original"
}

# Function to restore original prompt
restore_prompt() {
    if [[ -n "$ORIGINAL_PS1" ]]; then
        export PS1="$ORIGINAL_PS1"
    fi
    if [[ -n "$ORIGINAL_PROMPT" ]]; then
        export PROMPT="$ORIGINAL_PROMPT"
    fi
    echo "✅ Original prompt restored"
}

# Function to toggle between Claude and original prompt
toggle_claude_prompt() {
    if [[ "$PS1" == *"Claude Work"* ]] || [[ "$PROMPT" == *"Claude Work"* ]]; then
        restore_prompt
    else
        setup_claude_prompt
    fi
}

# Create convenient aliases
alias claude-prompt='setup_claude_prompt'
alias restore-prompt='restore_prompt'
alias toggle-prompt='toggle_claude_prompt'

# Auto-setup if script is sourced directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    echo "💡 Usage:"
    echo "   source $0                 # Load functions into shell"
    echo "   claude-prompt            # Activate Claude prompt"
    echo "   restore-prompt           # Restore original prompt" 
    echo "   toggle-prompt            # Toggle between prompts"
else
    echo "🤖 Claude prompt functions loaded!"
    echo "   Run 'claude-prompt' to activate"
fi

# Export functions for use in shell
export -f setup_claude_prompt 2>/dev/null || true
export -f restore_prompt 2>/dev/null || true  
export -f toggle_claude_prompt 2>/dev/null || true
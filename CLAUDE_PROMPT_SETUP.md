# 🤖 Claude Terminal Prompt Setup

This guide helps you set up a custom terminal prompt with a **5% orange background** to visually distinguish when you're working with Claude.

## 🎨 **Visual Preview**
```
🤖 Claude Work → ~/Documents/workspace/pbradygeorgen $ 
```
*(With subtle orange background and dark text for contrast)*

## ⚡ **Quick Setup**

### **Option 1: Temporary Setup (Current Session Only)**
```bash
# Load the Claude prompt functions
source scripts/claude-prompt-setup.sh

# Activate Claude prompt
claude-prompt
```

### **Option 2: Permanent Setup (Recommended)**
Add to your `~/.zshrc` file:
```bash
# Add this line to your ~/.zshrc
echo 'source ~/Documents/workspace/pbradygeorgen/scripts/claude-prompt-setup.sh' >> ~/.zshrc

# Reload your shell configuration
source ~/.zshrc

# Activate Claude prompt
claude-prompt
```

## 🎮 **Available Commands**

| Command | Description |
|---------|-------------|
| `claude-prompt` | Activate the Claude work prompt with orange background |
| `restore-prompt` | Restore your original terminal prompt |
| `toggle-prompt` | Switch between Claude and original prompts |

## 🎨 **Visual Features**

### **Claude Mode Prompt:**
- **Background**: 5% orange tint (`#FFF3E6`)
- **Text**: Dark gray for readability
- **Path**: Blue accent color
- **Icon**: 🤖 to indicate Claude work
- **Format**: `🤖 Claude Work → [path] $ `

### **Color Specifications:**
- **Orange Background**: `RGB(255, 243, 230)` - Very subtle orange tint
- **Dark Text**: `RGB(51, 51, 51)` - High contrast dark gray
- **Blue Path**: `RGB(59, 130, 246)` - Professional blue accent

## 🚀 **Usage Examples**

### **Starting Claude Work:**
```bash
$ claude-prompt
✅ Claude prompt activated! 🤖
   - 5% orange background enabled
   - Use 'restore_prompt' to return to original

🤖 Claude Work → ~/workspace/project $ 
```

### **Returning to Normal Work:**
```bash
🤖 Claude Work → ~/workspace/project $ restore-prompt
✅ Original prompt restored

$ 
```

### **Quick Toggle:**
```bash
$ toggle-prompt
✅ Claude prompt activated! 🤖

🤖 Claude Work → ~/workspace $ toggle-prompt  
✅ Original prompt restored

$ 
```

## 🔧 **Technical Details**

### **ANSI Color Codes Used:**
- **Orange Background**: `\033[48;2;255;243;230m`
- **Dark Gray Text**: `\033[38;2;51;51;51m`
- **Blue Path Text**: `\033[38;2;59;130;246m`
- **Reset**: `\033[0m`

### **Shell Compatibility:**
- **Primary**: Zsh (your current shell)
- **Secondary**: Bash (fallback support)
- **Prompt Variables**: Sets both `PROMPT` (zsh) and `PS1` (bash)

## 🛡️ **Safety Features**

- **Original Backup**: Your original prompt is saved and can be restored
- **Non-Destructive**: Doesn't modify your shell config files automatically
- **Reversible**: Easy to toggle on/off or completely remove

## 🎯 **Benefits**

1. **Visual Clarity**: Instantly know when you're in "Claude mode"
2. **Context Switching**: Easy mental separation between different work types
3. **Professional**: Subtle design that's not distracting
4. **Flexible**: Easy to toggle on/off as needed

## 🚨 **Troubleshooting**

### **If colors don't appear:**
```bash
# Check if your terminal supports 24-bit color
echo $COLORTERM

# Test color support
printf "\033[48;2;255;243;230m Orange Background Test \033[0m\n"
```

### **To completely remove:**
```bash
# Remove from ~/.zshrc if added
sed -i '' '/claude-prompt-setup.sh/d' ~/.zshrc

# Restore original prompt
restore-prompt
```

## 💡 **Pro Tips**

1. **Use with tmux**: Works great in tmux sessions for session identification
2. **Git Integration**: Consider adding git branch info to the prompt
3. **Project Context**: The prompt shows your current directory path
4. **Screenshot Friendly**: The subtle orange background shows well in screenshots

---

**Ready to distinguish your Claude work visually!** 🎨🤖
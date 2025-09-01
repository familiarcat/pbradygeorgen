# 🚀 Cursor-Claude LLM Collaboration Extension

**Revolutionary AI collaboration system with democratic LLM selection and N8N integration**

## 🎯 **What This Extension Does**

This extension converts your working Python-based LLM collaboration system into a fully integrated VS Code/Cursor extension that provides:

- **🤖 Democratic AI Model Selection** - Automatically chooses the best LLM for each task
- **🚀 N8N Workflow Integration** - Seamlessly deploys and manages your N8N workflows
- **📊 Real-time Model Scoring** - Shows confidence scores and reasoning for AI model selection
- **🎨 Beautiful Webview Interface** - Modern, responsive UI for collaboration management

## 🏗️ **Architecture**

Based on your working Python system, this extension implements:

```
Task Input → Democratic Selection → Model Routing → N8N Integration → Response
    ↓              ↓                ↓              ↓              ↓
  Cursor    →   AI Analysis   →  Best LLM    →  N8N Workflow  →  Output
  Chat      →   Algorithm     →  Selection   →  Execution     →  Display
```

## 🚀 **Features**

### **Core Commands**
- `🚀 Start LLM Collaboration` - Begin a new AI collaboration session
- `🗳️ Democratic LLM Selection` - View the democratic selection system
- `📊 Show Model Scores` - Display AI model confidence scores
- `🚀 Deploy N8N Workflow` - Deploy workflows to your N8N instance

### **AI Models Supported**
- **Claude Sonnet** - Strategic analysis and reasoning
- **GPT-4o** - Research and multimodal tasks
- **Gemini Pro** - Optimization and performance
- **Llama 3** - Code implementation and cost-effective solutions

### **Task Types**
- **Code Implementation** - Software development tasks
- **Strategic Analysis** - High-level planning and reasoning
- **Research** - Information gathering and analysis
- **Optimization** - Performance and efficiency improvements

## 🛠️ **Installation**

### **From Source**
```bash
# Clone the repository
git clone <your-repo-url>
cd cursor-claude-llm-collaboration

# Install dependencies
npm install

# Build the extension
npm run build

# Install the .vsix file
code --install-extension cursor-claude-llm-collaboration-1.0.0.vsix
```

### **🔧 Automatic Configuration from ~/.zshrc**

The extension automatically reads configuration from your `~/.zshrc` file! Just add these environment variables:

```bash
# Add to your ~/.zshrc file
export N8N_BASE_URL="https://n8n.pbradygeorgen.com"
export OPENROUTER_API_KEY="your_openrouter_key_here"
export CLAUDE_API_KEY="your_claude_key_here"
export N8N_API_KEY="your_n8n_api_key_here"
```

**Supported Environment Variables:**
- `N8N_BASE_URL` or `N8N_URL` - Your N8N instance URL
- `OPENROUTER_API_KEY` or `OPENROUTER_KEY` - OpenRouter API key
- `CLAUDE_API_KEY` or `ANTHROPIC_API_KEY` - Claude API key
- `N8N_API_KEY` - N8N API key for workflow deployment

### **Manual Configuration (Fallback)**
If you prefer VS Code settings, you can still configure manually:
```json
{
  "cursor-claude.n8nBaseUrl": "https://n8n.pbradygeorgen.com",
  "cursor-claude.openRouterApiKey": "your_openrouter_key",
  "cursor-claude.claudeApiKey": "your_claude_key",
  "cursor-claude.n8nApiKey": "your_n8n_api_key"
}
```

## 🎮 **Usage**

1. **Start Collaboration**: Press `Cmd+Shift+P` and type "Start LLM Collaboration"
2. **Describe Your Task**: Enter what you want to accomplish
3. **View AI Selection**: See which AI model was chosen and why
4. **Monitor Progress**: Track the collaboration through the webview interface

## 🔧 **Development**

### **Build Commands**
```bash
npm run compile    # Compile TypeScript
npm run watch      # Watch for changes
npm run build      # Build and package
npm run package    # Package extension only
```

### **Project Structure**
```
src/
├── extension.ts           # Main extension logic
├── types/                 # TypeScript interfaces
├── services/              # Business logic services
└── webview/               # Webview content providers

out/                       # Compiled JavaScript
node_modules/              # Dependencies
```

## 🌟 **Integration with Your Existing System**

This extension is designed to work seamlessly with your existing:
- **N8N Workflows** - Automatic deployment and management
- **OpenRouter Integration** - Multi-LLM access
- **Python Backend** - Extends your working collaboration system
- **Star Trek Crew System** - Integrates with your AI agent coordination

## 🚨 **Requirements**

- VS Code 1.80.0 or higher
- Node.js 16.x or higher
- Access to your N8N instance
- OpenRouter API key for LLM access

## 📝 **License**

MIT License - See LICENSE file for details

## 🤝 **Contributing**

This extension is based on your working Python LLM collaboration system. Contributions are welcome to enhance the VS Code integration while maintaining compatibility with your existing architecture.

---

**Built with ❤️ for the Star Trek Crew System**

# 🏛️ Federation Crew - Cursor Extension

**Global Federation Crew integration for Cursor with n8n connectivity**

## 🎯 Overview

This Cursor extension provides global access to your Federation Crew across all Cursor instances. The crew automatically activates and responds to natural language commands, providing Star Trek-style collaborative problem-solving.

## 🚀 Features

- ✅ **Global Activation** - Works across all Cursor instances
- ✅ **Auto-Activation** - Starts automatically on Cursor startup
- ✅ **Natural Language Commands** - Responds to phrases like "activate n8n" or "all hands on deck"
- ✅ **n8n Integration** - Connects to your n8n instance for workflow management
- ✅ **Observation Lounge** - Full crew consultation and synthesis
- ✅ **Star Trek Authenticity** - True to character skills and personalities

## 🏛️ The Federation Crew

**Your crew includes:**
- **Captain Jean-Luc Picard** - Strategic Leadership & Mission Command
- **Commander William T. Riker** - Tactical Execution & Mission Planning
- **Lieutenant Commander Data** - Analytics & Logic Operations
- **Lieutenant Commander Geordi La Forge** - Infrastructure & System Integration
- **Dr. Beverly Crusher** - Health & Optimization Specialist
- **Lieutenant Worf** - Security & Compliance Operations
- **Counselor Deanna Troi** - User Experience & Empathy Analysis
- **Lieutenant Uhura** - Communications & I/O Specialist
- **Quark** - Business & Budget Specialist

## 📦 Installation

### Prerequisites
- Cursor editor
- Node.js and npm
- n8n instance running
- OpenRouter API key

### Step 1: Build the Extension
```bash
cd cursor_federation_crew_extension
npm install
npm run compile
```

### Step 2: Install in Cursor
1. Open Cursor
2. Go to Extensions (Ctrl+Shift+X)
3. Click "..." and select "Install from VSIX..."
4. Navigate to the extension folder and select the compiled extension

### Step 3: Configure Environment Variables
Set your API keys in your system environment:
```bash
export N8N_API_KEY="your_n8n_api_key"
export OPENROUTER_API_KEY="your_openrouter_api_key"
```

## 🎮 Usage

### Automatic Activation
The Federation Crew automatically activates when you start Cursor.

### Manual Activation Commands
- `Cmd/Ctrl + Shift + P` → "Federation Crew: Activate"
- `Cmd/Ctrl + Shift + P` → "Federation Crew: Observation Lounge Meeting"

### Natural Language Activation
Simply type any of these phrases in chat or editor:
- `"activate n8n"`
- `"all hands on deck"`
- `"federation crew activate"`
- `"assemble the crew"`
- `"observation lounge"`
- `"senior staff meeting"`

### Enhanced Commands with Intent
- `"Observation lounge in order to fulfill project criteria"`
- `"Gather the crew to review bug"`
- `"Senior staff meeting to analyze system performance"`
- `"Crew briefing to plan deployment strategy"`

### Film Script Format
- `"Observation lounge with full crew debate"`
- `"Gather the crew for detailed discussion"`
- `"Senior staff meeting with individual insights"`
- `"Observation lounge - film script format"`

## ⚙️ Configuration

### Extension Settings
Open Cursor settings and search for "Federation Crew":

- **n8n URL**: Your n8n instance URL (default: https://n8n.pbradygeorgen.com)
- **Auto Activate**: Automatically activate on startup (default: true)
- **Activation Phrases**: Customize phrases that activate the crew

### Custom Activation Phrases
Add your own activation phrases in settings:
```json
{
  "federationCrew.activationPhrases": [
    "activate n8n",
    "all hands on deck",
    "federation crew activate",
    "assemble the crew",
    "observation lounge",
    "senior staff meeting",
    "your custom phrase here"
  ]
}
```

## 🔧 Development

### Project Structure
```
cursor_federation_crew_extension/
├── src/
│   └── extension.ts          # Main extension code
├── package.json              # Extension manifest
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

### Building
```bash
npm run compile              # Build once
npm run watch               # Build on file changes
```

### Testing
1. Press F5 in Cursor to start debugging
2. A new Cursor window will open with the extension loaded
3. Test the commands and natural language activation

## 🌐 Global Access

### Across All Cursor Instances
Once installed, the Federation Crew will be available in:
- ✅ All new Cursor windows
- ✅ All new Cursor workspaces
- ✅ All projects and repositories
- ✅ Any Cursor instance on your system

### Workspace Integration
The crew automatically:
- Detects your current workspace
- Connects to local n8n instances
- Adapts to project-specific needs
- Maintains context across sessions

## 🎖️ Admiral's Guide

### Basic Operations
1. **Start Cursor** → Federation Crew activates automatically
2. **Type activation phrase** → Crew responds immediately
3. **Give directive** → Crew assembles in Observation Lounge
4. **Receive analysis** → Each crew member provides insights
5. **Get synthesis** → Captain Picard's strategic assessment
6. **Issue orders** → Crew awaits your final decision

### Advanced Usage
- **Individual consultation** → Query specific crew members
- **Team synthesis** → Get coordinated team responses
- **Film script format** → Full dramatic crew interactions
- **Intent-driven analysis** → Focus crew on specific objectives

## 🚨 Troubleshooting

### Common Issues
- **Crew not activating**: Check environment variables and n8n connection
- **Commands not working**: Ensure extension is properly installed
- **API errors**: Verify OpenRouter API key and n8n API key

### Debug Mode
Enable debug mode in Cursor settings to see detailed extension logs.

## 🏛️ Federation Mission Status

**Your Federation Crew is ready for:**
- ✅ Strategic planning and analysis
- ✅ Technical problem-solving
- ✅ Security assessment
- ✅ Performance optimization
- ✅ User experience design
- ✅ Business intelligence
- ✅ System integration
- ✅ Mission coordination

## 🖖 Live Long and Prosper

The Federation Crew is at your service, Admiral. Engage!

---

**Extension Version**: 1.0.0  
**Last Updated**: 2025  
**Federation Status**: Active and Operational

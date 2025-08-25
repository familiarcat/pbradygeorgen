# 🏛️ Federation Crew - Cursor Extension

**Global Federation Crew integration for Cursor with n8n connectivity and Star Trek authenticity**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/familiarcat/cursor-federation-crew-extension)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Cursor](https://img.shields.io/badge/Cursor-Extension-orange.svg)](https://cursor.sh)

## 🎯 Overview

The Federation Crew Cursor Extension brings the power of Star Trek's collaborative problem-solving to your development environment. With authentic character personalities, n8n integration, and natural language commands, your crew is ready for any mission.

## 🚀 Features

- ✅ **Global Activation** - Works across all Cursor instances
- ✅ **Auto-Activation** - Starts automatically on Cursor startup
- ✅ **Natural Language Commands** - "activate n8n", "all hands on deck"
- ✅ **n8n Integration** - Connects to your n8n instance for workflow management
- ✅ **Observation Lounge** - Full crew consultation and synthesis
- ✅ **Star Trek Authenticity** - True to character skills and personalities
- ✅ **Film Script Format** - Dramatic crew interactions and debates

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
- [Cursor](https://cursor.sh) editor
- Node.js and npm
- n8n instance running (optional)
- OpenRouter API key

### Quick Install
```bash
# Clone the repository
git clone https://github.com/familiarcat/cursor-federation-crew-extension.git
cd cursor-federation-crew-extension

# Build and install
./install.sh
```

### Manual Install
```bash
# Install dependencies
npm install

# Build extension
npm run compile

# Install in Cursor
# 1. Open Cursor
# 2. Go to Extensions (Ctrl+Shift+X)
# 3. Click "..." and select "Install from VSIX..."
# 4. Select the generated .vsix file
```

### Environment Setup
```bash
# Set your API keys
export N8N_API_KEY="your_n8n_api_key"
export OPENROUTER_API_KEY="your_openrouter_api_key"
```

## 🎮 Usage

### Automatic Activation
The Federation Crew automatically activates when you start Cursor.

### Natural Language Commands
Type any of these phrases in chat or editor:
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

### Manual Commands
- `Cmd/Ctrl + Shift + P` → "Federation Crew: Activate"
- `Cmd/Ctrl + Shift + P` → "Federation Crew: Observation Lounge Meeting"

## ⚙️ Configuration

### Extension Settings
Open Cursor settings and search for "Federation Crew":

- **n8n URL**: Your n8n instance URL (default: https://n8n.pbradygeorgen.com)
- **Auto Activate**: Automatically activate on startup (default: true)
- **Activation Phrases**: Customize phrases that activate the crew

### Custom Activation Phrases
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

## 🌐 Global Access

### Across All Cursor Instances
Once installed, the Federation Crew works in:
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

## 🔧 Development

### Project Structure
```
cursor-federation-crew-extension/
├── src/
│   └── extension.ts          # Main extension code
├── package.json              # Extension manifest
├── tsconfig.json            # TypeScript configuration
├── README.md                # This file
├── CHANGELOG.md             # Version history
├── LICENSE                  # MIT License
├── .github/                 # GitHub workflows
├── examples/                # Usage examples
└── tests/                   # Test suite
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

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
git clone https://github.com/familiarcat/cursor-federation-crew-extension.git
cd cursor-federation-crew-extension
npm install
npm run watch
```

### Submitting Changes
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Star Trek** - For the inspiration and character personalities
- **Cursor** - For the excellent development environment
- **n8n** - For the powerful workflow automation platform
- **OpenRouter** - For the AI model access

## 🚨 Troubleshooting

### Common Issues
- **Crew not activating**: Check environment variables and n8n connection
- **Commands not working**: Ensure extension is properly installed
- **API errors**: Verify OpenRouter API key and n8n API key

### Debug Mode
Enable debug mode in Cursor settings to see detailed extension logs.

### Getting Help
- [Issues](https://github.com/familiarcat/cursor-federation-crew-extension/issues) - Report bugs and request features
- [Discussions](https://github.com/familiarcat/cursor-federation-crew-extension/discussions) - Ask questions and share ideas

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
**Repository**: [github.com/familiarcat/cursor-federation-crew-extension](https://github.com/familiarcat/cursor-federation-crew-extension)

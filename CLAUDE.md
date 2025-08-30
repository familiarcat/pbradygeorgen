# 🚀 Claude Code Integration Configuration

## 🎯 **Project Overview**
This project features a comprehensive AI crew system built with Claude Code, integrating 8 specialized AI agents with N8N workflows and Supabase memory persistence.

## 🏗️ **System Architecture**

### **Core Components**
- **Claude Crew System**: 8 specialized AI agents (Captain Picard, Commander Data, Lt. Worf, Geordi La Forge, Counselor Troi, Lt. Uhura, Dr. Crusher, Quark)
- **Observation Lounge**: Central coordination hub for mission planning and execution
- **N8N Integration**: Workflow automation for business processes
- **Supabase Memory**: Persistent data storage and learning system

### **Integration Points**
- **Claude API**: Real-time AI agent communication and analysis
- **N8N Workflows**: Automated business process execution
- **Web Interface**: Next.js frontend for system interaction
- **Database**: Supabase for data persistence and memory

## ⚙️ **Configuration Requirements**

### **1. Environment Variables**
Ensure your `.env` file includes:

```bash
# Claude AI Configuration
CLAUDE_API_KEY=your_actual_claude_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022
CLAUDE_MAX_TOKENS=4000
CLAUDE_TEMPERATURE=0.7

# N8N Integration
N8N_BASE_URL=https://n8n.pbradygeorgen.com
N8N_API_KEY=your_n8n_api_key_here

# Supabase Memory System
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

### **2. Claude Code Settings**
Configure Claude Code permissions in `.claude/settings.local.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(git add:*)",
      "Bash(chmod:*)", 
      "Bash(pip3 install:*)",
      "Bash(python3:*)",
      "Bash(curl:*)",
      "Bash(npm run dev:*)",
      "Bash(cp:*)",
      "Bash(npm test)",
      "Bash(npm run build:*)",
      "Bash(npx:*)"
    ],
    "deny": [],
    "ask": []
  },
  "outputStyle": {
    "codeBlocks": {
      "showLineNumbers": true,
      "wrapLongLines": true
    },
    "maxOutputLength": 50000
  }
}
```

## 🚀 **Quick Start Commands**

### **Development**
```bash
# Start development server
npm run dev

# Test Claude crew system
python3 claude_agents/test_full_crew_system.py

# Run comprehensive tests
npm test
```

### **Production**
```bash
# Build application
npm run build

# Start production server  
npm start
```

## 🧪 **Testing & Validation**

### **System Health Check**
```bash
# Test all crew members
python3 claude_agents/test_full_crew_system.py

# Run integration tests
npx playwright test tests/integration/

# Test N8N connectivity
python3 scripts/run_comprehensive_tests.py
```

### **Expected Results**
- ✅ 8/8 crew members operational
- ✅ N8N workflows responding (9/9 individual crew endpoints)
- ✅ Mission coordination functional
- ✅ Web interface accessible

## 📋 **Available Crew Members**

| Agent | Role | Specialization |
|-------|------|----------------|
| **Captain Picard** | Strategic Leadership | Mission Command & Diplomacy |
| **Commander Data** | Scientific Analysis | Data Processing & Logic |
| **Lieutenant Worf** | Tactical Operations | Security & Defense |
| **Geordi La Forge** | Engineering | Technical Problem Solving |
| **Counselor Troi** | Psychological Analysis | Team Dynamics & Empathy |
| **Lieutenant Uhura** | Communications | Language & Cultural Relations |
| **Dr. Crusher** | Medical Analysis | Health & Diagnostics |
| **Quark** | Business Operations | Commerce & Resource Optimization |

## 🔧 **API Endpoints**

### **Crew Interaction**
- `POST /api/test-n8n/crew-member` - Individual crew member tasks
- `POST /api/test-n8n/observation-lounge` - Multi-crew coordination
- `POST /api/test-n8n/mission-scenario` - Complex mission execution

### **System Integration** 
- `POST /api/analyze-content` - Content analysis pipeline
- `GET /api/health` - System health monitoring
- `GET /api/claude/status` - Claude API connectivity status

## 🐛 **Troubleshooting**

### **Common Issues**
1. **Claude API Key Missing**: Configure `CLAUDE_API_KEY` in `.env`
2. **N8N Workflows Failing**: Check N8N server status and API keys
3. **Database Connection Issues**: Verify Supabase credentials
4. **Performance Issues**: Monitor API response times and system resources

### **Debug Commands**
```bash
# Check system status
python3 claude_agents/test_full_crew_system.py

# Validate environment
grep CLAUDE_API_KEY .env

# Test API connectivity
curl -X POST http://localhost:3000/api/test-n8n/crew-member \
  -H "Content-Type: application/json" \
  -d '{"crewMemberId":"picard","task":"system test"}'
```

## 📖 **Additional Resources**

### **Documentation Files**
- `CURSOR_HANDOFF/CLAUDE_HANDOFF_COMPLETE.md` - Complete system handoff
- `docs/CLAUDE_MIGRATION_ARCHITECTURE.md` - Technical architecture
- `docs/CLAUDE_MIGRATION_SUMMARY.md` - Implementation summary
- `claude_agents/README.md` - Crew system documentation

### **Configuration Templates**
- `CURSOR_HANDOFF/configs/environment_template.env` - Complete environment template
- `.claude/settings.local.json` - Claude Code permissions
- `claude_agents/requirements.txt` - Python dependencies

## 🎯 **Development Guidelines**

### **Claude Code Best Practices**
1. **Use the TodoWrite tool** for complex multi-step tasks
2. **Run tests frequently** to ensure system stability
3. **Update documentation** when making architecture changes
4. **Monitor system performance** during development

### **System Maintenance**
1. **Regular health checks** using the test suite
2. **API key rotation** for security
3. **Performance monitoring** and optimization
4. **Documentation updates** for new features

---

**Status**: ✅ **System Operational**  
**Last Updated**: August 2025  
**Version**: 1.0.0 - Production Ready
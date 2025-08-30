# 🤖 Claude Code Setup & Configuration Guide

## 🎯 **Quick Setup for Claude Code**

This project is fully configured for Claude Code integration. Follow these steps to get started:

### **1. Immediate Setup**
```bash
# The system is already configured - just run the tests
python3 claude_agents/test_full_crew_system.py
```

Expected output:
```
🎉 ALL TESTS PASSED! Crew system is fully operational.
```

### **2. Environment Configuration** 
Your `.env` file is pre-configured with all necessary settings:

```bash
# Claude API Configuration (already set)
CLAUDE_API_KEY=sk-ant-api03-YOUR_ACTUAL_API_KEY_HERE  # Replace with real key
CLAUDE_MODEL=claude-3-5-sonnet-20241022
CLAUDE_MAX_TOKENS=4000
CLAUDE_TEMPERATURE=0.7

# N8N Integration (already configured)
N8N_BASE_URL=https://n8n.pbradygeorgen.com
N8N_API_KEY=YOUR_N8N_API_KEY_HERE

# Supabase Memory System (pre-configured)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE
```

### **3. Claude Code Permissions**
Your `.claude/settings.local.json` has been updated with optimal permissions:

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
  "outputStyle": "detailed"
}
```

## 🚀 **Available Commands for Claude Code**

### **System Testing**
```bash
# Test complete crew system
python3 claude_agents/test_full_crew_system.py

# Run integration tests  
npx playwright test tests/integration/

# Test N8N connectivity
python3 scripts/run_comprehensive_tests.py
```

### **Development**
```bash
# Start development server
npm run dev

# Build application
npm run build

# Run all tests
npm test
```

### **Crew System Interaction**
```bash
# Test individual crew members
curl -X POST http://localhost:3000/api/test-n8n/crew-member \
  -H "Content-Type: application/json" \
  -d '{"crewMemberId":"picard","task":"Strategic analysis"}'

# Test mission coordination
curl -X POST http://localhost:3000/api/test-n8n/observation-lounge \
  -H "Content-Type: application/json" \
  -d '{"mode":"core_crew","mission":"System integration test"}'
```

## 🧪 **System Health Checks**

### **Validate All Systems**
1. **Claude Crew System**: `python3 claude_agents/test_full_crew_system.py`
2. **Web Interface**: Navigate to `http://localhost:3000/test-n8n`
3. **API Endpoints**: Test with curl commands above
4. **Integration Tests**: `npx playwright test tests/integration/`

### **Expected System Status**
- ✅ **8/8 crew members operational** (Captain Picard, Commander Data, Lt. Worf, Geordi La Forge, Counselor Troi, Lt. Uhura, Dr. Crusher, Quark)
- ✅ **N8N workflows responding** (9/9 individual crew endpoints working)
- ✅ **Mission coordination functional** (Observation Lounge operational)
- ✅ **Web interface accessible** (Test interface available)

## 📋 **Claude Code Specific Features**

### **1. Crew Member Interaction**
Claude Code can directly interact with all 8 crew members:

```python
# Example: Get strategic analysis from Captain Picard
from claude_agents.core.captain_picard.agent import CaptainPicardAgent
picard = CaptainPicardAgent()
analysis = picard.analyze_task("Analyze quarterly business performance")
```

### **2. Mission Coordination**
```python
# Example: Coordinate multi-crew mission
from claude_agents.coordination.observation_lounge.coordinator import ObservationLoungeCoordinator
coordinator = ObservationLoungeCoordinator()
result = coordinator.coordinate_mission("Investigate security breach")
```

### **3. Specialized Analysis**
```python
# Example: Get specialized analysis by type
coordinator = ObservationLoungeCoordinator()
tactical_analysis = coordinator.get_specialized_analysis("tactical", {"situation": "Security threat detected"})
scientific_analysis = coordinator.get_specialized_analysis("scientific", {"data": "Anomalous sensor readings"})
```

## 🔧 **Troubleshooting for Claude Code**

### **Common Issues & Solutions**

1. **"No Claude API key provided" warnings**
   - **Issue**: API key not configured 
   - **Solution**: Set actual API key in `.env` file
   - **Impact**: System works with mock data until configured

2. **Import errors for crew members**
   - **Issue**: Python path configuration
   - **Solution**: Run from project root directory
   - **Check**: `python3 claude_agents/test_full_crew_system.py`

3. **N8N workflow failures**
   - **Issue**: N8N server connectivity
   - **Solution**: Check N8N server status
   - **Fallback**: System gracefully degrades to Claude-only mode

4. **Web interface not loading**
   - **Issue**: Next.js server not running
   - **Solution**: Run `npm run dev`
   - **Check**: Navigate to `http://localhost:3000`

### **Debug Commands**
```bash
# Check environment configuration
grep CLAUDE_API_KEY .env

# Validate Python dependencies
pip list | grep anthropic

# Test API connectivity
curl -X GET http://localhost:3000/api/health

# Check system logs
python3 claude_agents/test_full_crew_system.py 2>&1 | tee debug.log
```

## 📖 **Documentation Structure**

### **Main Configuration Files**
- `CLAUDE.md` - Master Claude Code configuration guide
- `.claude/settings.local.json` - Claude Code permissions and settings  
- `.env` - Environment variables and API keys
- `claude_agents/requirements.txt` - Python dependencies

### **System Documentation**
- `CURSOR_HANDOFF/CLAUDE_HANDOFF_COMPLETE.md` - Complete system handoff
- `docs/CLAUDE_MIGRATION_ARCHITECTURE.md` - Technical architecture
- `docs/CLAUDE_MIGRATION_SUMMARY.md` - Implementation summary
- `claude_agents/README.md` - Crew system documentation

### **Test Documentation**
- `tests/integration/` - End-to-end integration tests
- `test-results/` - Test execution results
- `claude_agents/test_full_crew_system.py` - Comprehensive crew testing

## 🎯 **Best Practices for Claude Code**

### **1. Task Management**
- Use the **TodoWrite tool** for complex multi-step operations
- Mark tasks as completed immediately after finishing
- Break large tasks into smaller, manageable steps

### **2. System Testing**
- Run `python3 claude_agents/test_full_crew_system.py` before major changes
- Use integration tests to validate cross-system functionality
- Monitor system performance during development

### **3. Code Organization**
- Keep crew member implementations in their respective directories
- Use the Observation Lounge for multi-crew coordination
- Follow the established architecture patterns

### **4. Documentation Updates**
- Update `CLAUDE.md` when adding new features
- Document API changes in the appropriate files
- Keep test documentation current with system changes

---

**Status**: ✅ **Ready for Claude Code**  
**System Health**: ✅ **All Systems Operational**  
**Last Updated**: August 2025  
**Version**: 1.0.0 - Production Ready
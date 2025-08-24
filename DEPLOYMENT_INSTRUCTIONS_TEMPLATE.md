# 🚀 AlexAI Crew Deployment Instructions (Template)

## 🔐 **IMPORTANT: Use Environment Variables**

**NEVER hardcode API keys in files!** Use your `~/.zshrc` environment variables instead.

## 📋 **Deployment Steps:**

### 1️⃣ **OpenRouter Credential Setup**
- **API Key**: Use `$OPENROUTER_API_KEY` from your ~/.zshrc
- **Base URL**: `https://openrouter.ai/api/v1`

### 2️⃣ **Workflow Import**
- Import the comprehensive crew workflow from `ultimate_import_ready/`
- Activate the workflow in n8n

### 3️⃣ **Test Deployment**
```bash
curl -X POST "https://n8n.pbradygeorgen.com/webhook/alexai-crew-mission" \
  -H "Content-Type: application/json" \
  -d '{"mission_description": "Test mission", "mission_id": "test-001"}'
```

## 🔒 **Security Reminder:**
- All API keys should be stored in `~/.zshrc`
- Never commit actual keys to version control
- Use environment variable references only

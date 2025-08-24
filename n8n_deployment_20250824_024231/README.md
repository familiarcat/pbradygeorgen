# AlexAI Optimized Crew N8N Deployment

## 🚀 Quick Start

1. **Test Connection**: Run `./quick_deploy.sh` to verify n8n connectivity
2. **Deploy Workflows**: Use `python3 deploy_workflows.py` for automated deployment
3. **Manual Import**: Import each workflow .json file through n8n interface

## 📁 Files Included

- `n8n_optimized_crew_config.json` - Complete crew configuration
- `n8n_openrouter_config.json` - OpenRouter integration settings
- `n8n_workflows/` - All 9 workflow templates
- `.env.n8n` - Environment variables for n8n
- `deployment_config.json` - Deployment metadata
- `deploy_workflows.py` - Python deployment script
- `quick_deploy.sh` - Quick deployment verification

## 🔐 Environment Variables

All required environment variables are loaded from `~/.zshrc`:
- N8N_API_KEY
- N8N_URL  
- OPENROUTER_API_KEY
- AWS credentials

## 🎯 Crew Members

1. **Picard** - Strategic Leadership (gpt-4o-mini)
2. **Riker** - Tactical Execution (claude-3-haiku)
3. **Data** - Analytics & Logic (claude-3-sonnet)
4. **Geordi** - Infrastructure (gpt-4o)
5. **Crusher** - Health & Diagnostics (claude-3-haiku)
6. **Worf** - Security & Compliance (gpt-4o-mini)
7. **Troi** - UX & Empathy (claude-3-sonnet)
8. **Uhura** - Communications & I/O (claude-3-haiku)
9. **Quark** - Business Intelligence (gpt-3.5-turbo)

## 🔧 Deployment Steps

1. **OpenRouter Setup**: Configure OpenRouter in n8n
2. **Import Workflows**: Deploy all workflow templates
3. **Configure Authentication**: Set up API keys and permissions
4. **Test Crew Members**: Verify each crew member works independently
5. **Activate Workflows**: Enable workflows for production use

## 📊 Expected Benefits

- 27% crew reduction (11 → 8 members)
- 25-35% cost savings
- 20-30% efficiency improvement
- Dynamic LLM selection for cost optimization

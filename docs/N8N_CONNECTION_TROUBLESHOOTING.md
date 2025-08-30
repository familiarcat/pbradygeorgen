# N8N Connection Troubleshooting Guide

## 🚨 Current Issue: Fallback to Mock Data

Your system is currently falling back to mock data because of n8n connection issues. This guide will help you resolve these problems.

## 🔍 Problem Analysis

Based on your logs, the main issues are:

1. **n8n workflows are responding (200 OK)** but returning non-JSON responses
2. **Missing workflow connections** causing data flow to break
3. **Workflow activation issues** preventing proper webhook execution

## 🛠️ Solution Steps

### Step 1: Fix Workflow Connections

The standardized workflows were missing the `connections` section. This has been fixed for:
- ✅ Captain Jean-Luc Picard workflow
- ✅ Commander William Riker workflow

**What was fixed:**
- Added proper node connections between webhook → LLM selection → AI agent → observation → response formatter
- Ensured data flows correctly through the entire workflow

### Step 2: Deploy Corrected Workflows

Use the deployment script to update your n8n instance:

```bash
# Make sure you're in the project root
cd /Users/bradygeorgen/Documents/workspace/pbradygeorgen

# Set your n8n API key (if not already set)
export N8N_API_KEY='your-api-key-here'

# Run the deployment script
./scripts/deploy_n8n.sh
```

### Step 3: Verify Workflow Activation

After deployment, check your n8n instance:

1. **Access n8n**: https://n8n.pbradygeorgen.com
2. **Check workflows**: Ensure all crew workflows are active (green toggle)
3. **Verify webhooks**: Each workflow should have an active webhook node

## 🔧 Manual Verification

### Check Webhook Status

Test individual webhook endpoints:

```bash
# Test Picard webhook
curl -X POST https://n8n.pbradygeorgen.com/webhook/crew-captain-jean-luc-picard \
  -H "Content-Type: application/json" \
  -d '{"test": true, "message": "Connection test"}'

# Test Riker webhook  
curl -X POST https://n8n.pbradygeorgen.com/webhook/crew-commander-william-riker \
  -H "Content-Type: application/json" \
  -d '{"test": true, "message": "Connection test"}'
```

### Expected Response Format

Your workflows should now return properly formatted JSON:

```json
{
  "crew_member": "Captain Jean-Luc Picard - Strategic Leadership & Mission Command",
  "role": "Strategic Leadership & Mission Coordination",
  "response": "Strategic analysis and recommendations...",
  "timestamp": "2025-08-30T00:00:00.000Z"
}
```

## 🚀 Environment Configuration

### Required Environment Variables

Add these to your `~/.zshrc`:

```bash
# N8N Configuration
export N8N_BASE_URL="https://n8n.pbradygeorgen.com"
export N8N_API_KEY="your-actual-api-key"

# OpenRouter Configuration (for AI agents)
export OPENROUTER_API_KEY="your-openrouter-key"
```

### Reload Environment

```bash
source ~/.zshrc
```

## 🧪 Testing After Fixes

### 1. Test Individual Crew Members

Use the testing interface at `/test-n8n` to test each crew member:

- **Picard**: Strategic analysis tasks
- **Riker**: Tactical execution tasks
- **Data**: Analytics and logic operations
- **Geordi**: Infrastructure and system integration
- **Worf**: Security and compliance operations
- **Troi**: User experience and empathy analysis

### 2. Test Observation Lounge

Test the crew coordination system at `/unified-testing`:

- **Core Crew Mode**: Tests 2 crew members
- **Full Crew Mode**: Tests all crew members

### 3. Monitor Logs

Watch for these success indicators:

```
✅ Successfully parsed n8n response
✅ Crew member test completed in XXXms (LIVE n8n)
✅ Observation Lounge coordination completed: X successful, 0 failed
```

## 🚨 Common Issues & Solutions

### Issue: "n8n returned non-JSON response"

**Cause**: Workflow connections broken or response formatting issues
**Solution**: Deploy corrected workflows using the deployment script

### Issue: "n8n webhook failed (500)"

**Cause**: Workflow execution errors or missing dependencies
**Solution**: Check n8n logs and ensure OpenRouter API key is configured

### Issue: "Network error calling n8n"

**Cause**: Connection timeout or network issues
**Solution**: Verify n8n instance is accessible and check firewall settings

### Issue: "Cannot find module" errors

**Cause**: Missing workflow connections or broken data flow
**Solution**: Deploy corrected workflows with proper connections

## 📊 Success Metrics

After implementing fixes, you should see:

- **Response Time**: < 2 seconds for crew member interactions
- **Success Rate**: > 95% successful n8n responses
- **Fallback Rate**: < 5% mock data usage
- **Error Rate**: < 1% connection failures

## 🔄 Maintenance

### Regular Checks

1. **Weekly**: Verify all workflows are active
2. **Monthly**: Test webhook connectivity
3. **Quarterly**: Review workflow performance metrics

### Monitoring

- Watch for increased fallback to mock data
- Monitor response times for degradation
- Check n8n instance health regularly

## 📞 Support

If issues persist after following this guide:

1. **Check n8n logs** for detailed error information
2. **Verify API keys** are correctly configured
3. **Test webhook endpoints** individually
4. **Review workflow execution** in n8n interface

## 🎯 Next Steps

1. **Deploy corrected workflows** using the deployment script
2. **Test individual crew members** to verify fixes
3. **Monitor system performance** for improvements
4. **Update documentation** with any new findings

---

**Remember**: The key to resolving these issues is ensuring proper workflow connections and activation. The deployment script will handle most of the heavy lifting automatically.

# 🛡️ Cost Control Guide - N8N/OpenRouter API Usage

**Status**: ✅ **COST PROTECTION ACTIVE**

## ⚠️ Important: Development vs Production Mode

Your system now has **automatic cost protection** to prevent unexpected charges during development.

## 🟢 Current Setup: Development Mode (COST-FREE)

The system is configured to **bypass expensive N8N/OpenRouter API calls** during development:

- **Environment**: `DISABLE_N8N_CALLS=true` in `.env.local`
- **Behavior**: API calls return simulated responses without triggering N8N webhooks
- **Cost**: $0 - No external API calls made
- **UI Testing**: Full functionality with simulated crew responses

### Development Mode Indicators:
```
🛡️ DEVELOPMENT MODE: Bypassing N8N webhook calls to prevent costs
[DEV MODE] Picard ready for mission: [your directive]
```

## 🔴 Production Mode (REAL API CALLS - COSTS MONEY)

To enable real N8N/OpenRouter API calls for production use:

### Option 1: Environment Variable
```bash
# In .env.local, change:
DISABLE_N8N_CALLS=false
```

### Option 2: Remove Override
```bash
# Comment out or remove this line in .env.local:
# DISABLE_N8N_CALLS=true
```

### Production Mode Behavior:
- Real webhook calls to N8N workflows
- OpenRouter API usage: **~$0.10-$1.00 per crew coordination**
- Full AI-powered responses from crew members

## 💰 Cost Breakdown

### Development Mode (Current):
- **Claude Code CLI**: $0 (covered by $20 subscription)
- **Local Development**: $0
- **N8N Webhook Calls**: $0 (bypassed)
- **OpenRouter API**: $0 (bypassed)
- **Total Development Cost**: $0

### Production Mode:
- **Claude Code CLI**: $0 (covered by $20 subscription)
- **N8N Hosting**: Your existing plan cost
- **OpenRouter API**: $0.10-$1.00 per workflow execution
- **Estimated per coordination**: $0.10-$2.00 (depending on crew size)

## 🎯 Quick Reference

### Enable Cost Protection (Current Default):
```bash
export DISABLE_N8N_CALLS=true
npm run dev
```

### Enable Production Mode (Real API Calls):
```bash
export DISABLE_N8N_CALLS=false
npm run dev
```

## 📊 Usage Monitoring

### Track Your Costs:
1. **OpenRouter Dashboard**: Monitor API usage at openrouter.ai
2. **N8N Execution Logs**: Check workflow execution frequency
3. **Development Logs**: Look for `🛡️ DEVELOPMENT MODE` messages

### Cost Control Best Practices:
1. **Always use development mode** for UI testing
2. **Enable production mode** only for real missions
3. **Monitor OpenRouter usage** if using production mode
4. **Set usage limits** on OpenRouter account

## 🚨 Emergency Cost Stop

If you see unexpected charges:

```bash
# Immediately enable cost protection
echo "DISABLE_N8N_CALLS=true" >> .env.local

# Restart your dev server
kill -9 $(lsof -ti:3000)
npm run dev
```

## ✅ Current Status Summary

- **✅ Cost Protection**: ACTIVE
- **✅ Development Mode**: Enabled by default
- **✅ N8N Calls**: Bypassed (cost-free)
- **✅ UI Testing**: Full functionality with simulations
- **✅ Your $20 Claude Subscription**: Covers all development work

**Bottom Line**: You can now develop and test your Claude crew system **without any additional costs** beyond your $20 Claude subscription!
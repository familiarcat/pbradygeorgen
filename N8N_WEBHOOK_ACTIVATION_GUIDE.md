# N8N Webhook Activation Guide

## 🚨 CRITICAL: Manual Webhook Activation Required

The Federation Crew workflows are active but webhook endpoints are not accessible. This requires manual activation in the n8n interface.

## 🔧 Manual Activation Steps

### Step 1: Access n8n Interface
1. Open your browser and navigate to: **https://n8n.pbradygeorgen.com**
2. Log in with your credentials

### Step 2: Activate Each Workflow
For each of the following workflows, you must manually activate the webhook:

#### 1. Federation Crew - OpenRouter Agent Coordination
- **Webhook Path**: `/federation-directive`
- **Action**: Open workflow → Click the webhook node → Ensure "Active" is checked → Save workflow

#### 2. Captain Jean-Luc Picard - Strategic Leadership & Mission Command
- **Webhook Path**: `/crew-captain-jean-luc-picard`
- **Action**: Open workflow → Click the webhook node → Ensure "Active" is checked → Save workflow

#### 3. Commander Data - Analytics & Logic Operations
- **Webhook Path**: `/crew-commander-data`
- **Action**: Open workflow → Click the webhook node → Ensure "Active" is checked → Save workflow

#### 4. Lieutenant Commander Geordi La Forge - Infrastructure & System Integration
- **Webhook Path**: `/crew-lieutenant-commander-geordi-la-forge`
- **Action**: Open workflow → Click the webhook node → Ensure "Active" is checked → Save workflow

#### 5. Lieutenant Worf - Security & Compliance Operations
- **Webhook Path**: `/crew-lieutenant-worf`
- **Action**: Open workflow → Click the webhook node → Ensure "Active" is checked → Save workflow

#### 6. Counselor Deanna Troi - User Experience & Empathy Analysis
- **Webhook Path**: `/crew-counselor-deanna-troi`
- **Action**: Open workflow → Click the webhook node → Ensure "Active" is checked → Save workflow

#### 7. Enhanced Federation Crew - Complete Mission Control
- **Webhook Path**: `/federation-mission`
- **Action**: Open workflow → Click the webhook node → Ensure "Active" is checked → Save workflow

## 🧪 Testing After Activation

After manually activating each workflow, test the webhook endpoints:

```bash
# Test Federation Directive
curl -X POST "https://n8n.pbradygeorgen.com/webhook/federation-directive" \
  -H "Content-Type: application/json" \
  -d '{"directive": "Test webhook"}'

# Test Captain Picard
curl -X POST "https://n8n.pbradygeorgen.com/webhook/crew-captain-jean-luc-picard" \
  -H "Content-Type: application/json" \
  -d '{"task": "Test task"}'

# Test Federation Mission
curl -X POST "https://n8n.pbradygeorgen.com/webhook/federation-mission" \
  -H "Content-Type: application/json" \
  -d '{"mission_description": "Test mission"}'
```

## ⚠️ Why Manual Activation is Required

n8n requires manual activation of webhook nodes even when workflows are marked as "Active" via API. This is a security feature to prevent unauthorized webhook access.

## 🎯 Expected Result

After manual activation, all webhook endpoints should return proper responses instead of 404 errors, enabling the Federation Crew to function properly.

## 🚀 Next Steps

1. Complete manual activation for all 7 workflows
2. Test webhook endpoints
3. Run crew evaluation script: `npm run crew:evaluate`
4. Verify Federation Crew is operational

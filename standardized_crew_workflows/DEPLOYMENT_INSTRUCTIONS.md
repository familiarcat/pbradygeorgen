# 🚀 AlexAI Standardized Crew - Deployment Instructions

## 🎯 Standardization Summary
- **Individual Workflows**: 9 standardized crew member workflows
- **Comprehensive Workflow**: 1 unified mission control workflow
- **Format**: Consistent structure across all workflows
- **LLM Models**: Optimized model selection for each crew member

## 🔐 Step 1: OpenRouter Credential Setup

### Manual Creation (Recommended)
1. Open your n8n instance
2. Go to **Settings → Credentials**
3. Click **'Add Credential'**
4. Select **'OpenAI'** as the credential type
5. Configure:
   - **Name**: `OpenRouter API`
   - **API Key**: Use your `$OPENROUTER_API_KEY` from ~/.zshrc
   - **Base URL**: `https://openrouter.ai/api/v1`
6. **Save the credential**

## 🚀 Step 2: Workflow Deployment

### Option A: Individual Crew Workflows
Import each standardized workflow from the `standardized_crew_workflows` directory:
- **Captain Jean-Luc Picard - Strategic Leadership & Mission Command**: `standardized_picard_workflow.json`
- **Commander William Riker - Tactical Execution & Workflow Management**: `standardized_riker_workflow.json`
- **Commander Data - Analytics & Logic Operations**: `standardized_data_workflow.json`
- **Lieutenant Commander Geordi La Forge - Infrastructure & System Integration**: `standardized_geordi_workflow.json`
- **Doctor Beverly Crusher - Health Monitoring & System Optimization**: `standardized_crusher_workflow.json`
- **Counselor Deanna Troi - User Experience & Empathy Analysis**: `standardized_troi_workflow.json`
- **Lieutenant Worf - Security & Compliance Operations**: `standardized_worf_workflow.json`
- **Lieutenant Uhura - Communications & I/O Operations**: `standardized_uhura_workflow.json`
- **Quark - Business Intelligence & Budget Optimization**: `standardized_quark_workflow.json`

### Option B: Comprehensive Mission Control
Import the unified workflow: `standardized_comprehensive_crew_workflow.json`

## 🧪 Step 3: Testing

### Test Individual Crew Members
```bash
curl -X POST "{N8N_URL}/webhook/crew-{CREW_ID}" \
  -H "Content-Type: application/json" \
  -d '{"task": "Test task for {CREW_NAME}", "mission_id": "test-001"}'
```

### Test Comprehensive Mission
```bash
curl -X POST "{N8N_URL}/webhook/alexai-crew-mission" \
  -H "Content-Type: application/json" \
  -d '{"mission_description": "Test mission", "mission_id": "test-001"}'
```

## 📊 Standardized Structure

All workflows now follow the same format:
1. **Webhook Input** - Standardized endpoint naming
2. **LLM Selection** - Optimized model selection for each role
3. **Crew AI Agent** - Consistent prompt structure and parameters
4. **Observation Communication** - Unified response formatting
5. **Response Formatter** - Standardized output structure

## 🔄 Benefits of Standardization

- **Consistent Behavior**: All crew members respond in the same format
- **Easier Maintenance**: Unified structure across all workflows
- **Better Integration**: Seamless communication between crew members
- **Optimized Performance**: Each crew member uses the best LLM for their role
- **Simplified Deployment**: Standardized import and configuration process

## 📁 File Locations

All standardized workflows are located in: `standardized_crew_workflows/`

## 🚨 Important Notes

- **Environment Variables**: Ensure your OpenRouter API key is properly set in ~/.zshrc
- **Credential Naming**: Use the exact credential name: `OpenRouter API`
- **Webhook Paths**: Each crew member has a unique webhook path for individual testing
- **Comprehensive Workflow**: Use the unified workflow for full mission control

# 🚀 Dynamic LLM Router for Claude Code Integration

## 🎯 **Overview**

The Dynamic LLM Router is an N8N workflow that intelligently routes tasks to the optimal AI model using OpenRouter. It analyzes task complexity, requirements, and budget constraints to automatically select the best LLM for each job.

## 🏗️ **Architecture**

```
Task Input → N8N Webhook → Python Router → OpenRouter API → Selected LLM → Response
```

### **Components:**
1. **Webhook Trigger** - Receives task requests
2. **Input Validator** - Validates and formats input data
3. **Python LLM Router** - Core routing logic and LLM selection
4. **Response Formatter** - Formats output for the user
5. **Logging Node** - Monitors and logs routing decisions

## 🚀 **Quick Start**

### **1. Prerequisites**
- N8N instance running
- OpenRouter API key
- Python 3.7+ with `requests` library

### **2. Setup OpenRouter API Key**
```bash
export OPENROUTER_API_KEY=your_api_key_here
```

### **3. Install Dependencies**
```bash
pip install requests
```

### **4. Deploy to N8N**
1. Import the `workflow.json` file into your N8N instance
2. Update the Python node path to point to your `llm_router.py` file
3. Activate the workflow

## 📡 **API Usage**

### **Endpoint:**
```
POST https://your-n8n-instance.com/webhook/dynamic-llm-router
```

### **Request Body:**
```json
{
  "task_description": "Create a strategic plan for our PDF processing system",
  "context": {
    "crew_member": {
      "name": "Captain Jean-Luc Picard",
      "role": "Strategic Leadership",
      "specialization": "High-level strategy and planning"
    }
  },
  "budget_constraints": {
    "max_cost": 0.10
  }
}
```

### **Response:**
```json
{
  "success": true,
  "routing_summary": {
    "task_type": "strategic_planning",
    "complexity": "high",
    "selected_model": "Claude 3.5 Sonnet",
    "reasoning": "Selected Claude 3.5 Sonnet for strategic_planning task with high complexity. Capability score: 5, Estimated cost: $0.0084",
    "total_cost": 0.0084
  },
  "ai_response": "Based on your request for a strategic plan...",
  "model_used": "Claude 3.5 Sonnet",
  "alternatives": [
    {
      "model_name": "GPT-4o",
      "capability_score": 4,
      "estimated_cost": 0.0070
    }
  ],
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

## 🧠 **LLM Selection Logic**

### **Task Type Mapping:**
- **Strategic Planning** → Claude 3.5 Sonnet, GPT-4o
- **Complex Analysis** → Claude 3.5 Sonnet, GPT-4o
- **Code Implementation** → GPT-4o, Claude 3.5 Sonnet
- **Debugging** → GPT-4o, Claude 3.5 Sonnet
- **Documentation** → Claude 3.5 Sonnet, GPT-4o
- **Quick Analysis** → Claude 3 Haiku, GPT-4o Mini
- **Cost Sensitive** → Claude 3 Haiku, GPT-4o Mini, Gemini Pro
- **Multimodal** → GPT-4o, Gemini Pro

### **Selection Criteria:**
1. **Capability Score** - How well the model matches the task
2. **Cost Efficiency** - Lower cost preferred when capabilities are similar
3. **Budget Constraints** - Respects maximum cost limits
4. **Model Availability** - Considers token limits and provider status

## 🧪 **Testing**

### **Run Test Suite:**
```bash
cd n8n_workflows/dynamic_llm_routing
python3 test_router.py
```

### **Test Individual Components:**
```python
from llm_router import DynamicLLMRouter

router = DynamicLLMRouter()

# Test task analysis
analysis = router.analyze_task("Create a strategic plan")
print(analysis)

# Test LLM selection
selection = router.select_optimal_llm(analysis, {"max_cost": 0.10})
print(selection)

# Test full routing
result = router.route_task("Debug the login form", budget_constraints={"max_cost": 0.05})
print(result)
```

## 🔧 **Configuration**

### **Environment Variables:**
- `OPENROUTER_API_KEY` - Your OpenRouter API key
- `N8N_BASE_URL` - Your N8N instance URL

### **Customizing Models:**
Edit the `available_models` dictionary in `llm_router.py` to:
- Add new models
- Update pricing
- Modify capabilities
- Adjust token limits

### **Customizing Task Types:**
Edit the `task_model_mappings` dictionary to:
- Add new task types
- Change model preferences
- Optimize for your use cases

## 📊 **Monitoring & Logging**

### **N8N Logs:**
The workflow includes a logging node that records:
- Task routing decisions
- Model selections
- Costs incurred
- Success/failure rates

### **Performance Metrics:**
- Response times
- Cost per task
- Model utilization
- Error rates

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Python Execution Error**
   - Verify Python path in N8N node
   - Check file permissions
   - Ensure dependencies are installed

2. **OpenRouter API Errors**
   - Verify API key is set
   - Check API rate limits
   - Verify model availability

3. **Task Analysis Failures**
   - Check task description format
   - Verify keyword matching logic
   - Review complexity thresholds

### **Debug Mode:**
Enable detailed logging by setting:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 🔮 **Future Enhancements**

### **Planned Features:**
- **Learning Router** - Improve selections based on past performance
- **Cost Optimization** - Dynamic budget allocation
- **Model Health Monitoring** - Track model availability and performance
- **A/B Testing** - Compare different routing strategies
- **Custom Model Integration** - Support for local/private models

### **Integration Opportunities:**
- **Supabase Memory** - Store routing decisions and outcomes
- **Crew Coordination** - Integrate with Star Trek crew system
- **Performance Analytics** - Track crew member effectiveness
- **Cost Reporting** - Monitor AI usage costs

## 📚 **API Reference**

### **DynamicLLMRouter Class:**

#### **Methods:**
- `analyze_task(task_description, context)` - Analyze task complexity and type
- `select_optimal_llm(task_analysis, budget_constraints)` - Select best LLM
- `execute_with_selected_llm(task, selected_model, context)` - Execute task
- `route_task(task_description, context, budget_constraints)` - Full routing pipeline

#### **Properties:**
- `available_models` - Dictionary of available LLM models
- `task_model_mappings` - Task type to model mappings

## 🤝 **Contributing**

### **Development Workflow:**
1. Test changes locally with `test_router.py`
2. Update documentation
3. Test in N8N development environment
4. Deploy to production

### **Code Standards:**
- Follow PEP 8 style guidelines
- Add type hints for all functions
- Include docstrings for all methods
- Write tests for new features

## 📄 **License**

This project is part of the Claude Code Integration system. See the main project license for details.

---

*System Status: Dynamic LLM Router ready for deployment! 🚀*

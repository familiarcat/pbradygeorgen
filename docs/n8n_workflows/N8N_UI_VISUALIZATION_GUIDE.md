# 🎯 How to See Your Optimized AlexAI Crew in the n8n UI

## 🚀 **Step-by-Step Guide to Visualize Your Crew**

### **📋 Step 1: Access Your n8n Instance**
1. Open your browser
2. Navigate to: **https://n8n.pbradygeorgen.com**
3. Log in with your credentials

### **📁 Step 2: Import Workflows (Manual Method)**

#### **Option A: Import from File (Recommended)**
1. In the n8n UI, click **"Import from file"**
2. Navigate to your deployment directory: `n8n_deployment_20250824_024231/n8n_workflows/`
3. Import each workflow file one by one:
   - `mission_coordinator_workflow.json` → **Captain Picard**
   - `execution_commander_workflow.json` → **Commander Riker**
   - `specialist_1_data_workflow.json` → **Lieutenant Commander Data**
   - `specialist_2_geordi_workflow.json` → **Lieutenant Commander Geordi**
   - `specialist_3_crusher_workflow.json` → **Dr. Beverly Crusher**
   - `specialist_4_worf_workflow.json` → **Lieutenant Worf**
   - `specialist_5_troi_workflow.json` → **Counselor Deanna Troi**
   - `specialist_6_uhura_workflow.json` → **Lieutenant Uhura**
   - `specialist_7_quark_workflow.json` → **Quark**

#### **Option B: Copy-Paste JSON**
1. Open each workflow file in a text editor
2. Copy the entire JSON content
3. In n8n, click **"Import from JSON"**
4. Paste the content and import

### **🎯 Step 3: What You'll See in the n8n UI**

#### **🏠 Main Dashboard**
- **9 new workflows** will appear in your workflows list
- Each workflow represents one crew member
- Workflows will be **inactive** by default (safety feature)

#### **👥 Crew Member Workflows**

**1. Mission Coordinator - Captain Picard**
- **Trigger**: Manual execution or webhook
- **AI Node**: OpenRouter with gpt-4o-mini
- **Function**: Strategic analysis and crew allocation
- **Output**: Mission assessment and crew recommendations

**2. Execution Commander - Commander Riker**
- **Trigger**: Manual execution or webhook
- **AI Node**: OpenRouter with claude-3-haiku
- **Function**: Tactical execution and workflow optimization
- **Output**: Optimized execution plans

**3. Analytics Officer - Lieutenant Commander Data**
- **Trigger**: Manual execution or webhook
- **AI Node**: OpenRouter with claude-3-sonnet
- **Function**: Data analysis and logical validation
- **Output**: Performance metrics and insights

**4. Infrastructure Officer - Lieutenant Commander Geordi**
- **Trigger**: Manual execution or webhook
- **AI Node**: OpenRouter with gpt-4o
- **Function**: Technical architecture and system integration
- **Output**: Infrastructure recommendations

**5. Health Officer - Dr. Beverly Crusher**
- **Trigger**: Manual execution or webhook
- **AI Node**: OpenRouter with claude-3-haiku
- **Function**: System health monitoring and diagnostics
- **Output**: Health reports and maintenance recommendations

**6. Security Officer - Lieutenant Worf**
- **Trigger**: Manual execution or webhook
- **AI Node**: OpenRouter with gpt-4o-mini
- **Function**: Security analysis and compliance checking
- **Output**: Security assessments and compliance reports

**7. UX Officer - Counselor Deanna Troi**
- **Trigger**: Manual execution or webhook
- **AI Node**: OpenRouter with claude-3-sonnet
- **Function**: User experience and empathy analysis
- **Output**: UX insights and user journey recommendations

**8. Communications Officer - Lieutenant Uhura**
- **Trigger**: Manual execution or webhook
- **AI Node**: OpenRouter with claude-3-haiku
- **Function**: API communication and I/O operations
- **Output**: Communication protocols and integration status

**9. Business Officer - Quark**
- **Trigger**: Manual execution or webhook
- **AI Node**: OpenRouter with gpt-3.5-turbo
- **Function**: Business intelligence and budget optimization
- **Output**: Cost analysis and growth recommendations

### **⚙️ Step 4: Configure OpenRouter Integration**

1. **In n8n, go to Settings → Credentials**
2. **Add new credential** for OpenRouter
3. **Configure with your API key**: `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`
4. **Test the connection**

### **🧪 Step 5: Test Your Crew**

#### **Individual Testing**
1. **Activate one workflow** at a time
2. **Execute manually** to test each crew member
3. **Verify AI responses** are working correctly
4. **Check OpenRouter integration** is functioning

#### **Crew Collaboration Testing**
1. **Create a master workflow** that calls multiple crew members
2. **Test crew coordination** workflows
3. **Verify cost optimization** is working
4. **Monitor performance metrics**

### **📊 Step 6: Monitor and Optimize**

#### **What to Watch For**
- **Cost per mission** with different LLM combinations
- **Response quality** from each crew member
- **Workflow execution time** and efficiency
- **Crew collaboration** effectiveness

#### **Optimization Opportunities**
- **Adjust LLM selection** based on task complexity
- **Fine-tune prompts** for better responses
- **Optimize crew activation** patterns
- **Monitor cost vs. quality** trade-offs

### **🎉 Expected Results in n8n UI**

After successful import and configuration, you'll see:

✅ **9 professional workflows** representing your Star Trek crew  
✅ **Intelligent LLM routing** based on task requirements  
✅ **Cost-optimized AI selection** for each mission type  
✅ **Seamless crew collaboration** through workflow chaining  
✅ **Professional workflow names** and descriptions  
✅ **Ready-to-execute** crew member workflows  

### **🔧 Troubleshooting**

#### **If Workflows Don't Import**
- Check JSON syntax in workflow files
- Verify n8n version compatibility
- Try importing one workflow at a time

#### **If OpenRouter Doesn't Work**
- Verify API key is correct
- Check credential configuration in n8n
- Test OpenRouter connection separately

#### **If Crew Members Don't Respond**
- Verify workflow activation status
- Check trigger configurations
- Test individual nodes manually

---

## 🚀 **Your Optimized Crew is Ready for Action!**

Once imported and configured, your 8-member AlexAI crew will be visible in the n8n UI as professional, cost-optimized workflows that can be activated individually or as collaborative teams for maximum mission effectiveness.

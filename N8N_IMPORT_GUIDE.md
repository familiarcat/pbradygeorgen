# 🚀 N8N CREW MANAGEMENT SYSTEM IMPORT GUIDE

## 🔐 **IMPORTANT: Use Your Local Credentials**

**NEVER hardcode API keys in files!** Use your `~/.zshrc` environment variables instead.

## 📋 **Step-by-Step Import Process**

### **1️⃣ Open Your n8n Instance**
- **URL**: `https://n8n.pbradygeorgen.com`
- **Status**: Ready for crew management system import

### **2️⃣ Import the Crew Management Workflow**
1. **Navigate to Workflows** in the n8n UI
2. **Click "Import from file"** button
3. **Select the file**: `crew_management_workflow.json`
4. **Review the workflow** - it should show 8 nodes and 7 connections
5. **Click "Import"** to add it to your n8n instance

### **3️⃣ Activate the Workflow**
1. **Find "AlexAI Crew Management System"** in your workflows list
2. **Toggle the activation switch** to turn it ON
3. **Verify the webhook endpoint** is available at `/webhook/crew-management`

### **4️⃣ Test the Crew Management System**

#### **Test 1: Add a Crew Member**
```bash
curl -X POST https://n8n.pbradygeorgen.com/webhook/crew-management \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "add_crew",
    "name": "Test Specialist",
    "role": "engineering_specialist",
    "specialization": "System testing and validation",
    "llm_preference": "openai/gpt-4o-mini"
  }'
```

#### **Test 2: Create a Mission**
```bash
curl -X POST https://n8n.pbradygeorgen.com/webhook/crew-management \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "create_mission",
    "mission_id": "test-mission-001",
    "name": "System Integration Test",
    "description": "Test the crew management system",
    "mission_type": "project_development",
    "required_crew_size": 5,
    "priority": "high"
  }'
```

#### **Test 3: Generate Crew Report**
```bash
curl -X POST https://n8n.pbradygeorgen.com/webhook/crew-management \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "crew_report"
  }'
```

#### **Test 4: Complete a Mission**
```bash
curl -X POST https://n8n.pbradygeorgen.com/webhook/crew-management \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "complete_mission",
    "mission_id": "test-mission-001",
    "outcomes": ["System tested successfully", "Crew operations validated"],
    "lessons_learned": ["Automated crew assignment works well", "Performance tracking is effective"]
  }'
```

## 🧠 **What This System Provides**

### **🎯 Single Source of Truth**
- **Dynamic crew management** with automated assignment
- **Mission creation and tracking** with outcome recording
- **Performance monitoring** and optimization recommendations
- **Collective learning** from all operations

### **🔧 Crew Operations**
- **Add Crew Member**: New specialists for specific missions
- **Remove Crew Member**: Safe removal with dependency checks
- **Create Mission**: Automated crew assignment based on requirements
- **Complete Mission**: Record outcomes and lessons learned
- **Generate Reports**: Performance insights and optimization opportunities

### **📊 Mission Types Supported**
- Project Development
- Infrastructure Deployment
- Security Audit
- Performance Optimization
- User Research
- Business Analysis
- Emergency Response
- Strategic Planning

## 🔍 **Verifying the Import**

### **✅ What to Look For**
1. **Workflow appears** in your n8n workflows list
2. **8 nodes** are visible in the workflow editor
3. **Webhook endpoint** is active at `/webhook/crew-management`
4. **Workflow status** shows as "Active"

### **🔧 Node Structure**
- **Webhook Trigger**: Receives crew management requests
- **Operation Router**: Routes requests to appropriate handlers
- **Add Crew Handler**: Processes crew member additions
- **Remove Crew Handler**: Processes crew member removals
- **Create Mission Handler**: Processes mission creation
- **Complete Mission Handler**: Processes mission completion
- **Crew Report Handler**: Generates performance reports
- **Response Aggregator**: Combines all responses

## 🚀 **Next Steps After Import**

### **1️⃣ Test Basic Operations**
- Try adding a test crew member
- Create a test mission
- Generate a crew report

### **2️⃣ Monitor Performance**
- Check webhook response times
- Verify all operations complete successfully
- Monitor for any error messages

### **3️⃣ Scale Operations**
- Add more crew members as needed
- Create missions for different project types
- Analyze performance patterns

### **4️⃣ Integrate with Other Systems**
- Connect to your existing workflows
- Use crew management for project planning
- Integrate with performance monitoring tools

## 🔒 **Security Features**

- **No API keys exposed** in workflow files
- **Environment variable protection** maintained
- **Secure webhook endpoints** for operations
- **Audit logging** of all crew operations

## 📞 **Support & Troubleshooting**

### **Common Issues**
1. **Webhook not responding**: Check workflow activation status
2. **Operation errors**: Verify payload format matches examples
3. **Authentication issues**: Ensure n8n instance is accessible

### **Getting Help**
- Check n8n execution logs for detailed error information
- Verify webhook endpoint is accessible
- Test with simple payloads first

---

## 🎉 **You're Ready to Go!**

Your **AlexAI Crew Management System** is now ready to become the **single source of truth** for all crew operations. Every addition, removal, mission, and outcome will be tracked, learned from, and optimized automatically!

**🚀 Mission Control: Engage!**

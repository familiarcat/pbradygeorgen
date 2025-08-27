#!/usr/bin/env python3
"""
N8N Crew Workflow Standardization Script

This script standardizes all individual crew workflows to match the comprehensive
workflow structure, ensuring consistent formatting and behavior across all crew members.
"""

import json
import os
import glob
from typing import Dict, List, Any
from pathlib import Path

class CrewWorkflowStandardizer:
    def __init__(self):
        self.backup_dir = "n8n_backup_20250825_050506"
        self.output_dir = "standardized_crew_workflows"
        self.comprehensive_template = None
        
        # Standard crew member configurations
        self.crew_members = {
            "picard": {
                "name": "Captain Jean-Luc Picard - Strategic Leadership & Mission Command",
                "role": "Strategic Leadership & Mission Coordination",
                "specialization": "High-level strategy, cost-benefit analysis, mission optimization, crew coordination",
                "llm_model": "anthropic/claude-3.5-sonnet",
                "temperature": 0.3,
                "position": [600, 200]
            },
            "riker": {
                "name": "Commander William Riker - Tactical Execution & Workflow Management",
                "role": "Tactical Execution & Workflow Management",
                "specialization": "Operational efficiency, workflow optimization, tactical decision making",
                "llm_model": "openai/gpt-4o",
                "temperature": 0.4,
                "position": [600, 400]
            },
            "data": {
                "name": "Commander Data - Analytics & Logic Operations",
                "role": "Analytics & Logic Operations",
                "specialization": "Data analysis, pattern recognition, logical reasoning, performance metrics",
                "llm_model": "openai/gpt-4o",
                "temperature": 0.3,
                "position": [600, 600]
            },
            "geordi": {
                "name": "Lieutenant Commander Geordi La Forge - Infrastructure & System Integration",
                "role": "Infrastructure & System Integration",
                "specialization": "Technical implementation, systems engineering, creative problem-solving",
                "llm_model": "anthropic/claude-3.5-sonnet",
                "temperature": 0.4,
                "position": [600, 800]
            },
            "crusher": {
                "name": "Doctor Beverly Crusher - Health Monitoring & System Optimization",
                "role": "Health Monitoring & System Optimization",
                "specialization": "System health monitoring, performance optimization, preventive maintenance",
                "llm_model": "anthropic/claude-3-haiku",
                "temperature": 0.3,
                "position": [800, 200]
            },
            "troi": {
                "name": "Counselor Deanna Troi - User Experience & Empathy Analysis",
                "role": "User Experience & Empathy Analysis",
                "specialization": "User experience optimization, empathy-driven design, emotional intelligence",
                "llm_model": "anthropic/claude-3-haiku",
                "temperature": 0.4,
                "position": [800, 400]
            },
            "worf": {
                "name": "Lieutenant Worf - Security & Compliance Operations",
                "role": "Security & Compliance Operations",
                "specialization": "Security analysis, compliance monitoring, threat assessment, risk management",
                "llm_model": "openai/gpt-4o-mini",
                "temperature": 0.3,
                "position": [800, 600]
            },
            "uhura": {
                "name": "Lieutenant Uhura - Communications & I/O Operations",
                "role": "Communications & I/O Operations",
                "specialization": "API communication, data processing, integration monitoring, response generation",
                "llm_model": "anthropic/claude-3-haiku",
                "temperature": 0.4,
                "position": [800, 800]
            },
            "quark": {
                "name": "Quark - Business Intelligence & Budget Optimization",
                "role": "Business Intelligence & Budget Optimization",
                "specialization": "Cost analysis, ROI optimization, business metrics, growth opportunities",
                "llm_model": "openai/gpt-3.5-turbo",
                "temperature": 0.3,
                "position": [1000, 200]
            }
        }
        
        # Create output directory
        os.makedirs(self.output_dir, exist_ok=True)
    
    def load_comprehensive_template(self):
        """Load the comprehensive workflow as a template"""
        template_path = os.path.join(self.backup_dir, "Enhanced_Federation_Crew___Complete_Mission_Control.json")
        if os.path.exists(template_path):
            with open(template_path, 'r') as f:
                self.comprehensive_template = json.load(f)
            print(f"✓ Loaded comprehensive template: {template_path}")
        else:
            print(f"✗ Comprehensive template not found: {template_path}")
            return False
        return True
    
    def create_standardized_crew_workflow(self, crew_id: str, crew_config: Dict[str, Any]) -> Dict[str, Any]:
        """Create a standardized individual crew workflow"""
        
        # Base workflow structure
        workflow = {
            "createdAt": "2025-01-27T00:00:00.000Z",
            "updatedAt": "2025-01-27T00:00:00.000Z",
            "id": f"standardized_{crew_id}",
            "name": crew_config["name"],
            "active": True,
            "isArchived": False,
            "nodes": []
        }
        
        # 1. Webhook node (standardized)
        webhook_node = {
            "id": "crew_directive",
            "name": f"{crew_config['role']} Directive",
            "type": "n8n-nodes-base.webhook",
            "typeVersion": 1,
            "position": [240, 300],
            "parameters": {
                "httpMethod": "POST",
                "path": f"crew-{crew_id}",
                "responseMode": "responseNode",
                "options": {}
            }
        }
        workflow["nodes"].append(webhook_node)
        
        # 2. LLM Selection Agent (standardized)
        llm_selector_node = {
            "id": "llm_selector",
            "name": "LLM Selection Agent",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 1,
            "position": [460, 200],
            "parameters": {
                "url": "https://api.openrouter.ai/api/v1/chat/completions",
                "method": "POST",
                "authentication": "genericCredentialType",
                "genericAuthType": "httpHeaderAuth",
                "nodeCredentialType": "httpHeaderAuth",
                "httpHeaderAuth": "Bearer {{ $env.OPENROUTER_API_KEY }}",
                "sendBody": True,
                "bodyParameters": [
                    {
                        "name": "model",
                        "value": crew_config["llm_model"]
                    },
                    {
                        "name": "messages",
                        "value": f"={{ [{{\"role\": \"system\", \"content\": \"You are the LLM Selection Agent for {crew_config['name']}. Based on the task complexity, requirements, and available models, select the optimal LLM model. Consider factors like reasoning ability, context length, speed, and cost.\"}}, {{\"role\": \"user\", \"content\": $json.body.task}}] }}"
                    },
                    {
                        "name": "temperature",
                        "value": "0.2"
                    }
                ]
            }
        }
        workflow["nodes"].append(llm_selector_node)
        
        # 3. Crew AI Agent (standardized)
        crew_ai_node = {
            "id": "crew_ai",
            "name": f"{crew_config['name']} AI Agent",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 1,
            "position": [680, 300],
            "parameters": {
                "url": "https://api.openrouter.ai/api/v1/chat/completions",
                "method": "POST",
                "authentication": "genericCredentialType",
                "genericAuthType": "httpHeaderAuth",
                "nodeCredentialType": "httpHeaderAuth",
                "httpHeaderAuth": "Bearer {{ $env.OPENROUTER_API_KEY }}",
                "sendBody": True,
                "bodyParameters": [
                    {
                        "name": "model",
                        "value": "={{ $json.body.selected_model }}"
                    },
                    {
                        "name": "messages",
                        "value": f"={{ [{{\"role\": \"system\", \"content\": \"You are {crew_config['name']}, a Federation crew member with the role of {crew_config['role']}. {crew_config['specialization']}. Execute your assigned task with expertise and provide detailed analysis and recommendations. Communicate your findings clearly for the Observation Lounge.\"}}, {{\"role\": \"user\", \"content\": $json.body.task}}] }}"
                    },
                    {
                        "name": "temperature",
                        "value": str(crew_config["temperature"])
                    }
                ]
            }
        }
        workflow["nodes"].append(crew_ai_node)
        
        # 4. Observation Lounge Communication (standardized)
        observation_node = {
            "id": "observation_communication",
            "name": "Observation Lounge Communication",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 1,
            "position": [900, 300],
            "parameters": {
                "url": "https://api.openrouter.ai/api/v1/chat/completions",
                "method": "POST",
                "authentication": "genericCredentialType",
                "genericAuthType": "httpHeaderAuth",
                "nodeCredentialType": "httpHeaderAuth",
                "httpHeaderAuth": "Bearer {{ $env.OPENROUTER_API_KEY }}",
                "sendBody": True,
                "bodyParameters": [
                    {
                        "name": "model",
                        "value": "anthropic/claude-3-haiku"
                    },
                    {
                        "name": "messages",
                        "value": "={{ [{\"role\": \"system\", \"content\": \"You are the Observation Lounge Communication Agent. Format the crew member's response for clear communication to the Observation Lounge. Ensure the response is well-structured, professional, and includes the crew member's role and recommendations.\"}, {\"role\": \"user\", \"content\": $json.body.response}] }}"
                    },
                    {
                        "name": "temperature",
                        "value": "0.3"
                    }
                ]
            }
        }
        workflow["nodes"].append(observation_node)
        
        # 5. Response Formatter (standardized)
        response_formatter_node = {
            "id": "response_formatter",
            "name": "Response Formatter",
            "type": "n8n-nodes-base.set",
            "typeVersion": 3.4,
            "position": [1120, 300],
            "parameters": {
                "values": {
                    "string": [
                        {
                            "name": "crew_member",
                            "value": crew_config["name"]
                        },
                        {
                            "name": "role",
                            "value": crew_config["role"]
                        },
                        {
                            "name": "response",
                            "value": "={{ $json.content }}"
                        },
                        {
                            "name": "timestamp",
                            "value": "={{ $now }}"
                        }
                    ]
                },
                "options": {}
            }
        }
        workflow["nodes"].append(response_formatter_node)
        
        return workflow
    
    def create_comprehensive_workflow(self) -> Dict[str, Any]:
        """Create a comprehensive workflow that integrates all crew members"""
        
        if not self.comprehensive_template:
            print("✗ No comprehensive template available")
            return None
        
        # Clone the template
        comprehensive_workflow = json.loads(json.dumps(self.comprehensive_template))
        comprehensive_workflow["name"] = "AlexAI Standardized Crew - Complete Mission Control"
        comprehensive_workflow["id"] = "standardized_comprehensive_crew"
        
        # Update webhook path
        for node in comprehensive_workflow["nodes"]:
            if node["id"] == "mission_coordinator":
                node["parameters"]["path"] = "alexai-crew-mission"
                break
        
        return comprehensive_workflow
    
    def standardize_all_workflows(self):
        """Standardize all crew workflows"""
        print("🚀 Starting crew workflow standardization...")
        
        if not self.load_comprehensive_template():
            return
        
        # Create individual standardized workflows
        for crew_id, crew_config in self.crew_members.items():
            print(f"\n📝 Standardizing {crew_config['name']}...")
            
            workflow = self.create_standardized_crew_workflow(crew_id, crew_config)
            
            # Save individual workflow
            filename = f"standardized_{crew_id}_workflow.json"
            filepath = os.path.join(self.output_dir, filename)
            
            with open(filepath, 'w') as f:
                json.dump(workflow, f, indent=2)
            
            print(f"✓ Saved: {filepath}")
        
        # Create comprehensive workflow
        print(f"\n🔗 Creating comprehensive workflow...")
        comprehensive_workflow = self.create_comprehensive_workflow()
        
        if comprehensive_workflow:
            filename = "standardized_comprehensive_crew_workflow.json"
            filepath = os.path.join(self.output_dir, filename)
            
            with open(filepath, 'w') as f:
                json.dump(comprehensive_workflow, f, indent=2)
            
            print(f"✓ Saved: {filepath}")
        
        # Create deployment instructions
        self.create_deployment_instructions()
        
        print(f"\n🎉 Standardization complete! Check the '{self.output_dir}' directory.")
    
    def create_deployment_instructions(self):
        """Create deployment instructions for the standardized workflows"""
        instructions = f"""# 🚀 AlexAI Standardized Crew - Deployment Instructions

## 🎯 Standardization Summary
- **Individual Workflows**: {len(self.crew_members)} standardized crew member workflows
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
Import each standardized workflow from the `{self.output_dir}` directory:
"""
        
        for crew_id, crew_config in self.crew_members.items():
            instructions += f"- **{crew_config['name']}**: `standardized_{crew_id}_workflow.json`\n"
        
        instructions += f"""
### Option B: Comprehensive Mission Control
Import the unified workflow: `standardized_comprehensive_crew_workflow.json`

## 🧪 Step 3: Testing

### Test Individual Crew Members
```bash
curl -X POST "{{N8N_URL}}/webhook/crew-{{CREW_ID}}" \\
  -H "Content-Type: application/json" \\
  -d '{{"task": "Test task for {{CREW_NAME}}", "mission_id": "test-001"}}'
```

### Test Comprehensive Mission
```bash
curl -X POST "{{N8N_URL}}/webhook/alexai-crew-mission" \\
  -H "Content-Type: application/json" \\
  -d '{{"mission_description": "Test mission", "mission_id": "test-001"}}'
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

All standardized workflows are located in: `{self.output_dir}/`

## 🚨 Important Notes

- **Environment Variables**: Ensure your OpenRouter API key is properly set in ~/.zshrc
- **Credential Naming**: Use the exact credential name: `OpenRouter API`
- **Webhook Paths**: Each crew member has a unique webhook path for individual testing
- **Comprehensive Workflow**: Use the unified workflow for full mission control
"""
        
        instructions_path = os.path.join(self.output_dir, "DEPLOYMENT_INSTRUCTIONS.md")
        with open(instructions_path, 'w') as f:
            f.write(instructions)
        
        print(f"✓ Created deployment instructions: {instructions_path}")

def main():
    """Main execution function"""
    standardizer = CrewWorkflowStandardizer()
    standardizer.standardize_all_workflows()

if __name__ == "__main__":
    main()

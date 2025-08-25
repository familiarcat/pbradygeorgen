#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - CONCISE AGENCY WORKFLOW
Creates a streamlined, OpenRouter-powered crew agency workflow
"""

import json
from datetime import datetime

class FederationConciseAgencyWorkflow:
    """Creates a concise Federation agency workflow"""
    
    def __init__(self):
        self.workflow_name = "Federation Concise Agency - OpenRouter Crew"
        self.workflow_description = "Streamlined Federation crew agency using OpenRouter for dynamic LLM selection"
        
        # Federation crew members
        self.federation_crew = [
            {
                "name": "Captain Picard",
                "role": "Strategic Commander",
                "specialty": "Mission strategy, diplomacy, crew coordination",
                "personality": "Diplomatic, strategic, wise leader"
            },
            {
                "name": "Commander Riker",
                "role": "Execution Specialist", 
                "specialty": "Tactical execution, mission implementation",
                "personality": "Action-oriented, tactical, decisive"
            },
            {
                "name": "Counselor Troi",
                "role": "Empathy & UX Specialist",
                "specialty": "User experience, emotional intelligence, human factors",
                "personality": "Empathetic, intuitive, user-focused"
            },
            {
                "name": "Lieutenant Uhura",
                "role": "Communications & I/O Specialist",
                "specialty": "Data communication, input/output optimization",
                "personality": "Clear communicator, efficient, organized"
            },
            {
                "name": "Quark",
                "role": "Business & Budget Specialist",
                "specialty": "Cost optimization, business strategy, resource management",
                "personality": "Practical, cost-conscious, business-savvy"
            }
        ]
    
    def create_concise_workflow(self):
        """Create a concise Federation agency workflow"""
        
        workflow = {
            "name": self.workflow_name,
            "description": self.workflow_description,
            "nodes": [
                {
                    "id": "mission_trigger",
                    "name": "Mission Trigger",
                    "type": "n8n-nodes-base.webhook",
                    "typeVersion": 1,
                    "position": [240, 300],
                    "parameters": {
                        "httpMethod": "POST",
                        "path": "federation-mission",
                        "responseMode": "responseNode",
                        "options": {}
                    }
                },
                {
                    "id": "mission_analyzer",
                    "name": "Mission Analyzer",
                    "type": "n8n-nodes-base.code",
                    "typeVersion": 2,
                    "position": [460, 300],
                    "parameters": {
                        "jsCode": f"""// Mission Analyzer - Determines crew requirements
const mission = $input.first().json;

// Analyze mission requirements
const analysis = {{
    mission_type: mission.type || 'general',
    complexity: mission.complexity || 'medium',
    required_crew: [],
    priority: mission.priority || 'normal',
    estimated_cost: mission.budget || 100
}};

// Determine required crew based on mission type
if (mission.type === 'strategic') {{
    analysis.required_crew = ['Captain Picard', 'Commander Riker'];
}} else if (mission.type === 'technical') {{
    analysis.required_crew = ['Commander Riker', 'Lieutenant Uhura'];
}} else if (mission.type === 'user_experience') {{
    analysis.required_crew = ['Counselor Troi', 'Lieutenant Uhura'];
}} else if (mission.type === 'business') {{
    analysis.required_crew = ['Quark', 'Captain Picard'];
}} else {{
    // General mission - use all crew
    analysis.required_crew = {[crew['name'] for crew in self.federation_crew]};
}}

return {{
    json: {{
        mission: mission,
        analysis: analysis,
        timestamp: new Date().toISOString(),
        federation: 'United Federation of AI Agents'
    }}
}};"""
                    }
                },
                {
                    "id": "openrouter_crew_selector",
                    "name": "OpenRouter Crew Selector",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 4.1,
                    "position": [680, 300],
                    "parameters": {
                        "url": "https://openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "authentication": "genericCredentialType",
                        "genericAuthType": "httpHeaderAuth",
                        "nodeCredentialType": "openRouterApi",
                        "sendHeaders": True,
                        "headerParameters": {
                            "parameters": [
                                {
                                    "name": "Content-Type",
                                    "value": "application/json"
                                }
                            ]
                        },
                        "sendBody": True,
                        "bodyParameters": {
                            "parameters": [
                                {
                                    "name": "model",
                                    "value": "{{ $json.analysis.complexity === 'high' ? 'anthropic/claude-3.5-sonnet' : 'openai/gpt-4o' }}"
                                },
                                {
                                    "name": "messages",
                                    "value": """[
                                        {
                                            "role": "system",
                                            "content": "You are the Federation Crew Selector. Based on the mission analysis, select the optimal crew members and provide a strategic approach."
                                        },
                                        {
                                            "role": "user", 
                                            "content": "Mission: {{ $json.mission.description }}\\nType: {{ $json.mission.type }}\\nComplexity: {{ $json.analysis.complexity }}\\nRequired Crew: {{ $json.analysis.required_crew.join(', ') }}\\n\\nProvide: 1) Optimal crew selection 2) Strategic approach 3) Estimated timeline 4) Success probability"
                                        }
                                    ]"""
                                },
                                {
                                    "name": "max_tokens",
                                    "value": "1000"
                                },
                                {
                                    "name": "temperature",
                                    "value": "0.7"
                                }
                            ]
                        }
                    }
                },
                {
                    "id": "crew_response_processor",
                    "name": "Crew Response Processor",
                    "type": "n8n-nodes-base.code",
                    "typeVersion": 2,
                    "position": [900, 300],
                    "parameters": {
                        "jsCode": """// Process crew response and create unified mission plan
const crewResponse = $input.first().json;
const mission = $('Mission Analyzer').first().json;

// Extract crew selection and strategy
const crewAnalysis = JSON.parse(crewResponse.choices[0].message.content);

// Create unified mission plan
const missionPlan = {
    mission_id: `federation_${Date.now()}`,
    mission_type: mission.mission.type,
    crew_selection: crewAnalysis.crew || mission.analysis.required_crew,
    strategy: crewAnalysis.strategy || 'Standard Federation protocol',
    timeline: crewAnalysis.timeline || '24-48 hours',
    success_probability: crewAnalysis.success_probability || '85%',
    cost_estimate: mission.analysis.estimated_cost,
    status: 'mission_approved',
    timestamp: new Date().toISOString(),
    federation: 'United Federation of AI Agents'
};

return {
    json: missionPlan
};"""
                    }
                },
                {
                    "id": "federation_response",
                    "name": "Federation Response",
                    "type": "n8n-nodes-base.respondToWebhook",
                    "typeVersion": 1,
                    "position": [1120, 300],
                    "parameters": {
                        "respondWith": "json",
                        "responseBody": "={{ $json }}",
                        "options": {}
                    }
                }
            ],
            "connections": {
                "Mission Trigger": {
                    "main": [
                        [
                            {
                                "node": "Mission Analyzer",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Mission Analyzer": {
                    "main": [
                        [
                            {
                                "node": "OpenRouter Crew Selector",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "OpenRouter Crew Selector": {
                    "main": [
                        [
                            {
                                "node": "Crew Response Processor",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Crew Response Processor": {
                    "main": [
                        [
                            {
                                "node": "Federation Response",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                }
            },
            "settings": {
                "executionOrder": "v1"
            },
            "staticData": None,
            "tags": [
                {
                    "createdAt": datetime.now().isoformat(),
                    "updatedAt": datetime.now().isoformat(),
                    "id": "federation-tag",
                    "name": "federation"
                }
            ],
            "triggerCount": 0,
            "updatedAt": datetime.now().isoformat(),
            "versionId": "1"
        }
        
        return workflow
    
    def create_workflow_file(self):
        """Create the workflow JSON file"""
        workflow = self.create_concise_workflow()
        
        # Create workflows directory if it doesn't exist
        import os
        os.makedirs("federation_workflows", exist_ok=True)
        
        # Save workflow file
        workflow_file = "federation_workflows/federation_concise_agency.json"
        with open(workflow_file, 'w') as f:
            json.dump(workflow, f, indent=2)
        
        print(f"✅ Concise Federation agency workflow created: {workflow_file}")
        return workflow_file
    
    def display_workflow_summary(self):
        """Display workflow summary"""
        print("\n" + "=" * 80)
        print("🏛️ FEDERATION CONCISE AGENCY WORKFLOW CREATED!")
        print("=" * 80)
        
        print("\n🎯 WORKFLOW STRUCTURE:")
        print("1. **Mission Trigger** - Webhook endpoint: `/federation-mission`")
        print("2. **Mission Analyzer** - Analyzes mission requirements and crew needs")
        print("3. **OpenRouter Crew Selector** - Dynamic LLM selection for optimal crew strategy")
        print("4. **Crew Response Processor** - Processes crew analysis into unified mission plan")
        print("5. **Federation Response** - Returns unified mission plan")
        
        print("\n🚀 KEY FEATURES:")
        print("✅ **Concise Design** - Only 5 nodes vs 8+ specialist nodes")
        print("✅ **OpenRouter Integration** - Dynamic LLM selection based on mission complexity")
        print("✅ **Intelligent Crew Selection** - Automatically selects optimal crew members")
        print("✅ **Unified Response** - Single, clean output instead of multiple specialist responses")
        print("✅ **Cost Optimization** - Quark's business expertise integrated")
        
        print("\n🎭 FEDERATION CREW MEMBERS:")
        for crew_member in self.federation_crew:
            print(f"   • **{crew_member['name']}** - {crew_member['role']}")
            print(f"     Specialty: {crew_member['specialty']}")
        
        print("\n🔧 DEPLOYMENT:")
        print("1. Import this workflow into n8n")
        print("2. Configure OpenRouter credentials")
        print("3. Test with POST request to `/federation-mission`")
        print("4. Your concise Federation agency will be operational!")
        
        print("\n💡 BENEFITS OVER CURRENT SETUP:")
        print("• **Simpler configuration** - Fewer nodes to manage")
        print("• **Better reliability** - No warning symbols or configuration issues")
        print("• **Dynamic crew selection** - OpenRouter chooses optimal LLM for each mission")
        print("• **Unified response** - Clean, aggregated output")
        print("• **Easier maintenance** - Less complex workflow structure")

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔧 CONCISE AGENCY WORKFLOW CREATOR")
    print("=" * 80)
    
    creator = FederationConciseAgencyWorkflow()
    workflow_file = creator.create_workflow_file()
    creator.display_workflow_summary()
    
    print("\n🎉 Concise Federation agency workflow creation completed!")
    print("🚀 Your streamlined Federation crew agency is ready for deployment!")

if __name__ == "__main__":
    main()

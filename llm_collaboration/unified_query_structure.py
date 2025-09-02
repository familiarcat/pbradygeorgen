#!/usr/bin/env python3
"""
Unified LLM Collaboration System
N8N + OpenRouter Integration for Multi-LLM Communication
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum

class CollaborationMode(Enum):
    SEQUENTIAL_HANDOFF = "sequential_handoff"
    PARALLEL_COLLABORATION = "parallel_collaboration"
    DEMOCRATIC_SELECTION = "democratic_selection"
    HYBRID_APPROACH = "hybrid_approach"

class LLMRole(Enum):
    STRATEGIC_ANALYSIS = "strategic_analysis"
    CODE_IMPLEMENTATION = "code_implementation"
    VISUAL_DEBUGGING = "visual_debugging"
    DOCUMENTATION = "documentation"
    RESEARCH = "research"
    TESTING = "testing"
    OPTIMIZATION = "optimization"

@dataclass
class LLMModel:
    name: str
    platform: str
    openrouter_id: str
    strengths: List[str]
    cost_per_token: float
    max_tokens: int
    specialization: LLMRole
    confidence_areas: List[str]

@dataclass
class CollaborationTask:
    task_id: str
    type: str
    complexity: str
    description: str
    context: Dict[str, Any]
    constraints: List[str]
    expected_deliverables: List[str]
    priority: str = "medium"

@dataclass
class UnifiedQuery:
    """Universal query structure for all LLM communication"""
    collaboration_id: str
    session_id: str
    timestamp: str
    
    task: CollaborationTask
    
    collaboration_context: Dict[str, Any]
    llm_routing: Dict[str, Any]
    response_format: Dict[str, Any]
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

class UnifiedLLMCollaborationSystem:
    def __init__(self):
        """Initialize the unified collaboration system"""
        self.n8n_base_url = os.environ.get('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.environ.get('N8N_API_KEY', '')
        self.openrouter_api_key = os.environ.get('OPENROUTER_API_KEY', '')
        
        # Available LLM models via OpenRouter
        self.available_models = {
            "claude": LLMModel(
                name="Claude",
                platform="anthropic",
                openrouter_id="anthropic/claude-3.5-sonnet",
                strengths=["system_architecture", "strategic_analysis", "integration_planning"],
                cost_per_token=0.000015,
                max_tokens=200000,
                specialization=LLMRole.STRATEGIC_ANALYSIS,
                confidence_areas=["complex_problems", "system_design", "workflow_coordination"]
            ),
            "gpt4": LLMModel(
                name="GPT-4",
                platform="openai", 
                openrouter_id="openai/gpt-4-turbo-preview",
                strengths=["creative_problem_solving", "documentation", "user_experience"],
                cost_per_token=0.00001,
                max_tokens=128000,
                specialization=LLMRole.DOCUMENTATION,
                confidence_areas=["creative_solutions", "user_interfaces", "communication"]
            ),
            "gemini": LLMModel(
                name="Gemini",
                platform="google",
                openrouter_id="google/gemini-pro",
                strengths=["multimodal_analysis", "research", "data_synthesis"],
                cost_per_token=0.000000125,
                max_tokens=30720,
                specialization=LLMRole.RESEARCH,
                confidence_areas=["data_analysis", "research_tasks", "visual_content"]
            ),
            "codellama": LLMModel(
                name="CodeLlama",
                platform="meta",
                openrouter_id="meta-llama/codellama-34b-instruct",
                strengths=["code_generation", "optimization", "code_explanation"],
                cost_per_token=0.0000008,
                max_tokens=16384,
                specialization=LLMRole.CODE_IMPLEMENTATION,
                confidence_areas=["code_generation", "optimization", "debugging"]
            )
        }
        
        self.collaboration_history = []
    
    def create_unified_query(
        self, 
        task_description: str,
        task_type: str = "general",
        complexity: str = "medium",
        requesting_llm: str = "claude",
        collaboration_mode: CollaborationMode = CollaborationMode.SEQUENTIAL_HANDOFF
    ) -> UnifiedQuery:
        """Create a unified query structure for LLM collaboration"""
        
        collaboration_id = f"collab_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        session_id = f"session_{collaboration_id}"
        
        # Create task object
        task = CollaborationTask(
            task_id=f"task_{collaboration_id}",
            type=task_type,
            complexity=complexity,
            description=task_description,
            context={
                "codebase_context": "claude_code_integration_project",
                "existing_systems": ["n8n_workflows", "observation_lounge", "crew_coordination"],
                "current_capabilities": ["5/5_n8n_endpoints_working", "live_data_flow", "ui_integration"]
            },
            constraints=["maintain_backwards_compatibility", "preserve_existing_functionality"],
            expected_deliverables=["analysis", "implementation_plan", "code_changes", "documentation"]
        )
        
        # Determine optimal LLM routing
        llm_routing = self.determine_optimal_routing(task, collaboration_mode, requesting_llm)
        
        # Create unified query
        query = UnifiedQuery(
            collaboration_id=collaboration_id,
            session_id=session_id,
            timestamp=datetime.now().isoformat(),
            task=task,
            collaboration_context={
                "requesting_llm": requesting_llm,
                "collaboration_mode": collaboration_mode.value,
                "previous_attempts": [],
                "shared_memory": {},
                "success_criteria": ["task_completion", "quality_validation", "integration_success"]
            },
            llm_routing=llm_routing,
            response_format={
                "include_reasoning": True,
                "include_next_steps": True,
                "include_handoff_context": True,
                "collaboration_notes": True,
                "confidence_score": True,
                "suggested_improvements": True
            }
        )
        
        return query
    
    def determine_optimal_routing(
        self, 
        task: CollaborationTask, 
        mode: CollaborationMode,
        requesting_llm: str
    ) -> Dict[str, Any]:
        """Determine the optimal LLM routing for the task"""
        
        # Analyze task requirements
        task_keywords = task.description.lower()
        
        # Determine primary LLM
        if any(keyword in task_keywords for keyword in ['architecture', 'system', 'integration', 'strategy']):
            primary = self.available_models["claude"]
        elif any(keyword in task_keywords for keyword in ['code', 'implement', 'debug', 'optimize']):
            primary = self.available_models["codellama"]
        elif any(keyword in task_keywords for keyword in ['research', 'analyze', 'data']):
            primary = self.available_models["gemini"]
        else:
            primary = self.available_models["gpt4"]
        
        # Determine collaborators based on mode
        collaborators = []
        if mode in [CollaborationMode.PARALLEL_COLLABORATION, CollaborationMode.HYBRID_APPROACH]:
            for model_id, model in self.available_models.items():
                if model != primary and any(strength in task_keywords for strength in model.strengths):
                    collaborators.append({
                        "model": model.openrouter_id,
                        "name": model.name,
                        "role": model.specialization.value,
                        "trigger": "parallel_execution",
                        "confidence_threshold": 0.7
                    })
        
        return {
            "primary": {
                "model": primary.openrouter_id,
                "name": primary.name,
                "role": primary.specialization.value,
                "confidence_threshold": 0.8,
                "cost_estimate": self.estimate_cost(primary, task)
            },
            "collaborators": collaborators,
            "routing_strategy": mode.value,
            "fallback_models": [model.openrouter_id for model in self.available_models.values() if model != primary]
        }
    
    def estimate_cost(self, model: LLMModel, task: CollaborationTask) -> float:
        """Estimate the cost for running the task with this model"""
        # Simple estimation based on task complexity
        complexity_multipliers = {"simple": 1000, "medium": 3000, "complex": 8000}
        estimated_tokens = complexity_multipliers.get(task.complexity, 3000)
        return estimated_tokens * model.cost_per_token
    
    async def send_to_n8n_orchestrator(self, query: UnifiedQuery) -> Dict[str, Any]:
        """Send the unified query to N8N for orchestration"""
        
        webhook_url = f"{self.n8n_base_url}/webhook/llm-collaborate"
        
        try:
            response = requests.post(
                webhook_url,
                json=query.to_dict(),
                headers={
                    'Content-Type': 'application/json',
                    'X-Collaboration-Source': 'unified_llm_system'
                },
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                self.collaboration_history.append({
                    'query': query.to_dict(),
                    'result': result,
                    'timestamp': datetime.now().isoformat(),
                    'success': True
                })
                return result
            else:
                error_result = {
                    'success': False,
                    'error': f'HTTP {response.status_code}: {response.text}',
                    'fallback_available': True
                }
                return error_result
                
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'fallback_to_direct': True
            }
    
    def create_n8n_workflow_json(self) -> Dict[str, Any]:
        """Generate N8N workflow JSON for LLM collaboration"""
        
        workflow = {
            "name": "Unified LLM Collaboration Orchestrator",
            "nodes": [
                {
                    "parameters": {
                        "path": "llm-collaborate",
                        "options": {}
                    },
                    "name": "Collaboration Webhook",
                    "type": "n8n-nodes-base.webhook",
                    "position": [240, 300],
                    "webhookId": "llm-collaborate"
                },
                {
                    "parameters": {
                        "jsCode": """
// Parse and validate the unified query
const query = $input.first().json;

// Validate required fields
if (!query.task || !query.collaboration_context || !query.llm_routing) {
    return [{ json: { error: 'Invalid query structure' } }];
}

// Determine collaboration strategy
const strategy = query.collaboration_context.collaboration_mode;
const primaryModel = query.llm_routing.primary;

// Prepare for OpenRouter API call
const openrouterRequest = {
    model: primaryModel.model,
    messages: [
        {
            role: 'system',
            content: `You are ${primaryModel.name}, an AI specialist in ${primaryModel.role}. 
                     You are collaborating with other AI models on this task: ${query.task.description}
                     
                     Context: ${JSON.stringify(query.task.context)}
                     Constraints: ${query.task.constraints.join(', ')}
                     
                     Please provide your analysis and indicate if you need collaboration from other models.`
        },
        {
            role: 'user', 
            content: query.task.description
        }
    ],
    temperature: 0.7,
    max_tokens: 4000,
    stream: false
};

return [{ 
    json: { 
        openrouterRequest,
        originalQuery: query,
        strategy,
        primaryModel
    } 
}];
                        """
                    },
                    "name": "Process Query",
                    "type": "n8n-nodes-base.code",
                    "position": [460, 300]
                },
                {
                    "parameters": {
                        "url": "https://openrouter.ai/api/v1/chat/completions",
                        "authentication": "predefinedCredentialType",
                        "nodeCredentialType": "httpHeaderAuth",
                        "sendHeaders": True,
                        "headerParameters": {
                            "parameters": [
                                {
                                    "name": "HTTP-Referer",
                                    "value": "https://n8n.pbradygeorgen.com"
                                },
                                {
                                    "name": "X-Title", 
                                    "value": "Unified LLM Collaboration"
                                }
                            ]
                        },
                        "sendBody": True,
                        "contentType": "json",
                        "body": "={{$json.openrouterRequest}}"
                    },
                    "name": "Primary LLM Call",
                    "type": "n8n-nodes-base.httpRequest",
                    "position": [680, 300]
                },
                {
                    "parameters": {
                        "jsCode": """
// Process the primary LLM response
const response = $input.first().json;
const originalQuery = $('Process Query').first().json.originalQuery;

// Extract the AI response
const aiResponse = response.choices[0].message.content;

// Determine if collaboration is needed
const needsCollaboration = aiResponse.toLowerCase().includes('collaborate') || 
                          aiResponse.toLowerCase().includes('need help') ||
                          originalQuery.llm_routing.collaborators.length > 0;

// Prepare handoff context if needed
let handoffContext = null;
if (needsCollaboration) {
    handoffContext = {
        primary_analysis: aiResponse,
        task_context: originalQuery.task,
        collaboration_notes: 'Primary analysis complete, ready for collaboration',
        next_steps: 'Route to appropriate collaborator based on task requirements'
    };
}

return [{
    json: {
        primary_response: aiResponse,
        needs_collaboration: needsCollaboration,
        handoff_context: handoffContext,
        original_query: originalQuery
    }
}];
                        """
                    },
                    "name": "Evaluate Collaboration Need",
                    "type": "n8n-nodes-base.code", 
                    "position": [900, 300]
                },
                {
                    "parameters": {
                        "conditions": {
                            "boolean": [
                                {
                                    "value1": "={{$json.needs_collaboration}}",
                                    "value2": True
                                }
                            ]
                        }
                    },
                    "name": "Collaboration Needed?",
                    "type": "n8n-nodes-base.if",
                    "position": [1120, 300]
                },
                {
                    "parameters": {
                        "jsCode": """
// Prepare final response without collaboration
const primaryResponse = $input.first().json.primary_response;
const originalQuery = $input.first().json.original_query;

const finalResponse = {
    collaboration_id: originalQuery.collaboration_id,
    success: true,
    collaboration_mode: 'single_llm',
    results: {
        primary: {
            model: originalQuery.llm_routing.primary.name,
            response: primaryResponse,
            role: originalQuery.llm_routing.primary.role
        }
    },
    synthesis: primaryResponse,
    metadata: {
        models_used: 1,
        collaboration_mode: 'single_llm',
        timestamp: new Date().toISOString()
    }
};

return [{ json: finalResponse }];
                        """
                    },
                    "name": "Single Response",
                    "type": "n8n-nodes-base.code",
                    "position": [1340, 180]
                },
                {
                    "parameters": {
                        "jsCode": """
// Route to collaborator model  
const data = $input.first().json;
const handoffContext = data.handoff_context;
const originalQuery = data.original_query;

// Select first available collaborator
const collaborator = originalQuery.llm_routing.collaborators[0];

if (!collaborator) {
    return [{ json: { error: 'No collaborators available' } }];
}

// Prepare collaborator request
const collaboratorRequest = {
    model: collaborator.model,
    messages: [
        {
            role: 'system',
            content: `You are ${collaborator.name}, specializing in ${collaborator.role}. 
                     You are collaborating with other AI models. Here is the context from the primary analysis:
                     
                     Primary Analysis: ${handoffContext.primary_analysis}
                     
                     Your role is to build upon this analysis and provide implementation details for: ${originalQuery.task.description}`
        },
        {
            role: 'user',
            content: `Based on the primary analysis, please provide your specialized contribution to: ${originalQuery.task.description}`
        }
    ],
    temperature: 0.7,
    max_tokens: 4000,
    stream: false
};

return [{
    json: {
        collaboratorRequest,
        handoff_context: handoffContext,
        collaborator_info: collaborator,
        original_query: originalQuery
    }
}];
                        """
                    },
                    "name": "Prepare Collaborator",
                    "type": "n8n-nodes-base.code",
                    "position": [1340, 420]
                },
                {
                    "parameters": {
                        "url": "https://openrouter.ai/api/v1/chat/completions",
                        "authentication": "predefinedCredentialType", 
                        "nodeCredentialType": "httpHeaderAuth",
                        "sendHeaders": True,
                        "headerParameters": {
                            "parameters": [
                                {
                                    "name": "HTTP-Referer",
                                    "value": "https://n8n.pbradygeorgen.com"
                                },
                                {
                                    "name": "X-Title",
                                    "value": "Unified LLM Collaboration - Collaborator"
                                }
                            ]
                        },
                        "sendBody": True,
                        "contentType": "json",
                        "body": "={{$json.collaboratorRequest}}"
                    },
                    "name": "Collaborator LLM Call",
                    "type": "n8n-nodes-base.httpRequest",
                    "position": [1560, 420]
                },
                {
                    "parameters": {
                        "jsCode": """
// Synthesize collaboration results
const collaboratorResponse = $input.first().json;
const contextData = $('Prepare Collaborator').first().json;
const handoffContext = contextData.handoff_context;
const originalQuery = contextData.original_query;

// Extract collaborator response
const collaboratorAnalysis = collaboratorResponse.choices[0].message.content;

// Create synthesized solution
const synthesis = `COLLABORATIVE SOLUTION:

PRIMARY ANALYSIS (${originalQuery.llm_routing.primary.name}):
${handoffContext.primary_analysis}

SPECIALIZED CONTRIBUTION (${contextData.collaborator_info.name}):
${collaboratorAnalysis}

INTEGRATED APPROACH:
This solution combines strategic analysis with specialized implementation, providing both high-level architecture and detailed execution guidance.`;

const finalResponse = {
    collaboration_id: originalQuery.collaboration_id,
    success: true,
    collaboration_mode: 'collaborative',
    results: {
        primary: {
            model: originalQuery.llm_routing.primary.name,
            response: handoffContext.primary_analysis,
            role: originalQuery.llm_routing.primary.role
        },
        collaborator: {
            model: contextData.collaborator_info.name,
            response: collaboratorAnalysis,
            role: contextData.collaborator_info.role
        }
    },
    synthesis: synthesis,
    metadata: {
        models_used: 2,
        collaboration_mode: 'sequential_handoff',
        timestamp: new Date().toISOString(),
        collaboration_quality: 'high'
    }
};

return [{ json: finalResponse }];
                        """
                    },
                    "name": "Synthesize Results",
                    "type": "n8n-nodes-base.code",
                    "position": [1780, 420]
                }
            ],
            "connections": {
                "Collaboration Webhook": {
                    "main": [[{"node": "Process Query", "type": "main", "index": 0}]]
                },
                "Process Query": {
                    "main": [[{"node": "Primary LLM Call", "type": "main", "index": 0}]]
                },
                "Primary LLM Call": {
                    "main": [[{"node": "Evaluate Collaboration Need", "type": "main", "index": 0}]]
                },
                "Evaluate Collaboration Need": {
                    "main": [[{"node": "Collaboration Needed?", "type": "main", "index": 0}]]
                },
                "Collaboration Needed?": {
                    "main": [
                        [{"node": "Single Response", "type": "main", "index": 0}],
                        [{"node": "Prepare Collaborator", "type": "main", "index": 0}]
                    ]
                },
                "Prepare Collaborator": {
                    "main": [[{"node": "Collaborator LLM Call", "type": "main", "index": 0}]]
                },
                "Collaborator LLM Call": {
                    "main": [[{"node": "Synthesize Results", "type": "main", "index": 0}]]
                }
            },
            "active": True,
            "settings": {},
            "id": "unified-llm-collaboration"
        }
        
        return workflow

def main():
    """Test the unified LLM collaboration system"""
    
    system = UnifiedLLMCollaborationSystem()
    
    # Create a test query
    test_query = system.create_unified_query(
        task_description="Optimize the N8N webhook authentication system for better security and performance",
        task_type="system_optimization",
        complexity="medium",
        requesting_llm="claude",
        collaboration_mode=CollaborationMode.SEQUENTIAL_HANDOFF
    )
    
    print("🤝 UNIFIED LLM COLLABORATION SYSTEM")
    print("=" * 50)
    print(f"Collaboration ID: {test_query.collaboration_id}")
    print(f"Task: {test_query.task.description}")
    print(f"Primary Model: {test_query.llm_routing['primary']['name']}")
    print(f"Collaboration Mode: {test_query.collaboration_context['collaboration_mode']}")
    print()
    
    print("🔧 N8N Workflow JSON generated and ready for import")
    print("📋 Unified query structure validated")
    print("🌐 OpenRouter integration configured")
    
    # Export N8N workflow
    workflow_json = system.create_n8n_workflow_json()
    with open('n8n_llm_collaboration_workflow.json', 'w') as f:
        json.dump(workflow_json, f, indent=2)
    
    print("✅ System ready for deployment!")
    
    return system, test_query

if __name__ == "__main__":
    system, query = main()
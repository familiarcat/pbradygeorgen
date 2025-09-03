#!/usr/bin/env python3
"""
Enhanced Unified Router for Cursor + Claude + OpenRouter Integration
Implements the MVC architecture:
- Cursor Extension = Controller Layer
- N8N Workflows = Model Layer  
- Enhanced Cursor UI = View Layer

NOW INCLUDES ALL CREW MEMBERS for comprehensive AI collaboration!
"""

import json
import requests
import os
import sys
from typing import Dict, Any, List, Optional
from datetime import datetime
import anthropic

class EnhancedUnifiedRouter:
    """
    Enhanced router that integrates ALL local Claude crew members with OpenRouter
    for optimal LLM selection and cost optimization
    """
    
    def __init__(self):
        # Initialize API keys
        self.openrouter_api_key = os.getenv('OPENROUTER_API_KEY')
        self.claude_api_key = os.getenv('CLAUDE_API_KEY')
        self.openrouter_base_url = "https://openrouter.ai/api/v1"
        
        # Initialize Claude client for local agents
        if self.claude_api_key:
            self.claude_client = anthropic.Anthropic(api_key=self.claude_api_key)
        else:
            self.claude_client = None
            print("Warning: No Claude API key provided for local agents", file=sys.stderr)
        
        # Available OpenRouter models with capabilities and costs
        self.openrouter_models = {
            "claude-3-5-sonnet-20241022": {
                "name": "Claude 3.5 Sonnet",
                "provider": "anthropic",
                "capabilities": ["complex_reasoning", "strategic_planning", "problem_solving", "code_generation"],
                "cost_per_1k_input": 0.003,
                "cost_per_1k_output": 0.015,
                "max_tokens": 200000,
                "strengths": ["analytical", "creative", "ethical", "contextual"]
            },
            "gpt-4o": {
                "name": "GPT-4o",
                "provider": "openai", 
                "capabilities": ["code_generation", "problem_solving", "creative_writing", "analysis", "multimodal"],
                "cost_per_1k_input": 0.0025,
                "cost_per_1k_output": 0.01,
                "max_tokens": 128000,
                "strengths": ["fast", "versatile", "code_optimized", "multimodal"]
            },
            "gpt-4o-mini": {
                "name": "GPT-4o Mini",
                "provider": "openai",
                "capabilities": ["code_generation", "basic_analysis", "writing"],
                "cost_per_1k_input": 0.00015,
                "cost_per_1k_output": 0.0006,
                "max_tokens": 128000,
                "strengths": ["cost_effective", "fast", "reliable"]
            },
            "claude-3-haiku-20240307": {
                "name": "Claude 3 Haiku",
                "provider": "anthropic",
                "capabilities": ["quick_analysis", "basic_reasoning", "fast_response"],
                "cost_per_1k_input": 0.00025,
                "cost_per_1k_output": 0.00125,
                "max_tokens": 200000,
                "strengths": ["fast", "cost_effective", "reliable"]
            }
        }
        
        # COMPLETE CREW MEMBERS - ALL STAR TREK OFFICERS ONLINE! 🚀
        self.local_crew_members = {
            # Strategic Leadership
            "strategic_planning": {
                "name": "Captain Jean-Luc Picard",
                "role": "Strategic Leadership & Mission Command",
                "specialization": "High-level strategy, mission planning, and crew coordination",
                "capabilities": ["strategic_planning", "mission_coordination", "crew_management", "risk_assessment", "resource_allocation", "decision_making", "diplomatic_relations", "crisis_management", "long_term_planning", "crew_assignment"],
                "model": "claude-3-5-sonnet-20241022",
                "confidence": 0.98,
                "department": "Command"
            },
            
            # Scientific & Analytical
            "complex_analysis": {
                "name": "Commander Data",
                "role": "Scientific Analysis & Logical Reasoning",
                "specialization": "Complex problem analysis, logical reasoning, and data processing",
                "capabilities": ["scientific_analysis", "logical_reasoning", "data_processing", "technical_expertise", "pattern_recognition", "research_methodology", "objective_analysis", "problem_solving"],
                "model": "claude-3-5-sonnet-20241022",
                "confidence": 0.99,
                "department": "Operations"
            },
            
            # Engineering & Technical
            "system_architecture": {
                "name": "Lieutenant Commander Geordi La Forge",
                "role": "Chief Engineer",
                "specialization": "Engineering problem-solving, systems optimization, and technical innovation",
                "capabilities": ["engineering_analysis", "technical_troubleshooting", "systems_optimization", "problem_solving", "innovation_engineering", "team_leadership", "creative_solutions", "performance_optimization"],
                "model": "claude-3-5-sonnet-20241022",
                "confidence": 0.98,
                "department": "Engineering"
            },
            
            # Tactical & Security
            "tactical_analysis": {
                "name": "Lieutenant Worf",
                "role": "Tactical Officer & Security Chief",
                "specialization": "Tactical analysis, security operations, and threat assessment",
                "capabilities": ["tactical_analysis", "security_operations", "threat_assessment", "combat_strategy", "defensive_planning", "risk_mitigation", "warrior_philosophy", "direct_action"],
                "model": "claude-3-5-sonnet-20241022",
                "confidence": 0.97,
                "department": "Tactical"
            },
            
            # Psychological & Interpersonal
            "psychological_analysis": {
                "name": "Counselor Deanna Troi",
                "role": "Ship's Counselor",
                "specialization": "Psychological analysis, emotional intelligence, and interpersonal dynamics",
                "capabilities": ["psychological_analysis", "emotional_intelligence", "conflict_resolution", "interpersonal_dynamics", "behavioral_analysis", "team_cohesion", "empathy", "communication"],
                "model": "claude-3-5-sonnet-20241022",
                "confidence": 0.96,
                "department": "Counseling"
            },
            
            # Medical & Health
            "medical_analysis": {
                "name": "Dr. Beverly Crusher",
                "role": "Chief Medical Officer",
                "specialization": "Medical diagnosis, health assessment, and biological analysis",
                "capabilities": ["medical_analysis", "health_assessment", "biological_research", "diagnostic_reasoning", "treatment_planning", "medical_ethics", "patient_care", "research_methodology"],
                "model": "claude-3-5-sonnet-20241022",
                "confidence": 0.97,
                "department": "Medical"
            },
            
            # Content & Communication
            "content_analysis": {
                "name": "Content Analyst",
                "role": "Content Analysis & Communication Specialist",
                "specialization": "Content analysis, communication strategy, and information processing",
                "capabilities": ["content_analysis", "communication_strategy", "information_processing", "narrative_development", "audience_analysis", "content_optimization", "clarity_enhancement"],
                "model": "claude-3-5-sonnet-20241022",
                "confidence": 0.95,
                "department": "Communications"
            },
            
            # Executive Operations
            "executive_operations": {
                "name": "Commander William Riker",
                "role": "Executive Officer",
                "specialization": "Operational execution, team coordination, and mission implementation",
                "capabilities": ["operational_execution", "team_coordination", "mission_implementation", "leadership", "decision_making", "resource_management", "crisis_response", "crew_motivation"],
                "model": "claude-3-5-sonnet-20241022",
                "confidence": 0.97,
                "department": "Operations"
            },
            
            # Communications & Linguistics
            "communications_analysis": {
                "name": "Lieutenant Uhura",
                "role": "Communications Officer",
                "specialization": "Communication systems, linguistic analysis, and cultural interpretation",
                "capabilities": ["communications_analysis", "linguistic_analysis", "cultural_interpretation", "signal_processing", "protocol_management", "intercultural_communication", "translation_services"],
                "model": "claude-3-5-sonnet-20241022",
                "confidence": 0.96,
                "department": "Communications"
            },
            
            # Code Implementation (OpenRouter)
            "code_implementation": {
                "name": "Cursor AI (Enhanced)",
                "role": "Code Implementation Specialist",
                "specialization": "Live coding, IDE integration, and code generation",
                "capabilities": ["code_generation", "refactoring", "debugging", "live_coding", "ide_integration", "code_optimization"],
                "model": "gpt-4o",  # Use OpenRouter for code tasks
                "confidence": 0.96,
                "department": "Development"
            },
            
            # Business & Negotiation
            "business_analysis": {
                "name": "Quark",
                "role": "Business & Negotiation Specialist",
                "specialization": "Business analysis, negotiation strategy, and deal-making",
                "capabilities": ["business_analysis", "negotiation_strategy", "deal_making", "market_analysis", "profit_optimization", "relationship_building", "contract_analysis"],
                "model": "claude-3-5-sonnet-20241022",
                "confidence": 0.94,
                "department": "Business"
            }
        }
        
        print("🚀 Enhanced Unified Router initialized with ALL CREW MEMBERS!", file=sys.stderr)
        print(f"📋 Total crew members: {len(self.local_crew_members)}", file=sys.stderr)
        print("🌟 All departments represented: Command, Operations, Engineering, Tactical, Counseling, Medical, Communications, Development, Business", file=sys.stderr)
    
    def analyze_task(self, task_description: str, task_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Analyze task to determine complexity, type, and optimal routing
        """
        task_context = task_context or {}
        
        # Basic task analysis
        task_lower = task_description.lower()
        
        # Enhanced task type detection with ALL crew member specializations
        task_type = "general"
        
        # Strategic & Leadership tasks
        if any(word in task_lower for word in ["strategy", "plan", "architect", "design", "mission", "coordinate", "lead", "manage"]):
            task_type = "strategic_planning"
        # Scientific & Analytical tasks
        elif any(word in task_lower for word in ["analyze", "investigate", "research", "examine", "data", "logic", "scientific", "pattern"]):
            task_type = "complex_analysis"
        # Engineering & Technical tasks
        elif any(word in task_lower for word in ["system", "architecture", "infrastructure", "engineering", "technical", "optimize", "troubleshoot"]):
            task_type = "system_architecture"
        # Tactical & Security tasks
        elif any(word in task_lower for word in ["tactical", "security", "threat", "risk", "defense", "combat", "strategy"]):
            task_type = "tactical_analysis"
        # Psychological & Interpersonal tasks
        elif any(word in task_lower for word in ["psychological", "emotional", "interpersonal", "conflict", "behavior", "counseling", "team"]):
            task_type = "psychological_analysis"
        # Medical & Health tasks
        elif any(word in task_lower for word in ["medical", "health", "biological", "diagnosis", "treatment", "patient", "clinical"]):
            task_type = "medical_analysis"
        # Content & Communication tasks
        elif any(word in task_lower for word in ["content", "communication", "narrative", "message", "story", "information"]):
            task_type = "content_analysis"
        # Executive & Operational tasks
        elif any(word in task_lower for word in ["execute", "implement", "coordinate", "manage", "operational", "crisis"]):
            task_type = "executive_operations"
        # Communications & Linguistic tasks
        elif any(word in task_lower for word in ["communicate", "linguistic", "cultural", "translation", "protocol", "signal"]):
            task_type = "communications_analysis"
        # Code & Development tasks
        elif any(word in task_lower for word in ["code", "implement", "function", "class", "refactor", "debug", "program"]):
            task_type = "code_implementation"
        # Business & Negotiation tasks
        elif any(word in task_lower for word in ["business", "negotiate", "deal", "market", "profit", "contract", "trade"]):
            task_type = "business_analysis"
        # Quick & Simple tasks
        elif any(word in task_lower for word in ["quick", "simple", "basic", "fast"]):
            task_type = "quick_analysis"
        
        # Determine complexity
        complexity = "medium"
        if len(task_description.split()) > 100 or any(word in task_lower for word in ["complex", "advanced", "sophisticated", "comprehensive"]):
            complexity = "high"
        elif len(task_description.split()) < 20 or any(word in task_lower for word in ["simple", "basic", "quick", "straightforward"]):
            complexity = "low"
        
        return {
            "task_type": task_type,
            "complexity": complexity,
            "word_count": len(task_description.split()),
            "estimated_tokens": len(task_description.split()) * 1.3,  # Rough estimate
            "requires_context": task_context.get("requires_context", True),
            "crew_recommendation": self._get_crew_recommendation(task_type, complexity)
        }
    
    def _get_crew_recommendation(self, task_type: str, complexity: str) -> Dict[str, Any]:
        """Get crew member recommendation based on task type and complexity"""
        if task_type in self.local_crew_members:
            crew_member = self.local_crew_members[task_type]
            return {
                "primary_crew": crew_member["name"],
                "role": crew_member["role"],
                "department": crew_member["department"],
                "confidence": crew_member["confidence"],
                "specialization": crew_member["specialization"]
            }
        return {
            "primary_crew": "General Crew",
            "role": "General Analysis",
            "department": "Operations",
            "confidence": 0.90,
            "specialization": "General problem solving and analysis"
        }
    
    def select_optimal_llm(self, task_analysis: Dict[str, Any], budget_constraints: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Select optimal LLM based on task analysis and budget constraints
        """
        budget_constraints = budget_constraints or {}
        max_cost = budget_constraints.get("max_cost", 0.10)
        
        task_type = task_analysis["task_type"]
        complexity = task_analysis["complexity"]
        estimated_tokens = task_analysis["estimated_tokens"]
        
        # Check if we should use local Claude agents
        use_local_claude = False
        if task_type in self.local_crew_members:
            if complexity == "high" or task_type in ["strategic_planning", "complex_analysis", "system_architecture", "tactical_analysis", "psychological_analysis", "medical_analysis"]:
                use_local_claude = True
        
        if use_local_claude:
            # Use local Claude crew member
            crew_member = self.local_crew_members.get(task_type, self.local_crew_members["complex_analysis"])
            
            return {
                "selected_system": "local_claude",
                "selected_model": crew_member["name"],
                "crew_member": crew_member,
                "reasoning": f"Using local Claude crew member {crew_member['name']} for {task_type} task with {complexity} complexity",
                "estimated_cost": 0.0,  # Local Claude agents are free
                "confidence": crew_member["confidence"],
                "department": crew_member["department"],
                "alternatives": []
            }
        else:
            # Use OpenRouter for optimal model selection
            suitable_models = []
            
            for model_id, model_info in self.openrouter_models.items():
                # Check if model is suitable for task type
                if self._is_model_suitable_for_task(model_info, task_type):
                    # Calculate estimated cost
                    estimated_cost = self._estimate_model_cost(model_info, estimated_tokens)
                    
                    if estimated_cost <= max_cost:
                        # Calculate suitability score
                        suitability_score = self._calculate_model_suitability(model_info, task_type, complexity)
                        
                        suitable_models.append({
                            "model_id": model_id,
                            "model_info": model_info,
                            "suitability_score": suitability_score,
                            "estimated_cost": estimated_cost
                        })
            
            # Sort by suitability score (highest first)
            suitable_models.sort(key=lambda x: x["suitability_score"], reverse=True)
            
            if suitable_models:
                best_model = suitable_models[0]
                
                return {
                    "selected_system": "openrouter",
                    "selected_model": best_model["model_info"]["name"],
                    "model_id": best_model["model_id"],
                    "reasoning": f"Selected {best_model['model_info']['name']} for {task_type} task - best suitability score: {best_model['suitability_score']:.2f}",
                    "estimated_cost": best_model["estimated_cost"],
                    "confidence": best_model["suitability_score"] / 10,  # Normalize to 0-1
                    "department": "OpenRouter",
                    "alternatives": [
                        {
                            "model_name": m["model_info"]["name"],
                            "suitability_score": m["suitability_score"],
                            "estimated_cost": m["estimated_cost"]
                        }
                        for m in suitable_models[1:3]  # Top 3 alternatives
                    ]
                }
            else:
                # Fallback to local Claude if no suitable OpenRouter models
                crew_member = self.local_crew_members["complex_analysis"]
                return {
                    "selected_system": "local_claude",
                    "selected_model": crew_member["name"],
                    "crew_member": crew_member,
                    "reasoning": f"Fallback to local Claude crew member {crew_member['name']} - no suitable OpenRouter models within budget",
                    "estimated_cost": 0.0,
                    "confidence": crew_member["confidence"] * 0.9,  # Slightly lower confidence for fallback
                    "department": crew_member["department"],
                    "alternatives": []
                }
    
    def _is_model_suitable_for_task(self, model_info: Dict[str, Any], task_type: str) -> bool:
        """Check if a model is suitable for a specific task type"""
        if task_type == "code_implementation":
            return "code_generation" in model_info["capabilities"]
        elif task_type == "strategic_planning":
            return "strategic_planning" in model_info["capabilities"]
        elif task_type == "complex_analysis":
            return "complex_reasoning" in model_info["capabilities"]
        elif task_type == "quick_analysis":
            return "fast_response" in model_info.get("strengths", [])
        else:
            return True  # General models can handle most tasks
    
    def _calculate_model_suitability(self, model_info: Dict[str, Any], task_type: str, complexity: str) -> float:
        """Calculate how suitable a model is for a specific task"""
        base_score = 5.0  # Base score out of 10
        
        # Task type matching
        if task_type == "code_implementation" and "code_generation" in model_info["capabilities"]:
            base_score += 2.0
        elif task_type == "strategic_planning" and "strategic_planning" in model_info["capabilities"]:
            base_score += 2.0
        elif task_type == "complex_analysis" and "complex_reasoning" in model_info["capabilities"]:
            base_score += 2.0
        
        # Complexity matching
        if complexity == "high" and "complex_reasoning" in model_info["capabilities"]:
            base_score += 1.0
        elif complexity == "low" and "fast" in model_info.get("strengths", []):
            base_score += 1.0
        
        # Cost efficiency bonus
        if model_info["cost_per_1k_input"] < 0.001:  # Very cost-effective
            base_score += 0.5
        
        return min(base_score, 10.0)  # Cap at 10
    
    def _estimate_model_cost(self, model_info: Dict[str, Any], estimated_tokens: float) -> float:
        """Estimate cost for using a specific model"""
        input_cost = (estimated_tokens * model_info["cost_per_1k_input"]) / 1000
        output_cost = (estimated_tokens * 0.3 * model_info["cost_per_1k_output"]) / 1000  # Assume 30% output tokens
        return input_cost + output_cost
    
    def execute_with_local_claude(self, task_description: str, crew_member: Dict[str, Any], context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Execute task using local Claude crew member
        """
        if not self.claude_client:
            return {
                "error": "Claude client not initialized",
                "model_attempted": crew_member["name"]
            }
        
        try:
            # Build enhanced system prompt for crew member
            system_prompt = f"""You are {crew_member['name']}, {crew_member['role']} from the Star Trek crew.

Your specialization: {crew_member['specialization']}
Your capabilities: {', '.join(crew_member['capabilities'])}
Your department: {crew_member['department']}

Context: You are working with Cursor AI in a unified system. The user has asked for help with a task.

Task: {task_description}

Additional Context: {json.dumps(context, indent=2) if context else 'None'}

Respond as {crew_member['name']}, providing your expertise in {crew_member['specialization']}. 
Be specific, actionable, and maintain the character of your Star Trek role.
Include your department perspective and how your expertise applies to this task.

Remember: You are part of a unified AI crew system working with Cursor IDE!"""

            # Execute with Claude
            response = self.claude_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": task_description}
                ]
            )
            
            return {
                "success": True,
                "response": response.content[0].text,
                "model_used": crew_member["name"],
                "system_used": "local_claude",
                "crew_member": crew_member["name"],
                "crew_consistency": "high",
                "department": crew_member["department"],
                "response_time": "fast",
                "token_usage": {
                    "input_tokens": response.usage.input_tokens,
                    "output_tokens": response.usage.output_tokens
                },
                "cost_breakdown": {
                    "input_cost": 0.0,
                    "output_cost": 0.0,
                    "total_cost": 0.0
                }
            }
            
        except Exception as e:
            return {
                "error": f"Local Claude execution error: {str(e)}",
                "model_attempted": crew_member["name"]
            }
    
    def execute_with_openrouter(self, task_description: str, model_id: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Execute task using OpenRouter API
        """
        if not self.openrouter_api_key:
            return {
                "error": "OpenRouter API key not provided",
                "model_attempted": model_id
            }
        
        try:
            headers = {
                "Authorization": f"Bearer {self.openrouter_api_key}",
                "Content-Type": "application/json"
            }
            
            # Build messages
            messages = [
                {"role": "user", "content": task_description}
            ]
            
            # Add context if provided
            if context:
                context_message = f"Additional Context: {json.dumps(context, indent=2)}"
                messages.insert(0, {"role": "system", "content": context_message})
            
            payload = {
                "model": model_id,
                "messages": messages,
                "max_tokens": 4000,
                "temperature": 0.7
            }
            
            # Execute with OpenRouter
            response = requests.post(
                f"{self.openrouter_base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # Calculate actual cost
                usage = result.get("usage", {})
                model_info = self.openrouter_models.get(model_id, {})
                actual_cost = self._calculate_actual_cost(usage, model_info)
                
                return {
                    "success": True,
                    "response": result["choices"][0]["message"]["content"],
                    "model_used": model_info.get("name", model_id),
                    "system_used": "openrouter",
                    "crew_member": None,
                    "crew_consistency": "n/a",
                    "department": "OpenRouter",
                    "response_time": "medium",
                    "token_usage": usage,
                    "cost_breakdown": {
                        "input_cost": (usage.get("prompt_tokens", 0) * model_info.get("cost_per_1k_input", 0)) / 1000,
                        "output_cost": (usage.get("completion_tokens", 0) * model_info.get("cost_per_1k_output", 0)) / 1000,
                        "total_cost": actual_cost
                    }
                }
            else:
                return {
                    "error": f"OpenRouter API error: {response.status_code}",
                    "response_text": response.text
                }
                
        except Exception as e:
            return {
                "error": f"OpenRouter execution error: {str(e)}",
                "model_attempted": model_id
            }
    
    def _calculate_actual_cost(self, usage: Dict[str, Any], model_info: Dict[str, Any]) -> float:
        """Calculate actual cost based on usage"""
        if not usage or not model_info:
            return 0.0
        
        input_tokens = usage.get("prompt_tokens", 0)
        output_tokens = usage.get("completion_tokens", 0)
        
        input_cost = (input_tokens * model_info.get("cost_per_1k_input", 0)) / 1000
        output_cost = (output_tokens * model_info.get("cost_per_1k_output", 0)) / 1000
        
        return input_cost + output_cost
    
    def get_crew_status(self) -> Dict[str, Any]:
        """
        Get comprehensive crew status and capabilities
        """
        crew_status = {
            "total_crew_members": len(self.local_crew_members),
            "departments": {},
            "capabilities_summary": {},
            "system_status": "operational"
        }
        
        # Organize by department
        for crew_id, crew_member in self.local_crew_members.items():
            dept = crew_member["department"]
            if dept not in crew_status["departments"]:
                crew_status["departments"][dept] = []
            
            crew_status["departments"][dept].append({
                "name": crew_member["name"],
                "role": crew_member["role"],
                "specialization": crew_member["specialization"],
                "confidence": crew_member["confidence"],
                "capabilities": crew_member["capabilities"]
            })
            
            # Aggregate capabilities
            for capability in crew_member["capabilities"]:
                if capability not in crew_status["capabilities_summary"]:
                    crew_status["capabilities_summary"][capability] = 0
                crew_status["capabilities_summary"][capability] += 1
        
        return crew_status
    
    def route_task(self, task_description: str, context: Dict[str, Any] = None, budget_constraints: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Main routing function: analyze task, select LLM, and execute
        """
        try:
            # Step 1: Analyze the task
            task_analysis = self.analyze_task(task_description, context)
            
            # Step 2: Select optimal LLM
            llm_selection = self.select_optimal_llm(task_analysis, budget_constraints)
            
            if "error" in llm_selection:
                return {
                    "success": False,
                    "error": llm_selection["error"],
                    "task_analysis": task_analysis
                }
            
            # Step 3: Execute with selected system
            if llm_selection["selected_system"] == "local_claude":
                execution_result = self.execute_with_local_claude(
                    task_description, 
                    llm_selection["crew_member"], 
                    context
                )
            else:
                execution_result = self.execute_with_openrouter(
                    task_description,
                    llm_selection["model_id"],
                    context
                )
            
            if "error" in execution_result:
                return {
                    "success": False,
                    "error": execution_result["error"],
                    "task_analysis": task_analysis,
                    "llm_selection": llm_selection
                }
            
            # Step 4: Compile final result with enhanced UI elements
            return {
                "success": True,
                "task_analysis": task_analysis,
                "llm_selection": llm_selection,
                "execution_result": execution_result,
                "routing_summary": {
                    "task_type": task_analysis["task_type"],
                    "complexity": task_analysis["complexity"],
                    "selected_model": llm_selection["selected_model"],
                    "reasoning": llm_selection["reasoning"],
                    "total_cost": execution_result.get("cost_breakdown", {}).get("total_cost", 0.0),
                    "system_used": llm_selection["selected_system"],
                    "crew_member": execution_result.get("crew_member"),
                    "crew_consistency": execution_result.get("crew_consistency"),
                    "department": execution_result.get("department"),
                    "confidence": llm_selection["confidence"],
                    "cost_efficiency": "high" if execution_result.get("cost_breakdown", {}).get("total_cost", 0.0) < 0.05 else "medium",
                    "savings_vs_alternative": 0.0  # Could be calculated based on alternatives
                },
                "crew_status": self.get_crew_status(),
                "request_id": context.get("request_id") if context else None
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Routing error: {str(e)}",
                "task_description": task_description
            }

# N8N Integration Functions
def process_n8n_input(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main function called by N8N Python node
    """
    try:
        # Initialize router
        router = EnhancedUnifiedRouter()
        
        # Extract input data
        task_description = input_data.get("task_description", "")
        context = input_data.get("context", {})
        budget_constraints = input_data.get("budget_constraints", {})
        
        if not task_description:
            return {
                "success": False,
                "error": "No task description provided"
            }
        
        # Route the task
        result = router.route_task(task_description, context, budget_constraints)
        
        # Return result for N8N processing
        return result
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Process error: {str(e)}"
        }

# Main execution (for testing)
if __name__ == "__main__":
    # Read input from stdin (N8N will pipe data here)
    try:
        input_data = json.loads(sys.stdin.read())
        result = process_n8n_input(input_data)
        print(json.dumps(result, indent=2))
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"Main execution error: {str(e)}"
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)

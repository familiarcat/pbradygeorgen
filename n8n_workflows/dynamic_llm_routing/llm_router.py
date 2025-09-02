#!/usr/bin/env python3
"""
N8N Python Node: Dynamic LLM Router
Analyzes tasks and selects optimal LLM via OpenRouter API
"""

import json
import requests
from typing import Dict, Any, List
import os

class DynamicLLMRouter:
    def __init__(self):
        self.openrouter_api_key = os.getenv('OPENROUTER_API_KEY')
        self.openrouter_base_url = "https://openrouter.ai/api/v1"
        
        # Available LLM models with capabilities and costs
        self.available_models = {
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
                "capabilities": ["code_generation", "problem_solving", "creative_writing", "analysis"],
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
                "capabilities": ["fast_analysis", "basic_reasoning", "code_generation"],
                "cost_per_1k_input": 0.00025,
                "cost_per_1k_output": 0.00125,
                "max_tokens": 200000,
                "strengths": ["fast", "cost_effective", "reliable"]
            },
            "gemini-pro": {
                "name": "Gemini Pro",
                "provider": "google",
                "capabilities": ["analysis", "reasoning", "code_generation", "multimodal"],
                "cost_per_1k_input": 0.0005,
                "cost_per_1k_output": 0.0015,
                "max_tokens": 1000000,
                "strengths": ["multimodal", "fast", "cost_effective"]
            }
        }
        
        # Task type mappings to optimal models
        self.task_model_mappings = {
            "strategic_planning": ["claude-3-5-sonnet-20241022", "gpt-4o"],
            "complex_analysis": ["claude-3-5-sonnet-20241022", "gpt-4o"],
            "code_implementation": ["gpt-4o", "claude-3-5-sonnet-20241022"],
            "debugging": ["gpt-4o", "claude-3-5-sonnet-20241022"],
            "documentation": ["claude-3-5-sonnet-20241022", "gpt-4o"],
            "quick_analysis": ["claude-3-haiku-20240307", "gpt-4o-mini"],
            "cost_sensitive": ["claude-3-haiku-20240307", "gpt-4o-mini", "gemini-pro"],
            "creative_writing": ["claude-3-5-sonnet-20241022", "gpt-4o"],
            "multimodal": ["gpt-4o", "gemini-pro"]
        }

    def analyze_task(self, task_description: str, task_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Analyze task to determine complexity, type, and requirements
        """
        analysis = {
            "task_type": "unknown",
            "complexity": "low",
            "estimated_tokens": 1000,
            "priority": "normal",
            "requires_context": False,
            "multimodal": False
        }
        
        # Simple keyword-based task classification
        task_lower = task_description.lower()
        
        if any(word in task_lower for word in ["strategy", "plan", "architecture", "design"]):
            analysis["task_type"] = "strategic_planning"
            analysis["complexity"] = "high"
            analysis["estimated_tokens"] = 3000
            analysis["priority"] = "high"
            
        elif any(word in task_lower for word in ["analyze", "investigate", "research", "examine"]):
            analysis["task_type"] = "complex_analysis"
            analysis["complexity"] = "medium"
            analysis["estimated_tokens"] = 2000
            
        elif any(word in task_lower for word in ["code", "implement", "build", "create"]):
            analysis["task_type"] = "code_implementation"
            analysis["complexity"] = "medium"
            analysis["estimated_tokens"] = 1500
            
        elif any(word in task_lower for word in ["debug", "fix", "error", "issue"]):
            analysis["task_type"] = "debugging"
            analysis["complexity"] = "medium"
            analysis["estimated_tokens"] = 1000
            
        elif any(word in task_lower for word in ["document", "explain", "describe", "write"]):
            analysis["task_type"] = "documentation"
            analysis["complexity"] = "low"
            analysis["estimated_tokens"] = 800
            
        elif any(word in task_lower for word in ["quick", "fast", "simple", "basic"]):
            analysis["task_type"] = "quick_analysis"
            analysis["complexity"] = "low"
            analysis["estimated_tokens"] = 500
            
        # Check for cost sensitivity
        if any(word in task_lower for word in ["cheap", "cost", "budget", "affordable"]):
            analysis["task_type"] = "cost_sensitive"
            
        # Check for multimodal requirements
        if any(word in task_lower for word in ["image", "visual", "picture", "chart", "graph"]):
            analysis["multimodal"] = True
            analysis["task_type"] = "multimodal"
            
        return analysis

    def select_optimal_llm(self, task_analysis: Dict[str, Any], budget_constraints: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Select optimal LLM based on task analysis and constraints
        """
        task_type = task_analysis["task_type"]
        complexity = task_analysis["complexity"]
        estimated_tokens = task_analysis["estimated_tokens"]
        multimodal = task_analysis["multimodal"]
        
        # Get candidate models for this task type
        if task_type in self.task_model_mappings:
            candidate_models = self.task_model_mappings[task_type]
        else:
            candidate_models = list(self.available_models.keys())
        
        # Filter by multimodal requirements
        if multimodal:
            candidate_models = [m for m in candidate_models if m in ["gpt-4o", "gemini-pro"]]
        
        # Calculate costs for each candidate
        model_scores = []
        for model_id in candidate_models:
            if model_id in self.available_models:
                model = self.available_models[model_id]
                
                # Calculate estimated cost
                input_cost = (estimated_tokens * 0.7 * model["cost_per_1k_input"]) / 1000
                output_cost = (estimated_tokens * 0.3 * model["cost_per_1k_output"]) / 1000
                total_cost = input_cost + output_cost
                
                # Calculate capability score
                capability_score = 0
                if task_type == "strategic_planning" and "strategic_planning" in model["capabilities"]:
                    capability_score += 3
                if task_type == "complex_analysis" and "complex_reasoning" in model["capabilities"]:
                    capability_score += 3
                if task_type == "code_implementation" and "code_generation" in model["capabilities"]:
                    capability_score += 3
                if complexity == "high" and model["max_tokens"] > 100000:
                    capability_score += 2
                if complexity == "low" and model["cost_per_1k_input"] < 0.001:
                    capability_score += 1
                
                # Apply budget constraints
                if budget_constraints and "max_cost" in budget_constraints:
                    if total_cost > budget_constraints["max_cost"]:
                        continue
                
                model_scores.append({
                    "model_id": model_id,
                    "model_name": model["name"],
                    "provider": model["provider"],
                    "capability_score": capability_score,
                    "estimated_cost": total_cost,
                    "max_tokens": model["max_tokens"],
                    "strengths": model["strengths"]
                })
        
        # Sort by capability score (descending) then by cost (ascending)
        model_scores.sort(key=lambda x: (-x["capability_score"], x["estimated_cost"]))
        
        if model_scores:
            selected_model = model_scores[0]
            return {
                "selected_model": selected_model,
                "alternatives": model_scores[1:3],  # Top 3 alternatives
                "reasoning": f"Selected {selected_model['model_name']} for {task_type} task with {complexity} complexity. Capability score: {selected_model['capability_score']}, Estimated cost: ${selected_model['estimated_cost']:.4f}"
            }
        else:
            return {
                "error": "No suitable model found within constraints",
                "candidates_considered": len(candidate_models),
                "budget_constraints": budget_constraints
            }

    def execute_with_selected_llm(self, task_description: str, selected_model: Dict[str, Any], context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Execute task with selected LLM via OpenRouter API
        """
        if not self.openrouter_api_key:
            return {"error": "OpenRouter API key not configured"}
        
        headers = {
            "Authorization": f"Bearer {self.openrouter_api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://n8n.pbradygeorgen.com",
            "X-Title": "Claude Code Integration - Dynamic LLM Router"
        }
        
        # Prepare the prompt
        system_prompt = "You are an AI assistant helping with a development task. Provide clear, actionable responses."
        
        if context and "crew_member" in context:
            crew_member = context["crew_member"]
            system_prompt = f"You are {crew_member['name']} from the Star Trek crew. Your role: {crew_member['role']}. {crew_member.get('specialization', '')}"
        
        payload = {
            "model": selected_model["model_id"],
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": task_description}
            ],
            "max_tokens": min(selected_model["max_tokens"], 4000),
            "temperature": 0.7
        }
        
        try:
            response = requests.post(
                f"{self.openrouter_base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "model_used": selected_model["model_name"],
                    "response": result["choices"][0]["message"]["content"],
                    "usage": result.get("usage", {}),
                    "actual_cost": self._calculate_actual_cost(result.get("usage", {}), selected_model)
                }
            else:
                return {
                    "error": f"OpenRouter API error: {response.status_code}",
                    "response_text": response.text
                }
                
        except Exception as e:
            return {
                "error": f"Execution error: {str(e)}",
                "model_attempted": selected_model["model_name"]
            }

    def _calculate_actual_cost(self, usage: Dict[str, Any], model: Dict[str, Any]) -> float:
        """Calculate actual cost based on usage"""
        if not usage:
            return 0.0
        
        input_tokens = usage.get("prompt_tokens", 0)
        output_tokens = usage.get("completion_tokens", 0)
        
        input_cost = (input_tokens * model["cost_per_1k_input"]) / 1000
        output_cost = (output_tokens * model["cost_per_1k_output"]) / 1000
        
        return input_cost + output_cost

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
            
            # Step 3: Execute with selected LLM
            execution_result = self.execute_with_selected_llm(
                task_description, 
                llm_selection["selected_model"], 
                context
            )
            
            # Step 4: Compile final result
            return {
                "success": True,
                "task_analysis": task_analysis,
                "llm_selection": llm_selection,
                "execution_result": execution_result,
                "routing_summary": {
                    "task_type": task_analysis["task_type"],
                    "complexity": task_analysis["complexity"],
                    "selected_model": llm_selection["selected_model"]["model_name"],
                    "reasoning": llm_selection["reasoning"],
                    "total_cost": execution_result.get("actual_cost", 0)
                }
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
    router = DynamicLLMRouter()
    
    # Extract input from N8N
    task_description = input_data.get("task_description", "")
    context = input_data.get("context", {})
    budget_constraints = input_data.get("budget_constraints", {})
    
    if not task_description:
        return {"error": "No task description provided"}
    
    # Route the task
    result = router.route_task(task_description, context, budget_constraints)
    
    return result


# Test function for development
if __name__ == "__main__":
    # Test the router
    router = DynamicLLMRouter()
    
    test_tasks = [
        "Create a strategic plan for our PDF processing system",
        "Debug the authentication error in the login form",
        "Write documentation for the new API endpoints",
        "Quick analysis of the performance metrics"
    ]
    
    for task in test_tasks:
        print(f"\n{'='*60}")
        print(f"Testing task: {task}")
        print(f"{'='*60}")
        
        result = router.route_task(task, budget_constraints={"max_cost": 0.10})
        
        if result["success"]:
            print(f"✅ Success!")
            print(f"Task Type: {result['task_analysis']['task_type']}")
            print(f"Complexity: {result['task_analysis']['complexity']}")
            print(f"Selected Model: {result['routing_summary']['selected_model']}")
            print(f"Reasoning: {result['routing_summary']['reasoning']}")
            print(f"Total Cost: ${result['routing_summary']['total_cost']:.4f}")
            print(f"Response: {result['execution_result']['response'][:200]}...")
        else:
            print(f"❌ Error: {result['error']}")

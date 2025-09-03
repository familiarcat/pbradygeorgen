#!/usr/bin/env python3
"""
Enhanced LLM Router - Multi-Provider Cost Optimization
Uses all available API keys for optimal LLM selection and cost management
"""

import sys
import os
import json
import asyncio
import aiohttp
from typing import Dict, Any, List, Optional
from datetime import datetime
import anthropic
import openai
import google.generativeai as genai

class EnhancedLLMRouter:
    """
    Enhanced LLM Router with multi-provider support
    Uses all available API keys for optimal cost and performance
    """
    
    def __init__(self):
        # Load API keys from environment (populated from ~/.zshrc)
        self.api_keys = self._load_api_keys()
        self.clients = self._initialize_clients()
        
        # LLM provider configurations with cost and capability data
        self.llm_providers = self._initialize_llm_providers()
        
        print(f"🚀 Enhanced LLM Router initialized with {len(self.api_keys)} API keys", file=sys.stderr)
        print(f"💰 Available providers: {', '.join(self.llm_providers.keys())}", file=sys.stderr)
    
    def _load_api_keys(self) -> Dict[str, str]:
        """Load all available API keys from environment"""
        keys = {}
        
        # Anthropic/Claude
        if os.getenv('ANTHROPIC_API_KEY'):
            keys['anthropic'] = os.getenv('ANTHROPIC_API_KEY')
        elif os.getenv('CLAUDE_API_KEY'):
            keys['anthropic'] = os.getenv('CLAUDE_API_KEY')
        
        # OpenAI
        if os.getenv('OPENAI_API_KEY'):
            keys['openai'] = os.getenv('OPENAI_API_KEY')
        
        # Google Gemini
        if os.getenv('GEMINI_API_KEY'):
            keys['gemini'] = os.getenv('GEMINI_API_KEY')
        
        # OpenRouter (for multiple providers)
        if os.getenv('OPENROUTER_API_KEY'):
            keys['openrouter'] = os.getenv('OPENROUTER_API_KEY')
        
        # Continue (for code-specific tasks)
        if os.getenv('CONTINUE_API_KEY'):
            keys['continue'] = os.getenv('CONTINUE_API_KEY')
        
        # Bito (for AI pair programming)
        if os.getenv('BITO_API_KEY'):
            keys['bito'] = os.getenv('BITO_API_KEY')
        
        return keys
    
    def _initialize_clients(self) -> Dict[str, Any]:
        """Initialize API clients for available providers"""
        clients = {}
        
        # Anthropic/Claude client
        if 'anthropic' in self.api_keys:
            try:
                clients['anthropic'] = anthropic.Anthropic(api_key=self.api_keys['anthropic'])
                print("✅ Anthropic/Claude client initialized", file=sys.stderr)
            except Exception as e:
                print(f"⚠️ Failed to initialize Anthropic client: {e}", file=sys.stderr)
        
        # OpenAI client
        if 'openai' in self.api_keys:
            try:
                clients['openai'] = openai.OpenAI(api_key=self.api_keys['openai'])
                print("✅ OpenAI client initialized", file=sys.stderr)
            except Exception as e:
                print(f"⚠️ Failed to initialize OpenAI client: {e}", file=sys.stderr)
        
        # Google Gemini client
        if 'gemini' in self.api_keys:
            try:
                genai.configure(api_key=self.api_keys['gemini'])
                clients['gemini'] = genai
                print("✅ Google Gemini client initialized", file=sys.stderr)
            except Exception as e:
                print(f"⚠️ Failed to initialize Gemini client: {e}", file=sys.stderr)
        
        return clients
    
    def _initialize_llm_providers(self) -> Dict[str, Dict[str, Any]]:
        """Initialize LLM provider configurations with cost and capability data"""
        return {
            # Anthropic/Claude models
            'claude-3-5-sonnet-20241022': {
                'provider': 'anthropic',
                'cost_per_1k_input': 0.003,
                'cost_per_1k_output': 0.015,
                'capabilities': ['general', 'creative', 'analytical', 'conversational'],
                'strengths': ['reasoning', 'analysis', 'writing', 'planning'],
                'max_tokens': 4096,
                'speed': 'medium',
                'reliability': 'high'
            },
            'claude-3-5-haiku-20241022': {
                'provider': 'anthropic',
                'cost_per_1k_input': 0.00025,
                'cost_per_1k_output': 0.00125,
                'capabilities': ['general', 'quick', 'efficient'],
                'strengths': ['fast_response', 'cost_effective', 'general_purpose'],
                'max_tokens': 4096,
                'speed': 'fast',
                'reliability': 'high'
            },
            'claude-3-opus-20240229': {
                'provider': 'anthropic',
                'cost_per_1k_input': 0.015,
                'cost_per_1k_output': 0.075,
                'capabilities': ['advanced', 'creative', 'complex'],
                'strengths': ['advanced_reasoning', 'creative_writing', 'complex_analysis'],
                'max_tokens': 4096,
                'speed': 'slow',
                'reliability': 'very_high'
            },
            
            # OpenAI models
            'gpt-4o': {
                'provider': 'openai',
                'cost_per_1k_input': 0.0025,
                'cost_per_1k_output': 0.01,
                'capabilities': ['general', 'creative', 'analytical', 'multimodal'],
                'strengths': ['coding', 'analysis', 'multimodal', 'reasoning'],
                'max_tokens': 4096,
                'speed': 'medium',
                'reliability': 'high'
            },
            'gpt-4o-mini': {
                'provider': 'openai',
                'cost_per_1k_input': 0.00015,
                'cost_per_1k_output': 0.0006,
                'capabilities': ['general', 'efficient', 'quick'],
                'strengths': ['fast_response', 'cost_effective', 'general_purpose'],
                'max_tokens': 4096,
                'speed': 'fast',
                'reliability': 'high'
            },
            'gpt-3.5-turbo': {
                'provider': 'openai',
                'cost_per_1k_input': 0.0005,
                'cost_per_1k_output': 0.0015,
                'capabilities': ['general', 'conversational', 'efficient'],
                'strengths': ['conversation', 'general_purpose', 'cost_effective'],
                'max_tokens': 4096,
                'speed': 'fast',
                'reliability': 'high'
            },
            
            # Google Gemini models
            'gemini-1.5-pro': {
                'provider': 'gemini',
                'cost_per_1k_input': 0.00375,
                'cost_per_1k_output': 0.0105,
                'capabilities': ['general', 'creative', 'analytical', 'multimodal'],
                'strengths': ['multimodal', 'reasoning', 'creative_writing'],
                'max_tokens': 8192,
                'speed': 'medium',
                'reliability': 'high'
            },
            'gemini-1.5-flash': {
                'provider': 'gemini',
                'cost_per_1k_input': 0.000075,
                'cost_per_1k_output': 0.0003,
                'capabilities': ['general', 'efficient', 'quick'],
                'strengths': ['fast_response', 'very_cost_effective', 'general_purpose'],
                'max_tokens': 8192,
                'speed': 'very_fast',
                'reliability': 'high'
            },
            
            # OpenRouter models (for cost comparison)
            'openrouter/anthropic/claude-3-5-sonnet-20241022': {
                'provider': 'openrouter',
                'cost_per_1k_input': 0.003,
                'cost_per_1k_output': 0.015,
                'capabilities': ['general', 'creative', 'analytical'],
                'strengths': ['reasoning', 'analysis', 'writing'],
                'max_tokens': 4096,
                'speed': 'medium',
                'reliability': 'high'
            },
            'openrouter/openai/gpt-4o': {
                'provider': 'openrouter',
                'cost_per_1k_input': 0.0025,
                'cost_per_1k_output': 0.01,
                'capabilities': ['general', 'creative', 'analytical', 'coding'],
                'strengths': ['coding', 'analysis', 'reasoning'],
                'max_tokens': 4096,
                'speed': 'medium',
                'reliability': 'high'
            }
        }
    
    def analyze_task(self, task_description: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Analyze task to determine optimal LLM selection"""
        task_lower = task_description.lower()
        word_count = len(task_description.split())
        estimated_tokens = word_count * 1.3
        
        # Determine task type and complexity
        task_type = "general"
        complexity = "medium"
        
        # Task type detection
        if any(word in task_lower for word in ["code", "program", "function", "class", "debug", "refactor"]):
            task_type = "coding"
        elif any(word in task_lower for word in ["analyze", "research", "investigate", "examine"]):
            task_type = "analysis"
        elif any(word in task_lower for word in ["write", "create", "generate", "compose"]):
            task_type = "creative"
        elif any(word in task_lower for word in ["quick", "simple", "fast", "basic"]):
            task_type = "quick"
        elif any(word in task_lower for word in ["complex", "advanced", "sophisticated", "detailed"]):
            task_type = "complex"
        
        # Complexity assessment
        if word_count > 100 or any(word in task_lower for word in ["complex", "advanced", "sophisticated"]):
            complexity = "high"
        elif word_count < 20 or any(word in task_lower for word in ["simple", "basic", "quick"]):
            complexity = "low"
        
        return {
            "task_type": task_type,
            "complexity": complexity,
            "word_count": word_count,
            "estimated_tokens": estimated_tokens,
            "requires_context": context.get("requires_context", True) if context else True
        }
    
    def select_optimal_llm(self, task_analysis: Dict[str, Any], budget_constraints: Dict[str, Any] = None) -> Dict[str, Any]:
        """Select the most optimal LLM based on task analysis and budget"""
        task_type = task_analysis["task_type"]
        complexity = task_analysis["complexity"]
        estimated_tokens = task_analysis["estimated_tokens"]
        
        # Default budget constraints
        max_cost = budget_constraints.get("max_cost", 0.10) if budget_constraints else 0.10
        priority = budget_constraints.get("priority", "balanced") if budget_constraints else "balanced"
        
        # Filter available models based on capabilities and cost
        suitable_models = []
        
        for model_id, model_info in self.llm_providers.items():
            # Check if provider is available
            if model_info['provider'] not in self.clients and model_info['provider'] != 'openrouter':
                continue
            
            # Check if model can handle the task
            if self._is_model_suitable_for_task(model_info, task_type, complexity):
                # Calculate estimated cost
                estimated_cost = self._calculate_estimated_cost(model_info, estimated_tokens)
                
                if estimated_cost <= max_cost:
                    # Calculate suitability score
                    suitability_score = self._calculate_suitability_score(model_info, task_type, complexity, priority)
                    
                    suitable_models.append({
                        "model_id": model_id,
                        "provider": model_info['provider'],
                        "estimated_cost": estimated_cost,
                        "suitability_score": suitability_score,
                        "capabilities": model_info['capabilities'],
                        "strengths": model_info['strengths'],
                        "speed": model_info['speed'],
                        "reliability": model_info['reliability']
                    })
        
        # Sort by suitability score (highest first)
        suitable_models.sort(key=lambda x: x['suitability_score'], reverse=True)
        
        if not suitable_models:
            # Fallback to most cost-effective available model
            return self._get_fallback_model(estimated_tokens, max_cost)
        
        # Select the best model
        best_model = suitable_models[0]
        
        return {
            "selected_model": best_model["model_id"],
            "provider": best_model["provider"],
            "estimated_cost": best_model["estimated_cost"],
            "suitability_score": best_model["suitability_score"],
            "capabilities": best_model["capabilities"],
            "strengths": best_model["strengths"],
            "speed": best_model["speed"],
            "reliability": best_model["reliability"],
            "alternatives": suitable_models[1:4],  # Top 3 alternatives
            "selection_reasoning": self._explain_selection(best_model, task_type, complexity)
        }
    
    def _is_model_suitable_for_task(self, model_info: Dict[str, Any], task_type: str, complexity: str) -> bool:
        """Check if a model is suitable for the given task"""
        capabilities = model_info['capabilities']
        
        if task_type == "coding":
            return "coding" in capabilities or "general" in capabilities
        elif task_type == "analysis":
            return "analytical" in capabilities or "general" in capabilities
        elif task_type == "creative":
            return "creative" in capabilities or "general" in capabilities
        elif task_type == "quick":
            return "quick" in capabilities or "fast" in model_info.get('speed', '')
        elif task_type == "complex":
            return "advanced" in capabilities or "complex" in capabilities
        else:
            return "general" in capabilities
    
    def _calculate_estimated_cost(self, model_info: Dict[str, Any], estimated_tokens: float) -> float:
        """Calculate estimated cost for the task"""
        input_cost = (estimated_tokens / 1000) * model_info['cost_per_1k_input']
        # Assume 1:1 input/output ratio for estimation
        output_cost = (estimated_tokens / 1000) * model_info['cost_per_1k_output']
        return input_cost + output_cost
    
    def _calculate_suitability_score(self, model_info: Dict[str, Any], task_type: str, complexity: str, priority: str) -> float:
        """Calculate suitability score for model selection"""
        score = 0.0
        
        # Base score from capabilities match
        if task_type in model_info['capabilities']:
            score += 10.0
        elif "general" in model_info['capabilities']:
            score += 7.0
        
        # Complexity handling
        if complexity == "high" and "advanced" in model_info['capabilities']:
            score += 5.0
        elif complexity == "low" and "quick" in model_info['capabilities']:
            score += 3.0
        
        # Priority-based scoring
        if priority == "cost":
            # Favor lower cost models
            cost_factor = 1.0 / (model_info['cost_per_1k_input'] + model_info['cost_per_1k_output'])
            score += cost_factor * 1000
        elif priority == "speed":
            # Favor faster models
            speed_scores = {"very_fast": 5.0, "fast": 4.0, "medium": 3.0, "slow": 1.0}
            score += speed_scores.get(model_info['speed'], 2.0)
        elif priority == "quality":
            # Favor higher quality models
            reliability_scores = {"very_high": 5.0, "high": 4.0, "medium": 3.0, "low": 1.0}
            score += reliability_scores.get(model_info['reliability'], 2.0)
        
        # Task-specific bonuses
        if task_type == "coding" and "coding" in model_info.get('strengths', []):
            score += 3.0
        elif task_type == "analysis" and "analytical" in model_info.get('strengths', []):
            score += 3.0
        
        return score
    
    def _get_fallback_model(self, estimated_tokens: float, max_cost: float) -> Dict[str, Any]:
        """Get fallback model when no suitable models are found"""
        # Find the most cost-effective available model
        fallback_models = []
        
        for model_id, model_info in self.llm_providers.items():
            if model_info['provider'] in self.clients or model_info['provider'] == 'openrouter':
                estimated_cost = self._calculate_estimated_cost(model_info, estimated_tokens)
                if estimated_cost <= max_cost * 1.5:  # Allow 50% over budget for fallback
                    fallback_models.append({
                        "model_id": model_id,
                        "provider": model_info['provider'],
                        "estimated_cost": estimated_cost,
                        "suitability_score": 1.0,
                        "capabilities": model_info['capabilities'],
                        "strengths": model_info['strengths'],
                        "speed": model_info['speed'],
                        "reliability": model_info['reliability']
                    })
        
        if fallback_models:
            # Sort by cost (lowest first)
            fallback_models.sort(key=lambda x: x['estimated_cost'])
            best_fallback = fallback_models[0]
            
            return {
                "selected_model": best_fallback["model_id"],
                "provider": best_fallback["provider"],
                "estimated_cost": best_fallback["estimated_cost"],
                "suitability_score": best_fallback["suitability_score"],
                "capabilities": best_fallback["capabilities"],
                "strengths": best_fallback["strengths"],
                "speed": best_fallback["speed"],
                "reliability": best_fallback["reliability"],
                "alternatives": [],
                "selection_reasoning": "Fallback model selected due to budget constraints",
                "is_fallback": True
            }
        
        # Ultimate fallback - use available local models
        return {
            "selected_model": "claude-3-5-sonnet-20241022",
            "provider": "anthropic",
            "estimated_cost": 0.0,
            "suitability_score": 1.0,
            "capabilities": ["general"],
            "strengths": ["general_purpose"],
            "speed": "medium",
            "reliability": "high",
            "alternatives": [],
            "selection_reasoning": "Local fallback model - no external providers available",
            "is_fallback": True,
            "local_only": True
        }
    
    def _explain_selection(self, model_info: Dict[str, Any], task_type: str, complexity: str) -> str:
        """Explain why this model was selected"""
        reasons = []
        
        if task_type in model_info['capabilities']:
            reasons.append(f"Perfect match for {task_type} tasks")
        elif "general" in model_info['capabilities']:
            reasons.append("General-purpose model suitable for various tasks")
        
        if complexity == "high" and "advanced" in model_info['capabilities']:
            reasons.append("Advanced capabilities for complex tasks")
        elif complexity == "low" and "quick" in model_info['capabilities']:
            reasons.append("Fast response for simple tasks")
        
        cost_efficiency = "cost-effective" if model_info['estimated_cost'] < 0.01 else "moderate cost"
        reasons.append(f"{cost_efficiency} at ${model_info['estimated_cost']:.4f}")
        
        return "; ".join(reasons)
    
    async def execute_with_selected_llm(self, task_description: str, llm_selection: Dict[str, Any], context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute the task with the selected LLM"""
        model_id = llm_selection["selected_model"]
        provider = llm_selection["provider"]
        
        try:
            if provider == "anthropic":
                return await self._execute_with_anthropic(task_description, model_id, context)
            elif provider == "openai":
                return await self._execute_with_openai(task_description, model_id, context)
            elif provider == "gemini":
                return await self._execute_with_gemini(task_description, model_id, context)
            elif provider == "openrouter":
                return await self._execute_with_openrouter(task_description, model_id, context)
            else:
                return {
                    "success": False,
                    "error": f"Unsupported provider: {provider}",
                    "model_used": model_id
                }
        
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "model_used": model_id
            }
    
    async def _execute_with_anthropic(self, task_description: str, model_id: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute task with Anthropic/Claude"""
        if "anthropic" not in self.clients:
            return {"success": False, "error": "Anthropic client not available"}
        
        client = self.clients["anthropic"]
        
        # Build system prompt
        system_prompt = "You are an expert AI assistant. Provide clear, actionable, and well-structured responses."
        if context:
            system_prompt += f"\n\nContext: {json.dumps(context, indent=2)}"
        
        # Execute with Claude
        response = await asyncio.to_thread(
            client.messages.create,
            model=model_id,
            max_tokens=4000,
            system=system_prompt,
            messages=[{"role": "user", "content": task_description}]
        )
        
        return {
            "success": True,
            "response": response.content[0].text,
            "model_used": model_id,
            "provider": "anthropic",
            "usage": {
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens,
                "total_tokens": response.usage.total_tokens
            }
        }
    
    async def _execute_with_openai(self, task_description: str, model_id: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute task with OpenAI"""
        if "openai" not in self.clients:
            return {"success": False, "error": "OpenAI client not available"}
        
        client = self.clients["openai"]
        
        # Build messages
        messages = []
        if context:
            messages.append({"role": "system", "content": f"Context: {json.dumps(context, indent=2)}"})
        messages.append({"role": "user", "content": task_description})
        
        # Execute with OpenAI
        response = await asyncio.to_thread(
            client.chat.completions.create,
            model=model_id,
            messages=messages,
            max_tokens=4000
        )
        
        return {
            "success": True,
            "response": response.choices[0].message.content,
            "model_used": model_id,
            "provider": "openai",
            "usage": {
                "input_tokens": response.usage.prompt_tokens,
                "output_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            }
        }
    
    async def _execute_with_gemini(self, task_description: str, model_id: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute task with Google Gemini"""
        if "gemini" not in self.clients:
            return {"success": False, "error": "Gemini client not available"}
        
        # Build prompt
        prompt = task_description
        if context:
            prompt = f"Context: {json.dumps(context, indent=2)}\n\nTask: {task_description}"
        
        # Execute with Gemini
        model = genai.GenerativeModel(model_id)
        response = await asyncio.to_thread(
            model.generate_content,
            prompt
        )
        
        return {
            "success": True,
            "response": response.text,
            "model_used": model_id,
            "provider": "gemini",
            "usage": {
                "input_tokens": len(prompt.split()),
                "output_tokens": len(response.text.split()),
                "total_tokens": len(prompt.split()) + len(response.text.split())
            }
        }
    
    async def _execute_with_openrouter(self, task_description: str, model_id: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute task with OpenRouter"""
        if "openrouter" not in self.api_keys:
            return {"success": False, "error": "OpenRouter API key not available"}
        
        # Build messages
        messages = []
        if context:
            messages.append({"role": "system", "content": f"Context: {json.dumps(context, indent=2)}"})
        messages.append({"role": "user", "content": task_description})
        
        # Execute with OpenRouter
        headers = {
            "Authorization": f"Bearer {self.api_keys['openrouter']}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": model_id,
            "messages": messages,
            "max_tokens": 4000
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=data
            ) as response:
                result = await response.json()
                
                if "choices" in result:
                    return {
                        "success": True,
                        "response": result["choices"][0]["message"]["content"],
                        "model_used": model_id,
                        "provider": "openrouter",
                        "usage": result.get("usage", {})
                    }
                else:
                    return {
                        "success": False,
                        "error": f"OpenRouter API error: {result.get('error', 'Unknown error')}",
                        "model_used": model_id
                    }
    
    def get_provider_status(self) -> Dict[str, Any]:
        """Get status of all available providers"""
        status = {
            "total_providers": len(self.api_keys),
            "available_providers": list(self.api_keys.keys()),
            "client_status": {},
            "model_count": len(self.llm_providers)
        }
        
        for provider, client in self.clients.items():
            status["client_status"][provider] = "available"
        
        for provider in self.api_keys:
            if provider not in self.clients:
                status["client_status"][provider] = "api_key_only"
        
        return status

# Main execution for testing
if __name__ == "__main__":
    async def test_enhanced_router():
        router = EnhancedLLMRouter()
        
        # Test provider status
        status = router.get_provider_status()
        print("Provider Status:", json.dumps(status, indent=2))
        
        # Test task analysis
        task = "Create a Python function to analyze JSON data and extract specific fields"
        analysis = router.analyze_task(task)
        print(f"\nTask Analysis: {json.dumps(analysis, indent=2)}")
        
        # Test LLM selection
        selection = router.select_optimal_llm(analysis, {"max_cost": 0.05, "priority": "cost"})
        print(f"\nLLM Selection: {json.dumps(selection, indent=2)}")
        
        # Test execution (if clients are available)
        if any(router.clients.values()):
            result = await router.execute_with_selected_llm(task, selection)
            print(f"\nExecution Result: {json.dumps(result, indent=2)}")
        else:
            print("\nNo clients available for execution")
    
    asyncio.run(test_enhanced_router())

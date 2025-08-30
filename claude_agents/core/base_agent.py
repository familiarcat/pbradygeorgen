#!/usr/bin/env python3
"""
Base Agent Class for Claude Crew Members
Provides common functionality for all crew member agents
"""

import os
import json
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from datetime import datetime
import anthropic

class BaseAgent(ABC):
    """
    Base class for all Claude crew member agents
    Provides common functionality and interface
    """
    
    def __init__(self, agent_id: str, name: str, role: str, claude_api_key: Optional[str] = None):
        """
        Initialize the base agent
        
        Args:
            agent_id: Unique identifier for the agent
            name: Display name of the agent
            role: Role description of the agent
            claude_api_key: Claude API key (optional, will use env var if not provided)
        """
        self.agent_id = agent_id
        self.name = name
        self.role = role
        self.claude_api_key = claude_api_key or os.getenv('CLAUDE_API_KEY')
        
        # Initialize Claude client
        if self.claude_api_key:
            self.claude_client = anthropic.Anthropic(api_key=self.claude_api_key)
        else:
            self.claude_client = None
            logging.warning(f"No Claude API key provided for {self.name}")
        
        # Agent state
        self.memory = []
        self.current_task = None
        self.status = "idle"
        self.created_at = datetime.now()
        self.last_active = datetime.now()
        
        # Setup logging
        self.setup_logging()
        
        logging.info(f"Initialized agent: {self.name} ({self.role})")
    
    def setup_logging(self):
        """Setup logging for the agent"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(f"Agent.{self.agent_id}")
    
    @abstractmethod
    def get_system_prompt(self) -> str:
        """
        Get the system prompt for this agent
        Must be implemented by each crew member
        
        Returns:
            System prompt string
        """
        pass
    
    @abstractmethod
    def get_capabilities(self) -> List[str]:
        """
        Get the capabilities of this agent
        Must be implemented by each crew member
        
        Returns:
            List of capability strings
        """
        pass
    
    def analyze_task(self, task: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Analyze a task using Claude
        
        Args:
            task: The task to analyze
            context: Additional context for the task
            
        Returns:
            Analysis results dictionary
        """
        if not self.claude_client:
            return self._fallback_analysis(task, context)
        
        try:
            # Prepare the message
            system_prompt = self.get_system_prompt()
            user_message = f"Task: {task}"
            
            if context:
                user_message += f"\n\nContext: {json.dumps(context, indent=2)}"
            
            # Call Claude
            response = self.claude_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                system=system_prompt,
                messages=[{"role": "user", "content": user_message}]
            )
            
            # Process response
            analysis = {
                "agent": self.name,
                "role": self.role,
                "task": task,
                "analysis": response.content[0].text,
                "timestamp": datetime.now().isoformat(),
                "status": "completed"
            }
            
            # Update agent state
            self.current_task = task
            self.status = "active"
            self.last_active = datetime.now()
            
            # Store in memory
            self.memory.append(analysis)
            
            self.logger.info(f"Task analysis completed: {task[:50]}...")
            return analysis
            
        except Exception as e:
            self.logger.error(f"Error analyzing task: {e}")
            return self._fallback_analysis(task, context)
    
    def _fallback_analysis(self, task: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Fallback analysis when Claude is not available
        
        Args:
            task: The task to analyze
            context: Additional context for the task
            
        Returns:
            Basic analysis results
        """
        analysis = {
            "agent": self.name,
            "role": self.role,
            "task": task,
            "analysis": f"Fallback analysis for task: {task}. This agent specializes in {self.role}.",
            "timestamp": datetime.now().isoformat(),
            "status": "fallback",
            "note": "Claude API not available, using fallback analysis"
        }
        
        self.memory.append(analysis)
        return analysis
    
    def get_memory_summary(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get a summary of recent memory entries
        
        Args:
            limit: Maximum number of entries to return
            
        Returns:
            List of recent memory entries
        """
        return self.memory[-limit:] if self.memory else []
    
    def clear_memory(self):
        """Clear the agent's memory"""
        self.memory.clear()
        self.logger.info("Memory cleared")
    
    def get_status(self) -> Dict[str, Any]:
        """
        Get the current status of the agent
        
        Returns:
            Status dictionary
        """
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "role": self.role,
            "status": self.status,
            "current_task": self.current_task,
            "memory_count": len(self.memory),
            "created_at": self.created_at.isoformat(),
            "last_active": self.last_active.isoformat()
        }
    
    def update_status(self, status: str, task: Optional[str] = None):
        """
        Update the agent's status
        
        Args:
            status: New status
            task: Current task (optional)
        """
        self.status = status
        if task:
            self.current_task = task
        self.last_active = datetime.now()
        self.logger.info(f"Status updated: {status}")
    
    def can_handle_task(self, task: str) -> bool:
        """
        Check if this agent can handle a specific task
        
        Args:
            task: The task to check
            
        Returns:
            True if the agent can handle the task
        """
        capabilities = self.get_capabilities()
        task_lower = task.lower()
        
        # Check if any capability matches the task
        for capability in capabilities:
            if capability.lower() in task_lower:
                return True
        
        return False
    
    def get_task_recommendation(self, task: str) -> Dict[str, Any]:
        """
        Get a recommendation for handling a task
        
        Args:
            task: The task to get a recommendation for
            
        Returns:
            Recommendation dictionary
        """
        if self.can_handle_task(task):
            return {
                "agent": self.name,
                "recommendation": "This agent can handle this task",
                "confidence": "high",
                "reasoning": f"Task '{task}' aligns with agent's capabilities: {', '.join(self.get_capabilities())}"
            }
        else:
            return {
                "agent": self.name,
                "recommendation": "This agent is not the best fit for this task",
                "confidence": "low",
                "reasoning": f"Task '{task}' does not align with agent's primary capabilities: {', '.join(self.get_capabilities())}"
            }
    
    def __str__(self) -> str:
        return f"{self.name} ({self.role}) - {self.status}"
    
    def __repr__(self) -> str:
        return f"BaseAgent(agent_id='{self.agent_id}', name='{self.name}', role='{self.role}')"

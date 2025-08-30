#!/usr/bin/env python3
"""
Observation Lounge Coordinator
Manages crew interactions, mission coordination, and collective decision-making
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from typing import Dict, Any, List, Optional
from datetime import datetime
import logging
import json

from core.base_agent import BaseAgent
from integration.n8n_connector.connector import N8NConnector

class ObservationLoungeCoordinator:
    """
    Observation Lounge Coordinator
    Manages crew interactions and mission coordination
    """
    
    def __init__(self, claude_api_key: str = None):
        """
        Initialize the Observation Lounge Coordinator
        
        Args:
            claude_api_key: Claude API key for agent initialization
        """
        self.claude_api_key = claude_api_key
        self.crew_agents = {}
        self.n8n_connector = N8NConnector()
        self.mission_log = []
        self.coordination_sessions = []
        
        # Setup logging
        self.logger = logging.getLogger("ObservationLounge")
        
        # Initialize crew agents
        self._initialize_crew_agents()
        
        self.logger.info("Observation Lounge Coordinator initialized")
    
    def _initialize_crew_agents(self):
        """Initialize all crew member agents"""
        try:
            # Import and initialize crew agents
            from core.captain_picard.agent import CaptainPicardAgent
            
            # Initialize Captain Picard
            self.crew_agents["captain_picard"] = CaptainPicardAgent(self.claude_api_key)
            
            # TODO: Initialize other crew agents as they are created
            # self.crew_agents["commander_riker"] = CommanderRikerAgent(self.claude_api_key)
            # self.crew_agents["commander_data"] = CommanderDataAgent(self.claude_api_key)
            # etc.
            
            self.logger.info(f"Initialized {len(self.crew_agents)} crew agents")
            
        except Exception as e:
            self.logger.error(f"Error initializing crew agents: {e}")
    
    def get_crew_status(self) -> Dict[str, Any]:
        """Get status of all crew members"""
        crew_status = {}
        for agent_id, agent in self.crew_agents.items():
            crew_status[agent_id] = agent.get_status()
        
        return {
            "total_crew": len(self.crew_agents),
            "crew_members": crew_status,
            "timestamp": datetime.now().isoformat()
        }
    
    def coordinate_mission(self, mission_objectives: List[str], mission_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Coordinate a mission using the crew
        
        Args:
            mission_objectives: List of mission objectives
            mission_context: Additional mission context
            
        Returns:
            Mission coordination results
        """
        self.logger.info(f"Starting mission coordination for objectives: {mission_objectives}")
        
        # Create mission session
        mission_session = {
            "session_id": f"mission_{len(self.coordination_sessions)}",
            "objectives": mission_objectives,
            "context": mission_context or {},
            "start_time": datetime.now().isoformat(),
            "crew_participants": list(self.crew_agents.keys()),
            "status": "in_progress"
        }
        
        self.coordination_sessions.append(mission_session)
        
        # Get Captain Picard's strategic analysis
        if "captain_picard" in self.crew_agents:
            picard = self.crew_agents["captain_picard"]
            strategic_plan = picard.plan_mission(mission_objectives, {
                "available_crew": list(self.crew_agents.keys()),
                "mission_context": mission_context
            })
            
            mission_session["strategic_plan"] = strategic_plan
            self.logger.info("Strategic plan created by Captain Picard")
        
        # Coordinate crew assignments
        crew_coordination = self._coordinate_crew_assignments(mission_objectives)
        mission_session["crew_coordination"] = crew_coordination
        
        # Check if n8n workflows are needed
        workflow_recommendations = self._assess_workflow_needs(mission_objectives)
        mission_session["workflow_recommendations"] = workflow_recommendations
        
        # Execute recommended workflows
        if workflow_recommendations:
            workflow_results = self._execute_workflows(workflow_recommendations)
            mission_session["workflow_results"] = workflow_results
        
        # Complete mission session
        mission_session["status"] = "completed"
        mission_session["end_time"] = datetime.now().isoformat()
        
        # Log the mission
        self.mission_log.append(mission_session)
        
        self.logger.info(f"Mission coordination completed: {mission_session['session_id']}")
        
        return mission_session
    
    def _coordinate_crew_assignments(self, mission_objectives: List[str]) -> Dict[str, Any]:
        """
        Coordinate crew assignments for mission objectives
        
        Args:
            mission_objectives: List of mission objectives
            
        Returns:
            Crew coordination plan
        """
        coordination_plan = {
            "objectives": mission_objectives,
            "crew_assignments": {},
            "coordination_strategy": "Captain Picard leads strategic coordination",
            "timestamp": datetime.now().isoformat()
        }
        
        # Assign crew to objectives based on capabilities
        for objective in mission_objectives:
            best_agent = self._find_best_agent_for_objective(objective)
            if best_agent:
                coordination_plan["crew_assignments"][objective] = {
                    "assigned_agent": best_agent.agent_id,
                    "agent_name": best_agent.name,
                    "role": best_agent.role,
                    "capabilities": best_agent.get_capabilities()
                }
        
        return coordination_plan
    
    def _find_best_agent_for_objective(self, objective: str) -> Optional[BaseAgent]:
        """
        Find the best agent for a specific objective
        
        Args:
            objective: The objective to find an agent for
            
        Returns:
            Best agent for the objective or None
        """
        best_agent = None
        best_score = 0
        
        for agent in self.crew_agents.values():
            if agent.can_handle_task(objective):
                # Calculate a simple relevance score
                capabilities = agent.get_capabilities()
                objective_lower = objective.lower()
                
                # Count matching capability keywords
                matches = sum(1 for cap in capabilities if cap.lower() in objective_lower)
                
                if matches > best_score:
                    best_score = matches
                    best_agent = agent
        
        return best_agent
    
    def _assess_workflow_needs(self, mission_objectives: List[str]) -> List[Dict[str, Any]]:
        """
        Assess which n8n workflows might be needed for the mission
        
        Args:
            mission_objectives: List of mission objectives
            
        Returns:
            List of workflow recommendations
        """
        workflow_recommendations = []
        
        for objective in mission_objectives:
            # Check if any n8n workflow can help with this objective
            recommended_workflow = self.n8n_connector.recommend_workflow(objective)
            
            if recommended_workflow:
                workflow_recommendations.append({
                    "objective": objective,
                    "workflow": {
                        "name": recommended_workflow.name,
                        "description": recommended_workflow.description,
                        "category": recommended_workflow.category
                    },
                    "rationale": f"Workflow can automate aspects of: {objective}"
                })
        
        return workflow_recommendations
    
    def _execute_workflows(self, workflow_recommendations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Execute recommended n8n workflows
        
        Args:
            workflow_recommendations: List of workflow recommendations
            
        Returns:
            List of workflow execution results
        """
        workflow_results = []
        
        for recommendation in workflow_recommendations:
            objective = recommendation["objective"]
            workflow_name = recommendation["workflow"]["name"]
            
            # Execute the workflow
            result = self.n8n_connector.execute_task_with_workflow(
                objective,
                {"mission_objective": objective, "execution_context": "claude_coordination"}
            )
            
            workflow_results.append({
                "objective": objective,
                "workflow": workflow_name,
                "execution_result": result,
                "timestamp": datetime.now().isoformat()
            })
        
        return workflow_results
    
    def get_agent_analysis(self, agent_id: str, task: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Get analysis from a specific crew agent
        
        Args:
            agent_id: ID of the agent to consult
            task: Task to analyze
            context: Additional context
            
        Returns:
            Agent analysis results
        """
        if agent_id not in self.crew_agents:
            return {
                "error": f"Agent {agent_id} not found",
                "available_agents": list(self.crew_agents.keys())
            }
        
        agent = self.crew_agents[agent_id]
        analysis = agent.analyze_task(task, context)
        
        return {
            "agent": agent_id,
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        }
    
    def get_collective_analysis(self, task: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Get collective analysis from multiple crew agents
        
        Args:
            task: Task to analyze
            context: Additional context
            
        Returns:
            Collective analysis results
        """
        collective_analysis = {
            "task": task,
            "context": context,
            "crew_analyses": {},
            "consensus_recommendation": None,
            "timestamp": datetime.now().isoformat()
        }
        
        # Get analysis from each crew member
        for agent_id, agent in self.crew_agents.items():
            analysis = agent.analyze_task(task, context)
            collective_analysis["crew_analyses"][agent_id] = analysis
        
        # Generate consensus recommendation
        consensus = self._generate_consensus_recommendation(collective_analysis["crew_analyses"])
        collective_analysis["consensus_recommendation"] = consensus
        
        return collective_analysis
    
    def _generate_consensus_recommendation(self, crew_analyses: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate consensus recommendation from crew analyses
        
        Args:
            crew_analyses: Analyses from different crew members
            
        Returns:
            Consensus recommendation
        """
        # This is a simplified consensus mechanism
        # In practice, this could use more sophisticated NLP and reasoning
        
        consensus = {
            "recommendation": "Coordinate crew efforts based on individual analyses",
            "confidence": "medium",
            "rationale": f"Based on analysis from {len(crew_analyses)} crew members",
            "key_insights": []
        }
        
        # Extract key insights from each analysis
        for agent_id, analysis in crew_analyses.items():
            if "analysis" in analysis:
                consensus["key_insights"].append({
                    "agent": agent_id,
                    "insight": analysis["analysis"][:200] + "..." if len(analysis["analysis"]) > 200 else analysis["analysis"]
                })
        
        return consensus
    
    def get_mission_history(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get mission history
        
        Args:
            limit: Maximum number of missions to return
            
        Returns:
            List of recent missions
        """
        return self.mission_log[-limit:] if self.mission_log else []
    
    def get_coordination_sessions(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recent coordination sessions
        
        Args:
            limit: Maximum number of sessions to return
            
        Returns:
            List of recent coordination sessions
        """
        return self.coordination_sessions[-limit:] if self.coordination_sessions else []
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get overall system status"""
        return {
            "observation_lounge": {
                "status": "operational",
                "crew_agents": len(self.crew_agents),
                "total_missions": len(self.mission_log),
                "total_sessions": len(self.coordination_sessions)
            },
            "n8n_integration": self.n8n_connector.get_connection_status(),
            "crew_status": self.get_crew_status(),
            "timestamp": datetime.now().isoformat()
        }
    
    def add_crew_member(self, agent: BaseAgent):
        """
        Add a new crew member to the coordination system
        
        Args:
            agent: The crew member agent to add
        """
        self.crew_agents[agent.agent_id] = agent
        self.logger.info(f"Added crew member: {agent.name}")
    
    def remove_crew_member(self, agent_id: str):
        """
        Remove a crew member from the coordination system
        
        Args:
            agent_id: ID of the agent to remove
        """
        if agent_id in self.crew_agents:
            agent_name = self.crew_agents[agent_id].name
            del self.crew_agents[agent_id]
            self.logger.info(f"Removed crew member: {agent_name}")
        else:
            self.logger.warning(f"Attempted to remove non-existent crew member: {agent_id}")

#!/usr/bin/env python3
"""
Observation Lounge Coordinator
Central hub for crew interactions and mission coordination
"""

import os
import sys
from typing import Dict, List, Any, Optional
from datetime import datetime

# Add the parent directory to the path to import from claude_agents
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from claude_agents.core import (
    CaptainPicardAgent,
    CommanderDataAgent,
    CommanderRikerAgent,
    LieutenantWorfAgent,
    GeordiLaForgeAgent,
    CounselorTroiAgent,
    LieutenantUhuraAgent,
    DrCrusherAgent,
    QuarkAgent
)
from claude_agents.integration.n8n_connector.connector import N8NConnector

class ObservationLoungeCoordinator:
    def __init__(self):
        """Initialize the Observation Lounge with all crew members"""
        self.crew_members = {
            "picard": CaptainPicardAgent(),
            "data": CommanderDataAgent(),
            "riker": CommanderRikerAgent(),
            "worf": LieutenantWorfAgent(),
            "geordi": GeordiLaForgeAgent(),
            "troi": CounselorTroiAgent(),
            "uhura": LieutenantUhuraAgent(),
            "crusher": DrCrusherAgent(),
            "quark": QuarkAgent()
        }
        
        self.n8n_connector = N8NConnector()
        self.mission_log = []
        
    def get_crew_status(self) -> Dict[str, Any]:
        """Get the status of all crew members"""
        crew_status = {}
        
        for crew_id, agent in self.crew_members.items():
            crew_status[crew_id] = {
                "name": agent.name,
                "role": agent.role,
                "capabilities": agent.get_capabilities(),
                "status": "active"
            }
            
        return {
            "total_crew": len(self.crew_members),
            "crew_members": crew_status,
            "timestamp": datetime.now().isoformat()
        }
    
    def coordinate_mission(self, mission_brief: str, crew_requirements: List[str] = None) -> Dict[str, Any]:
        """Coordinate a mission using the appropriate crew members"""
        try:
            # If no specific crew requirements, use all crew members
            if crew_requirements is None:
                crew_requirements = list(self.crew_members.keys())
            
            mission_results = {}
            mission_summary = {
                "mission_brief": mission_brief,
                "crew_involved": crew_requirements,
                "timestamp": datetime.now().isoformat(),
                "results": {}
            }
            
            # Coordinate each crew member's contribution
            for crew_id in crew_requirements:
                if crew_id in self.crew_members:
                    agent = self.crew_members[crew_id]
                    
                    # Analyze the mission based on the agent's capabilities
                    analysis_result = agent.analyze_task(mission_brief)
                    
                    mission_results[crew_id] = {
                        "agent_name": agent.name,
                        "role": agent.role,
                        "analysis": analysis_result,
                        "capabilities_used": agent.get_capabilities()
                    }
                    
                    mission_summary["results"][crew_id] = analysis_result
            
            # Log the mission
            self.mission_log.append(mission_summary)
            
            return {
                "status": "success",
                "mission_coordination": mission_summary,
                "crew_contributions": mission_results
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "mission_brief": mission_brief
            }
    
    def get_specialized_analysis(self, analysis_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Get specialized analysis from the appropriate crew member"""
        try:
            # Map analysis types to crew members
            analysis_mapping = {
                "scientific": "data",
                "tactical": "worf", 
                "engineering": "geordi",
                "psychological": "troi",
                "communications": "uhura",
                "medical": "crusher",
                "business": "quark",
                "strategic": "picard"
            }
            
            if analysis_type not in analysis_mapping:
                return {
                    "status": "error",
                    "error": f"Unknown analysis type: {analysis_type}",
                    "available_types": list(analysis_mapping.keys())
                }
            
            crew_id = analysis_mapping[analysis_type]
            agent = self.crew_members[crew_id]
            
            # Use specialized methods based on the agent type
            if analysis_type == "scientific":
                result = agent.analyze_scientific_data(data)
            elif analysis_type == "tactical":
                result = agent.analyze_tactical_situation(data)
            elif analysis_type == "engineering":
                result = agent.analyze_engineering_problem(data)
            elif analysis_type == "psychological":
                result = agent.analyze_psychological_situation(data)
            elif analysis_type == "communications":
                result = agent.analyze_communication_challenge(data)
            elif analysis_type == "medical":
                result = agent.analyze_medical_situation(data)
            elif analysis_type == "business":
                result = agent.analyze_business_opportunity(data)
            else:
                result = agent.analyze_task(str(data))
            
            return {
                "status": "success",
                "analysis_type": analysis_type,
                "agent": agent.name,
                "result": result
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "analysis_type": analysis_type
            }
    
    def assess_n8n_workflow_needs(self, task_description: str) -> Dict[str, Any]:
        """Assess whether n8n workflows are needed for a task"""
        try:
            # Use the n8n connector to assess workflow needs
            workflow_assessment = self.n8n_connector.recommend_workflow(task_description)
            
            return {
                "status": "success",
                "workflow_assessment": workflow_assessment,
                "n8n_connector_status": self.n8n_connector.get_connection_status()
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "task_description": task_description
            }
    
    def execute_n8n_workflow(self, workflow_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a specific n8n workflow"""
        try:
            execution_result = self.n8n_connector.execute_workflow(workflow_name, parameters)
            
            return {
                "status": "success",
                "workflow_execution": execution_result,
                "workflow_name": workflow_name,
                "parameters": parameters
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "workflow_name": workflow_name
            }
    
    def get_collective_analysis(self, mission_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get collective analysis from all crew members"""
        try:
            collective_analysis = {}
            
            for crew_id, agent in self.crew_members.items():
                analysis = agent.analyze_task(str(mission_data))
                collective_analysis[crew_id] = {
                    "agent_name": agent.name,
                    "role": agent.role,
                    "analysis": analysis
                }
            
            # Log the collective analysis
            self.mission_log.append({
                "type": "collective_analysis",
                "timestamp": datetime.now().isoformat(),
                "mission_data": mission_data,
                "collective_analysis": collective_analysis
            })
            
            return {
                "status": "success",
                "collective_analysis": collective_analysis,
                "total_contributors": len(self.crew_members)
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "mission_data": mission_data
            }
    
    def get_mission_history(self) -> List[Dict[str, Any]]:
        """Get the history of all missions"""
        return self.mission_log

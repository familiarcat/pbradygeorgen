#!/usr/bin/env python3
"""
Counselor Deanna Troi Agent
Specializes in psychological analysis, emotional intelligence, and interpersonal dynamics
"""

from ..base_agent import BaseAgent
from typing import Dict, Any, List

class CounselorTroiAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_id="counselor_troi",
            name="Counselor Deanna Troi",
            role="Psychological Analysis & Emotional Intelligence"
        )

    def get_system_prompt(self) -> str:
        return """You are Counselor Deanna Troi, the ship's counselor aboard the USS Enterprise-D. 
        You excel at:
        - Psychological analysis and emotional intelligence
        - Interpersonal dynamics and conflict resolution
        - Empathetic communication and counseling
        - Behavioral pattern recognition
        - Team cohesion and morale building
        
        You approach situations with empathy, understanding, and psychological insight."""

    def get_capabilities(self) -> List[str]:
        return [
            "psychological_analysis",
            "emotional_intelligence",
            "conflict_resolution",
            "interpersonal_dynamics",
            "behavioral_analysis",
            "team_cohesion"
        ]

    def analyze_psychological_situation(self, situation: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze psychological situations and provide emotional insights"""
        try:
            psychology_prompt = f"""
            Analyze this psychological situation and provide emotional insights:
            
            Situation: {situation}
            
            Provide:
            1. Emotional dynamics analysis
            2. Psychological factors at play
            3. Communication recommendations
            4. Conflict resolution strategies
            """
            
            response = self._call_claude(psychology_prompt)
            
            return {
                "status": "success",
                "psychological_analysis": response,
                "agent": "Counselor Troi",
                "methodology": "psychological_analysis"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "agent": "Counselor Troi"
            }

    def resolve_interpersonal_conflict(self, conflict_data: Dict[str, Any]) -> Dict[str, Any]:
        """Resolve interpersonal conflicts through mediation and counseling"""
        try:
            conflict_prompt = f"""
            Analyze this interpersonal conflict and provide resolution strategies:
            
            Conflict Data: {conflict_data}
            
            Provide:
            1. Conflict root cause analysis
            2. Mediation approach recommendations
            3. Communication improvement strategies
            4. Long-term relationship building
            """
            
            response = self._call_claude(conflict_prompt)
            
            return {
                "status": "success",
                "conflict_resolution": response,
                "agent": "Counselor Troi",
                "methodology": "conflict_resolution"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "agent": "Counselor Troi"
            }

    def build_team_cohesion(self, team_dynamics: Dict[str, Any]) -> Dict[str, Any]:
        """Build team cohesion and improve group dynamics"""
        try:
            cohesion_prompt = f"""
            Analyze this team's dynamics and provide cohesion-building strategies:
            
            Team Dynamics: {team_dynamics}
            
            Provide:
            1. Team dynamic assessment
            2. Cohesion building activities
            3. Communication improvement strategies
            4. Morale enhancement recommendations
            """
            
            response = self._call_claude(cohesion_prompt)
            
            return {
                "status": "success",
                "team_cohesion_plan": response,
                "agent": "Counselor Troi",
                "methodology": "team_cohesion"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "agent": "Counselor Troi"
            }

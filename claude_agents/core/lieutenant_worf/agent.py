#!/usr/bin/env python3
"""
Lieutenant Worf Agent
Specializes in tactical analysis, security operations, and Klingon warrior philosophy
"""

from ..base_agent import BaseAgent
from typing import Dict, Any, List

class LieutenantWorfAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_id="lieutenant_worf",
            name="Lieutenant Worf",
            role="Tactical Analysis & Security Operations"
        )

    def get_system_prompt(self) -> str:
        return """You are Lieutenant Worf, the Klingon tactical officer aboard the USS Enterprise-D. 
        You excel at:
        - Tactical analysis and combat strategy
        - Security operations and threat assessment
        - Klingon warrior philosophy and honor
        - Defensive planning and risk mitigation
        - Direct, decisive action and leadership
        
        You approach challenges with warrior's courage and tactical precision."""

    def get_capabilities(self) -> List[str]:
        return [
            "tactical_analysis",
            "security_operations",
            "threat_assessment",
            "combat_strategy",
            "defensive_planning",
            "risk_mitigation"
        ]

    def analyze_tactical_situation(self, situation: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze tactical situations and provide strategic recommendations"""
        try:
            tactical_prompt = f"""
            Analyze this tactical situation and provide strategic recommendations:
            
            Situation: {situation}
            
            Provide:
            1. Threat assessment and risk analysis
            2. Tactical advantages and disadvantages
            3. Strategic options and recommendations
            4. Resource requirements and timeline
            """
            
            response = self._call_claude(tactical_prompt)
            
            return {
                "status": "success",
                "tactical_analysis": response,
                "agent": "Lieutenant Worf",
                "methodology": "tactical_analysis"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "agent": "Lieutenant Worf"
            }

    def assess_security_threats(self, threat_data: Dict[str, Any]) -> Dict[str, Any]:
        """Assess security threats and recommend countermeasures"""
        try:
            security_prompt = f"""
            Assess these security threats and recommend countermeasures:
            
            Threat Data: {threat_data}
            
            Provide:
            1. Threat level assessment
            2. Vulnerability analysis
            3. Countermeasure recommendations
            4. Implementation priority
            """
            
            response = self._call_claude(security_prompt)
            
            return {
                "status": "success",
                "security_assessment": response,
                "agent": "Lieutenant Worf",
                "methodology": "security_analysis"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "agent": "Lieutenant Worf"
            }

    def develop_defensive_strategy(self, defensive_requirements: Dict[str, Any]) -> Dict[str, Any]:
        """Develop comprehensive defensive strategies"""
        try:
            defense_prompt = f"""
            Develop a comprehensive defensive strategy based on these requirements:
            
            Requirements: {defensive_requirements}
            
            Provide:
            1. Defensive perimeter design
            2. Resource allocation strategy
            3. Response protocols and procedures
            4. Training and readiness requirements
            """
            
            response = self._call_claude(defense_prompt)
            
            return {
                "status": "success",
                "defensive_strategy": response,
                "agent": "Lieutenant Worf",
                "methodology": "defensive_planning"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "agent": "Lieutenant Worf"
            }

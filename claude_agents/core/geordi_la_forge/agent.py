#!/usr/bin/env python3
"""
Lieutenant Commander Geordi La Forge Agent
Specializes in engineering, technical problem-solving, and systems optimization
"""

from ..base_agent import BaseAgent
from typing import Dict, Any, List

class GeordiLaForgeAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_id="geordi_la_forge",
            name="Lieutenant Commander Geordi La Forge",
            role="Engineering & Technical Problem-Solving"
        )

    def get_system_prompt(self) -> str:
        return """You are Lieutenant Commander Geordi La Forge, the Chief Engineer aboard the USS Enterprise-D. 
        You excel at:
        - Engineering problem-solving and innovation
        - Systems analysis and optimization
        - Technical troubleshooting and repair
        - Creative engineering solutions
        - Team leadership and collaboration
        
        You approach technical challenges with creativity, patience, and engineering excellence."""

    def get_capabilities(self) -> List[str]:
        return [
            "engineering_analysis",
            "technical_troubleshooting",
            "systems_optimization",
            "problem_solving",
            "innovation_engineering",
            "team_leadership"
        ]

    def analyze_engineering_problem(self, problem: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze engineering problems and provide technical solutions"""
        try:
            engineering_prompt = f"""
            Analyze this engineering problem and provide technical solutions:
            
            Problem: {problem}
            
            Provide:
            1. Problem diagnosis and root cause analysis
            2. Technical solution options
            3. Implementation approach and timeline
            4. Resource requirements and safety considerations
            """
            
            response = self._call_claude(engineering_prompt)
            
            return {
                "status": "success",
                "engineering_analysis": response,
                "agent": "Geordi La Forge",
                "methodology": "engineering_analysis"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "agent": "Geordi La Forge"
            }

    def optimize_system_performance(self, system_data: Dict[str, Any]) -> Dict[str, Any]:
        """Optimize system performance and efficiency"""
        try:
            optimization_prompt = f"""
            Analyze this system and provide optimization recommendations:
            
            System Data: {system_data}
            
            Provide:
            1. Current performance analysis
            2. Bottleneck identification
            3. Optimization strategies
            4. Expected performance improvements
            """
            
            response = self._call_claude(optimization_prompt)
            
            return {
                "status": "success",
                "optimization_plan": response,
                "agent": "Geordi La Forge",
                "methodology": "systems_optimization"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "agent": "Geordi La Forge"
            }

    def develop_innovative_solution(self, requirements: Dict[str, Any]) -> Dict[str, Any]:
        """Develop innovative engineering solutions"""
        try:
            innovation_prompt = f"""
            Develop an innovative engineering solution for these requirements:
            
            Requirements: {requirements}
            
            Provide:
            1. Creative solution concepts
            2. Technical feasibility analysis
            3. Implementation strategy
            4. Risk assessment and mitigation
            """
            
            response = self._call_claude(innovation_prompt)
            
            return {
                "status": "success",
                "innovative_solution": response,
                "agent": "Geordi La Forge",
                "methodology": "innovation_engineering"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "agent": "Geordi La Forge"
            }

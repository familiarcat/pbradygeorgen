#!/usr/bin/env python3
"""
Commander Data Agent
Specializes in scientific analysis, logical reasoning, and data processing
"""

from ..base_agent import BaseAgent
from typing import Dict, Any, List

class CommanderDataAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            agent_id="commander_data",
            name="Commander Data",
            role="Scientific Analysis & Logical Reasoning"
        )

    def get_system_prompt(self) -> str:
        return """You are Commander Data, an android officer aboard the USS Enterprise-D. 
        You excel at:
        - Scientific analysis and research
        - Logical reasoning and problem-solving
        - Data processing and pattern recognition
        - Technical expertise and engineering
        - Objective analysis without emotional bias
        
        You approach problems methodically and provide clear, logical solutions based on facts and data."""

    def get_capabilities(self) -> List[str]:
        return [
            "scientific_analysis",
            "logical_reasoning", 
            "data_processing",
            "technical_expertise",
            "pattern_recognition",
            "research_methodology"
        ]

    def analyze_scientific_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze scientific data and provide logical conclusions"""
        try:
            # Use Claude for scientific analysis
            analysis_prompt = f"""
            Analyze the following scientific data and provide:
            1. Key observations and patterns
            2. Logical conclusions
            3. Potential implications
            4. Recommendations for further investigation
            
            Data: {data}
            """
            
            response = self._call_claude(analysis_prompt)
            
            return {
                "status": "success",
                "analysis": response,
                "agent": "Commander Data",
                "methodology": "scientific_analysis"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "agent": "Commander Data"
            }

    def solve_logical_problem(self, problem: str) -> Dict[str, Any]:
        """Solve logical problems using systematic reasoning"""
        try:
            logic_prompt = f"""
            Solve this logical problem using systematic reasoning:
            
            Problem: {problem}
            
            Provide:
            1. Problem breakdown
            2. Logical steps to solution
            3. Final answer
            4. Verification of solution
            """
            
            response = self._call_claude(logic_prompt)
            
            return {
                "status": "success",
                "solution": response,
                "agent": "Commander Data",
                "methodology": "logical_reasoning"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "agent": "Commander Data"
            }

    def process_technical_data(self, technical_info: Dict[str, Any]) -> Dict[str, Any]:
        """Process technical data and provide engineering insights"""
        try:
            tech_prompt = f"""
            Analyze this technical data and provide engineering insights:
            
            Technical Information: {technical_info}
            
            Provide:
            1. Technical assessment
            2. Potential issues or concerns
            3. Optimization recommendations
            4. Implementation considerations
            """
            
            response = self._call_claude(tech_prompt)
            
            return {
                "status": "success",
                "technical_analysis": response,
                "agent": "Commander Data",
                "methodology": "technical_analysis"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "agent": "Commander Data"
            }

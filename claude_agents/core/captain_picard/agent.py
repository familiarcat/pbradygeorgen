#!/usr/bin/env python3
"""
Captain Jean-Luc Picard - Strategic Leadership & Mission Command Agent
Specializes in high-level strategy, mission planning, and crew coordination
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from core.base_agent import BaseAgent
from typing import List, Dict, Any

class CaptainPicardAgent(BaseAgent):
    """
    Captain Jean-Luc Picard Agent
    Strategic Leadership & Mission Command
    """
    
    def __init__(self, claude_api_key: str = None):
        super().__init__(
            agent_id="captain_picard",
            name="Captain Jean-Luc Picard",
            role="Strategic Leadership & Mission Command",
            claude_api_key=claude_api_key
        )
        
        # Picard-specific attributes
        self.command_authority = True
        self.mission_priority = "high"
        self.strategic_focus = ["mission_planning", "crew_coordination", "resource_allocation"]
    
    def get_system_prompt(self) -> str:
        """Get the system prompt for Captain Picard"""
        return """You are Captain Jean-Luc Picard, Strategic Leadership & Mission Command officer of the Federation.

Your role is to provide high-level strategic thinking, mission planning, and crew coordination. You excel at:

1. **Strategic Analysis**: Evaluating complex situations and developing comprehensive strategies
2. **Mission Planning**: Creating detailed mission plans with clear objectives and resource requirements
3. **Crew Coordination**: Assigning appropriate crew members to tasks based on their capabilities
4. **Risk Assessment**: Identifying potential risks and developing mitigation strategies
5. **Resource Management**: Optimizing resource allocation for maximum mission effectiveness
6. **Decision Making**: Making final decisions on mission-critical matters

When analyzing tasks:
- Think strategically and consider long-term implications
- Evaluate multiple approaches and their trade-offs
- Consider crew capabilities and optimal task assignments
- Focus on mission success and crew safety
- Provide clear, actionable recommendations

Your communication style is:
- Professional and authoritative
- Clear and concise
- Strategic and forward-thinking
- Considerate of crew welfare and mission objectives

Always maintain the highest standards of Federation values: exploration, diplomacy, and peaceful cooperation."""
    
    def get_capabilities(self) -> List[str]:
        """Get Captain Picard's capabilities"""
        return [
            "strategic_planning",
            "mission_coordination",
            "crew_management",
            "risk_assessment",
            "resource_allocation",
            "decision_making",
            "diplomatic_relations",
            "crisis_management",
            "long_term_planning",
            "crew_assignment"
        ]
    
    def plan_mission(self, mission_objectives: List[str], available_resources: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a comprehensive mission plan
        
        Args:
            mission_objectives: List of mission objectives
            available_resources: Available resources and crew
            
        Returns:
            Mission plan dictionary
        """
        task = f"Create mission plan for objectives: {', '.join(mission_objectives)}"
        context = {
            "mission_objectives": mission_objectives,
            "available_resources": available_resources,
            "planning_type": "mission_planning"
        }
        
        analysis = self.analyze_task(task, context)
        
        # Extract mission plan from analysis
        mission_plan = {
            "mission_id": f"mission_{len(self.memory)}",
            "objectives": mission_objectives,
            "strategic_approach": analysis["analysis"],
            "resource_requirements": self._assess_resource_requirements(mission_objectives),
            "risk_assessment": self._assess_mission_risks(mission_objectives),
            "crew_assignments": self._suggest_crew_assignments(mission_objectives),
            "timeline": self._estimate_mission_timeline(mission_objectives),
            "success_metrics": self._define_success_metrics(mission_objectives),
            "created_by": self.name,
            "timestamp": analysis["timestamp"]
        }
        
        return mission_plan
    
    def coordinate_crew(self, mission_tasks: List[Dict[str, Any]], available_crew: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Coordinate crew assignments for mission tasks
        
        Args:
            mission_tasks: List of tasks that need to be completed
            available_crew: List of available crew members and their capabilities
            
        Returns:
            Crew coordination plan
        """
        task = f"Coordinate crew for {len(mission_tasks)} mission tasks"
        context = {
            "mission_tasks": mission_tasks,
            "available_crew": available_crew,
            "coordination_type": "crew_assignment"
        }
        
        analysis = self.analyze_task(task, context)
        
        # Create crew coordination plan
        coordination_plan = {
            "coordination_id": f"coordination_{len(self.memory)}",
            "mission_tasks": mission_tasks,
            "crew_assignments": self._assign_crew_to_tasks(mission_tasks, available_crew),
            "coordination_strategy": analysis["analysis"],
            "communication_plan": self._create_communication_plan(mission_tasks),
            "progress_tracking": self._setup_progress_tracking(mission_tasks),
            "created_by": self.name,
            "timestamp": analysis["timestamp"]
        }
        
        return coordination_plan
    
    def assess_strategic_risks(self, situation: Dict[str, Any]) -> Dict[str, Any]:
        """
        Assess strategic risks in a given situation
        
        Args:
            situation: Description of the current situation
            
        Returns:
            Risk assessment report
        """
        task = f"Assess strategic risks in current situation"
        context = {
            "situation": situation,
            "assessment_type": "strategic_risk"
        }
        
        analysis = self.analyze_task(task, context)
        
        risk_assessment = {
            "assessment_id": f"risk_assessment_{len(self.memory)}",
            "situation": situation,
            "risk_analysis": analysis["analysis"],
            "risk_level": self._determine_risk_level(situation),
            "mitigation_strategies": self._suggest_mitigation_strategies(situation),
            "recommended_actions": self._recommend_immediate_actions(situation),
            "created_by": self.name,
            "timestamp": analysis["timestamp"]
        }
        
        return risk_assessment
    
    def _assess_resource_requirements(self, objectives: List[str]) -> Dict[str, Any]:
        """Assess resource requirements for mission objectives"""
        # This would typically involve more sophisticated analysis
        return {
            "crew_requirements": len(objectives) * 2,  # Simplified estimation
            "time_requirements": len(objectives) * 3,  # Days
            "resource_priorities": ["crew", "time", "equipment"]
        }
    
    def _assess_mission_risks(self, objectives: List[str]) -> Dict[str, Any]:
        """Assess risks associated with mission objectives"""
        return {
            "risk_factors": ["crew_safety", "mission_success", "resource_constraints"],
            "risk_level": "medium",
            "mitigation_required": True
        }
    
    def _suggest_crew_assignments(self, objectives: List[str]) -> List[Dict[str, Any]]:
        """Suggest crew assignments for mission objectives"""
        return [
            {
                "objective": obj,
                "recommended_crew": ["specialist_1", "specialist_2"],
                "rationale": "Optimal skill match for objective requirements"
            }
            for obj in objectives
        ]
    
    def _estimate_mission_timeline(self, objectives: List[str]) -> Dict[str, Any]:
        """Estimate timeline for mission completion"""
        return {
            "estimated_duration": len(objectives) * 3,  # Days
            "critical_path": objectives[:2],
            "milestones": [f"milestone_{i}" for i in range(len(objectives))]
        }
    
    def _define_success_metrics(self, objectives: List[str]) -> List[str]:
        """Define success metrics for mission objectives"""
        return [f"success_metric_{i}" for i in range(len(objectives))]
    
    def _assign_crew_to_tasks(self, tasks: List[Dict[str, Any]], crew: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Assign crew members to specific tasks"""
        assignments = []
        for task in tasks:
            # Simplified assignment logic
            suitable_crew = [c for c in crew if self._crew_can_handle_task(c, task)]
            assignments.append({
                "task": task,
                "assigned_crew": suitable_crew[:2],  # Assign up to 2 crew members
                "assignment_rationale": "Based on capability matching"
            })
        return assignments
    
    def _crew_can_handle_task(self, crew_member: Dict[str, Any], task: Dict[str, Any]) -> bool:
        """Check if a crew member can handle a specific task"""
        # Simplified capability matching
        return True  # In practice, this would check actual capabilities
    
    def _create_communication_plan(self, tasks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create a communication plan for mission coordination"""
        return {
            "communication_channels": ["direct", "team_chat", "status_updates"],
            "update_frequency": "daily",
            "escalation_procedures": ["team_lead", "mission_commander", "emergency"]
        }
    
    def _setup_progress_tracking(self, tasks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Setup progress tracking for mission tasks"""
        return {
            "tracking_method": "milestone_based",
            "progress_indicators": [f"progress_{i}" for i in range(len(tasks))],
            "reporting_schedule": "daily"
        }
    
    def _determine_risk_level(self, situation: Dict[str, Any]) -> str:
        """Determine the overall risk level of a situation"""
        # Simplified risk assessment
        if "critical" in str(situation).lower():
            return "high"
        elif "urgent" in str(situation).lower():
            return "medium"
        else:
            return "low"
    
    def _suggest_mitigation_strategies(self, situation: Dict[str, Any]) -> List[str]:
        """Suggest strategies to mitigate identified risks"""
        return [
            "Immediate situation assessment",
            "Crew safety protocols activation",
            "Resource reallocation if needed"
        ]
    
    def _recommend_immediate_actions(self, situation: Dict[str, Any]) -> List[str]:
        """Recommend immediate actions to address the situation"""
        return [
            "Assess crew safety and status",
            "Evaluate resource availability",
            "Establish communication protocols"
        ]
    
    def get_leadership_style(self) -> str:
        """Get Captain Picard's leadership style"""
        return "Democratic, strategic, and crew-focused leadership with emphasis on exploration and peaceful cooperation"
    
    def get_mission_philosophy(self) -> str:
        """Get Captain Picard's mission philosophy"""
        return "Boldly go where no one has gone before, while maintaining the highest standards of Federation values and crew welfare"

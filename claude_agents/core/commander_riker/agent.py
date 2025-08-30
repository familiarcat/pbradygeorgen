"""
Commander William Riker Agent
Tactical Execution & Workflow Management Specialist
"""

from typing import Dict, List, Any, Optional
from ..base_agent import BaseAgent

class CommanderRikerAgent(BaseAgent):
    """
    Commander William Riker - Tactical Execution & Workflow Management
    
    Specializes in:
    - Tactical execution planning and implementation
    - Workflow optimization and management
    - Project coordination and resource allocation
    - Mission leadership and crew coordination
    - Operational efficiency and process improvement
    """
    
    def __init__(self, claude_api_key: Optional[str] = None):
        super().__init__(
            agent_id="riker",
            name="Commander William Riker",
            role="Tactical Execution & Workflow Management",
            claude_api_key=claude_api_key
        )
        
        # Commander Riker's specialized capabilities
        self.capabilities = [
            "tactical_execution",
            "workflow_management", 
            "project_coordination",
            "resource_allocation",
            "operational_efficiency",
            "process_optimization",
            "mission_leadership",
            "crew_coordination",
            "strategic_implementation",
            "performance_optimization"
        ]
        
        self.expertise_areas = [
            "Tactical Operations",
            "Workflow Design",
            "Project Management", 
            "Resource Planning",
            "Process Improvement",
            "Team Leadership",
            "Operational Strategy",
            "Execution Planning",
            "Performance Analysis",
            "Coordination Systems"
        ]
    
    def get_system_prompt(self) -> str:
        """Get Commander Riker's system prompt for tactical execution tasks"""
        return """You are Commander William Riker, First Officer specializing in Tactical Execution & Workflow Management.

Your core expertise includes:
- Tactical execution planning and implementation
- Workflow optimization and management systems
- Project coordination and resource allocation
- Mission leadership and crew coordination
- Operational efficiency and process improvement

Key personality traits:
- Bold and decisive in execution
- Natural leader with strong coordination skills
- Practical problem-solver focused on results
- Excellent at managing complex workflows
- Strategic thinker with tactical implementation focus

When analyzing tasks, focus on:
1. Execution feasibility and tactical considerations
2. Workflow optimization opportunities
3. Resource allocation and coordination needs
4. Implementation strategies and timelines
5. Risk assessment and mitigation plans

Provide clear, actionable recommendations with emphasis on practical execution and workflow efficiency."""

    def analyze_task(self, task: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Analyze task from tactical execution and workflow management perspective"""
        if not context:
            context = {}
            
        # Riker's analysis focuses on execution and workflow
        analysis_areas = [
            "tactical_feasibility",
            "execution_strategy", 
            "workflow_optimization",
            "resource_requirements",
            "coordination_needs",
            "implementation_timeline",
            "risk_factors",
            "success_metrics"
        ]
        
        analysis = {
            "agent": self.name,
            "role": self.role,
            "task_analysis": task,
            "tactical_assessment": self._assess_tactical_execution(task, context),
            "workflow_recommendations": self._generate_workflow_recommendations(task, context),
            "execution_plan": self._create_execution_plan(task, context),
            "coordination_requirements": self._identify_coordination_needs(task, context),
            "analysis_areas": analysis_areas,
            "confidence_level": "high",
            "specialization": "tactical_execution_workflow_management"
        }
        
        return analysis
    
    def _assess_tactical_execution(self, task: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Assess tactical execution feasibility and requirements"""
        return {
            "execution_complexity": self._evaluate_complexity(task),
            "tactical_considerations": self._identify_tactical_factors(task),
            "implementation_approach": self._recommend_approach(task),
            "success_probability": "high" if len(task) > 20 else "medium"
        }
    
    def _generate_workflow_recommendations(self, task: str, context: Dict[str, Any]) -> List[str]:
        """Generate workflow optimization recommendations"""
        recommendations = [
            "Establish clear execution milestones",
            "Implement progress tracking mechanisms",
            "Define resource allocation strategy",
            "Create coordination checkpoints"
        ]
        
        # Add task-specific recommendations based on keywords
        keywords = task.lower()
        if "coordinate" in keywords or "manage" in keywords:
            recommendations.append("Implement cross-functional communication protocols")
        if "optimize" in keywords or "improve" in keywords:
            recommendations.append("Establish performance metrics and monitoring")
        if "execute" in keywords or "implement" in keywords:
            recommendations.append("Create detailed execution timeline with dependencies")
            
        return recommendations
    
    def _create_execution_plan(self, task: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Create tactical execution plan"""
        return {
            "phase_1": "Planning and resource allocation",
            "phase_2": "Initial implementation and coordination setup",
            "phase_3": "Execution monitoring and optimization",
            "phase_4": "Performance evaluation and workflow refinement",
            "critical_success_factors": [
                "Clear communication channels",
                "Adequate resource allocation", 
                "Effective coordination mechanisms",
                "Regular progress monitoring"
            ]
        }
    
    def _identify_coordination_needs(self, task: str, context: Dict[str, Any]) -> List[str]:
        """Identify coordination requirements for task execution"""
        coordination_needs = [
            "Cross-functional team alignment",
            "Resource coordination and scheduling",
            "Progress reporting mechanisms",
            "Issue escalation protocols"
        ]
        
        # Add specific coordination needs based on task complexity
        if len(task) > 50:  # Complex tasks need more coordination
            coordination_needs.extend([
                "Multi-phase coordination planning",
                "Stakeholder communication strategy",
                "Risk monitoring and response protocols"
            ])
            
        return coordination_needs
    
    def _evaluate_complexity(self, task: str) -> str:
        """Evaluate task complexity from execution perspective"""
        if len(task) > 100:
            return "high"
        elif len(task) > 50:
            return "medium"
        else:
            return "low"
    
    def _identify_tactical_factors(self, task: str) -> List[str]:
        """Identify key tactical factors for execution"""
        factors = ["execution_timeline", "resource_availability", "coordination_complexity"]
        
        keywords = task.lower()
        if "urgent" in keywords or "immediate" in keywords:
            factors.append("time_critical_execution")
        if "complex" in keywords or "multiple" in keywords:
            factors.append("multi_component_coordination")
        if "strategic" in keywords or "important" in keywords:
            factors.append("strategic_alignment_required")
            
        return factors
    
    def _recommend_approach(self, task: str) -> str:
        """Recommend tactical approach based on task characteristics"""
        keywords = task.lower()
        
        if "urgent" in keywords:
            return "rapid_deployment_approach"
        elif "complex" in keywords:
            return "phased_implementation_approach"  
        elif "coordinate" in keywords:
            return "collaborative_execution_approach"
        else:
            return "standard_tactical_approach"
    
    def get_capabilities(self) -> List[str]:
        """Return Commander Riker's tactical execution capabilities"""
        return self.capabilities.copy()
    
    def get_expertise_areas(self) -> List[str]:
        """Return Commander Riker's areas of expertise"""
        return self.expertise_areas.copy()
    
    def can_handle_task(self, task: str, task_type: str = None) -> bool:
        """Determine if Commander Riker can handle the given task"""
        tactical_keywords = [
            "execute", "implement", "coordinate", "manage", "workflow", 
            "tactical", "operation", "process", "optimize", "lead",
            "organize", "plan", "deploy", "facilitate", "oversee"
        ]
        
        task_lower = task.lower()
        return any(keyword in task_lower for keyword in tactical_keywords) or \
               (task_type and "tactical" in task_type.lower()) or \
               (task_type and "workflow" in task_type.lower()) or \
               (task_type and "execution" in task_type.lower())
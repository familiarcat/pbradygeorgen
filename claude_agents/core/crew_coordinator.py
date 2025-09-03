#!/usr/bin/env python3
"""
Crew Coordinator - Observation Lounge System
Coordinates all crew members for collaborative discussions and decision-making
"""

import sys
import os
import json
import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime
import anthropic

# Add the parent directory to the path to import base_agent
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from core.base_agent import BaseAgent

class CrewCoordinator:
    """
    Crew Coordinator for the Observation Lounge
    Manages crew member interactions and collaborative discussions
    """
    
    def __init__(self, claude_api_key: str = None):
        self.claude_api_key = claude_api_key
        if self.claude_api_key:
            self.claude_client = anthropic.Anthropic(api_key=self.claude_api_key)
        else:
            self.claude_client = None
            print("Warning: No Claude API key provided", file=sys.stderr)
        
        # Initialize crew members
        self.crew_members = self._initialize_crew_members()
        print(f"🚀 Crew Coordinator initialized with {len(self.crew_members)} crew members", file=sys.stderr)
    
    def _initialize_crew_members(self) -> Dict[str, Dict[str, Any]]:
        """Initialize all crew members with their specializations"""
        return {
            "captain_picard": {
                "name": "Captain Jean-Luc Picard",
                "role": "Strategic Leadership & Mission Command",
                "specialization": "High-level strategy, mission planning, and crew coordination",
                "capabilities": ["strategic_planning", "mission_coordination", "crew_management", "risk_assessment", "resource_allocation", "decision_making", "diplomatic_relations", "crisis_management", "long_term_planning", "crew_assignment"],
                "department": "Command",
                "confidence": 0.98,
                "agent_path": "captain_picard/agent.py"
            },
            "commander_data": {
                "name": "Commander Data",
                "role": "Scientific Analysis & Logical Reasoning",
                "specialization": "Complex problem analysis, logical reasoning, and data processing",
                "capabilities": ["scientific_analysis", "logical_reasoning", "data_processing", "technical_expertise", "pattern_recognition", "research_methodology", "objective_analysis", "problem_solving"],
                "department": "Operations",
                "confidence": 0.99,
                "agent_path": "commander_data/agent.py"
            },
            "geordi_la_forge": {
                "name": "Lieutenant Commander Geordi La Forge",
                "role": "Chief Engineer",
                "specialization": "Engineering problem-solving, systems optimization, and technical innovation",
                "capabilities": ["engineering_analysis", "technical_troubleshooting", "systems_optimization", "problem_solving", "innovation_engineering", "team_leadership", "creative_solutions", "performance_optimization"],
                "department": "Engineering",
                "confidence": 0.98,
                "agent_path": "geordi_la_forge/agent.py"
            },
            "lieutenant_worf": {
                "name": "Lieutenant Worf",
                "role": "Tactical Officer & Security Chief",
                "specialization": "Tactical analysis, security operations, and threat assessment",
                "capabilities": ["tactical_analysis", "security_operations", "threat_assessment", "combat_strategy", "defensive_planning", "risk_mitigation", "warrior_philosophy", "direct_action"],
                "department": "Tactical",
                "confidence": 0.97,
                "agent_path": "lieutenant_worf/agent.py"
            },
            "counselor_troi": {
                "name": "Counselor Deanna Troi",
                "role": "Ship's Counselor",
                "specialization": "Psychological analysis, emotional intelligence, and interpersonal dynamics",
                "capabilities": ["psychological_analysis", "emotional_intelligence", "conflict_resolution", "interpersonal_dynamics", "behavioral_analysis", "team_cohesion", "empathy", "communication"],
                "department": "Counseling",
                "confidence": 0.96,
                "agent_path": "counselor_troi/agent.py"
            },
            "dr_crusher": {
                "name": "Dr. Beverly Crusher",
                "role": "Chief Medical Officer",
                "specialization": "Medical diagnosis, health assessment, and biological analysis",
                "capabilities": ["medical_analysis", "health_assessment", "biological_research", "diagnostic_reasoning", "treatment_planning", "medical_ethics", "patient_care", "research_methodology"],
                "department": "Medical",
                "confidence": 0.97,
                "agent_path": "dr_crusher/agent.py"
            },
            "content_analyst": {
                "name": "Content Analyst",
                "role": "Content Analysis & Communication Specialist",
                "specialization": "Content analysis, communication strategy, and information processing",
                "capabilities": ["content_analysis", "communication_strategy", "information_processing", "narrative_development", "audience_analysis", "content_optimization", "clarity_enhancement"],
                "department": "Communications",
                "confidence": 0.95,
                "agent_path": "content_analyst/agent.py"
            },
            "commander_riker": {
                "name": "Commander William Riker",
                "role": "Executive Officer",
                "specialization": "Operational execution, team coordination, and mission implementation",
                "capabilities": ["operational_execution", "team_coordination", "mission_implementation", "leadership", "decision_making", "resource_management", "crisis_response", "crew_motivation"],
                "department": "Operations",
                "confidence": 0.97,
                "agent_path": "commander_riker/agent.py"
            },
            "lieutenant_uhura": {
                "name": "Lieutenant Uhura",
                "role": "Communications Officer",
                "specialization": "Communication systems, linguistic analysis, and cultural interpretation",
                "capabilities": ["communications_analysis", "linguistic_analysis", "cultural_interpretation", "signal_processing", "protocol_management", "intercultural_communication", "translation_services"],
                "department": "Communications",
                "confidence": 0.96,
                "agent_path": "lieutenant_uhura/agent.py"
            },
            "quark": {
                "name": "Quark",
                "role": "Business & Negotiation Specialist",
                "specialization": "Business analysis, negotiation strategy, and deal-making",
                "capabilities": ["business_analysis", "negotiation_strategy", "deal_making", "market_analysis", "profit_optimization", "relationship_building", "contract_analysis"],
                "department": "Business",
                "confidence": 0.94,
                "agent_path": "quark/agent.py"
            }
        }
    
    async def convene_observation_lounge(self, topic: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Convene all crew members in the Observation Lounge for collaborative discussion
        
        Args:
            topic: The topic for discussion
            context: Additional context for the discussion
            
        Returns:
            Collaborative discussion results from all crew members
        """
        print(f"🚀 Convening Observation Lounge for topic: {topic}", file=sys.stderr)
        
        # Prepare the discussion framework
        discussion_framework = self._prepare_discussion_framework(topic, context)
        
        # Get insights from each crew member
        crew_insights = {}
        for crew_id, crew_info in self.crew_members.items():
            try:
                insight = await self._get_crew_member_insight(crew_id, crew_info, discussion_framework)
                crew_insights[crew_id] = insight
                print(f"✅ {crew_info['name']} provided insight", file=sys.stderr)
            except Exception as e:
                print(f"⚠️ {crew_info['name']} encountered an issue: {str(e)}", file=sys.stderr)
                crew_insights[crew_id] = {
                    "status": "error",
                    "error": str(e),
                    "crew_member": crew_info['name']
                }
        
        # Synthesize all insights in the Observation Lounge
        synthesis = await self._synthesize_observation_lounge_discussion(topic, crew_insights, context)
        
        return {
            "observation_lounge_session": {
                "topic": topic,
                "timestamp": datetime.now().isoformat(),
                "participants": len([i for i in crew_insights.values() if i.get("status") == "success"]),
                "total_crew": len(self.crew_members),
                "session_status": "completed"
            },
            "crew_insights": crew_insights,
            "synthesis": synthesis,
            "recommendations": synthesis.get("recommendations", []),
            "next_actions": synthesis.get("next_actions", [])
        }
    
    def _prepare_discussion_framework(self, topic: str, context: Dict[str, Any] = None) -> str:
        """Prepare the discussion framework for crew members"""
        context_str = json.dumps(context, indent=2) if context else "None"
        
        return f"""
TOPIC FOR OBSERVATION LOUNGE DISCUSSION: {topic}

CONTEXT: {context_str}

DISCUSSION FRAMEWORK:
1. Analyze the topic from your department's perspective
2. Identify key challenges and opportunities
3. Provide actionable recommendations
4. Suggest next steps for implementation
5. Consider how this affects other departments

Please provide your insights in the format:
- Department Perspective: [Your view]
- Key Analysis: [Your analysis]
- Recommendations: [Your recommendations]
- Next Steps: [Your suggested actions]
- Interdepartmental Impact: [How this affects other areas]

Remember: You are part of a unified crew working together for the success of the mission.
"""
    
    async def _get_crew_member_insight(self, crew_id: str, crew_info: Dict[str, Any], discussion_framework: str) -> Dict[str, Any]:
        """Get insight from a specific crew member"""
        if not self.claude_client:
            return {
                "status": "error",
                "error": "Claude client not available",
                "crew_member": crew_info['name']
            }
        
        try:
            # Create crew member specific prompt
            crew_prompt = f"""You are {crew_info['name']}, {crew_info['role']} from the Star Trek crew.

Your specialization: {crew_info['specialization']}
Your capabilities: {', '.join(crew_info['capabilities'])}
Your department: {crew_info['department']}

You are now in the Observation Lounge for a crew discussion. Please provide your insights based on your expertise and department perspective.

{discussion_framework}

Respond as {crew_info['name']}, maintaining your character and expertise. Be specific, actionable, and consider how your insights impact the entire crew and mission success."""

            # Get response from Claude
            response = await asyncio.to_thread(
                self.claude_client.messages.create,
                model="claude-3-5-sonnet-20241022",
                max_tokens=2000,
                system=crew_prompt,
                messages=[{"role": "user", "content": discussion_framework}]
            )
            
            return {
                "status": "success",
                "crew_member": crew_info['name'],
                "department": crew_info['department'],
                "role": crew_info['role'],
                "insight": response.content[0].text,
                "confidence": crew_info['confidence'],
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "crew_member": crew_info['name']
            }
    
    async def _synthesize_observation_lounge_discussion(self, topic: str, crew_insights: Dict[str, Any], context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Synthesize all crew insights in the Observation Lounge"""
        if not self.claude_client:
            return {
                "status": "error",
                "error": "Claude client not available for synthesis"
            }
        
        try:
            # Prepare synthesis prompt
            successful_insights = [insight for insight in crew_insights.values() if insight.get("status") == "success"]
            
            insights_summary = "\n\n".join([
                f"=== {insight['crew_member']} ({insight['department']}) ===\n{insight['insight']}"
                for insight in successful_insights
            ])
            
            synthesis_prompt = f"""You are the Observation Lounge Coordinator, synthesizing insights from all crew members.

TOPIC: {topic}
CONTEXT: {json.dumps(context, indent=2) if context else 'None'}

CREW INSIGHTS:
{insights_summary}

Please synthesize these insights and provide:
1. Executive Summary: Key points from the discussion
2. Consensus Areas: Where crew members agree
3. Divergent Views: Different perspectives and why they exist
4. Recommendations: Prioritized actionable recommendations
5. Next Actions: Specific next steps with timelines
6. Risk Assessment: Potential challenges and mitigation strategies
7. Success Metrics: How to measure success

Format your response clearly with these sections."""

            # Get synthesis from Claude
            response = await asyncio.to_thread(
                self.claude_client.messages.create,
                model="claude-3-5-sonnet-20241022",
                max_tokens=3000,
                system="You are the Observation Lounge Coordinator, expert at synthesizing diverse crew insights into actionable plans.",
                messages=[{"role": "user", "content": synthesis_prompt}]
            )
            
            return {
                "status": "success",
                "synthesis": response.content[0].text,
                "participants": len(successful_insights),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }
    
    def get_crew_status(self) -> Dict[str, Any]:
        """Get comprehensive crew status"""
        return {
            "total_crew_members": len(self.crew_members),
            "departments": list(set([crew["department"] for crew in self.crew_members.values()])),
            "crew_members": {
                crew_id: {
                    "name": crew["name"],
                    "role": crew["role"],
                    "department": crew["department"],
                    "confidence": crew["confidence"],
                    "capabilities": crew["capabilities"]
                }
                for crew_id, crew in self.crew_members.items()
            },
            "system_status": "operational",
            "observation_lounge_ready": True
        }
    
    async def get_crew_member_recommendation(self, crew_id: str, task: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Get a specific recommendation from a crew member"""
        if crew_id not in self.crew_members:
            return {
                "status": "error",
                "error": f"Crew member {crew_id} not found"
            }
        
        crew_info = self.crew_members[crew_id]
        return await self._get_crew_member_insight(crew_id, crew_info, f"TASK: {task}\n\nCONTEXT: {json.dumps(context, indent=2) if context else 'None'}")

# Convenience function for N8N integration
async def convene_crew_discussion(topic: str, context: Dict[str, Any] = None, claude_api_key: str = None) -> Dict[str, Any]:
    """Convene crew discussion for N8N integration"""
    coordinator = CrewCoordinator(claude_api_key)
    return await coordinator.convene_observation_lounge(topic, context)

# Main execution for testing
if __name__ == "__main__":
    import asyncio
    
    async def test_observation_lounge():
        coordinator = CrewCoordinator()
        
        # Test crew status
        status = coordinator.get_crew_status()
        print("Crew Status:", json.dumps(status, indent=2))
        
        # Test observation lounge
        result = await coordinator.convene_observation_lounge(
            "Implementing AI-powered code review system",
            {
                "current_state": "Manual code review process",
                "goals": ["Improve code quality", "Reduce review time", "Increase consistency"],
                "constraints": ["Must integrate with existing tools", "Budget limited"]
            }
        )
        
        print("Observation Lounge Result:", json.dumps(result, indent=2))
    
    asyncio.run(test_observation_lounge())

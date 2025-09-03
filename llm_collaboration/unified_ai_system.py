#!/usr/bin/env python3
"""
Unified AI System
Combines Star Trek Crew System with Claude Sub-Agent System for comprehensive AI collaboration
"""

import os
import json
import sys
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path

# Add paths for imports
workspace_root = Path(__file__).parent.parent
sys.path.append(str(workspace_root))
sys.path.append(str(workspace_root / "claude_agents"))

try:
    from simple_sub_agent_orchestrator import SimpleSubAgentOrchestrator
    from claude_agents.coordination.observation_lounge.coordinator import ObservationLoungeCoordinator
except ImportError as e:
    print(f"Warning: Could not import all components: {e}")
    # Fallback to basic functionality
    SimpleSubAgentOrchestrator = None
    ObservationLoungeCoordinator = None

class UnifiedAISystem:
    """Unified system combining Star Trek Crew and Claude Sub-Agents"""
    
    def __init__(self):
        """Initialize the unified AI system"""
        self.system_name = "Unified AI System"
        self.version = "1.0.0"
        self.timestamp = datetime.now().isoformat()
        
        # Initialize subsystems
        self.sub_agent_system = None
        self.crew_system = None
        self.available_systems = []
        
        # Initialize Sub-Agent System
        try:
            if SimpleSubAgentOrchestrator:
                self.sub_agent_system = SimpleSubAgentOrchestrator()
                self.available_systems.append("claude_sub_agents")
                print("✅ Claude Sub-Agent System initialized")
        except Exception as e:
            print(f"⚠️ Claude Sub-Agent System initialization failed: {e}")
        
        # Initialize Star Trek Crew System
        try:
            if ObservationLoungeCoordinator:
                self.crew_system = ObservationLoungeCoordinator()
                self.available_systems.append("star_trek_crew")
                print("✅ Star Trek Crew System initialized")
        except Exception as e:
            print(f"⚠️ Star Trek Crew System initialization failed: {e}")
        
        print(f"🚀 Unified AI System initialized with {len(self.available_systems)} subsystems")
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get comprehensive status of all AI systems"""
        status = {
            "system_name": self.system_name,
            "version": self.version,
            "timestamp": self.timestamp,
            "available_systems": self.available_systems,
            "subsystems": {}
        }
        
        # Sub-Agent System Status
        if self.sub_agent_system:
            try:
                sub_agent_status = self.sub_agent_system.get_agent_status()
                status["subsystems"]["claude_sub_agents"] = {
                    "status": "active",
                    "total_agents": sub_agent_status["total_agents"],
                    "active_agents": sub_agent_status["active_agents"],
                    "agent_types": list(sub_agent_status["agents"].keys())
                }
            except Exception as e:
                status["subsystems"]["claude_sub_agents"] = {
                    "status": "error",
                    "error": str(e)
                }
        
        # Star Trek Crew System Status
        if self.crew_system:
            try:
                crew_status = self.crew_system.get_crew_status()
                status["subsystems"]["star_trek_crew"] = {
                    "status": "active",
                    "total_crew": crew_status["total_crew"],
                    "crew_members": list(crew_status["crew_members"].keys())
                }
            except Exception as e:
                status["subsystems"]["star_trek_crew"] = {
                    "status": "error",
                    "error": str(e)
                }
        
        return status
    
    def get_all_agents(self) -> Dict[str, Any]:
        """Get all available agents from both systems"""
        all_agents = {
            "claude_sub_agents": {},
            "star_trek_crew": {},
            "total_agents": 0
        }
        
        # Get Sub-Agents
        if self.sub_agent_system:
            try:
                sub_agent_status = self.sub_agent_system.get_agent_status()
                all_agents["claude_sub_agents"] = sub_agent_status["agents"]
                all_agents["total_agents"] += sub_agent_status["total_agents"]
            except Exception as e:
                all_agents["claude_sub_agents"] = {"error": str(e)}
        
        # Get Star Trek Crew
        if self.crew_system:
            try:
                crew_status = self.crew_system.get_crew_status()
                all_agents["star_trek_crew"] = crew_status["crew_members"]
                all_agents["total_agents"] += crew_status["total_crew"]
            except Exception as e:
                all_agents["star_trek_crew"] = {"error": str(e)}
        
        return all_agents
    
    def coordinate_unified_mission(
        self, 
        mission_brief: str,
        use_sub_agents: bool = True,
        use_crew: bool = True,
        specific_agents: List[str] = None
    ) -> Dict[str, Any]:
        """Coordinate a mission using both AI systems"""
        
        mission_id = f"unified_mission_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        results = {
            "mission_id": mission_id,
            "mission_brief": mission_brief,
            "timestamp": datetime.now().isoformat(),
            "sub_agent_results": {},
            "crew_results": {},
            "unified_analysis": {}
        }
        
        # Execute with Sub-Agents
        if use_sub_agents and self.sub_agent_system:
            try:
                # Create collaboration session
                session = self.sub_agent_system.create_collaboration_session(
                    primary_task=mission_brief,
                    collaboration_mode="sequential"
                )
                
                # Assign tasks to relevant agents
                if specific_agents:
                    for agent_id in specific_agents:
                        if agent_id in self.sub_agent_system.sub_agents:
                            self.sub_agent_system.assign_task_to_agent(
                                session.session_id,
                                agent_id,
                                f"Analyze mission: {mission_brief}",
                                {"mission_type": "unified_coordination"}
                            )
                
                # Mock execute tasks
                for assignment in session.task_assignments:
                    result = self.sub_agent_system.mock_execute_agent_task(
                        assignment, 
                        {"session_id": session.session_id, "mission_id": mission_id}
                    )
                    results["sub_agent_results"][assignment.agent_id] = result
                
            except Exception as e:
                results["sub_agent_results"]["error"] = str(e)
        
        # Execute with Star Trek Crew
        if use_crew and self.crew_system:
            try:
                crew_requirements = specific_agents if specific_agents else None
                crew_result = self.crew_system.coordinate_mission(mission_brief, crew_requirements)
                results["crew_results"] = crew_result
            except Exception as e:
                results["crew_results"]["error"] = str(e)
        
        # Create unified analysis
        results["unified_analysis"] = self._synthesize_unified_results(results)
        
        return results
    
    def _synthesize_unified_results(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Synthesize results from both AI systems"""
        
        synthesis = {
            "total_contributors": 0,
            "key_insights": [],
            "recommendations": [],
            "system_contributions": {
                "sub_agents": 0,
                "crew_members": 0
            }
        }
        
        # Analyze Sub-Agent contributions
        if "sub_agent_results" in results and results["sub_agent_results"]:
            sub_agent_count = len([k for k in results["sub_agent_results"].keys() if k != "error"])
            synthesis["system_contributions"]["sub_agents"] = sub_agent_count
            synthesis["total_contributors"] += sub_agent_count
            
            # Extract insights from sub-agents
            for agent_id, result in results["sub_agent_results"].items():
                if agent_id != "error" and isinstance(result, dict) and result.get("success"):
                    synthesis["key_insights"].append(f"{agent_id}: {result.get('content', '')[:100]}...")
        
        # Analyze Crew contributions
        if "crew_results" in results and results["crew_results"]:
            if "crew_contributions" in results["crew_results"]:
                crew_count = len(results["crew_results"]["crew_contributions"])
                synthesis["system_contributions"]["crew_members"] = crew_count
                synthesis["total_contributors"] += crew_count
                
                # Extract insights from crew
                for crew_id, contribution in results["crew_results"]["crew_contributions"].items():
                    if "analysis" in contribution:
                        synthesis["key_insights"].append(f"{crew_id}: {str(contribution['analysis'])[:100]}...")
        
        # Generate unified recommendations
        synthesis["recommendations"] = [
            "Leverage both technical expertise (Sub-Agents) and strategic thinking (Crew)",
            "Use Sub-Agents for detailed implementation and Crew for high-level strategy",
            "Combine analytical precision with diplomatic and tactical insights",
            "Maintain balance between automation and human-like decision making"
        ]
        
        return synthesis
    
    def get_agent_capabilities_matrix(self) -> Dict[str, Any]:
        """Get a matrix of all agent capabilities across both systems"""
        
        capabilities_matrix = {
            "strategic_planning": [],
            "technical_implementation": [],
            "analysis_research": [],
            "communication_diplomacy": [],
            "security_tactical": [],
            "engineering_optimization": [],
            "business_financial": [],
            "medical_healthcare": [],
            "psychological_emotional": []
        }
        
        # Map Sub-Agent capabilities
        if self.sub_agent_system:
            sub_agent_mapping = {
                "strategic_analyst": ["strategic_planning"],
                "code_implementer": ["technical_implementation"],
                "visual_debugger": ["technical_implementation", "engineering_optimization"],
                "documentation_specialist": ["communication_diplomacy"],
                "research_analyst": ["analysis_research"],
                "testing_coordinator": ["technical_implementation"],
                "optimization_engineer": ["engineering_optimization"],
                "integration_specialist": ["technical_implementation", "engineering_optimization"]
            }
            
            for agent_id, capabilities in sub_agent_mapping.items():
                for capability in capabilities:
                    capabilities_matrix[capability].append(f"sub_agent:{agent_id}")
        
        # Map Crew capabilities
        if self.crew_system:
            crew_mapping = {
                "picard": ["strategic_planning", "communication_diplomacy"],
                "riker": ["strategic_planning", "technical_implementation"],
                "data": ["analysis_research", "technical_implementation"],
                "worf": ["security_tactical"],
                "geordi": ["engineering_optimization", "technical_implementation"],
                "troi": ["psychological_emotional", "communication_diplomacy"],
                "uhura": ["communication_diplomacy"],
                "crusher": ["medical_healthcare"],
                "quark": ["business_financial"]
            }
            
            for crew_id, capabilities in crew_mapping.items():
                for capability in capabilities:
                    capabilities_matrix[capability].append(f"crew:{crew_id}")
        
        return capabilities_matrix
    
    def recommend_optimal_team(
        self, 
        task_description: str,
        task_type: str = "general"
    ) -> Dict[str, Any]:
        """Recommend the optimal team composition for a task"""
        
        recommendations = {
            "task_description": task_description,
            "task_type": task_type,
            "recommended_team": {
                "sub_agents": [],
                "crew_members": [],
                "rationale": []
            },
            "alternative_teams": []
        }
        
        task_lower = task_description.lower()
        
        # Strategic/Tactical tasks
        if any(keyword in task_lower for keyword in ['strategy', 'planning', 'leadership', 'mission']):
            recommendations["recommended_team"]["crew_members"].extend(["picard", "riker"])
            recommendations["recommended_team"]["sub_agents"].append("strategic_analyst")
            recommendations["recommended_team"]["rationale"].append("Strategic tasks benefit from Picard's leadership and Riker's tactical execution")
        
        # Technical/Engineering tasks
        if any(keyword in task_lower for keyword in ['technical', 'engineering', 'code', 'implement', 'system']):
            recommendations["recommended_team"]["crew_members"].extend(["data", "geordi"])
            recommendations["recommended_team"]["sub_agents"].extend(["code_implementer", "optimization_engineer"])
            recommendations["recommended_team"]["rationale"].append("Technical tasks require Data's analysis and Geordi's engineering expertise")
        
        # Research/Analysis tasks
        if any(keyword in task_lower for keyword in ['research', 'analyze', 'investigate', 'study']):
            recommendations["recommended_team"]["crew_members"].append("data")
            recommendations["recommended_team"]["sub_agents"].append("research_analyst")
            recommendations["recommended_team"]["rationale"].append("Research tasks benefit from Data's logical analysis and research specialist expertise")
        
        # Security/Safety tasks
        if any(keyword in task_lower for keyword in ['security', 'safety', 'threat', 'risk', 'defense']):
            recommendations["recommended_team"]["crew_members"].append("worf")
            recommendations["recommended_team"]["sub_agents"].append("testing_coordinator")
            recommendations["recommended_team"]["rationale"].append("Security tasks require Worf's tactical expertise and testing coordination")
        
        # Communication/Diplomatic tasks
        if any(keyword in task_lower for keyword in ['communication', 'diplomatic', 'user', 'interface']):
            recommendations["recommended_team"]["crew_members"].extend(["uhura", "troi"])
            recommendations["recommended_team"]["sub_agents"].append("documentation_specialist")
            recommendations["recommended_team"]["rationale"].append("Communication tasks benefit from Uhura's diplomatic skills and Troi's empathy")
        
        # Business/Financial tasks
        if any(keyword in task_lower for keyword in ['business', 'financial', 'cost', 'profit', 'market']):
            recommendations["recommended_team"]["crew_members"].append("quark")
            recommendations["recommended_team"]["sub_agents"].append("optimization_engineer")
            recommendations["recommended_team"]["rationale"].append("Business tasks require Quark's financial expertise and optimization skills")
        
        # Remove duplicates
        recommendations["recommended_team"]["crew_members"] = list(set(recommendations["recommended_team"]["crew_members"]))
        recommendations["recommended_team"]["sub_agents"] = list(set(recommendations["recommended_team"]["sub_agents"]))
        
        return recommendations

def main():
    """Test the unified AI system"""
    
    print("🚀 UNIFIED AI SYSTEM")
    print("=" * 50)
    print("🌟 Combining Star Trek Crew with Claude Sub-Agents")
    print("")
    
    # Initialize the unified system
    unified_system = UnifiedAISystem()
    
    # Get system status
    status = unified_system.get_system_status()
    print(f"✅ System Status: {len(status['available_systems'])} subsystems active")
    
    # Get all agents
    all_agents = unified_system.get_all_agents()
    print(f"🤖 Total AI Agents Available: {all_agents['total_agents']}")
    print(f"   • Claude Sub-Agents: {len(all_agents['claude_sub_agents'])}")
    print(f"   • Star Trek Crew: {len(all_agents['star_trek_crew'])}")
    
    # Test unified mission coordination
    print("\n🎯 Testing Unified Mission Coordination...")
    mission_result = unified_system.coordinate_unified_mission(
        mission_brief="Design and implement a comprehensive AI collaboration system with security and performance optimization",
        use_sub_agents=True,
        use_crew=True
    )
    
    print(f"✅ Mission coordinated with {mission_result['unified_analysis']['total_contributors']} contributors")
    print(f"   • Sub-Agents: {mission_result['unified_analysis']['system_contributions']['sub_agents']}")
    print(f"   • Crew Members: {mission_result['unified_analysis']['system_contributions']['crew_members']}")
    
    # Test team recommendations
    print("\n🎯 Testing Team Recommendations...")
    team_rec = unified_system.recommend_optimal_team(
        task_description="Develop a secure, high-performance AI system with comprehensive testing and documentation",
        task_type="technical_development"
    )
    
    print(f"✅ Recommended Team:")
    print(f"   • Crew Members: {', '.join(team_rec['recommended_team']['crew_members'])}")
    print(f"   • Sub-Agents: {', '.join(team_rec['recommended_team']['sub_agents'])}")
    
    # Get capabilities matrix
    capabilities = unified_system.get_agent_capabilities_matrix()
    print(f"\n📊 Capabilities Matrix:")
    for capability, agents in capabilities.items():
        if agents:
            print(f"   • {capability}: {len(agents)} agents")
    
    print("\n🎉 UNIFIED AI SYSTEM READY!")
    print("✅ Both Star Trek Crew and Claude Sub-Agents integrated")
    print("✅ Unified mission coordination operational")
    print("✅ Team recommendation system active")
    print("✅ Comprehensive capabilities matrix available")
    
    return unified_system

if __name__ == "__main__":
    main()

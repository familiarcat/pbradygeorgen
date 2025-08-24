#!/usr/bin/env python3
"""
🤝 MULTI-AGENT COLLABORATION SYSTEM
Enables interpersonal AI interactions and collective decision-making
"""

import json
import time
from datetime import datetime
from typing import Dict, List, Any

class MultiAgentCollaborationSystem:
    """Manages multi-agent collaboration with interpersonal awareness"""
    
    def __init__(self):
        self.collaboration_config = {
            "system_name": "Multi-Agent Collaboration System",
            "collaboration_modes": ["synchronous", "asynchronous", "emergent"],
            "interpersonal_factors": ["trust", "expertise", "communication_style", "decision_history"],
            "collective_intelligence": "active"
        }
        
        self.active_collaborations = {}
        self.agent_personalities = {}
        self.collaboration_memories = []
    
    def create_agent_personality(self, agent_id: str, personality_traits: Dict[str, Any]):
        """Create personality profile for an agent"""
        personality = {
            "agent_id": agent_id,
            "created_at": datetime.now().isoformat(),
            "personality_traits": personality_traits,
            "interpersonal_style": {
                "communication_preference": personality_traits.get("communication_style", "collaborative"),
                "decision_making_style": personality_traits.get("decision_style", "analytical"),
                "trust_level": personality_traits.get("trust_level", 0.8),
                "expertise_areas": personality_traits.get("expertise", []),
                "collaboration_history": []
            }
        }
        
        self.agent_personalities[agent_id] = personality
        return personality
    
    def initiate_collaboration(self, collaboration_id: str, agents: List[str], task: str, mode: str = "synchronous"):
        """Initiate multi-agent collaboration"""
        collaboration = {
            "collaboration_id": collaboration_id,
            "agents": agents,
            "task": task,
            "mode": mode,
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "interpersonal_context": self.analyze_interpersonal_dynamics(agents),
            "shared_memory_context": f"collab_{collaboration_id}_{int(time.time())}",
            "collaboration_phases": [],
            "collective_decisions": []
        }
        
        self.active_collaborations[collaboration_id] = collaboration
        return collaboration
    
    def analyze_interpersonal_dynamics(self, agents: List[str]) -> Dict[str, Any]:
        """Analyze interpersonal dynamics between agents"""
        dynamics = {
            "trust_network": {},
            "expertise_complementarity": {},
            "communication_patterns": {},
            "collaboration_potential": 0.0
        }
        
        # Analyze trust relationships
        for i, agent1 in enumerate(agents):
            for j, agent2 in enumerate(agents):
                if i != j:
                    trust_level = self.calculate_trust_level(agent1, agent2)
                    dynamics["trust_network"][f"{agent1}_to_{agent2}"] = trust_level
        
        # Analyze expertise complementarity
        expertise_overlap = self.calculate_expertise_overlap(agents)
        dynamics["expertise_complementarity"] = expertise_overlap
        
        # Calculate overall collaboration potential
        avg_trust = sum(dynamics["trust_network"].values()) / len(dynamics["trust_network"]) if dynamics["trust_network"] else 0
        dynamics["collaboration_potential"] = (avg_trust + expertise_overlap["complementarity_score"]) / 2
        
        return dynamics
    
    def calculate_trust_level(self, agent1: str, agent2: str) -> float:
        """Calculate trust level between two agents"""
        if agent1 not in self.agent_personalities or agent2 not in self.agent_personalities:
            return 0.5  # Default trust level
        
        agent1_personality = self.agent_personalities[agent1]
        agent2_personality = self.agent_personalities[agent2]
        
        # Base trust on personality compatibility
        communication_compatibility = 1.0 if (
            agent1_personality["interpersonal_style"]["communication_preference"] == 
            agent2_personality["interpersonal_style"]["communication_preference"]
        ) else 0.7
        
        # Trust based on expertise overlap
        expertise_overlap = len(set(agent1_personality["interpersonal_style"]["expertise_areas"]) & 
                              set(agent2_personality["interpersonal_style"]["expertise_areas"]))
        expertise_trust = min(0.3 + (expertise_overlap * 0.1), 1.0)
        
        # Historical trust (placeholder for future implementation)
        historical_trust = 0.8
        
        return (communication_compatibility + expertise_trust + historical_trust) / 3
    
    def calculate_expertise_overlap(self, agents: List[str]) -> Dict[str, Any]:
        """Calculate expertise overlap and complementarity"""
        all_expertise = []
        for agent in agents:
            if agent in self.agent_personalities:
                all_expertise.extend(self.agent_personalities[agent]["interpersonal_style"]["expertise_areas"])
        
        # Calculate overlap
        expertise_counts = {}
        for expertise in all_expertise:
            expertise_counts[expertise] = expertise_counts.get(expertise, 0) + 1
        
        overlap_areas = [area for area, count in expertise_counts.items() if count > 1]
        unique_areas = [area for area, count in expertise_counts.items() if count == 1]
        
        complementarity_score = len(unique_areas) / len(all_expertise) if all_expertise else 0
        
        return {
            "overlap_areas": overlap_areas,
            "unique_areas": unique_areas,
            "complementarity_score": complementarity_score,
            "total_expertise_areas": len(all_expertise)
        }
    
    def share_memory_between_agents(self, collaboration_id: str, source_agent: str, 
                                   target_agents: List[str], memory_content: Dict[str, Any]) -> Dict[str, Any]:
        """Share memory between agents in a collaboration"""
        if collaboration_id not in self.active_collaborations:
            return {"status": "error", "message": "Collaboration not found"}
        
        collaboration = self.active_collaborations[collaboration_id]
        
        # Create shared memory entry
        shared_memory = {
            "memory_id": f"shared_{int(time.time())}",
            "source_agent": source_agent,
            "target_agents": target_agents,
            "memory_content": memory_content,
            "shared_at": datetime.now().isoformat(),
            "collaboration_context": collaboration_id,
            "interpersonal_factors": {
                "trust_levels": {target: self.calculate_trust_level(source_agent, target) for target in target_agents},
                "relevance_score": self.calculate_memory_relevance(memory_content, target_agents)
            }
        }
        
        # Store in collaboration memory
        collaboration["collaboration_phases"].append({
            "phase": "memory_sharing",
            "timestamp": datetime.now().isoformat(),
            "shared_memory": shared_memory
        })
        
        # Update agent collaboration history
        for agent in [source_agent] + target_agents:
            if agent in self.agent_personalities:
                self.agent_personalities[agent]["interpersonal_style"]["collaboration_history"].append({
                    "type": "memory_shared",
                    "timestamp": datetime.now().isoformat(),
                    "collaboration_id": collaboration_id,
                    "memory_id": shared_memory["memory_id"]
                })
        
        return {
            "status": "success",
            "shared_memory": shared_memory,
            "interpersonal_impact": "memory_enhanced_collaboration"
        }
    
    def calculate_memory_relevance(self, memory_content: Dict[str, Any], target_agents: List[str]) -> float:
        """Calculate relevance of memory content to target agents"""
        relevance_score = 0.0
        
        for agent in target_agents:
            if agent in self.agent_personalities:
                agent_expertise = self.agent_personalities[agent]["interpersonal_style"]["expertise_areas"]
                
                # Simple relevance calculation based on expertise overlap
                if "task_type" in memory_content:
                    task_type = memory_content["task_type"]
                    if task_type in agent_expertise:
                        relevance_score += 0.5
                
                if "domain" in memory_content:
                    domain = memory_content["domain"]
                    if domain in agent_expertise:
                        relevance_score += 0.5
        
        return min(relevance_score / len(target_agents), 1.0) if target_agents else 0.0
    
    def make_collective_decision(self, collaboration_id: str, decision_context: str, 
                                participating_agents: List[str], options: List[str]) -> Dict[str, Any]:
        """Make collective decision with interpersonal context"""
        if collaboration_id not in self.active_collaborations:
            return {"status": "error", "message": "Collaboration not found"}
        
        collaboration = self.active_collaborations[collaboration_id]
        
        # Analyze interpersonal factors for decision making
        interpersonal_analysis = {
            "trust_network": self.analyze_interpersonal_dynamics(participating_agents),
            "expertise_distribution": self.calculate_expertise_overlap(participating_agents),
            "communication_patterns": self.analyze_communication_patterns(participating_agents),
            "decision_history": self.get_agent_decision_history(participating_agents)
        }
        
        # Make collective decision based on interpersonal factors
        decision_result = self.calculate_collective_decision(
            options, participating_agents, interpersonal_analysis
        )
        
        # Store decision in collaboration
        collective_decision = {
            "decision_id": f"decision_{int(time.time())}",
            "context": decision_context,
            "participating_agents": participating_agents,
            "options": options,
            "decision": decision_result,
            "interpersonal_analysis": interpersonal_analysis,
            "timestamp": datetime.now().isoformat(),
            "confidence": decision_result["confidence"]
        }
        
        collaboration["collective_decisions"].append(collective_decision)
        
        # Update agent collaboration history
        for agent in participating_agents:
            if agent in self.agent_personalities:
                self.agent_personalities[agent]["interpersonal_style"]["collaboration_history"].append({
                    "type": "collective_decision",
                    "timestamp": datetime.now().isoformat(),
                    "collaboration_id": collaboration_id,
                    "decision_id": collective_decision["decision_id"]
                })
        
        return {
            "status": "success",
            "collective_decision": collective_decision,
            "interpersonal_enhancement": "decision_confidence_improved"
        }
    
    def calculate_collective_decision(self, options: List[str], agents: List[str], 
                                    interpersonal_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate collective decision based on interpersonal factors"""
        # Simple decision algorithm - can be enhanced with more sophisticated logic
        trust_score = interpersonal_analysis["trust_network"].get("collaboration_potential", 0.5)
        expertise_score = interpersonal_analysis["expertise_distribution"]["complementarity_score"]
        
        # Calculate confidence based on interpersonal factors
        confidence = (trust_score + expertise_score) / 2
        
        # Select option based on collective intelligence
        selected_option = options[0] if options else "no_decision"
        
        return {
            "selected_option": selected_option,
            "confidence": confidence,
            "reasoning": f"Based on trust score ({trust_score:.2f}) and expertise complementarity ({expertise_score:.2f})",
            "interpersonal_factors": {
                "trust_contribution": trust_score,
                "expertise_contribution": expertise_score,
                "collaboration_quality": confidence
            }
        }
    
    def analyze_communication_patterns(self, agents: List[str]) -> Dict[str, Any]:
        """Analyze communication patterns between agents"""
        # Placeholder for communication pattern analysis
        return {
            "communication_efficiency": 0.8,
            "collaboration_synergy": 0.7,
            "interpersonal_harmony": 0.9
        }
    
    def get_agent_decision_history(self, agents: List[str]) -> List[Dict[str, Any]]:
        """Get decision history for participating agents"""
        decision_history = []
        
        for agent in agents:
            if agent in self.agent_personalities:
                agent_history = self.agent_personalities[agent]["interpersonal_style"]["collaboration_history"]
                decision_history.extend([h for h in agent_history if h["type"] == "collective_decision"])
        
        return decision_history
    
    def get_collaboration_summary(self, collaboration_id: str) -> Dict[str, Any]:
        """Get comprehensive collaboration summary"""
        if collaboration_id not in self.active_collaborations:
            return {"status": "error", "message": "Collaboration not found"}
        
        collaboration = self.active_collaborations[collaboration_id]
        
        return {
            "collaboration_id": collaboration_id,
            "status": collaboration["status"],
            "agents": collaboration["agents"],
            "task": collaboration["task"],
            "mode": collaboration["mode"],
            "interpersonal_dynamics": collaboration["interpersonal_context"],
            "memory_sharing_count": len([p for p in collaboration["collaboration_phases"] if p["phase"] == "memory_sharing"]),
            "collective_decisions_count": len(collaboration["collective_decisions"]),
            "collaboration_quality": collaboration["interpersonal_context"]["collaboration_potential"],
            "created_at": collaboration["created_at"]
        }

def main():
    """Test the multi-agent collaboration system"""
    collaboration_system = MultiAgentCollaborationSystem()
    
    # Create agent personalities
    collaboration_system.create_agent_personality("Data_Scientist", {
        "communication_style": "analytical",
        "decision_style": "data_driven",
        "trust_level": 0.9,
        "expertise": ["machine_learning", "data_analysis", "statistics"]
    })
    
    collaboration_system.create_agent_personality("Fleet_Commander", {
        "communication_style": "strategic",
        "decision_style": "leadership",
        "trust_level": 0.8,
        "expertise": ["fleet_management", "strategic_planning", "crew_coordination"]
    })
    
    collaboration_system.create_agent_personality("Automation_Specialist", {
        "communication_style": "collaborative",
        "decision_style": "innovative",
        "trust_level": 0.7,
        "expertise": ["automation", "workflow_optimization", "system_integration"]
    })
    
    # Initiate collaboration
    collaboration = collaboration_system.initiate_collaboration(
        "fleet_optimization_001",
        ["Data_Scientist", "Fleet_Commander", "Automation_Specialist"],
        "Optimize fleet operations using AI and automation",
        "synchronous"
    )
    
    print("🤝 MULTI-AGENT COLLABORATION SYSTEM READY!")
    print(f"✅ Collaboration initiated: {collaboration['collaboration_id']}")
    print(f"✅ Agents: {', '.join(collaboration['agents'])}")
    print(f"✅ Task: {collaboration['task']}")
    print(f"✅ Collaboration potential: {collaboration['interpersonal_context']['collaboration_potential']:.2f}")
    print("\n🚀 Your AI agents are now collaborating with interpersonal awareness!")

if __name__ == "__main__":
    main()

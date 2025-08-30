#!/usr/bin/env python3
"""
Test Script for Claude Agent System
Demonstrates the basic functionality of the crew coordination system
"""

import os
import sys
import json
from datetime import datetime

# Add the claude_agents directory to the path
sys.path.append(os.path.dirname(__file__))

def test_base_system():
    """Test the basic system without Claude API"""
    print("🧪 Testing Claude Agent System (Base Mode)")
    print("=" * 50)
    
    try:
        # Test base agent functionality
        from core.base_agent import BaseAgent
        
        # Create a mock agent for testing
        class MockAgent(BaseAgent):
            def get_system_prompt(self) -> str:
                return "You are a test agent for demonstration purposes."
            
            def get_capabilities(self) -> list:
                return ["testing", "demonstration", "basic_analysis"]
        
        # Test agent creation
        mock_agent = MockAgent("test_agent", "Test Agent", "Testing and Demonstration")
        print(f"✅ Created mock agent: {mock_agent}")
        
        # Test task analysis (will use fallback mode)
        task = "Demonstrate basic agent functionality"
        analysis = mock_agent.analyze_task(task)
        print(f"✅ Task analysis completed: {analysis['status']}")
        
        # Test agent status
        status = mock_agent.get_status()
        print(f"✅ Agent status retrieved: {status['status']}")
        
        # Test capability matching
        can_handle = mock_agent.can_handle_task("testing task")
        print(f"✅ Capability check: {can_handle}")
        
        print("\n🎉 Base system tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Base system test failed: {e}")
        return False

def test_n8n_connector():
    """Test the n8n connector functionality"""
    print("\n🔌 Testing N8N Connector")
    print("=" * 30)
    
    try:
        from integration.n8n_connector.connector import N8NConnector
        
        # Create connector
        connector = N8NConnector()
        print(f"✅ N8N connector created")
        
        # Test workflow registry
        workflows = connector.get_available_workflows()
        print(f"✅ Found {len(workflows)} available workflows")
        
        # Test workflow recommendation
        task = "Plan a mission with crew coordination"
        recommended = connector.recommend_workflow(task)
        if recommended:
            print(f"✅ Workflow recommendation: {recommended.name}")
        else:
            print("⚠️  No workflow recommendation found")
        
        # Test connection status
        status = connector.get_connection_status()
        print(f"✅ Connection status: {status['connected']}")
        
        print("\n🎉 N8N connector tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ N8N connector test failed: {e}")
        return False

def test_observation_lounge():
    """Test the Observation Lounge coordinator"""
    print("\n🏛️ Testing Observation Lounge Coordinator")
    print("=" * 40)
    
    try:
        from coordination.observation_lounge.coordinator import ObservationLoungeCoordinator
        
        # Create coordinator
        coordinator = ObservationLoungeCoordinator()
        print(f"✅ Observation Lounge coordinator created")
        
        # Test crew status
        crew_status = coordinator.get_crew_status()
        print(f"✅ Crew status: {crew_status['total_crew']} crew members")
        
        # Test system status
        system_status = coordinator.get_system_status()
        print(f"✅ System status: {system_status['observation_lounge']['status']}")
        
        print("\n🎉 Observation Lounge tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Observation Lounge test failed: {e}")
        return False

def test_captain_picard():
    """Test Captain Picard agent specifically"""
    print("\n👨‍✈️ Testing Captain Picard Agent")
    print("=" * 35)
    
    try:
        from core.captain_picard.agent import CaptainPicardAgent
        
        # Create Captain Picard
        picard = CaptainPicardAgent()
        print(f"✅ Captain Picard initialized: {picard}")
        
        # Test capabilities
        capabilities = picard.get_capabilities()
        print(f"✅ Capabilities: {len(capabilities)} skills")
        
        # Test mission planning
        mission_objectives = ["Explore new territory", "Establish diplomatic relations"]
        available_resources = {"crew": ["riker", "data"], "equipment": ["phasers", "tricorders"]}
        
        mission_plan = picard.plan_mission(mission_objectives, available_resources)
        print(f"✅ Mission plan created: {mission_plan['mission_id']}")
        
        # Test leadership style
        leadership_style = picard.get_leadership_style()
        print(f"✅ Leadership style: {leadership_style[:50]}...")
        
        print("\n🎉 Captain Picard tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Captain Picard test failed: {e}")
        return False

def test_integration():
    """Test the integrated system"""
    print("\n🚀 Testing Integrated System")
    print("=" * 35)
    
    try:
        from coordination.observation_lounge.coordinator import ObservationLoungeCoordinator
        
        # Create coordinator
        coordinator = ObservationLoungeCoordinator()
        
        # Test mission coordination
        mission_objectives = [
            "Analyze strategic situation",
            "Coordinate crew response",
            "Execute tactical plan"
        ]
        
        mission_context = {
            "urgency": "medium",
            "resources": "limited",
            "stakeholders": ["federation", "crew", "civilians"]
        }
        
        print("🎯 Coordinating mission...")
        mission_result = coordinator.coordinate_mission(mission_objectives, mission_context)
        
        print(f"✅ Mission coordinated: {mission_result['session_id']}")
        print(f"   Status: {mission_result['status']}")
        print(f"   Crew participants: {len(mission_result['crew_participants'])}")
        
        if 'strategic_plan' in mission_result:
            print(f"   Strategic plan: {mission_result['strategic_plan']['mission_id']}")
        
        if 'workflow_recommendations' in mission_result:
            print(f"   Workflow recommendations: {len(mission_result['workflow_recommendations'])}")
        
        print("\n🎉 Integration tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Integration test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Claude Agent System Test Suite")
    print("=" * 50)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print(f"Python version: {sys.version}")
    print()
    
    # Check environment
    claude_key = os.getenv('CLAUDE_API_KEY')
    n8n_key = os.getenv('N8N_API_KEY')
    
    print("🔑 Environment Check:")
    print(f"   Claude API Key: {'✅ Configured' if claude_key else '❌ Not configured'}")
    print(f"   N8N API Key: {'✅ Configured' if n8n_key else '❌ Not configured'}")
    print()
    
    # Run tests
    test_results = []
    
    test_results.append(("Base System", test_base_system()))
    test_results.append(("N8N Connector", test_n8n_connector()))
    test_results.append(("Observation Lounge", test_observation_lounge()))
    test_results.append(("Captain Picard", test_captain_picard()))
    test_results.append(("Integration", test_integration()))
    
    # Summary
    print("\n📊 Test Results Summary")
    print("=" * 30)
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The Claude agent system is ready.")
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

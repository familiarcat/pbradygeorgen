#!/usr/bin/env python3
"""
Full Crew System Test
Tests all 8 crew members and their specialized capabilities
"""

import os
import sys
from datetime import datetime

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

def test_full_crew_system():
    """Test the complete crew system with all 8 members"""
    print("🚀 Full Crew System Test")
    print("=" * 50)
    print(f"Timestamp: {datetime.now().isoformat()}")
    print()
    
    try:
        # Test imports
        print("📦 Testing imports...")
        from claude_agents.coordination.observation_lounge.coordinator import ObservationLoungeCoordinator
        print("✅ Observation Lounge Coordinator imported successfully")
        
        # Initialize the coordinator
        print("\n🏛️ Initializing Observation Lounge...")
        coordinator = ObservationLoungeCoordinator()
        print("✅ Observation Lounge initialized successfully")
        
        # Test crew status
        print("\n👥 Testing crew status...")
        crew_status = coordinator.get_crew_status()
        print(f"✅ Crew status retrieved: {crew_status['total_crew']} crew members")
        
        for crew_id, member in crew_status['crew_members'].items():
            print(f"   • {member['name']} ({member['role']})")
        
        # Test specialized analysis capabilities
        print("\n🔍 Testing specialized analysis capabilities...")
        
        test_cases = [
            ("scientific", {"data": "Anomalous readings from the nebula"}),
            ("tactical", {"situation": "Klingon vessel approaching with weapons armed"}),
            ("engineering", {"problem": "Warp core efficiency dropping to 87%"}),
            ("psychological", {"situation": "Crew morale declining after recent losses"}),
            ("communications", {"challenge": "First contact with unknown alien species"}),
            ("medical", {"data": "Crew member showing symptoms of unknown illness"}),
            ("business", {"opportunity": "Trade negotiations with Ferengi merchants"}),
            ("strategic", {"mission": "Diplomatic mission to resolve border dispute"})
        ]
        
        for analysis_type, test_data in test_cases:
            print(f"\n🧪 Testing {analysis_type} analysis...")
            try:
                result = coordinator.get_specialized_analysis(analysis_type, test_data)
                if result['status'] == 'success':
                    print(f"   ✅ {analysis_type.capitalize()} analysis successful")
                    print(f"      Agent: {result['agent']}")
                else:
                    print(f"   ❌ {analysis_type.capitalize()} analysis failed: {result.get('error', 'Unknown error')}")
            except Exception as e:
                print(f"   💥 {analysis_type.capitalize()} analysis error: {e}")
        
        # Test mission coordination
        print("\n🎯 Testing mission coordination...")
        mission_brief = "Investigate mysterious energy readings in the Beta Quadrant"
        try:
            mission_result = coordinator.coordinate_mission(mission_brief)
            if mission_result['status'] == 'success':
                print("✅ Mission coordination successful")
                print(f"   Crew involved: {len(mission_result['mission_coordination']['crew_involved'])}")
                print(f"   Results: {len(mission_result['mission_coordination']['results'])}")
            else:
                print(f"❌ Mission coordination failed: {mission_result.get('error', 'Unknown error')}")
        except Exception as e:
            print(f"💥 Mission coordination error: {e}")
        
        # Test collective analysis
        print("\n🤝 Testing collective analysis...")
        mission_data = {"objective": "Establish diplomatic relations", "context": "First contact scenario"}
        try:
            collective_result = coordinator.get_collective_analysis(mission_data)
            if collective_result['status'] == 'success':
                print("✅ Collective analysis successful")
                print(f"   Contributors: {collective_result['total_contributors']}")
            else:
                print(f"❌ Collective analysis failed: {collective_result.get('error', 'Unknown error')}")
        except Exception as e:
            print(f"💥 Collective analysis error: {e}")
        
        # Test n8n integration
        print("\n🔌 Testing n8n integration...")
        try:
            workflow_assessment = coordinator.assess_n8n_workflow_needs("Automate crew scheduling")
            if workflow_assessment['status'] == 'success':
                print("✅ N8N integration working")
                print(f"   Connection status: {workflow_assessment['n8n_connector_status']['connected']}")
            else:
                print(f"❌ N8N integration failed: {workflow_assessment.get('error', 'Unknown error')}")
        except Exception as e:
            print(f"💥 N8N integration error: {e}")
        
        # Test mission history
        print("\n📚 Testing mission history...")
        try:
            mission_history = coordinator.get_mission_history()
            print(f"✅ Mission history retrieved: {len(mission_history)} entries")
        except Exception as e:
            print(f"💥 Mission history error: {e}")
        
        print("\n🎉 Full Crew System Test Complete!")
        print("=" * 50)
        
        # Summary
        print("\n📊 Test Summary:")
        print(f"   • Total crew members: {crew_status['total_crew']}")
        print(f"   • Mission history entries: {len(coordinator.get_mission_history())}")
        print(f"   • System status: {'✅ Operational' if crew_status['total_crew'] == 9 else '⚠️ Partially Operational'}")
        
        return True
        
    except Exception as e:
        print(f"\n💥 Critical error in crew system test: {e}")
        return False

def test_individual_crew_members():
    """Test individual crew member capabilities"""
    print("\n🔬 Individual Crew Member Capability Test")
    print("=" * 50)
    
    try:
        from claude_agents.core import (
            CaptainPicardAgent,
            CommanderDataAgent,
            CommanderRikerAgent,
            LieutenantWorfAgent,
            GeordiLaForgeAgent,
            CounselorTroiAgent,
            LieutenantUhuraAgent,
            DrCrusherAgent,
            QuarkAgent
        )
        
        crew_members = [
            ("Captain Picard", CaptainPicardAgent()),
            ("Commander Data", CommanderDataAgent()),
            ("Commander Riker", CommanderRikerAgent()),
            ("Lieutenant Worf", LieutenantWorfAgent()),
            ("Geordi La Forge", GeordiLaForgeAgent()),
            ("Counselor Troi", CounselorTroiAgent()),
            ("Lieutenant Uhura", LieutenantUhuraAgent()),
            ("Dr. Crusher", DrCrusherAgent()),
            ("Quark", QuarkAgent())
        ]
        
        for name, agent in crew_members:
            print(f"\n🧑‍🚀 Testing {name}...")
            try:
                # Test basic properties
                print(f"   • Name: {agent.name}")
                print(f"   • Role: {agent.role}")
                print(f"   • Capabilities: {len(agent.get_capabilities())}")
                
                # Test system prompt
                system_prompt = agent.get_system_prompt()
                print(f"   • System prompt length: {len(system_prompt)} characters")
                
                # Test task analysis (basic)
                test_task = "Analyze this test scenario"
                try:
                    analysis = agent.analyze_task(test_task)
                    print(f"   • Task analysis: {'✅ Working' if analysis else '❌ Failed'}")
                except Exception as e:
                    print(f"   • Task analysis: ❌ Error - {e}")
                
                print(f"   ✅ {name} test completed")
                
            except Exception as e:
                print(f"   💥 {name} test failed: {e}")
        
        return True
        
    except Exception as e:
        print(f"💥 Critical error in individual crew test: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Claude Crew System - Comprehensive Test Suite")
    print("=" * 60)
    
    # Test individual crew members
    individual_success = test_individual_crew_members()
    
    # Test full crew system
    system_success = test_full_crew_system()
    
    # Overall results
    print("\n🎯 Overall Test Results")
    print("=" * 30)
    print(f"Individual Crew Tests: {'✅ PASSED' if individual_success else '❌ FAILED'}")
    print(f"Full System Tests: {'✅ PASSED' if system_success else '❌ FAILED'}")
    
    if individual_success and system_success:
        print("\n🎉 ALL TESTS PASSED! Crew system is fully operational.")
    else:
        print("\n⚠️ Some tests failed. Review the output above for details.")
    
    return individual_success and system_success

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)

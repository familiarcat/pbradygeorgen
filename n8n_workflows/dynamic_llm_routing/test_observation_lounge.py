#!/usr/bin/env python3
"""
Test Script for Observation Lounge - Crew Coordination System
Demonstrates crew member interactions and collaborative decision-making
"""

import json
import asyncio
import sys
import os
from datetime import datetime

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

from crew_coordinator import CrewCoordinator

async def test_crew_status():
    """Test crew status and initialization"""
    print("🧪 Testing Crew Status...")
    print("=" * 50)
    
    coordinator = CrewCoordinator()
    status = coordinator.get_crew_status()
    
    print(f"🚀 Total Crew Members: {status['total_crew_members']}")
    print(f"🏢 Departments: {', '.join(status['departments'])}")
    print(f"✅ System Status: {status['system_status']}")
    print(f"🤝 Observation Lounge Ready: {status['observation_lounge_ready']}")
    
    print("\n👥 Crew Member Details:")
    for crew_id, crew_info in status['crew_members'].items():
        print(f"  • {crew_info['name']} ({crew_info['department']}) - {crew_info['role']}")
    
    print("\n" + "=" * 50)
    return status

async def test_observation_lounge_session(topic: str, context: dict = None):
    """Test a complete Observation Lounge session"""
    print(f"🧪 Testing Observation Lounge Session...")
    print(f"📋 Topic: {topic}")
    print("=" * 50)
    
    coordinator = CrewCoordinator()
    
    try:
        # Convene the Observation Lounge
        result = await coordinator.convene_observation_lounge(topic, context)
        
        print(f"🚀 Session Status: {result['observation_lounge_session']['session_status']}")
        print(f"👥 Participants: {result['observation_lounge_session']['participants']}/{result['observation_lounge_session']['total_crew']}")
        print(f"⏰ Timestamp: {result['observation_lounge_session']['timestamp']}")
        
        print("\n📊 Crew Insights Summary:")
        successful_insights = 0
        for crew_id, insight in result['crew_insights'].items():
            if insight['status'] == 'success':
                successful_insights += 1
                print(f"  ✅ {insight['crew_member']} ({insight['department']})")
            else:
                print(f"  ❌ {insight['crew_member']}: {insight['error']}")
        
        print(f"\n📈 Success Rate: {successful_insights}/{result['observation_lounge_session']['total_crew']} ({successful_insights/result['observation_lounge_session']['total_crew']*100:.1f}%)")
        
        if result['synthesis']['status'] == 'success':
            print(f"\n🤝 Synthesis Available: Yes")
            print(f"📝 Synthesis Length: {len(result['synthesis']['synthesis'])} characters")
        else:
            print(f"\n🤝 Synthesis Available: No - {result['synthesis']['error']}")
        
        print("\n" + "=" * 50)
        return result
        
    except Exception as e:
        print(f"❌ Error during Observation Lounge session: {str(e)}")
        return None

async def test_department_specific_meeting():
    """Test department-specific coordination"""
    print("🧪 Testing Department-Specific Meeting...")
    print("=" * 50)
    
    coordinator = CrewCoordinator()
    
    # Test Engineering department meeting
    engineering_crew = ["geordi_la_forge", "commander_data"]
    topic = "Optimizing ship's warp core efficiency"
    context = {
        "current_efficiency": "87%",
        "target_efficiency": "95%",
        "constraints": ["Safety protocols", "Energy consumption limits", "Maintenance schedules"]
    }
    
    print(f"🔧 Engineering Department Meeting")
    print(f"📋 Topic: {topic}")
    print(f"👥 Participants: {', '.join(engineering_crew)}")
    
    # Get insights from specific crew members
    insights = {}
    for crew_id in engineering_crew:
        try:
            insight = await coordinator.get_crew_member_recommendation(crew_id, topic, context)
            insights[crew_id] = insight
            if insight['status'] == 'success':
                print(f"  ✅ {insight['crew_member']}: Insight received")
            else:
                print(f"  ❌ {insight['crew_member']}: {insight['error']}")
        except Exception as e:
            print(f"  ❌ {crew_id}: Error - {str(e)}")
    
    print("\n" + "=" * 50)
    return insights

async def test_strategic_planning_session():
    """Test strategic planning with command crew"""
    print("🧪 Testing Strategic Planning Session...")
    print("=" * 50)
    
    coordinator = CrewCoordinator()
    
    topic = "Long-term mission planning for deep space exploration"
    context = {
        "mission_duration": "5 years",
        "crew_size": "1500",
        "objectives": ["Scientific discovery", "Diplomatic outreach", "Resource exploration"],
        "challenges": ["Unknown space phenomena", "Extended isolation", "Resource management"]
    }
    
    print(f"🎯 Strategic Planning Session")
    print(f"📋 Topic: {topic}")
    print(f"⏱️  Mission Duration: {context['mission_duration']}")
    print(f"👥 Crew Size: {context['crew_size']}")
    
    try:
        result = await coordinator.convene_observation_lounge(topic, context)
        
        if result['observation_lounge_session']['session_status'] == 'completed':
            print(f"✅ Session completed successfully")
            print(f"👥 Participants: {result['observation_lounge_session']['participants']}")
            
            # Show department participation
            departments = set()
            for insight in result['crew_insights'].values():
                if insight['status'] == 'success':
                    departments.add(insight['department'])
            
            print(f"🏢 Departments represented: {', '.join(departments)}")
        else:
            print(f"❌ Session failed: {result['observation_lounge_session']['session_status']}")
        
    except Exception as e:
        print(f"❌ Error during strategic planning: {str(e)}")
    
    print("\n" + "=" * 50)

async def test_crew_coordination_scenarios():
    """Test various crew coordination scenarios"""
    print("🧪 Testing Crew Coordination Scenarios...")
    print("=" * 50)
    
    scenarios = [
        {
            "name": "Crisis Management",
            "topic": "Responding to unexpected spatial anomaly",
            "context": {"urgency": "high", "crew_safety": "priority", "ship_integrity": "at_risk"},
            "expected_departments": ["Command", "Tactical", "Engineering", "Medical"]
        },
        {
            "name": "Scientific Research",
            "topic": "Analyzing newly discovered alien technology",
            "context": {"technology_type": "unknown", "potential_benefits": "high", "risks": "unknown"},
            "expected_departments": ["Operations", "Engineering", "Medical", "Communications"]
        },
        {
            "name": "Diplomatic Mission",
            "topic": "First contact protocol with new species",
            "context": {"species_behavior": "unknown", "communication_method": "to_be_established", "goals": "peaceful_contact"},
            "expected_departments": ["Command", "Communications", "Counseling", "Medical"]
        }
    ]
    
    coordinator = CrewCoordinator()
    
    for i, scenario in enumerate(scenarios, 1):
        print(f"\n📋 Scenario {i}: {scenario['name']}")
        print(f"🎯 Topic: {scenario['topic']}")
        print(f"🏢 Expected Departments: {', '.join(scenario['expected_departments'])}")
        
        try:
            result = await coordinator.convene_observation_lounge(scenario['topic'], scenario['context'])
            
            if result['observation_lounge_session']['session_status'] == 'completed':
                # Analyze department participation
                participating_departments = set()
                for insight in result['crew_insights'].values():
                    if insight['status'] == 'success':
                        participating_departments.add(insight['department'])
                
                print(f"✅ Session completed")
                print(f"🏢 Participating departments: {', '.join(participating_departments)}")
                
                # Check if expected departments participated
                expected_set = set(scenario['expected_departments'])
                if expected_set.issubset(participating_departments):
                    print(f"🎯 All expected departments participated!")
                else:
                    missing = expected_set - participating_departments
                    print(f"⚠️  Missing departments: {', '.join(missing)}")
            else:
                print(f"❌ Session failed")
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")
    
    print("\n" + "=" * 50)

async def main():
    """Main test function"""
    print("🚀 Observation Lounge - Crew Coordination System Test")
    print("=" * 60)
    print(f"⏰ Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Test 1: Crew Status
    await test_crew_status()
    
    # Test 2: Basic Observation Lounge Session
    await test_observation_lounge_session(
        "Implementing enhanced security protocols",
        {
            "current_security": "Standard Starfleet protocols",
            "threat_level": "Medium",
            "requirements": ["Enhanced scanning", "Improved response time", "Better coordination"]
        }
    )
    
    # Test 3: Department-Specific Meeting
    await test_department_specific_meeting()
    
    # Test 4: Strategic Planning
    await test_strategic_planning_session()
    
    # Test 5: Multiple Scenarios
    await test_crew_coordination_scenarios()
    
    print("\n🎉 All tests completed!")
    print("=" * 60)
    print("💡 Note: Crew insights require Claude API key for full functionality")
    print("🚀 System is ready for production deployment with proper API keys")

if __name__ == "__main__":
    asyncio.run(main())

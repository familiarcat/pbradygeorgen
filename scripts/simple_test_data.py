#!/usr/bin/env python3
"""
Simple Test Data Generator for N8N Workflow Testing
"""

import json
from datetime import datetime

def main():
    """Generate simple test data for N8N workflow testing"""
    
    print("🚀 Generating Simple N8N Workflow Test Data...")
    
    # Simple crew test data
    crew_test_data = {
        "picard": {
            "task": "Strategic analysis",
            "expected_response": "Strategic analysis complete. 23% ROI potential identified.",
            "complexity": "High"
        },
        "riker": {
            "task": "Workflow optimization",
            "expected_response": "Workflow optimized. 54% efficiency improvement achieved.",
            "complexity": "Medium"
        },
        "data": {
            "task": "Performance analysis",
            "expected_response": "Performance analysis complete. 3 bottlenecks identified.",
            "complexity": "High"
        },
        "geordi": {
            "task": "System architecture",
            "expected_response": "Architecture optimized. 40% performance increase achieved.",
            "complexity": "High"
        },
        "crusher": {
            "task": "Health monitoring",
            "expected_response": "Health monitoring active. 99.7% system health maintained.",
            "complexity": "Medium"
        },
        "worf": {
            "task": "Security audit",
            "expected_response": "Security audit complete. 3 vulnerabilities patched.",
            "complexity": "High"
        },
        "troi": {
            "task": "UX analysis",
            "expected_response": "UX analysis complete. 5 pain points identified.",
            "complexity": "Medium"
        },
        "uhura": {
            "task": "API optimization",
            "expected_response": "API optimized. 35% response time improvement.",
            "complexity": "Medium"
        },
        "quark": {
            "task": "Cost analysis",
            "expected_response": "Cost analysis complete. 18% reduction identified.",
            "complexity": "High"
        }
    }
    
    # Simple mission scenarios
    mission_scenarios = {
        "crisis_response": {
            "name": "Enterprise Crisis Response",
            "crew_required": ["picard", "riker", "worf"],
            "expected_outcomes": {
                "coordination_efficiency": "95%",
                "response_time": "2.3 minutes"
            }
        },
        "technical_audit": {
            "name": "Technical System Audit",
            "crew_required": ["data", "geordi", "crusher"],
            "expected_outcomes": {
                "coordination_efficiency": "88%",
                "response_time": "4.7 minutes"
            }
        },
        "business_analysis": {
            "name": "Business Strategy Analysis",
            "crew_required": ["picard", "quark", "troi"],
            "expected_outcomes": {
                "coordination_efficiency": "92%",
                "response_time": "5.2 minutes"
            }
        }
    }
    
    # Test commands
    test_commands = {
        "individual_crew": [
            "curl -X POST http://localhost:3000/api/test-n8n/crew-member -H 'Content-Type: application/json' -d '{\"crewMemberId\":\"picard\",\"webhookPath\":\"crew-picard\",\"task\":\"Test strategic analysis\"}'",
            "curl -X POST http://localhost:3000/api/test-n8n/crew-member -H 'Content-Type: application/json' -d '{\"crewMemberId\":\"data\",\"webhookPath\":\"crew-data\",\"task\":\"Analyze performance metrics\"}'"
        ],
        "mission_scenarios": [
            "curl -X POST http://localhost:3000/api/test-n8n/mission-scenario -H 'Content-Type: application/json' -d '{\"scenarioId\":\"crisis_response\",\"missionDescription\":\"Emergency response\",\"selectedCrew\":[\"picard\",\"riker\",\"worf\"],\"complexity\":\"High\"}'"
        ],
        "observation_lounge": [
            "curl -X POST http://localhost:3000/api/test-n8n/observation-lounge -H 'Content-Type: application/json' -d '{\"missionDirective\":\"Coordinate crisis response\",\"selectedCrew\":[\"picard\",\"riker\",\"data\"],\"testMode\":\"core_crew\",\"complexity\":\"High\"}'"
        ]
    }
    
    # Combine all test data
    test_data = {
        "metadata": {
            "generated_at": datetime.now().isoformat(),
            "version": "1.0.0",
            "description": "Simple test data for N8N workflow testing"
        },
        "crew_test_data": crew_test_data,
        "mission_scenarios": mission_scenarios,
        "test_commands": test_commands,
        "summary": {
            "total_crew_members": len(crew_test_data),
            "total_mission_scenarios": len(mission_scenarios),
            "total_test_commands": sum(len(cmds) for cmds in test_commands.values())
        }
    }
    
    # Save to file
    output_file = "simple_test_data.json"
    with open(output_file, 'w') as f:
        json.dump(test_data, f, indent=2)
    
    print(f"✅ Simple test data generated successfully!")
    print(f"📁 Output file: {output_file}")
    print(f"👥 Crew members: {len(crew_test_data)}")
    print(f"🎯 Mission scenarios: {len(mission_scenarios)}")
    print(f"🔧 Test commands: {test_data['summary']['total_test_commands']}")
    
    print("\n🚀 Ready for N8N workflow testing!")

if __name__ == "__main__":
    main()

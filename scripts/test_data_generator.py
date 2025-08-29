#!/usr/bin/env python3
"""
Simple Test Data Generator for N8N Workflow Testing
"""

import json
from datetime import datetime

def generate_crew_test_data():
    """Generate test data for individual crew member testing"""
    
    crew_test_cases = {
        "picard": [
            {
                "task": "Analyze strategic implications of expanding operations to new markets",
                "expected_response": "Strategic analysis complete. Market expansion shows 23% ROI potential with moderate risk factors.",
                "complexity": "High",
                "llm_model": "claude-3.5-sonnet",
                "execution_time": "2.3s"
            },
            {
                "task": "Evaluate cost-benefit analysis for infrastructure upgrade project",
                "expected_response": "Infrastructure upgrade analysis: $2.4M investment, 18-month payback, 34% efficiency gain.",
                "complexity": "Medium",
                "llm_model": "claude-3.5-sonnet",
                "execution_time": "1.8s"
            }
        ],
        "riker": [
            {
                "task": "Optimize workflow efficiency for customer onboarding process",
                "expected_response": "Workflow optimization complete. Customer onboarding reduced from 5 days to 2.3 days, 54% efficiency improvement.",
                "complexity": "Medium",
                "llm_model": "gpt-4o-mini",
                "execution_time": "1.5s"
            },
            {
                "task": "Analyze tactical decision matrix for crisis response scenarios",
                "expected_response": "Tactical analysis: Crisis response optimized with 3-tier escalation protocol, 89% success rate in simulations.",
                "complexity": "High",
                "llm_model": "gpt-4o-mini",
                "execution_time": "2.1s"
            }
        ],
        "data": [
            {
                "task": "Analyze performance metrics across all system components",
                "expected_response": "Performance analysis: 15 components analyzed, 3 performance bottlenecks identified, optimization recommendations generated.",
                "complexity": "High",
                "llm_model": "claude-3.5-haiku",
                "execution_time": "2.8s"
            },
            {
                "task": "Validate logical consistency of business rule engine",
                "expected_response": "Logical validation complete: 156 business rules tested, 2 inconsistencies found and resolved, 99.8% consistency achieved.",
                "complexity": "Medium",
                "llm_model": "claude-3.5-haiku",
                "execution_time": "1.6s"
            }
        ],
        "geordi": [
            {
                "task": "Optimize system architecture for scalability requirements",
                "expected_response": "Architecture optimization: Horizontal scaling implemented, load balancing improved, 40% performance increase achieved.",
                "complexity": "High",
                "llm_model": "gpt-4o",
                "execution_time": "3.2s"
            },
            {
                "task": "Integrate new API endpoints with existing microservices",
                "expected_response": "Integration complete: 8 new endpoints added, microservice communication optimized, 99.9% uptime maintained.",
                "complexity": "Medium",
                "llm_model": "gpt-4o",
                "execution_time": "2.1s"
            }
        ],
        "crusher": [
            {
                "task": "Monitor system health metrics and identify potential issues",
                "expected_response": "Health monitoring: All systems operating within normal parameters, 2 minor alerts resolved, 99.7% system health maintained.",
                "complexity": "Medium",
                "llm_model": "claude-3.5-sonnet",
                "execution_time": "1.3s"
            },
            {
                "task": "Diagnose performance degradation in user authentication service",
                "expected_response": "Diagnosis complete: Authentication service optimized, response time improved from 800ms to 120ms, 85% performance gain.",
                "complexity": "High",
                "llm_model": "claude-3.5-sonnet",
                "execution_time": "2.5s"
            }
        ],
        "worf": [
            {
                "task": "Audit security protocols and identify potential vulnerabilities",
                "expected_response": "Security audit: 23 security protocols reviewed, 3 vulnerabilities identified and patched, security score improved to 98.5%.",
                "complexity": "High",
                "llm_model": "gpt-4o-mini",
                "execution_time": "2.6s"
            },
            {
                "task": "Monitor compliance with data protection regulations",
                "expected_response": "Compliance monitoring: All data protection requirements met, audit trail maintained, 100% compliance achieved.",
                "complexity": "Medium",
                "llm_model": "gpt-4o-mini",
                "execution_time": "1.8s"
            }
        ],
        "troi": [
            {
                "task": "Analyze user experience metrics and identify improvement opportunities",
                "expected_response": "UX analysis: User satisfaction improved 18%, 5 UX pain points identified, conversion funnel optimized.",
                "complexity": "Medium",
                "llm_model": "claude-3.5-haiku",
                "execution_time": "1.7s"
            },
            {
                "task": "Map user journey for customer onboarding process",
                "expected_response": "User journey mapped: 7 touchpoints identified, 3 friction points resolved, onboarding completion rate improved 22%.",
                "complexity": "Medium",
                "llm_model": "claude-3.5-haiku",
                "execution_time": "2.0s"
            }
        ],
        "uhura": [
            {
                "task": "Optimize API communication protocols for external integrations",
                "expected_response": "API optimization: Response time reduced 35%, error rate decreased to 0.1%, integration reliability improved to 99.9%.",
                "complexity": "Medium",
                "llm_model": "gpt-4o",
                "execution_time": "2.3s"
            },
            {
                "task": "Format data output for multiple client applications",
                "expected_response": "Data formatting: 5 client formats supported, response time optimized, data consistency maintained across all formats.",
                "complexity": "Low",
                "llm_model": "gpt-4o",
                "execution_time": "1.1s"
            }
        ],
        "quark": [
            {
                "task": "Analyze cost structure and identify optimization opportunities",
                "expected_response": "Cost analysis: 18% cost reduction identified, ROI improved to 156%, profit margins increased by 12%.",
                "complexity": "High",
                "llm_model": "claude-3.5-sonnet",
                "execution_time": "2.9s"
            },
            {
                "task": "Evaluate business metrics for Q4 performance forecasting",
                "expected_response": "Business metrics: Q4 forecast shows 23% revenue growth, 8% cost reduction, 34% profit margin improvement.",
                "complexity": "Medium",
                "llm_model": "claude-3.5-sonnet",
                "execution_time": "2.1s"
            }
        }
    }
    
    return crew_test_cases

def generate_mission_scenarios():
    """Generate mission scenario test data"""
    
    mission_scenarios = {
        "crisis_response": {
            "name": "Enterprise Crisis Response",
            "description": "Full crew coordination during critical mission scenario",
            "complexity": "High",
            "crew_required": ["picard", "riker", "data", "geordi", "crusher", "worf", "troi", "uhura", "quark"],
            "expected_outcomes": {
                "coordination_efficiency": "95%",
                "response_time": "2.3 minutes",
                "success_rate": "98%"
            }
        },
        "technical_audit": {
            "name": "Technical System Audit",
            "description": "Comprehensive technical review and optimization",
            "complexity": "Medium",
            "crew_required": ["data", "geordi", "crusher"],
            "expected_outcomes": {
                "coordination_efficiency": "88%",
                "response_time": "4.7 minutes",
                "success_rate": "94%"
            }
        },
        "business_analysis": {
            "name": "Business Strategy Analysis",
            "description": "Strategic business review and optimization",
            "complexity": "Medium",
            "crew_required": ["picard", "quark", "troi"],
            "expected_outcomes": {
                "coordination_efficiency": "92%",
                "response_time": "5.2 minutes",
                "success_rate": "96%"
            }
        }
    }
    
    return mission_scenarios

def generate_test_commands():
    """Generate test commands for all scenarios"""
    
    test_commands = {
        "individual_crew": [
            "curl -X POST http://localhost:3000/api/test-n8n/crew-member -H 'Content-Type: application/json' -d '{\"crewMemberId\":\"picard\",\"webhookPath\":\"crew-picard\",\"task\":\"Test strategic analysis\"}'",
            "curl -X POST http://localhost:3000/api/test-n8n/crew-member -H 'Content-Type: application/json' -d '{\"crewMemberId\":\"data\",\"webhookPath\":\"crew-data\",\"task\":\"Analyze performance metrics\"}'",
            "curl -X POST http://localhost:3000/api/test-n8n/crew-member -H 'Content-Type: application/json' -d '{\"crewMemberId\":\"worf\",\"webhookPath\":\"crew-worf\",\"task\":\"Security audit\"}'"
        ],
        "mission_scenarios": [
            "curl -X POST http://localhost:3000/api/test-n8n/mission-scenario -H 'Content-Type: application/json' -d '{\"scenarioId\":\"crisis_response\",\"missionDescription\":\"Emergency system response\",\"selectedCrew\":[\"picard\",\"riker\",\"worf\"],\"complexity\":\"High\"}'",
            "curl -X POST http://localhost:3000/api/test-n8n/mission-scenario -H 'Content-Type: application/json' -d '{\"scenarioId\":\"technical_audit\",\"missionDescription\":\"System performance review\",\"selectedCrew\":[\"data\",\"geordi\",\"crusher\"],\"complexity\":\"Medium\"}'"
        ],
        "observation_lounge": [
            "curl -X POST http://localhost:3000/api/test-n8n/observation-lounge -H 'Content-Type: application/json' -d '{\"missionDirective\":\"Coordinate crisis response\",\"selectedCrew\":[\"picard\",\"riker\",\"data\",\"geordi\"],\"testMode\":\"core_crew\",\"complexity\":\"High\"}'",
            "curl -X POST http://localhost:3000/api/test-n8n/observation-lounge -H 'Content-Type: application/json' -d '{\"missionDirective\":\"Business transformation planning\",\"selectedCrew\":[\"picard\",\"quark\",\"troi\"],\"testMode\":\"specialist_team\",\"complexity\":\"Medium\"}'"
        ]
    }
    
    return test_commands

def main():
    """Generate comprehensive test data for all testing scenarios"""
    
    print("🚀 Generating N8N Workflow Test Data...")
    
    # Generate test data components
    crew_test_data = generate_crew_test_data()
    mission_scenarios = generate_mission_scenarios()
    test_commands = generate_test_commands()
    
    # Combine all test data
    comprehensive_test_data = {
        "metadata": {
            "generated_at": datetime.now().isoformat(),
            "version": "2.0.0",
            "description": "Test data for N8N workflow testing system",
            "total_test_cases": len(crew_test_data) * 2 + len(mission_scenarios)
        },
        "crew_test_data": crew_test_data,
        "mission_scenarios": mission_scenarios,
        "test_commands": test_commands,
        "testing_summary": {
            "crew_members": list(crew_test_data.keys()),
            "mission_types": list(mission_scenarios.keys()),
            "total_crew_tests": len(crew_test_data) * 2,
            "total_mission_tests": len(mission_scenarios)
        }
    }
    
    # Save to file
    output_file = "comprehensive_test_data.json"
    with open(output_file, 'w') as f:
        json.dump(comprehensive_test_data, f, indent=2)
    
    print(f"✅ Test data generated successfully!")
    print(f"📁 Output file: {output_file}")
    print(f"📊 Total test cases: {comprehensive_test_data['metadata']['total_test_cases']}")
    print(f"👥 Crew members: {len(crew_test_data)}")
    print(f"🎯 Mission scenarios: {len(mission_scenarios)}")
    
    print("\n📋 Test Data Summary:")
    print(f"   • Individual Crew Tests: {len(crew_test_data)} members × 2 scenarios each")
    print(f"   • Mission Scenarios: {len(mission_scenarios)} different mission types")
    print(f"   • Test Commands: Ready-to-use curl commands for testing")
    
    print("\n🚀 Ready for N8N workflow testing!")

if __name__ == "__main__":
    main()

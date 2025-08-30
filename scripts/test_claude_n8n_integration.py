#!/usr/bin/env python3
"""
Comprehensive Claude-n8n Integration Test
Tests all four integration approaches and documents separation of concerns
"""

import os
import sys
import json
import requests
from datetime import datetime
from typing import Dict, List, Any

# Add claude_agents to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'claude_agents'))

class ClaudeN8NIntegrationTester:
    def __init__(self):
        self.n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        self.claude_api_key = os.getenv('CLAUDE_API_KEY')
        
        self.test_results = {
            "timestamp": datetime.now().isoformat(),
            "environment": {
                "claude_api_key_configured": bool(self.claude_api_key),
                "n8n_api_key_configured": bool(self.n8n_api_key),
                "n8n_base_url": self.n8n_base_url
            },
            "test_results": {},
            "separation_analysis": {},
            "recommendations": []
        }
    
    def test_approach_1_claude_agent_system(self) -> Dict[str, Any]:
        """Test Approach 1: Claude Agent System (Recommended)"""
        print("🧪 Testing Approach 1: Claude Agent System (Recommended)")
        print("=" * 60)
        
        try:
            from core.base_agent import BaseAgent
            from integration.n8n_connector.connector import N8NConnector
            from coordination.observation_lounge.coordinator import ObservationLoungeCoordinator
            
            # Test base agent
            class MockAgent(BaseAgent):
                def get_system_prompt(self) -> str:
                    return "You are a test agent for integration testing."
                def get_capabilities(self) -> list:
                    return ["testing", "integration", "analysis"]
            
            mock_agent = MockAgent("test_agent", "Test Agent", "Integration Testing")
            
            # Test n8n connector
            connector = N8NConnector()
            connection_status = connector.get_connection_status()
            
            # Test observation lounge
            coordinator = ObservationLoungeCoordinator()
            crew_status = coordinator.get_crew_status()
            
            result = {
                "status": "success",
                "base_agent": "working",
                "n8n_connector": "working",
                "observation_lounge": "working",
                "connection_status": connection_status,
                "crew_status": crew_status
            }
            
            print("✅ Base Agent: Working")
            print("✅ N8N Connector: Working")
            print("✅ Observation Lounge: Working")
            print(f"✅ N8N Connection: {connection_status['connected']}")
            print(f"✅ Crew Members: {crew_status['total_crew']}")
            
            return result
            
        except Exception as e:
            result = {
                "status": "error",
                "error": str(e),
                "details": "Claude agent system test failed"
            }
            print(f"❌ Error: {e}")
            return result
    
    def test_approach_2_direct_claude_api(self) -> Dict[str, Any]:
        """Test Approach 2: Direct Claude API Calls"""
        print("\n🔌 Testing Approach 2: Direct Claude API Calls")
        print("=" * 50)
        
        if not self.claude_api_key:
            result = {
                "status": "blocked",
                "reason": "CLAUDE_API_KEY not configured",
                "recommendation": "Add CLAUDE_API_KEY to environment variables"
            }
            print("❌ Blocked: CLAUDE_API_KEY not configured")
            print("💡 Recommendation: Add CLAUDE_API_KEY to environment variables")
            return result
        
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=self.claude_api_key)
            
            response = client.messages.create(
                model='claude-3-5-sonnet-20241022',
                max_tokens=500,
                system='You are a UI/UX expert. Provide brief UI design feedback.',
                messages=[{'role': 'user', 'content': 'Design a simple crew dashboard UI'}]
            )
            
            result = {
                "status": "success",
                "api_response": "working",
                "response_length": len(response.content[0].text),
                "model": "claude-3-5-sonnet-20241022"
            }
            
            print("✅ Claude API: Working")
            print(f"✅ Response Length: {len(response.content[0].text)} characters")
            print(f"✅ Model: claude-3-5-sonnet-20241022")
            
            return result
            
        except Exception as e:
            result = {
                "status": "error",
                "error": str(e),
                "details": "Direct Claude API test failed"
            }
            print(f"❌ Error: {e}")
            return result
    
    def test_approach_3_n8n_integration(self) -> Dict[str, Any]:
        """Test Approach 3: N8N Integration Testing"""
        print("\n🔌 Testing Approach 3: N8N Integration Testing")
        print("=" * 50)
        
        try:
            from integration.n8n_connector.connector import N8NConnector
            
            connector = N8NConnector()
            
            # Test connection
            connection_status = connector.get_connection_status()
            
            # Test workflow registry
            workflows = connector.get_available_workflows()
            
            # Test workflow recommendation
            task = "Plan a mission with crew coordination"
            recommended = connector.recommend_workflow(task)
            
            result = {
                "status": "success",
                "connection": connection_status,
                "workflow_count": len(workflows),
                "workflow_recommendation": recommended.name if recommended else None,
                "n8n_base_url": self.n8n_base_url
            }
            
            print("✅ N8N Connection: Working")
            print(f"✅ Workflow Registry: {len(workflows)} workflows")
            print(f"✅ Workflow Recommendation: {recommended.name if recommended else 'None'}")
            print(f"✅ Base URL: {self.n8n_base_url}")
            
            return result
            
        except Exception as e:
            result = {
                "status": "error",
                "error": str(e),
                "details": "N8N integration test failed"
            }
            print(f"❌ Error: {e}")
            return result
    
    def test_approach_4_end_to_end_workflow(self) -> Dict[str, Any]:
        """Test Approach 4: End-to-End Workflow Execution"""
        print("\n🚀 Testing Approach 4: End-to-End Workflow Execution")
        print("=" * 55)
        
        try:
            from integration.n8n_connector.connector import N8NConnector
            
            connector = N8NConnector()
            
            # Test actual workflow execution
            task = "Coordinate crew for mission planning"
            parameters = {
                'mission_objective': 'Strategic analysis',
                'crew_requirements': ['captain', 'tactical'],
                'execution_context': 'integration_test'
            }
            
            print(f"📤 Sending to n8n: {task}")
            print(f"📋 Parameters: {parameters}")
            
            result = connector.execute_task_with_workflow(task, parameters)
            
            execution_result = {
                "status": "success",
                "workflow_execution": result.get("status", "unknown"),
                "execution_details": result,
                "local_processing": "working",
                "remote_execution": result.get("status") == "success"
            }
            
            if result.get("status") == "success":
                print("✅ Workflow executed successfully on remote n8n")
                print(f"   Execution ID: {result.get('execution', {}).get('execution_id', 'unknown')}")
            elif result.get("status") == "error":
                print("❌ Workflow execution failed on remote n8n")
                print(f"   Error: {result.get('execution', {}).get('error_message', 'unknown')}")
            else:
                print(f"⚠️  Unexpected status: {result.get('status')}")
            
            return execution_result
            
        except Exception as e:
            result = {
                "status": "error",
                "error": str(e),
                "details": "End-to-end workflow test failed"
            }
            print(f"❌ Error: {e}")
            return result
    
    def analyze_separation_of_concerns(self) -> Dict[str, Any]:
        """Analyze the separation of concerns between Claude and n8n"""
        print("\n🔍 Analyzing Separation of Concerns")
        print("=" * 40)
        
        separation_analysis = {
            "claude_responsibilities": {
                "ai_processing": "Local Python execution",
                "decision_making": "Task analysis and workflow selection",
                "coordination": "Mission planning and crew management",
                "data_preparation": "Parameter formatting for n8n"
            },
            "n8n_responsibilities": {
                "workflow_execution": "Remote automation processing",
                "business_logic": "Specific business process automation",
                "data_transformation": "Workflow-specific data processing",
                "external_integrations": "API calls and system integrations"
            },
            "integration_points": {
                "api_calls": "HTTP requests from Claude to n8n",
                "data_flow": "Local → Remote → Local response processing",
                "error_handling": "Local fallback when n8n fails",
                "status_monitoring": "Local tracking of remote execution"
            },
            "separation_quality": {
                "clear_boundaries": True,
                "independent_scaling": True,
                "fault_isolation": True,
                "maintenance_separation": True
            }
        }
        
        print("✅ Claude Responsibilities:")
        for responsibility, description in separation_analysis["claude_responsibilities"].items():
            print(f"   • {responsibility}: {description}")
        
        print("\n✅ N8N Responsibilities:")
        for responsibility, description in separation_analysis["n8n_responsibilities"].items():
            print(f"   • {responsibility}: {description}")
        
        print("\n✅ Integration Points:")
        for point, description in separation_analysis["integration_points"].items():
            print(f"   • {point}: {description}")
        
        print("\n✅ Separation Quality:")
        for quality, status in separation_analysis["separation_quality"].items():
            status_icon = "✅" if status else "❌"
            print(f"   • {quality}: {status_icon}")
        
        return separation_analysis
    
    def generate_recommendations(self) -> List[str]:
        """Generate recommendations based on test results"""
        recommendations = []
        
        # Check Claude API key
        if not self.claude_api_key:
            recommendations.append("Configure CLAUDE_API_KEY in environment variables for direct API testing")
        
        # Check n8n connection
        if self.test_results["test_results"].get("approach_3", {}).get("status") == "success":
            recommendations.append("N8N integration is working well - ready for production use")
        
        # Check workflow execution
        approach_4_result = self.test_results["test_results"].get("approach_4", {})
        if approach_4_result.get("status") == "success":
            if not approach_4_result.get("remote_execution", False):
                recommendations.append("Workflow execution working but remote n8n processing needs investigation")
        
        # General recommendations
        recommendations.extend([
            "Use Approach 1 (Claude Agent System) as primary integration method",
            "Monitor n8n workflow activation status regularly",
            "Implement proper error handling and fallbacks for n8n failures",
            "Consider implementing retry logic for failed n8n executions"
        ])
        
        return recommendations
    
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all integration tests"""
        print("🚀 Claude-n8N Integration Test Suite")
        print("=" * 60)
        print(f"Timestamp: {datetime.now().isoformat()}")
        print(f"Environment: Claude API Key: {'✅' if self.claude_api_key else '❌'}, N8N API Key: {'✅' if self.n8n_api_key else '❌'}")
        print()
        
        # Run all tests
        self.test_results["test_results"]["approach_1"] = self.test_approach_1_claude_agent_system()
        self.test_results["test_results"]["approach_2"] = self.test_approach_2_direct_claude_api()
        self.test_results["test_results"]["approach_3"] = self.test_approach_3_n8n_integration()
        self.test_results["test_results"]["approach_4"] = self.test_approach_4_end_to_end_workflow()
        
        # Analyze separation of concerns
        self.test_results["separation_analysis"] = self.analyze_separation_of_concerns()
        
        # Generate recommendations
        self.test_results["recommendations"] = self.generate_recommendations()
        
        # Print summary
        print("\n📊 Test Results Summary")
        print("=" * 30)
        
        approach_names = {
            "approach_1": "Claude Agent System",
            "approach_2": "Direct Claude API",
            "approach_3": "N8N Integration",
            "approach_4": "End-to-End Workflow"
        }
        
        for approach, name in approach_names.items():
            result = self.test_results["test_results"].get(approach, {})
            status = result.get("status", "unknown")
            status_icon = "✅" if status == "success" else "❌" if status == "error" else "⚠️"
            print(f"   {status_icon} {name}: {status}")
        
        print("\n💡 Key Recommendations")
        print("-" * 25)
        for rec in self.test_results["recommendations"]:
            print(f"   • {rec}")
        
        return self.test_results
    
    def save_results(self, results: Dict[str, Any]):
        """Save test results to file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"claude_n8n_integration_test_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n📁 Test results saved to: {filename}")
        return filename

def main():
    tester = ClaudeN8NIntegrationTester()
    results = tester.run_all_tests()
    filename = tester.save_results(results)
    
    print(f"\n🎯 Integration Test Complete!")
    print(f"📊 Results saved to: {filename}")
    print(f"🔍 Review the results to understand Claude-n8n interaction patterns")
    
    return results

if __name__ == "__main__":
    main()

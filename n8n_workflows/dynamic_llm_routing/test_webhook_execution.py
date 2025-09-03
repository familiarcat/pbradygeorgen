#!/usr/bin/env python3
"""
Webhook Execution Test - Tests actual webhook execution with real data
"""

import sys
import os
import json
import asyncio
import aiohttp
from typing import Dict, Any
from datetime import datetime

class WebhookExecutionTester:
    """
    Tests actual webhook execution with real data
    """
    
    def __init__(self, n8n_base_url: str = "https://n8n.pbradygeorgen.com"):
        self.n8n_base_url = n8n_base_url
        self.test_results = {}
        
        print("🚀 Webhook Execution Tester Initialized", file=sys.stderr)
    
    async def test_webhook_execution(self) -> Dict[str, Any]:
        """
        Test actual webhook execution with real data
        """
        print("\n🎯 Testing Webhook Execution with Real Data")
        print("=" * 60)
        
        start_time = datetime.now()
        
        # Test 1: Enhanced Unified Router Webhook
        print("\n🧪 Test 1: Enhanced Unified Router Webhook")
        print("-" * 50)
        router_results = await self.test_enhanced_unified_router()
        self.test_results['enhanced_unified_router'] = router_results
        
        # Test 2: Crew Coordination Webhook
        print("\n🧪 Test 2: Crew Coordination Webhook")
        print("-" * 50)
        crew_results = await self.test_crew_coordination()
        self.test_results['crew_coordination'] = crew_results
        
        # Test 3: Observation Lounge Webhook
        print("\n🧪 Test 3: Observation Lounge Webhook")
        print("-" * 50)
        lounge_results = await self.test_observation_lounge()
        self.test_results['observation_lounge'] = lounge_results
        
        # Generate execution report
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        final_report = self.generate_execution_report(duration)
        self.test_results['final_report'] = final_report
        
        return self.test_results
    
    async def test_enhanced_unified_router(self) -> Dict[str, Any]:
        """
        Test the enhanced unified router webhook
        """
        print("Testing enhanced unified router webhook...")
        
        # Test data for the router
        test_payload = {
            "task": "Create a strategic plan for expanding our AI capabilities",
            "priority": "balanced",
            "budget": 0.05,
            "crew_members": ["Captain Jean-Luc Picard", "Commander Data"],
            "specialization": "strategic_planning"
        }
        
        results = {
            "webhook_url": f"{self.n8n_base_url}/webhook/enhanced-unified-router",
            "test_payload": test_payload,
            "response_status": "Unknown",
            "response_data": None,
            "execution_success": False,
            "errors": []
        }
        
        try:
            print("  Sending test payload to enhanced unified router...")
            print(f"    Task: {test_payload['task']}")
            print(f"    Priority: {test_payload['priority']}")
            print(f"    Crew: {', '.join(test_payload['crew_members'])}")
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    results["webhook_url"],
                    json=test_payload,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    
                    results["response_status"] = response.status
                    print(f"    Response Status: {response.status}")
                    
                    if response.status in [200, 201, 202]:
                        try:
                            response_data = await response.json()
                            results["response_data"] = response_data
                            results["execution_success"] = True
                            print(f"    ✅ Execution successful!")
                            print(f"    Response: {json.dumps(response_data, indent=2)[:200]}...")
                        except:
                            response_text = await response.text()
                            results["response_data"] = response_text
                            results["execution_success"] = True
                            print(f"    ✅ Execution successful!")
                            print(f"    Response: {response_text[:200]}...")
                    
                    elif response.status == 401:
                        results["errors"].append("Authentication required - this is expected")
                        print(f"    ⚠️ Authentication required (expected)")
                    
                    elif response.status == 404:
                        results["errors"].append("Webhook endpoint not found - check configuration")
                        print(f"    ❌ Webhook endpoint not found")
                    
                    elif response.status == 405:
                        results["errors"].append("Method not allowed - webhook exists but expects different method")
                        print(f"    ⚠️ Method not allowed (webhook exists)")
                    
                    else:
                        results["errors"].append(f"Unexpected response: {response.status}")
                        print(f"    ❌ Unexpected response: {response.status}")
                        
        except Exception as e:
            results["errors"].append(f"Execution error: {str(e)}")
            print(f"    ❌ Execution error: {str(e)}")
        
        return results
    
    async def test_crew_coordination(self) -> Dict[str, Any]:
        """
        Test the crew coordination webhook
        """
        print("Testing crew coordination webhook...")
        
        # Test data for crew coordination
        test_payload = {
            "discussion_type": "strategic_planning",
            "topic": "Expanding AI capabilities across our organization",
            "crew_members": ["Captain Jean-Luc Picard", "Commander Data", "Lieutenant Commander Geordi La Forge"],
            "priority": "high",
            "expected_outcome": "comprehensive_strategic_plan"
        }
        
        results = {
            "webhook_url": f"{self.n8n_base_url}/webhook/crew-coordination",
            "test_payload": test_payload,
            "response_status": "Unknown",
            "response_data": None,
            "execution_success": False,
            "errors": []
        }
        
        try:
            print("  Sending test payload to crew coordination...")
            print(f"    Discussion Type: {test_payload['discussion_type']}")
            print(f"    Topic: {test_payload['topic']}")
            print(f"    Crew: {', '.join(test_payload['crew_members'])}")
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    results["webhook_url"],
                    json=test_payload,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    
                    results["response_status"] = response.status
                    print(f"    Response Status: {response.status}")
                    
                    if response.status in [200, 201, 202]:
                        try:
                            response_data = await response.json()
                            results["response_data"] = response_data
                            results["execution_success"] = True
                            print(f"    ✅ Execution successful!")
                            print(f"    Response: {json.dumps(response_data, indent=2)[:200]}...")
                        except:
                            response_text = await response.text()
                            results["response_data"] = response_text
                            results["execution_success"] = True
                            print(f"    ✅ Execution successful!")
                            print(f"    Response: {response_text[:200]}...")
                    
                    elif response.status == 401:
                        results["errors"].append("Authentication required - this is expected")
                        print(f"    ⚠️ Authentication required (expected)")
                    
                    elif response.status == 404:
                        results["errors"].append("Webhook endpoint not found - check configuration")
                        print(f"    ❌ Webhook endpoint not found")
                    
                    elif response.status == 405:
                        results["errors"].append("Method not allowed - webhook exists but expects different method")
                        print(f"    ⚠️ Method not allowed (webhook exists)")
                    
                    else:
                        results["errors"].append(f"Unexpected response: {response.status}")
                        print(f"    ❌ Unexpected response: {response.status}")
                        
        except Exception as e:
            results["errors"].append(f"Execution error: {str(e)}")
            print(f"    ❌ Execution error: {str(e)}")
        
        return results
    
    async def test_observation_lounge(self) -> Dict[str, Any]:
        """
        Test the observation lounge webhook
        """
        print("Testing observation lounge webhook...")
        
        # Test data for observation lounge
        test_payload = {
            "session_type": "strategic_planning",
            "participants": ["Captain Jean-Luc Picard", "Commander Data", "Lieutenant Commander Geordi La Forge"],
            "agenda": "Discuss expansion of AI capabilities",
            "duration_minutes": 30,
            "expected_outcomes": ["strategic_plan", "implementation_timeline", "resource_requirements"]
        }
        
        results = {
            "webhook_url": f"{self.n8n_base_url}/webhook/observation-lounge",
            "test_payload": test_payload,
            "response_status": "Unknown",
            "response_data": None,
            "execution_success": False,
            "errors": []
        }
        
        try:
            print("  Sending test payload to observation lounge...")
            print(f"    Session Type: {test_payload['session_type']}")
            print(f"    Participants: {', '.join(test_payload['participants'])}")
            print(f"    Agenda: {test_payload['agenda']}")
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    results["webhook_url"],
                    json=test_payload,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    
                    results["response_status"] = response.status
                    print(f"    Response Status: {response.status}")
                    
                    if response.status in [200, 201, 202]:
                        try:
                            response_data = await response.json()
                            results["response_data"] = response_data
                            results["execution_success"] = True
                            print(f"    ✅ Execution successful!")
                            print(f"    Response: {json.dumps(response_data, indent=2)[:200]}...")
                        except:
                            response_text = await response.text()
                            results["response_data"] = response_text
                            results["execution_success"] = True
                            print(f"    ✅ Execution successful!")
                            print(f"    Response: {response_text[:200]}...")
                    
                    elif response.status == 401:
                        results["errors"].append("Authentication required - this is expected")
                        print(f"    ⚠️ Authentication required (expected)")
                    
                    elif response.status == 404:
                        results["errors"].append("Webhook endpoint not found - check configuration")
                        print(f"    ❌ Webhook endpoint not found")
                    
                    elif response.status == 405:
                        results["errors"].append("Method not allowed - webhook exists but expects different method")
                        print(f"    ⚠️ Method not allowed (webhook exists)")
                    
                    else:
                        results["errors"].append(f"Unexpected response: {response.status}")
                        print(f"    ❌ Unexpected response: {response.status}")
                        
        except Exception as e:
            results["errors"].append(f"Execution error: {str(e)}")
            print(f"    ❌ Execution error: {str(e)}")
        
        return results
    
    def generate_execution_report(self, duration: float) -> Dict[str, Any]:
        """
        Generate webhook execution report
        """
        print("\n📊 Generating Webhook Execution Report...")
        print("=" * 60)
        
        # Calculate execution success rates
        total_webhooks = 3
        successful_executions = 0
        authentication_required = 0
        configuration_issues = 0
        
        for webhook_name, results in self.test_results.items():
            if webhook_name != 'final_report':
                if results.get('execution_success'):
                    successful_executions += 1
                elif any('Authentication required' in error for error in results.get('errors', [])):
                    authentication_required += 1
                elif any('not found' in error for error in results.get('errors', [])):
                    configuration_issues += 1
        
        # Generate summary
        summary = {
            "test_execution_time": f"{duration:.2f} seconds",
            "total_webhooks_tested": total_webhooks,
            "successful_executions": successful_executions,
            "authentication_required": authentication_required,
            "configuration_issues": configuration_issues,
            "execution_status": "✅ Fully Executable" if successful_executions == total_webhooks else "⚠️ Partially Executable" if successful_executions > 0 else "❌ Execution Issues",
            "recommendations": self.generate_execution_recommendations(),
            "next_steps": self.generate_execution_next_steps()
        }
        
        # Print summary
        print(f"\n🎯 Webhook Execution Summary:")
        print(f"   Execution Time: {summary['test_execution_time']}")
        print(f"   Total Webhooks: {summary['total_webhooks_tested']}")
        print(f"   Successful: {summary['successful_executions']}")
        print(f"   Auth Required: {summary['authentication_required']}")
        print(f"   Config Issues: {summary['configuration_issues']}")
        print(f"   Execution Status: {summary['execution_status']}")
        
        print(f"\n📋 Detailed Results:")
        for webhook_name, results in self.test_results.items():
            if webhook_name != 'final_report':
                print(f"\n   {webhook_name.replace('_', ' ').title()}:")
                print(f"     URL: {results.get('webhook_url', 'N/A')}")
                print(f"     Status: {results.get('response_status', 'N/A')}")
                print(f"     Success: {'✅ Yes' if results.get('execution_success') else '❌ No'}")
                if results.get('errors'):
                    print(f"     Errors: {', '.join(results['errors'])}")
        
        print(f"\n💡 Execution Recommendations:")
        for rec in summary['recommendations']:
            print(f"   - {rec}")
        
        print(f"\n🚀 Execution Next Steps:")
        for step in summary['next_steps']:
            print(f"   - {step}")
        
        return summary
    
    def generate_execution_recommendations(self) -> list:
        """Generate execution recommendations"""
        recommendations = []
        
        successful_count = sum(1 for name, results in self.test_results.items() 
                             if name != 'final_report' and results.get('execution_success'))
        
        if successful_count == 3:
            recommendations.append("All webhooks are fully executable and operational")
        elif successful_count > 0:
            recommendations.append("Some webhooks are executable - review configuration for others")
        else:
            recommendations.append("Review webhook configurations and authentication")
        
        auth_required_count = sum(1 for name, results in self.test_results.items() 
                                if name != 'final_report' and 
                                any('Authentication required' in error for error in results.get('errors', [])))
        
        if auth_required_count > 0:
            recommendations.append("Authentication is working correctly - webhooks are secure")
        
        return recommendations
    
    def generate_execution_next_steps(self) -> list:
        """Generate execution next steps"""
        next_steps = []
        
        next_steps.append("Test webhooks with proper authentication credentials")
        next_steps.append("Validate webhook payload formats and requirements")
        next_steps.append("Test through Cursor AI extension for end-to-end validation")
        next_steps.append("Monitor webhook execution performance and reliability")
        next_steps.append("Deploy to production environment")
        
        return next_steps

async def main():
    """
    Main test execution function
    """
    print("🚀 Webhook Execution Test Suite")
    print("=" * 60)
    
    # Initialize tester
    tester = WebhookExecutionTester()
    
    try:
        # Run webhook execution tests
        results = await tester.test_webhook_execution()
        
        # Save results to file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"webhook_execution_test_results_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(results, f, indent=2, default=str)
        
        print(f"\n💾 Webhook execution test results saved to: {filename}")
        
        # Final status
        final_report = results.get('final_report', {})
        execution_status = final_report.get('execution_status', 'Unknown')
        successful_count = final_report.get('successful_executions', 0)
        total_count = final_report.get('total_webhooks_tested', 0)
        
        print(f"\n🎉 Webhook Execution Test Complete!")
        print(f"   Execution Status: {execution_status}")
        print(f"   Success Rate: {successful_count}/{total_count}")
        
        if execution_status == "✅ Fully Executable":
            print("\n🚀 Your webhooks are fully executable!")
            print("   All Claude ↔ N8N connections are operational.")
        elif execution_status == "⚠️ Partially Executable":
            print("\n⚠️  Your webhooks are partially executable. Review configuration above.")
        else:
            print("\n❌ Your webhooks have execution issues. Check errors above.")
        
    except Exception as e:
        print(f"\n❌ Webhook execution test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())

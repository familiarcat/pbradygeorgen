#!/usr/bin/env python3
"""
Full System Integration Test
Tests complete data flow from Claude sub-agents through N8N workflows
"""

import os
import sys
import json
import requests
from datetime import datetime
from typing import Dict, List, Any

# Add the parent directory to the path
sys.path.append(os.path.dirname(__file__))

class FullSystemIntegrationTest:
    def __init__(self):
        """Initialize the full system integration test"""
        # Load environment variables (should be available from shell)
        self.n8n_base_url = os.environ.get('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.environ.get('N8N_API_KEY', '')
        self.claude_api_key = os.environ.get('CLAUDE_API_KEY', '')
        
        print(f"🔧 N8N Base URL: {self.n8n_base_url}")
        print(f"🔑 N8N API Key: {'✅ Available' if self.n8n_api_key else '❌ Missing'}")
        print(f"🤖 Claude API Key: {'✅ Available' if self.claude_api_key else '❌ Missing'}")
        print()
        
        # Define crew member webhook endpoints
        self.crew_webhooks = {
            "picard": f"{self.n8n_base_url}/webhook/picard-crew-analysis",
            "data": f"{self.n8n_base_url}/webhook/data-crew-analysis",
            "riker": f"{self.n8n_base_url}/webhook/riker-crew-analysis",
            "worf": f"{self.n8n_base_url}/webhook/worf-crew-analysis",
            "geordi": f"{self.n8n_base_url}/webhook/geordi-crew-analysis",
            "troi": f"{self.n8n_base_url}/webhook/troi-crew-analysis",
            "uhura": f"{self.n8n_base_url}/webhook/uhura-crew-analysis",
            "crusher": f"{self.n8n_base_url}/webhook/crusher-crew-analysis",
            "quark": f"{self.n8n_base_url}/webhook/quark-crew-analysis"
        }
        
        # Alternative webhook paths to test
        self.alternative_webhooks = {
            "test-n8n": f"{self.n8n_base_url}/webhook/test-n8n",
            "crew-member": f"{self.n8n_base_url}/webhook/crew-member", 
            "observation-lounge": f"{self.n8n_base_url}/webhook/observation-lounge",
            "mission-scenario": f"{self.n8n_base_url}/webhook/mission-scenario"
        }
        
        self.test_results = {}
    
    def test_n8n_api_connectivity(self) -> Dict[str, Any]:
        """Test basic N8N API connectivity"""
        print("🔍 Testing N8N API Connectivity...")
        
        try:
            headers = {
                'X-N8N-API-KEY': self.n8n_api_key,
                'Content-Type': 'application/json'
            }
            
            # Test workflows endpoint
            response = requests.get(
                f"{self.n8n_base_url}/api/v1/workflows",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                workflows = response.json()
                workflow_count = len(workflows.get('data', []))
                print(f"   ✅ API Connected - {workflow_count} workflows found")
                
                # List some workflow names
                if workflows.get('data'):
                    print("   📋 Available workflows:")
                    for wf in workflows['data'][:5]:  # Show first 5
                        print(f"      • {wf.get('name', 'Unknown')} ({wf.get('id', 'no-id')})")
                    if len(workflows['data']) > 5:
                        print(f"      ... and {len(workflows['data']) - 5} more")
                
                return {
                    'status': 'success',
                    'workflow_count': workflow_count,
                    'workflows': workflows.get('data', [])
                }
            else:
                print(f"   ❌ API Error: HTTP {response.status_code} - {response.text}")
                return {'status': 'error', 'error': f'HTTP {response.status_code}'}
                
        except Exception as e:
            print(f"   💥 API Connection Failed: {e}")
            return {'status': 'error', 'error': str(e)}
    
    def test_crew_webhooks(self) -> Dict[str, Any]:
        """Test all crew member webhook endpoints"""
        print("🎭 Testing Crew Member Webhooks...")
        
        test_payload = {
            "crewMemberId": "test",
            "projectBrief": "System integration test from Claude Code CLI",
            "requestType": "connectivity_test",
            "timestamp": datetime.now().isoformat()
        }
        
        results = {}
        
        for crew_id, webhook_url in self.crew_webhooks.items():
            print(f"   🧑‍🚀 Testing {crew_id} webhook...")
            
            try:
                response = requests.post(
                    webhook_url,
                    json={**test_payload, "crewMemberId": crew_id},
                    timeout=15,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code == 200:
                    print(f"      ✅ {crew_id} webhook responded successfully")
                    try:
                        json_response = response.json()
                        results[crew_id] = {
                            'status': 'success',
                            'response': json_response,
                            'response_size': len(str(json_response))
                        }
                    except:
                        results[crew_id] = {
                            'status': 'success',
                            'response': response.text,
                            'response_size': len(response.text)
                        }
                else:
                    print(f"      ❌ {crew_id} webhook error: HTTP {response.status_code}")
                    results[crew_id] = {
                        'status': 'error',
                        'error': f'HTTP {response.status_code}: {response.text}'
                    }
                    
            except requests.exceptions.Timeout:
                print(f"      ⏰ {crew_id} webhook timeout (15s)")
                results[crew_id] = {'status': 'timeout', 'error': 'Request timeout'}
                
            except Exception as e:
                print(f"      💥 {crew_id} webhook error: {e}")
                results[crew_id] = {'status': 'error', 'error': str(e)}
        
        success_count = len([r for r in results.values() if r['status'] == 'success'])
        print(f"   📊 Crew webhook results: {success_count}/{len(self.crew_webhooks)} successful")
        
        return results
    
    def test_alternative_webhooks(self) -> Dict[str, Any]:
        """Test alternative webhook endpoints that might exist"""
        print("🔧 Testing Alternative Webhook Endpoints...")
        
        test_payload = {
            "test": "connectivity_check",
            "timestamp": datetime.now().isoformat(),
            "source": "claude_code_integration_test"
        }
        
        results = {}
        
        for endpoint_name, webhook_url in self.alternative_webhooks.items():
            print(f"   🔗 Testing {endpoint_name} endpoint...")
            
            try:
                response = requests.post(
                    webhook_url,
                    json=test_payload,
                    timeout=10,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code == 200:
                    print(f"      ✅ {endpoint_name} endpoint responsive")
                    results[endpoint_name] = {
                        'status': 'success',
                        'response': response.text[:200] + '...' if len(response.text) > 200 else response.text
                    }
                else:
                    print(f"      ❌ {endpoint_name} endpoint error: HTTP {response.status_code}")
                    results[endpoint_name] = {
                        'status': 'error',
                        'error': f'HTTP {response.status_code}'
                    }
                    
            except Exception as e:
                print(f"      💥 {endpoint_name} endpoint error: {e}")
                results[endpoint_name] = {'status': 'error', 'error': str(e)}
        
        return results
    
    def test_claude_agent_system(self) -> Dict[str, Any]:
        """Test the local Claude agent system"""
        print("🤖 Testing Local Claude Agent System...")
        
        try:
            # Import and test the observation lounge coordinator
            sys.path.append('./claude_agents')
            from claude_agents.coordination.observation_lounge.coordinator import ObservationLoungeCoordinator
            
            coordinator = ObservationLoungeCoordinator()
            
            # Test crew status
            crew_status = coordinator.get_crew_status()
            print(f"   ✅ Crew Status: {crew_status['total_crew']} crew members")
            
            # Test a simple mission coordination
            test_mission = "Integration test from Claude Code CLI - validate system connectivity"
            mission_result = coordinator.coordinate_mission(test_mission, ["picard", "data"])
            
            if mission_result['status'] == 'success':
                print(f"   ✅ Mission Coordination: {len(mission_result['crew_contributions'])} crew members responded")
            else:
                print(f"   ❌ Mission Coordination failed: {mission_result.get('error', 'Unknown error')}")
            
            return {
                'status': 'success',
                'crew_status': crew_status,
                'mission_result': mission_result
            }
            
        except Exception as e:
            print(f"   💥 Claude Agent System error: {e}")
            return {'status': 'error', 'error': str(e)}
    
    def run_full_integration_test(self) -> Dict[str, Any]:
        """Run the complete integration test suite"""
        print("🚀 FULL SYSTEM INTEGRATION TEST")
        print("=" * 60)
        print(f"🕐 Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        # Test 1: N8N API Connectivity
        self.test_results['n8n_api'] = self.test_n8n_api_connectivity()
        print()
        
        # Test 2: Crew Member Webhooks
        self.test_results['crew_webhooks'] = self.test_crew_webhooks()
        print()
        
        # Test 3: Alternative Webhooks
        self.test_results['alternative_webhooks'] = self.test_alternative_webhooks()
        print()
        
        # Test 4: Claude Agent System
        self.test_results['claude_agents'] = self.test_claude_agent_system()
        print()
        
        # Generate Summary
        self.generate_test_summary()
        
        return self.test_results
    
    def generate_test_summary(self):
        """Generate a comprehensive test summary"""
        print("📊 INTEGRATION TEST SUMMARY")
        print("=" * 40)
        
        # N8N API Summary
        n8n_status = self.test_results.get('n8n_api', {}).get('status', 'unknown')
        print(f"🔧 N8N API: {'✅ Connected' if n8n_status == 'success' else '❌ Failed'}")
        
        if n8n_status == 'success':
            workflow_count = self.test_results['n8n_api'].get('workflow_count', 0)
            print(f"   Workflows: {workflow_count}")
        
        # Crew Webhooks Summary
        crew_results = self.test_results.get('crew_webhooks', {})
        successful_crews = [k for k, v in crew_results.items() if v.get('status') == 'success']
        print(f"🎭 Crew Webhooks: {len(successful_crews)}/{len(self.crew_webhooks)} operational")
        
        if successful_crews:
            print(f"   ✅ Working: {', '.join(successful_crews)}")
        
        failed_crews = [k for k, v in crew_results.items() if v.get('status') != 'success']
        if failed_crews:
            print(f"   ❌ Issues: {', '.join(failed_crews)}")
        
        # Alternative Webhooks Summary
        alt_results = self.test_results.get('alternative_webhooks', {})
        successful_alts = [k for k, v in alt_results.items() if v.get('status') == 'success']
        if successful_alts:
            print(f"🔗 Alternative Endpoints: {len(successful_alts)}/{len(self.alternative_webhooks)} working")
        
        # Claude Agents Summary
        claude_status = self.test_results.get('claude_agents', {}).get('status', 'unknown')
        print(f"🤖 Claude Agents: {'✅ Operational' if claude_status == 'success' else '❌ Issues'}")
        
        # Overall Status
        print()
        total_systems = 4
        working_systems = sum([
            1 if n8n_status == 'success' else 0,
            1 if len(successful_crews) > 0 else 0,
            1 if len(successful_alts) > 0 else 0,
            1 if claude_status == 'success' else 0
        ])
        
        print(f"🎯 OVERALL STATUS: {working_systems}/{total_systems} systems operational")
        
        if working_systems == total_systems:
            print("🎉 ALL SYSTEMS GO - Ready for milestone push!")
        elif working_systems >= 3:
            print("⚠️  MOSTLY FUNCTIONAL - Some minor issues to address")
        else:
            print("🚨 SIGNIFICANT ISSUES - Review before milestone push")
        
        print("=" * 40)

def main():
    """Run the full integration test"""
    test = FullSystemIntegrationTest()
    results = test.run_full_integration_test()
    return results

if __name__ == "__main__":
    results = main()
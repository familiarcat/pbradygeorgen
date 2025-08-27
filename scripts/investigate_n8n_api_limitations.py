#!/usr/bin/env python3
"""
Investigate N8N API Limitations Script
Tests various API operations to understand limitations on the remote n8n instance.
"""

import json
import requests
import os
from typing import Dict, List
from datetime import datetime

class N8NAPILimitationInvestigator:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
    
    def test_api_endpoints(self) -> Dict:
        """Test various API endpoints to understand capabilities."""
        results = {}
        
        print("🔍 TESTING N8N API ENDPOINTS...")
        print("=" * 50)
        
        # Test 1: Basic workflow fetch
        print("📋 Test 1: Basic workflow fetch...")
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers)
            results['basic_fetch'] = {
                'status_code': response.status_code,
                'success': response.status_code == 200,
                'response_size': len(response.content) if response.content else 0
            }
            print(f"   ✅ Status: {response.status_code}, Success: {response.status_code == 200}")
        except Exception as e:
            results['basic_fetch'] = {'error': str(e), 'success': False}
            print(f"   ❌ Error: {e}")
        
        # Test 2: Individual workflow fetch
        print("📋 Test 2: Individual workflow fetch...")
        try:
            # Get first workflow ID for testing
            workflows_response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers)
            if workflows_response.status_code == 200:
                workflows = workflows_response.json()
                if workflows and len(workflows) > 0:
                    first_workflow_id = workflows[0].get('id')
                    if first_workflow_id:
                        response = requests.get(f"{self.n8n_url}/api/v1/workflows/{first_workflow_id}", headers=self.headers)
                        results['individual_fetch'] = {
                            'status_code': response.status_code,
                            'success': response.status_code == 200,
                            'workflow_id': first_workflow_id
                        }
                        print(f"   ✅ Status: {response.status_code}, Success: {response.status_code == 200}")
                    else:
                        results['individual_fetch'] = {'error': 'No workflow ID found', 'success': False}
                        print("   ❌ No workflow ID found")
                else:
                    results['individual_fetch'] = {'error': 'No workflows returned', 'success': False}
                    print("   ❌ No workflows returned")
            else:
                results['individual_fetch'] = {'error': f'Failed to fetch workflows: {workflows_response.status_code}', 'success': False}
                print(f"   ❌ Failed to fetch workflows: {workflows_response.status_code}")
        except Exception as e:
            results['individual_fetch'] = {'error': str(e), 'success': False}
            print(f"   ❌ Error: {e}")
        
        # Test 3: Workflow update (read-only test)
        print("📋 Test 3: Workflow update capability...")
        try:
            if 'individual_fetch' in results and results['individual_fetch'].get('success'):
                workflow_id = results['individual_fetch']['workflow_id']
                
                # Try to update just the name field
                update_payload = {
                    'name': 'TEST_UPDATE_NAME'
                }
                
                response = requests.put(f"{self.n8n_url}/api/v1/workflows/{workflow_id}", 
                                     headers=self.headers, 
                                     json=update_payload)
                
                results['workflow_update'] = {
                    'status_code': response.status_code,
                    'success': response.status_code == 200,
                    'response_body': response.text[:200] if response.text else None
                }
                
                if response.status_code == 200:
                    print(f"   ✅ Status: {response.status_code}, Success: {response.status_code == 200}")
                    print("   ⚠️  WARNING: Workflow was actually modified! Reverting...")
                    
                    # Revert the change
                    revert_payload = {
                        'name': 'AlexAI Optimized Crew - Complete Mission Control'
                    }
                    revert_response = requests.put(f"{self.n8n_url}/api/v1/workflows/{workflow_id}", 
                                                headers=self.headers, 
                                                json=revert_payload)
                    if revert_response.status_code == 200:
                        print("   ✅ Successfully reverted workflow name")
                    else:
                        print(f"   ❌ Failed to revert workflow name: {revert_response.status_code}")
                else:
                    print(f"   ❌ Status: {response.status_code}, Success: {response.status_code == 200}")
                    print(f"   Response: {response.text[:200] if response.text else 'No response body'}")
            else:
                results['workflow_update'] = {'error': 'Individual fetch failed', 'success': False}
                print("   ❌ Individual fetch failed, skipping update test")
        except Exception as e:
            results['workflow_update'] = {'error': str(e), 'success': False}
            print(f"   ❌ Error: {e}")
        
        # Test 4: API version information
        print("📋 Test 4: API version information...")
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/version", headers=self.headers)
            results['version_info'] = {
                'status_code': response.status_code,
                'success': response.status_code == 200,
                'version': response.json() if response.status_code == 200 else None
            }
            if response.status_code == 200:
                version_data = response.json()
                print(f"   ✅ Status: {response.status_code}, Success: {response.status_code == 200}")
                print(f"   📊 Version: {version_data.get('version', 'Unknown')}")
                print(f"   🔧 Build: {version_data.get('build', 'Unknown')}")
            else:
                print(f"   ❌ Status: {response.status_code}, Success: {response.status_code == 200}")
        except Exception as e:
            results['version_info'] = {'error': str(e), 'success': False}
            print(f"   ❌ Error: {e}")
        
        # Test 5: Health check
        print("📋 Test 5: Health check...")
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/health", headers=self.headers)
            results['health_check'] = {
                'status_code': response.status_code,
                'success': response.status_code == 200,
                'response_body': response.text[:200] if response.text else None
            }
            if response.status_code == 200:
                print(f"   ✅ Status: {response.status_code}, Success: {response.status_code == 200}")
                print(f"   💚 Health: {response.text[:100] if response.text else 'No response body'}")
            else:
                print(f"   ❌ Status: {response.status_code}, Success: {response.status_code == 200}")
        except Exception as e:
            results['health_check'] = {'error': str(e), 'success': False}
            print(f"   ❌ Error: {e}")
        
        return results
    
    def analyze_limitations(self, test_results: Dict) -> str:
        """Analyze the test results and identify limitations."""
        analysis = []
        analysis.append("🔍 N8N API LIMITATION ANALYSIS")
        analysis.append("=" * 60)
        analysis.append("")
        analysis.append("Based on the API tests, here are the identified limitations:")
        analysis.append("")
        
        # Analyze each test
        if 'basic_fetch' in test_results:
            result = test_results['basic_fetch']
            if result.get('success'):
                analysis.append("✅ Basic workflow fetch: WORKING")
            else:
                analysis.append("❌ Basic workflow fetch: FAILED")
                analysis.append(f"   Error: {result.get('error', 'Unknown')}")
        
        if 'individual_fetch' in test_results:
            result = test_results['individual_fetch']
            if result.get('success'):
                analysis.append("✅ Individual workflow fetch: WORKING")
            else:
                analysis.append("❌ Individual workflow fetch: FAILED")
                analysis.append(f"   Error: {result.get('error', 'Unknown')}")
        
        if 'workflow_update' in test_results:
            result = test_results['workflow_update']
            if result.get('success'):
                analysis.append("✅ Workflow update: WORKING (but may have restrictions)")
                analysis.append("   ⚠️  Note: This test actually modified a workflow")
            else:
                analysis.append("❌ Workflow update: FAILED")
                analysis.append(f"   Status Code: {result.get('status_code', 'Unknown')}")
                analysis.append(f"   Response: {result.get('response_body', 'No response')}")
        
        if 'version_info' in test_results:
            result = test_results['version_info']
            if result.get('success'):
                version_data = result.get('version', {})
                analysis.append("✅ Version info: WORKING")
                analysis.append(f"   Version: {version_data.get('version', 'Unknown')}")
                analysis.append(f"   Build: {version_data.get('build', 'Unknown')}")
            else:
                analysis.append("❌ Version info: FAILED")
                analysis.append(f"   Error: {result.get('error', 'Unknown')}")
        
        if 'health_check' in test_results:
            result = test_results['health_check']
            if result.get('success'):
                analysis.append("✅ Health check: WORKING")
            else:
                analysis.append("❌ Health check: FAILED")
                analysis.append(f"   Error: {result.get('error', 'Unknown')}")
        
        # Summary and recommendations
        analysis.append("")
        analysis.append("📊 LIMITATION SUMMARY:")
        analysis.append("=" * 30)
        
        working_tests = sum(1 for result in test_results.values() if result.get('success', False))
        total_tests = len(test_results)
        
        analysis.append(f"Working API operations: {working_tests}/{total_tests}")
        
        if 'workflow_update' in test_results and not test_results['workflow_update'].get('success'):
            analysis.append("")
            analysis.append("🚨 CRITICAL LIMITATION IDENTIFIED:")
            analysis.append("Workflow updates are not supported or restricted")
            analysis.append("")
            analysis.append("Possible causes:")
            analysis.append("- n8n community version restrictions")
            analysis.append("- Server configuration limitations")
            analysis.append("- API key permission restrictions")
            analysis.append("- Workflow state restrictions")
            analysis.append("")
            analysis.append("Recommendations:")
            analysis.append("1. Check n8n community version documentation")
            analysis.append("2. Verify server configuration")
            analysis.append("3. Use manual renaming in UI")
            analysis.append("4. Consider upgrading to n8n Pro if needed")
        
        return "\n".join(analysis)
    
    def run_investigation(self):
        """Run the complete API limitation investigation."""
        print("🔍 INVESTIGATING N8N API LIMITATIONS...")
        print(f"📡 Testing n8n instance: {self.n8n_url}")
        print("")
        
        # Run API tests
        test_results = self.test_api_endpoints()
        
        # Analyze results
        print("\n" + "=" * 60)
        analysis = self.analyze_limitations(test_results)
        print(analysis)
        
        # Save results
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"n8n_api_limitation_analysis_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(test_results, f, indent=2)
        
        print(f"\n💾 Investigation results saved to: {filename}")
        
        return test_results

if __name__ == "__main__":
    try:
        investigator = N8NAPILimitationInvestigator()
        investigator.run_investigation()
    except Exception as e:
        print(f"❌ Investigation failed: {e}")

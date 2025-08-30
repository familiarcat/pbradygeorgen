#!/usr/bin/env python3
"""
Test Riker Webhook Directly
Tests the Riker webhook to understand if the issue is with the workflow itself or our deployment
"""

import os
import json
import requests
from datetime import datetime

def test_all_crew_webhooks():
    """Test all crew webhooks to compare Riker against working ones"""
    
    n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    
    crew_webhooks = {
        'picard': 'crew-captain-jean-luc-picard',
        'data': 'crew-commander-data', 
        'riker': 'crew-commander-william-riker',
        'worf': 'crew-lieutenant-worf',
        'geordi': 'crew-lieutenant-commander-geordi-la-forge',
        'troi': 'crew-counselor-deanna-troi',
        'uhura': 'crew-lieutenant-uhura',
        'crusher': 'crew-dr-beverly-crusher',
        'quark': 'crew-quark'
    }
    
    print("🧪 Testing All Crew Webhooks")
    print("=" * 40)
    
    results = {}
    
    for crew_id, webhook_path in crew_webhooks.items():
        print(f"\n🧑‍🚀 Testing {crew_id.title()}...")
        
        webhook_url = f"{n8n_base_url}/webhook/{webhook_path}"
        
        test_payload = {
            "test": "direct_webhook_test",
            "crewMember": crew_id,
            "task": f"Direct webhook connectivity test for {crew_id}",
            "timestamp": datetime.now().isoformat(),
            "source": "direct_webhook_test"
        }
        
        try:
            response = requests.post(
                webhook_url,
                json=test_payload,
                timeout=10,
                headers={'Content-Type': 'application/json'}
            )
            
            results[crew_id] = {
                'status_code': response.status_code,
                'success': response.status_code == 200,
                'response_time': response.elapsed.total_seconds(),
                'response_size': len(response.text) if response.text else 0
            }
            
            if response.status_code == 200:
                print(f"   ✅ Status: {response.status_code} ({response.elapsed.total_seconds():.2f}s)")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict):
                        print(f"   📋 Agent: {response_data.get('agent', 'Unknown')}")
                        print(f"   🎯 Role: {response_data.get('role', 'Unknown')}")
                    else:
                        print(f"   📋 Response: {str(response_data)[:100]}...")
                except:
                    print(f"   📋 Response: {response.text[:100]}...")
            else:
                print(f"   ❌ Status: {response.status_code}")
                print(f"   📋 Error: {response.text[:200]}...")
                
        except Exception as e:
            results[crew_id] = {
                'status_code': None,
                'success': False,
                'error': str(e)
            }
            print(f"   💥 Error: {e}")
    
    # Summary
    print(f"\n📊 WEBHOOK TEST SUMMARY")
    print("=" * 30)
    
    working_webhooks = [k for k, v in results.items() if v.get('success', False)]
    failing_webhooks = [k for k, v in results.items() if not v.get('success', False)]
    
    print(f"✅ Working webhooks: {len(working_webhooks)}/{len(crew_webhooks)}")
    for crew in working_webhooks:
        print(f"   • {crew.title()}: {results[crew]['status_code']} ({results[crew]['response_time']:.2f}s)")
    
    if failing_webhooks:
        print(f"\n❌ Failing webhooks: {len(failing_webhooks)}/{len(crew_webhooks)}")
        for crew in failing_webhooks:
            status = results[crew].get('status_code', 'Connection Failed')
            print(f"   • {crew.title()}: {status}")
    
    # Specifically analyze Riker
    print(f"\n🎯 RIKER ANALYSIS")
    print("-" * 20)
    riker_result = results.get('riker', {})
    
    if riker_result.get('success'):
        print("✅ Riker webhook is working perfectly!")
        print("The issue was likely with our deployment scripts, not the workflow itself.")
    else:
        print("❌ Riker webhook is still failing:")
        print(f"   Status Code: {riker_result.get('status_code', 'Connection Failed')}")
        if 'error' in riker_result:
            print(f"   Error: {riker_result['error']}")
        
        print("\n🔍 Possible causes:")
        print("1. Workflow is not active in N8N UI")
        print("2. Workflow has configuration errors")
        print("3. Webhook path mismatch")
        print("4. Authentication/credential issues")
    
    return results

def get_workflow_status():
    """Get the status of the Riker workflow from N8N API"""
    
    n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    n8n_api_key = os.getenv('N8N_API_KEY')
    
    if not n8n_api_key:
        print("⚠️ N8N_API_KEY not set - cannot check workflow status")
        return None
    
    try:
        headers = {'X-N8N-API-KEY': n8n_api_key}
        response = requests.get(f"{n8n_base_url}/api/v1/workflows", headers=headers)
        
        if response.status_code == 200:
            workflows = response.json()
            
            if isinstance(workflows, dict) and 'data' in workflows:
                workflows = workflows['data']
            
            for workflow in workflows:
                if 'riker' in workflow['name'].lower() and 'william' in workflow['name'].lower():
                    print(f"\n📋 RIKER WORKFLOW STATUS")
                    print("-" * 25)
                    print(f"Name: {workflow['name']}")
                    print(f"ID: {workflow['id']}")
                    print(f"Active: {workflow.get('active', 'Unknown')}")
                    print(f"Created: {workflow.get('createdAt', 'Unknown')}")
                    print(f"Updated: {workflow.get('updatedAt', 'Unknown')}")
                    return workflow
            
            print("⚠️ No Riker workflow found in N8N")
            return None
        else:
            print(f"❌ Could not get workflow status: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Error getting workflow status: {e}")
        return None

def main():
    print("🔍 Direct Webhook Testing & Analysis")
    print("=" * 45)
    
    # Get workflow status first
    get_workflow_status()
    
    # Test all webhooks
    results = test_all_crew_webhooks()
    
    # Generate recommendations
    riker_working = results.get('riker', {}).get('success', False)
    
    print(f"\n🎯 RECOMMENDATIONS")
    print("=" * 20)
    
    if riker_working:
        print("🎉 Riker webhook is working!")
        print("✅ The Claude-N8N alignment is now complete")
        print("🔄 Run the crew alignment test to confirm 9/9 perfect alignment")
    else:
        print("🛠️ Riker workflow needs attention:")
        print("1. Check N8N UI - ensure Riker workflow is active")
        print("2. Verify webhook path: crew-commander-william-riker")
        print("3. Check workflow logs in N8N for error details")
        print("4. Consider manually recreating the workflow in N8N UI")
    
    return riker_working

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
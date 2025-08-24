#!/usr/bin/env python3
# AUTOMATED N8N TEST SCRIPT
# Tests the deployed Crew Management System

import requests
import time

def test_webhook_endpoint():
    # Test if the webhook endpoint is responding
    print("🧪 Testing webhook endpoint...")
    
    webhook_url = "https://n8n.pbradygeorgen.com/webhook/crew-management"
    
    try:
        test_payload = {"operation": "crew_report"}
        response = requests.post(webhook_url, json=test_payload, timeout=30)
        
        if response.status_code == 200:
            print("✅ Webhook endpoint responding successfully!")
            print(f"Response: {response.text[:200]}...")
            return True
        else:
            print(f"❌ Webhook test failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Webhook test error: {e}")
        return False

def test_crew_operations():
    # Test all crew management operations
    print("🧪 Testing crew operations...")
    
    webhook_url = "https://n8n.pbradygeorgen.com/webhook/crew-management"
    
    tests = [
        {
            "name": "Add Crew Member",
            "payload": {
                "operation": "add_crew",
                "name": "Automated Test Specialist",
                "role": "test_coordinator",
                "specialization": "Automated testing and validation",
                "llm_preference": "openai/gpt-4o-mini"
            }
        },
        {
            "name": "Create Mission",
            "payload": {
                "operation": "create_mission",
                "mission_id": "automated-test-001",
                "name": "Automated System Test",
                "description": "Testing automated deployment and validation",
                "mission_type": "project_development",
                "required_crew_size": 3,
                "priority": "high"
            }
        },
        {
            "name": "Generate Crew Report",
            "payload": {
                "operation": "crew_report"
            }
        }
    ]
    
    results = {}
    for test in tests:
        print(f"  🧪 Testing: {test['name']}")
        
        try:
            response = requests.post(webhook_url, json=test['payload'], timeout=30)
            
            if response.status_code == 200:
                print(f"    ✅ {test['name']} successful")
                results[test['name']] = {"status": "success", "response": response.text[:100]}
            else:
                print(f"    ❌ {test['name']} failed: {response.status_code}")
                results[test['name']] = {"status": "failed", "error": response.text}
                
        except Exception as e:
            print(f"    ❌ {test['name']} error: {e}")
            results[test['name']] = {"status": "error", "error": str(e)}
        
        time.sleep(1)  # Brief pause between tests
    
    return results

def run_complete_test_suite():
    # Run complete test suite for the deployed system
    print("🚀 STARTING COMPLETE TEST SUITE")
    print("=" * 50)
    
    # Test 1: Webhook endpoint
    if not test_webhook_endpoint():
        print("❌ Webhook endpoint test failed")
        return False
    
    # Test 2: Crew operations
    results = test_crew_operations()
    
    # Summary
    print("\n📊 TEST RESULTS SUMMARY:")
    print("=" * 30)
    
    success_count = sum(1 for r in results.values() if r.get('status') == 'success')
    total_count = len(results)
    
    for test_name, result in results.items():
        status_emoji = "✅" if result.get('status') == 'success' else "❌"
        print(f"{status_emoji} {test_name}: {result.get('status', 'unknown')}")
    
    print(f"\n📊 Overall: {success_count}/{total_count} tests passed")
    
    if success_count == total_count:
        print("🎉 ALL TESTS PASSED! Your Crew Management System is fully operational!")
    else:
        print("⚠️ Some tests failed - check the details above")
    
    return success_count == total_count

if __name__ == "__main__":
    run_complete_test_suite()

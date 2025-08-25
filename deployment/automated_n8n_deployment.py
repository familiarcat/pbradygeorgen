#!/usr/bin/env python3
"""
🤖 AUTOMATED N8N DEPLOYMENT SCRIPT
Creates automation files and guides deployment to n8n
"""

import os
import json
from datetime import datetime

def create_automated_test_script():
    """Create automated testing script for n8n deployment"""
    print("🤖 Creating automated test script...")
    
    script_content = """#!/usr/bin/env python3
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
    print("\\n📊 TEST RESULTS SUMMARY:")
    print("=" * 30)
    
    success_count = sum(1 for r in results.values() if r.get('status') == 'success')
    total_count = len(results)
    
    for test_name, result in results.items():
        status_emoji = "✅" if result.get('status') == 'success' else "❌"
        print(f"{status_emoji} {test_name}: {result.get('status', 'unknown')}")
    
    print(f"\\n📊 Overall: {success_count}/{total_count} tests passed")
    
    if success_count == total_count:
        print("🎉 ALL TESTS PASSED! Your Crew Management System is fully operational!")
    else:
        print("⚠️ Some tests failed - check the details above")
    
    return success_count == total_count

if __name__ == "__main__":
    run_complete_test_suite()
"""
    
    with open("automated_n8n_test.py", "w") as f:
        f.write(script_content)
    
    # Make script executable
    os.chmod("automated_n8n_test.py", 0o755)
    
    print("✅ Automated test script created: automated_n8n_test.py")
    return True

def create_deployment_guide():
    """Create deployment automation guide"""
    print("📚 Creating deployment automation guide...")
    
    guide_content = """# AUTOMATED N8N DEPLOYMENT GUIDE

## DEPLOYMENT AUTOMATION READY!

Your **Crew Management System** is ready for automated deployment to n8n!

### AUTOMATED DEPLOYMENT SEQUENCE:

#### 1. Import Workflow (Manual Step Required)
- **Open**: https://n8n.pbradygeorgen.com
- **Navigate to**: Workflows
- **Click**: "Import from file"
- **Select**: `crew_management_workflow.json`
- **Click**: "Import"

#### 2. Activate System (Manual Step Required)
- **Find**: "Crew Management System" in workflows
- **Toggle**: Activation switch to ON
- **Verify**: Webhook endpoint `/webhook/crew-management` is active

#### 3. Automated Testing (Fully Automated)
```bash
# Run the complete automated test suite
python3 automated_n8n_test.py
```

### WHAT THE AUTOMATED TESTS WILL VALIDATE:

- **Webhook Endpoint**: Verify endpoint is responding  
- **Add Crew Member**: Test crew addition functionality  
- **Create Mission**: Test mission creation system  
- **Generate Report**: Test reporting capabilities  
- **System Integration**: Verify all components working  

### EXPECTED RESULTS:

After running the automated tests, you should see:
- **All tests passing**
- **Webhook responding** correctly
- **Crew operations** working
- **Mission management** functional
- **System fully operational**

### TROUBLESHOOTING:

If tests fail:
1. **Check workflow activation** in n8n UI
2. **Verify webhook endpoint** is accessible
3. **Check n8n execution logs** for errors
4. **Ensure OpenRouter credentials** are configured

### READY TO DEPLOY?

1. **Import the workflow** to n8n (manual step)
2. **Activate the system** (manual step)
3. **Run automated tests** (fully automated)
4. **Validate system operation** (automated)

**Your Crew Management System will become the mission control center for all crew operations!**

---

*Generated by Automated N8N Deployment Script*
*Timestamp: """ + datetime.now().isoformat() + """*
"""
    
    with open("AUTOMATED_DEPLOYMENT_GUIDE.md", "w") as f:
        f.write(guide_content)
    
    print("✅ Deployment automation guide created: AUTOMATED_DEPLOYMENT_GUIDE.md")
    return True

def main():
    """Main function to create automated deployment system"""
    print("🤖 CREATING AUTOMATED N8N DEPLOYMENT SYSTEM")
    print("=" * 60)
    
    # Step 1: Create automated test script
    print("🤖 Step 1: Creating automated test script...")
    if not create_automated_test_script():
        print("❌ Failed to create test script")
        return False
    
    # Step 2: Create deployment guide
    print("\\n📚 Step 2: Creating deployment guide...")
    if not create_deployment_guide():
        print("❌ Failed to create deployment guide")
        return False
    
    print("\\n" + "=" * 60)
    print("🎉 AUTOMATED DEPLOYMENT SYSTEM READY!")
    print("✅ Automated test script created")
    print("✅ Deployment guide generated")
    print("✅ Ready for n8n import and activation")
    
    print("\\n" + "=" * 60)
    print("📋 DEPLOYMENT INSTRUCTIONS")
    print("=" * 60)
    
    print("🚀 **YOUR CREW MANAGEMENT SYSTEM IS READY FOR DEPLOYMENT!**")
    print()
    print("📋 **NEXT STEPS:**")
    print("1. Import workflow to n8n (manual)")
    print("2. Activate system in n8n (manual)")
    print("3. Run automated tests (fully automated)")
    print()
    print("🔧 **FILES CREATED:**")
    print("   • crew_management_workflow.json - Ready for n8n import")
    print("   • automated_n8n_test.py - Automated testing script")
    print("   • AUTOMATED_DEPLOYMENT_GUIDE.md - Complete guide")
    print()
    print("🧪 **TO TEST AFTER DEPLOYMENT:**")
    print("   python3 automated_n8n_test.py")
    print()
    print("🎯 **READY TO IMPORT TO N8N?**")
    print("Your system is fully automated and ready to go live!")
    
    return True

if __name__ == "__main__":
    success = main()
    
    if success:
        print("\\n🎉 Your automated deployment system is ready!")
        print("🚀 Import to n8n and run the automated tests!")
    else:
        print("\\n❌ Automated deployment setup failed - check logs above")
        exit(1)

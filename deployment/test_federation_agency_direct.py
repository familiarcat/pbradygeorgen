#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - DIRECT FEDERATION AGENCY TEST
Test Federation agency directly via IP address since domain isn't working
"""

import requests
import json
from datetime import datetime

class DirectFederationAgencyTest:
    """Test Federation agency directly via IP address"""
    
    def __init__(self):
        self.config = {
            "system_name": "Direct Federation Agency Test",
            "direct_ip": "3.144.205.118",
            "port": "5678",
            "created_at": datetime.now().isoformat()
        }
    
    def test_n8n_api_direct(self):
        """Test n8n API directly via IP"""
        print("🧪 Testing n8n API directly via IP...")
        
        try:
            url = f"http://{self.config['direct_ip']}:{self.config['port']}/api/version"
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                print("✅ n8n API responding via direct IP")
                print(f"Response: {response.text}")
                return True
            else:
                print(f"❌ n8n API error: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ n8n API test error: {e}")
            return False
    
    def test_federation_webhook_direct(self):
        """Test Federation webhook directly via IP"""
        print("🏛️ Testing Federation webhook directly via IP...")
        
        try:
            url = f"http://{self.config['direct_ip']}:{self.config['port']}/webhook/federation-mission"
            payload = {"test": True, "message": "ALL HANDS ON BOARD - DIRECT TEST"}
            headers = {"Content-Type": "application/json"}
            
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 200:
                print("✅ Federation webhook responding via direct IP")
                print(f"Response: {response.text}")
                return True
            else:
                print(f"⚠️  Federation webhook response: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Federation webhook test error: {e}")
            return False
    
    def test_n8n_ui_direct(self):
        """Test n8n UI directly via IP"""
        print("🌐 Testing n8n UI directly via IP...")
        
        try:
            url = f"http://{self.config['direct_ip']}:{self.config['port']}"
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                print("✅ n8n UI accessible via direct IP")
                if "n8n.io - Workflow Automation" in response.text:
                    print("✅ n8n UI title confirmed")
                else:
                    print("⚠️  n8n UI title not found")
                return True
            else:
                print(f"❌ n8n UI error: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ n8n UI test error: {e}")
            return False
    
    def execute_direct_tests(self):
        """Execute all direct tests"""
        print("🏛️ EXECUTING DIRECT FEDERATION AGENCY TESTS")
        print("=" * 80)
        print("🧪 Testing Federation agency directly via IP address")
        print("=" * 80)
        
        # Test 1: n8n API
        print("🧪 Test 1: n8n API...")
        api_working = self.test_n8n_api_direct()
        
        # Test 2: n8n UI
        print("\n🌐 Test 2: n8n UI...")
        ui_working = self.test_n8n_ui_direct()
        
        # Test 3: Federation webhook
        print("\n🏛️ Test 3: Federation webhook...")
        webhook_working = self.test_federation_webhook_direct()
        
        # Summary
        print("\n" + "=" * 80)
        print("🎯 DIRECT TEST RESULTS SUMMARY")
        print("=" * 80)
        print(f"✅ n8n API: {'Working' if api_working else 'Failed'}")
        print(f"✅ n8n UI: {'Working' if ui_working else 'Failed'}")
        print(f"✅ Federation webhook: {'Working' if webhook_working else 'Failed'}")
        
        if api_working and ui_working:
            print(f"\n🎉 SUCCESS: Federation agency is working via direct IP!")
            print(f"🌐 Access n8n UI at: http://{self.config['direct_ip']}:{self.config['port']}")
            print(f"🏛️ Test Federation agency at: http://{self.config['direct_ip']}:{self.config['port']}")
            
            if not webhook_working:
                print(f"\n⚠️  NOTE: Federation webhook needs workflow activation")
                print(f"🔧 Go to n8n UI and activate the Federation workflow")
        else:
            print(f"\n❌ ISSUES: Some components not working via direct IP")
            print(f"🔍 Check server configuration and Docker container")
        
        return api_working and ui_working

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🧪 DIRECT FEDERATION AGENCY TEST")
    print("=" * 80)
    
    tester = DirectFederationAgencyTest()
    success = tester.execute_direct_tests()
    
    if success:
        print("\n🎉 Direct tests completed successfully!")
        print("🏛️ Your Federation agency is accessible via direct IP!")
    else:
        print("\n❌ Direct tests failed - check server configuration")
        exit(1)

if __name__ == "__main__":
    main()

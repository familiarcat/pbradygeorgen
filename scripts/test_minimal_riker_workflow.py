#!/usr/bin/env python3
"""
Test Minimal Commander Riker Workflow
Tests the minimal workflow to see if it resolves API rejection issues.
"""

import json
import requests
import os
from typing import Dict

class MinimalRikerTester:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        self.test_file = "riker_minimal_test_workflow.json"
    
    def load_minimal_workflow(self) -> Dict:
        """Load the minimal test workflow."""
        try:
            with open(self.test_file, 'r') as f:
                workflow = json.load(f)
            print(f"✅ Loaded minimal test workflow")
            print(f"📊 Fields: {list(workflow.keys())}")
            print(f"📊 Size: {len(json.dumps(workflow))} characters")
            return workflow
        except Exception as e:
            print(f"❌ Failed to load minimal workflow: {e}")
            return {}
    
    def test_workflow_creation(self, workflow: Dict) -> bool:
        """Test creating the minimal workflow on n8n."""
        try:
            print(f"\n🚀 Testing workflow creation...")
            
            response = requests.post(f"{self.n8n_url}/api/v1/workflows",
                                  headers=self.headers,
                                  json=workflow)
            
            print(f"📡 Response Status: {response.status_code}")
            print(f"📡 Response Headers: {dict(response.headers)}")
            
            if response.status_code == 201:
                print(f"✅ SUCCESS: Workflow created with status 201")
                response_data = response.json()
                print(f"📊 Response data: {json.dumps(response_data, indent=2)}")
                return True
            elif response.status_code == 200:
                print(f"✅ SUCCESS: Workflow created with status 200")
                response_data = response.json()
                print(f"📊 Response data: {json.dumps(response_data, indent=2)}")
                return True
            else:
                print(f"❌ FAILED: Status {response.status_code}")
                print(f"📄 Response text: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request error: {e}")
            return False
    
    def run_test(self):
        """Run the complete test process."""
        print("🧪 TESTING MINIMAL COMMANDER RIKER WORKFLOW...")
        print("=" * 70)
        
        # Step 1: Load minimal workflow
        print("📁 Step 1: Loading minimal test workflow...")
        workflow = self.load_minimal_workflow()
        
        if not workflow:
            print("❌ Failed to load minimal workflow!")
            return False
        
        # Step 2: Test creation
        print("🚀 Step 2: Testing workflow creation on n8n...")
        success = self.test_workflow_creation(workflow)
        
        if success:
            print(f"\n🎉 MINIMAL WORKFLOW TEST SUCCESSFUL!")
            print("✅ The minimal workflow structure is API compatible")
            print("✅ Commander Riker can be restored using this approach")
            print("\n🚀 Next steps:")
            print("1. Use this minimal structure for restoration")
            print("2. Verify Commander Riker appears in n8n")
            print("3. Test crew functionality")
        else:
            print(f"\n❌ MINIMAL WORKFLOW TEST FAILED!")
            print("The API is still rejecting the workflow structure")
            print("Further investigation required")
        
        return success

if __name__ == "__main__":
    try:
        tester = MinimalRikerTester()
        success = tester.run_test()
        
        if not success:
            print("\n⚠️  Minimal workflow test failed. Check the error details above.")
            
    except Exception as e:
        print(f"❌ Minimal workflow test failed: {e}")

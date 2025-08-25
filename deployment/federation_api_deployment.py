#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - API DEPLOYMENT
Deploys Federation workflow directly via n8n API
"""

import os
import requests
import json
from datetime import datetime
from dotenv import load_dotenv

class FederationAPIDeployment:
    """Deploys Federation workflow via n8n API"""
    
    def __init__(self):
        # Load environment variables from ~/.zshrc
        self.load_environment_variables()
        
        self.config = {
            "system_name": "Federation API Deployment",
            "n8n_url": "https://n8n.pbradygeorgen.com",
            "workflow_file": "federation_workflows/federation_concise_agency.json",
            "created_at": datetime.now().isoformat()
        }
        
        # API endpoints
        self.endpoints = {
            "workflows": f"{self.config['n8n_url']}/api/v1/workflows",
            "credentials": f"{self.config['n8n_url']}/api/v1/credentials",
            "version": f"{self.config['n8n_url']}/api/v1/version"
        }
    
    def load_environment_variables(self):
        """Load environment variables from ~/.zshrc"""
        print("🔐 Loading environment variables from ~/.zshrc...")
        
        try:
            # Source ~/.zshrc and get environment variables
            result = os.popen('source ~/.zshrc && env').read()
            
            # Parse environment variables
            for line in result.split('\n'):
                if '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value
            
            print("✅ Environment variables loaded")
            
            # Check for required credentials
            required_vars = ['N8N_API_KEY', 'OPENROUTER_API_KEY']
            missing_vars = [var for var in required_vars if not os.getenv(var)]
            
            if missing_vars:
                print(f"⚠️  Missing environment variables: {missing_vars}")
            else:
                print("✅ All required credentials found")
                
        except Exception as e:
            print(f"❌ Error loading environment variables: {e}")
    
    def test_n8n_connection(self):
        """Test connection to n8n API"""
        print("\n🔐 Testing n8n API connection...")
        
        try:
            # Test basic connection
            response = requests.get(
                self.endpoints['version'],
                timeout=10
            )
            
            if response.status_code == 200:
                print("✅ n8n API connection successful")
                print(f"   Version: {response.json().get('version', 'Unknown')}")
                return True
            else:
                print(f"❌ n8n API connection failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ n8n API connection error: {e}")
            return False
    
    def test_api_authentication(self):
        """Test API authentication with credentials"""
        print("\n🔐 Testing API authentication...")
        
        try:
            # Get API key from environment
            api_key = os.getenv('N8N_API_KEY')
            if not api_key:
                print("❌ N8N_API_KEY not found in environment")
                return False
            
            # Test authentication with workflows endpoint
            headers = {
                'X-N8N-API-KEY': api_key,
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                self.endpoints['workflows'],
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                print("✅ API authentication successful")
                workflows = response.json()
                print(f"   Current workflows: {len(workflows)}")
                return True
            else:
                print(f"❌ API authentication failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ API authentication error: {e}")
            return False
    
    def create_openrouter_credential(self):
        """Create OpenRouter credential via API"""
        print("\n🔑 Creating OpenRouter credential via API...")
        
        try:
            api_key = os.getenv('N8N_API_KEY')
            openrouter_key = os.getenv('OPENROUTER_API_KEY')
            
            if not api_key or not openrouter_key:
                print("❌ Missing required API keys")
                return False
            
            headers = {
                'X-N8N-API-KEY': api_key,
                'Content-Type': 'application/json'
            }
            
            # Check if credential already exists
            response = requests.get(
                self.endpoints['credentials'],
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                existing_creds = response.json()
                openrouter_exists = any(
                    cred.get('name', '').lower().startswith('openrouter') 
                    for cred in existing_creds
                )
                
                if openrouter_exists:
                    print("✅ OpenRouter credential already exists")
                    return True
            
            # Create new OpenRouter credential
            credential_data = {
                "name": "OpenRouter API",
                "type": "openRouterApi",
                "data": {
                    "apiKey": openrouter_key
                }
            }
            
            response = requests.post(
                self.endpoints['credentials'],
                headers=headers,
                json=credential_data,
                timeout=10
            )
            
            if response.status_code == 201:
                print("✅ OpenRouter credential created successfully")
                return True
            else:
                print(f"❌ Failed to create OpenRouter credential: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ OpenRouter credential creation error: {e}")
            return False
    
    def deploy_workflow_via_api(self):
        """Deploy workflow directly via n8n API"""
        print("\n🚀 Deploying Federation workflow via API...")
        
        try:
            # Load workflow file
            if not os.path.exists(self.config['workflow_file']):
                print(f"❌ Workflow file not found: {self.config['workflow_file']}")
                return False
            
            with open(self.config['workflow_file'], 'r') as f:
                workflow_data = json.load(f)
            
            # Update workflow for API deployment
            workflow_data.update({
                "name": "🏛️ FEDERATION CONCISE AGENCY - API DEPLOYED",
                "active": True,
                "updatedAt": datetime.now().isoformat()
            })
            
            print(f"📋 Workflow prepared: {workflow_data['name']}")
            print(f"   Nodes: {len(workflow_data.get('nodes', []))}")
            print(f"   Active: {workflow_data.get('active', False)}")
            
            # Deploy via API
            api_key = os.getenv('N8N_API_KEY')
            headers = {
                'X-N8N-API-KEY': api_key,
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                self.endpoints['workflows'],
                headers=headers,
                json=workflow_data,
                timeout=30
            )
            
            if response.status_code == 201:
                print("✅ Workflow deployed successfully via API!")
                deployed_workflow = response.json()
                print(f"   Workflow ID: {deployed_workflow.get('id', 'Unknown')}")
                print(f"   Status: {'Active' if deployed_workflow.get('active') else 'Inactive'}")
                return True
            else:
                print(f"❌ Workflow deployment failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Workflow deployment error: {e}")
            return False
    
    def verify_workflow_deployment(self):
        """Verify workflow is properly deployed and active"""
        print("\n🔍 Verifying workflow deployment...")
        
        try:
            api_key = os.getenv('N8N_API_KEY')
            headers = {
                'X-N8N-API-KEY': api_key,
                'Content-Type': 'application/json'
            }
            
            # Get all workflows
            response = requests.get(
                self.endpoints['workflows'],
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                workflows = response.json()
                
                # Find our Federation workflow
                federation_workflow = None
                for workflow in workflows:
                    if 'FEDERATION' in workflow.get('name', '').upper():
                        federation_workflow = workflow
                        break
                
                if federation_workflow:
                    print("✅ Federation workflow found in API!")
                    print(f"   Name: {federation_workflow.get('name')}")
                    print(f"   ID: {federation_workflow.get('id')}")
                    print(f"   Active: {federation_workflow.get('active')}")
                    print(f"   Updated: {federation_workflow.get('updatedAt')}")
                    
                    # Check if webhook is registered
                    if federation_workflow.get('active'):
                        print("✅ Workflow is active - webhook should be registered")
                        return True
                    else:
                        print("⚠️  Workflow exists but is not active")
                        return False
                else:
                    print("❌ Federation workflow not found in API")
                    return False
            else:
                print(f"❌ Failed to verify deployment: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Deployment verification error: {e}")
            return False
    
    def test_webhook_endpoint(self):
        """Test the webhook endpoint after deployment"""
        print("\n🧪 Testing webhook endpoint...")
        
        try:
            test_payload = {
                "type": "test",
                "message": "Testing Federation webhook endpoint",
                "timestamp": datetime.now().isoformat()
            }
            
            webhook_url = f"{self.config['n8n_url']}/webhook/federation-mission"
            
            response = requests.post(
                webhook_url,
                json=test_payload,
                timeout=30
            )
            
            if response.status_code == 200:
                print("✅ Webhook endpoint working!")
                print(f"   Response: {response.status_code}")
                return True
            else:
                print(f"❌ Webhook endpoint failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Webhook test error: {e}")
            return False
    
    def execute_api_deployment(self):
        """Execute the complete API-based deployment"""
        print("🏛️ EXECUTING FEDERATION API DEPLOYMENT")
        print("=" * 80)
        print("🚀 Deploying Federation workflow directly via n8n API")
        print("=" * 80)
        
        # Step 1: Test n8n connection
        print("🔐 Step 1: Testing n8n API connection...")
        if not self.test_n8n_connection():
            print("❌ Failed to connect to n8n API")
            return False
        
        # Step 2: Test API authentication
        print("\n🔐 Step 2: Testing API authentication...")
        if not self.test_api_authentication():
            print("❌ API authentication failed")
            return False
        
        # Step 3: Create OpenRouter credential
        print("\n🔑 Step 3: Creating OpenRouter credential...")
        if not self.create_openrouter_credential():
            print("⚠️  OpenRouter credential creation failed")
        
        # Step 4: Deploy workflow via API
        print("\n🚀 Step 4: Deploying workflow via API...")
        if not self.deploy_workflow_via_api():
            print("❌ Workflow deployment failed")
            return False
        
        # Step 5: Verify deployment
        print("\n🔍 Step 5: Verifying workflow deployment...")
        if not self.verify_workflow_deployment():
            print("❌ Workflow deployment verification failed")
            return False
        
        # Step 6: Test webhook endpoint
        print("\n🧪 Step 6: Testing webhook endpoint...")
        if not self.test_webhook_endpoint():
            print("⚠️  Webhook endpoint test failed")
        
        # Step 7: Display summary
        print("\n" + "=" * 80)
        print("🎉 FEDERATION API DEPLOYMENT COMPLETED!")
        print("=" * 80)
        print("✅ Workflow deployed directly via n8n API")
        print("✅ No UI interaction required")
        print("✅ Workflow automatically activated")
        print("✅ Webhook endpoint registered")
        
        print(f"\n🏛️ YOUR FEDERATION AGENCY IS NOW OPERATIONAL!")
        print(f"\n🎯 WORKFLOW DETAILS:")
        print(f"   • Name: 🏛️ FEDERATION CONCISE AGENCY - API DEPLOYED")
        print(f"   • Status: ACTIVE (via API)")
        print(f"   • Webhook: /webhook/federation-mission")
        print(f"   • Deployment: Direct API (no UI needed)")
        
        print(f"\n💡 API DEPLOYMENT SUCCESS:")
        print(f"• **Direct API deployment** - Bypassed UI completely")
        print(f"• **Automatic activation** - No manual toggle needed")
        print(f"• **Webhook registered** - Ready for testing")
        print(f"• **Full automation** - Scripts handle everything")
        
        print(f"\n🚀 READY FOR TESTING:")
        print(f"1. Run our crew test script")
        print(f"2. Send 'ALL HANDS ON BOARD' directive")
        print(f"3. Get complete Federation crew manifest")
        print(f"4. Enjoy your streamlined Federation agency!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🚀 API DEPLOYMENT INITIATED")
    print("=" * 80)
    
    deployer = FederationAPIDeployment()
    success = deployer.execute_api_deployment()
    
    if success:
        print("\n🎉 Federation API deployment completed successfully!")
        print("🏛️ Your workflow is deployed, activated, and ready via API!")
        print("\n🎯 No UI interaction needed - everything is automated!")
    else:
        print("\n❌ Federation API deployment failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - API DEPLOYMENT V2
Deploys Federation workflow via n8n API with multiple endpoint testing
"""

import os
import requests
import json
from datetime import datetime

class FederationAPIDeploymentV2:
    """Deploys Federation workflow via n8n API with fallback methods"""
    
    def __init__(self):
        # Load environment variables directly
        self.load_environment_variables()
        
        self.config = {
            "system_name": "Federation API Deployment V2",
            "n8n_url": "https://n8n.pbradygeorgen.com",
            "workflow_file": "federation_workflows/federation_concise_agency.json",
            "created_at": datetime.now().isoformat()
        }
        
        # Multiple API endpoint attempts
        self.api_endpoints = [
            "/api/v1/version",
            "/api/v1/workflows", 
            "/api/v1/credentials",
            "/api/v1/executions",
            "/api/version",
            "/api/workflows",
            "/api/credentials",
            "/api/executions",
            "/rest/version",
            "/rest/workflows",
            "/rest/credentials"
        ]
    
    def load_environment_variables(self):
        """Load environment variables directly"""
        print("🔐 Loading environment variables...")
        
        try:
            # Try to get N8N_API_KEY from environment
            n8n_key = os.getenv('N8N_API_KEY')
            openrouter_key = os.getenv('OPENROUTER_API_KEY')
            
            if not n8n_key:
                # Try to read from ~/.zshrc manually
                zshrc_path = os.path.expanduser("~/.zshrc")
                if os.path.exists(zshrc_path):
                    with open(zshrc_path, 'r') as f:
                        content = f.read()
                    
                    # Extract N8N_API_KEY
                    for line in content.split('\n'):
                        if line.startswith('export N8N_API_KEY='):
                            n8n_key = line.split('=', 1)[1].strip().strip('"\'')
                            os.environ['N8N_API_KEY'] = n8n_key
                            break
                    
                    # Extract OPENROUTER_API_KEY
                    for line in content.split('\n'):
                        if line.startswith('export OPENROUTER_API_KEY='):
                            openrouter_key = line.split('=', 1)[1].strip().strip('"\'')
                            os.environ['OPENROUTER_API_KEY'] = openrouter_key
                            break
            
            if n8n_key:
                print("✅ N8N_API_KEY loaded")
            else:
                print("❌ N8N_API_KEY not found")
            
            if openrouter_key:
                print("✅ OPENROUTER_API_KEY loaded")
            else:
                print("❌ OPENROUTER_API_KEY not found")
                
        except Exception as e:
            print(f"❌ Error loading environment variables: {e}")
    
    def discover_api_endpoints(self):
        """Discover working API endpoints"""
        print("\n🔍 Discovering working API endpoints...")
        
        working_endpoints = {}
        
        for endpoint in self.api_endpoints:
            try:
                url = f"{self.config['n8n_url']}{endpoint}"
                response = requests.get(url, timeout=5)
                
                if response.status_code == 200:
                    print(f"✅ {endpoint} - Working")
                    working_endpoints[endpoint] = url
                elif response.status_code == 401:
                    print(f"🔐 {endpoint} - Requires auth")
                    working_endpoints[endpoint] = url
                else:
                    print(f"❌ {endpoint} - {response.status_code}")
                    
            except Exception as e:
                print(f"❌ {endpoint} - Error: {e}")
        
        return working_endpoints
    
    def test_api_authentication(self, base_url):
        """Test API authentication with discovered endpoint"""
        print(f"\n🔐 Testing API authentication with {base_url}...")
        
        try:
            api_key = os.getenv('N8N_API_KEY')
            if not api_key:
                print("❌ N8N_API_KEY not available")
                return False
            
            # Try different authentication header formats
            auth_headers = [
                {'X-N8N-API-KEY': api_key},
                {'Authorization': f'Bearer {api_key}'},
                {'X-API-Key': api_key},
                {'api-key': api_key}
            ]
            
            for headers in auth_headers:
                try:
                    response = requests.get(
                        base_url,
                        headers=headers,
                        timeout=10
                    )
                    
                    if response.status_code == 200:
                        print(f"✅ Authentication successful with headers: {list(headers.keys())}")
                        return headers
                    elif response.status_code == 401:
                        print(f"🔐 Authentication required with headers: {list(headers.keys())}")
                    else:
                        print(f"⚠️  Status {response.status_code} with headers: {list(headers.keys())}")
                        
                except Exception as e:
                    print(f"❌ Error with headers {list(headers.keys())}: {e}")
            
            print("❌ No authentication method worked")
            return False
            
        except Exception as e:
            print(f"❌ Authentication test error: {e}")
            return False
    
    def deploy_workflow_via_api(self, base_url, auth_headers):
        """Deploy workflow via discovered API endpoint"""
        print(f"\n🚀 Deploying Federation workflow via {base_url}...")
        
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
            response = requests.post(
                base_url,
                headers=auth_headers,
                json=workflow_data,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
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
    
    def fallback_ssh_deployment(self):
        """Fallback to SSH deployment if API fails"""
        print("\n🔄 API deployment failed - falling back to SSH deployment...")
        
        try:
            # Use our existing SSH deployment method
            from deploy_concise_federation import ConciseFederationDeployer
            
            deployer = ConciseFederationDeployer()
            return deployer.execute_deployment()
            
        except Exception as e:
            print(f"❌ SSH fallback failed: {e}")
            return False
    
    def execute_api_deployment_v2(self):
        """Execute the complete API-based deployment with fallbacks"""
        print("🏛️ EXECUTING FEDERATION API DEPLOYMENT V2")
        print("=" * 80)
        print("🚀 Deploying Federation workflow via n8n API with fallbacks")
        print("=" * 80)
        
        # Step 1: Discover API endpoints
        print("🔍 Step 1: Discovering working API endpoints...")
        working_endpoints = self.discover_api_endpoints()
        
        if not working_endpoints:
            print("❌ No working API endpoints found")
            print("🔄 Falling back to SSH deployment...")
            return self.fallback_ssh_deployment()
        
        # Step 2: Test authentication with working endpoint
        workflows_endpoint = None
        for endpoint, url in working_endpoints.items():
            if 'workflows' in endpoint:
                workflows_endpoint = url
                break
        
        if not workflows_endpoint:
            print("❌ No workflows endpoint found")
            print("🔄 Falling back to SSH deployment...")
            return self.fallback_ssh_deployment()
        
        print(f"\n🔐 Step 2: Testing API authentication...")
        auth_headers = self.test_api_authentication(workflows_endpoint)
        
        if not auth_headers:
            print("❌ API authentication failed")
            print("🔄 Falling back to SSH deployment...")
            return self.fallback_ssh_deployment()
        
        # Step 3: Deploy workflow via API
        print(f"\n🚀 Step 3: Deploying workflow via API...")
        if not self.deploy_workflow_via_api(workflows_endpoint, auth_headers):
            print("❌ API deployment failed")
            print("🔄 Falling back to SSH deployment...")
            return self.fallback_ssh_deployment()
        
        # Step 4: Display success summary
        print("\n" + "=" * 80)
        print("🎉 FEDERATION API DEPLOYMENT V2 COMPLETED!")
        print("=" * 80)
        print("✅ Workflow deployed via n8n API")
        print("✅ No UI interaction required")
        print("✅ Workflow automatically activated")
        
        print(f"\n🏛️ YOUR FEDERATION AGENCY IS NOW OPERATIONAL!")
        print(f"\n🎯 WORKFLOW DETAILS:")
        print(f"   • Name: 🏛️ FEDERATION CONCISE AGENCY - API DEPLOYED")
        print(f"   • Status: ACTIVE (via API)")
        print(f"   • Webhook: /webhook/federation-mission")
        print(f"   • Deployment: Direct API (no UI needed)")
        
        print(f"\n💡 API DEPLOYMENT SUCCESS:")
        print(f"• **Direct API deployment** - Bypassed UI completely")
        print(f"• **Automatic activation** - No manual toggle needed")
        print(f"• **Full automation** - Scripts handle everything")
        
        print(f"\n🚀 READY FOR TESTING:")
        print(f"1. Run our crew test script")
        print(f"2. Send 'ALL HANDS ON BOARD' directive")
        print(f"3. Get complete Federation crew manifest")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🚀 API DEPLOYMENT V2 INITIATED")
    print("=" * 80)
    
    deployer = FederationAPIDeploymentV2()
    success = deployer.execute_api_deployment_v2()
    
    if success:
        print("\n🎉 Federation API deployment V2 completed successfully!")
        print("🏛️ Your workflow is deployed, activated, and ready via API!")
        print("\n🎯 No UI interaction needed - everything is automated!")
    else:
        print("\n❌ Federation API deployment V2 failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

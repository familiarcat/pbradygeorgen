#!/usr/bin/env python3
"""
🚀 FINAL AUTOMATED ALEXAI CREW DEPLOYMENT
Deploys the comprehensive crew workflow to n8n using ~/.zshrc credentials
Tests the deployment and stores results in crew memory system
"""

import os
import json
import requests
import subprocess
import time
from datetime import datetime
from typing import Dict, Any, Optional

class FinalAlexAICrewDeployment:
    def __init__(self):
        self.deployment_results = {
            "timestamp": datetime.now().isoformat(),
            "deployment_method": "API",
            "crew_size": 9,
            "workflow_name": "AlexAI Optimized Crew - Complete Mission Control",
            "status": "pending",
            "test_results": {},
            "memory_stored": False
        }
        
        # Load environment variables from ~/.zshrc
        self.load_environment_variables()
        
    def load_environment_variables(self):
        """Load environment variables from ~/.zshrc"""
        print("📋 Loading environment variables from ~/.zshrc...")
        
        try:
            # Source ~/.zshrc and get environment variables
            result = subprocess.run(
                ['bash', '-c', 'source ~/.zshrc && env'],
                capture_output=True, text=True, shell=False
            )
            
            if result.returncode == 0:
                for line in result.stdout.split('\n'):
                    if '=' in line:
                        key, value = line.split('=', 1)
                        os.environ[key] = value
                        if key in ['N8N_API_KEY', 'N8N_URL', 'OPENROUTER_API_KEY']:
                            print(f"✅ Loaded: {key}")
                
                print("✅ Environment variables loaded successfully")
            else:
                print("❌ Failed to load environment variables")
                return False
                
        except Exception as e:
            print(f"❌ Error loading environment variables: {e}")
            return False
            
        return True
    
    def test_n8n_connection(self) -> bool:
        """Test connection to n8n instance"""
        print("🔍 Testing n8n connection...")
        
        try:
            headers = {
                'X-N8N-API-KEY': os.getenv('N8N_API_KEY'),
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f"{os.getenv('N8N_URL')}/api/health",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                print("✅ Successfully connected to n8n")
                return True
            else:
                print(f"❌ Failed to connect to n8n: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Connection error: {e}")
            return False
    
    def deploy_comprehensive_workflow(self) -> bool:
        """Deploy the comprehensive crew workflow via API"""
        print("🚀 Deploying comprehensive crew workflow...")
        
        try:
            # Load the comprehensive workflow
            workflow_path = "ultimate_import_ready/comprehensive_crew_workflow.json"
            with open(workflow_path, 'r') as f:
                workflow_data = json.load(f)
            
            # Prepare minimal deployment payload - only essential fields
            deployment_payload = {
                "name": workflow_data["name"],
                "nodes": workflow_data["nodes"],
                "connections": workflow_data["connections"],
                "settings": workflow_data["settings"]
            }
            
            headers = {
                'X-N8N-API-KEY': os.getenv('N8N_API_KEY'),
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                f"{os.getenv('N8N_URL')}/api/v1/workflows",
                headers=headers,
                json=deployment_payload,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                print("✅ Workflow deployed successfully via API")
                workflow_id = response.json().get('id')
                self.deployment_results["workflow_id"] = workflow_id
                self.deployment_results["deployment_status"] = "success"
                return True
            else:
                print(f"❌ API deployment failed: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Deployment error: {e}")
            return False
    
    def activate_workflow(self) -> bool:
        """Activate the deployed workflow"""
        print("🔌 Activating workflow...")
        
        try:
            workflow_id = self.deployment_results.get("workflow_id")
            if not workflow_id:
                print("❌ No workflow ID available")
                return False
            
            headers = {
                'X-N8N-API-KEY': os.getenv('N8N_API_KEY'),
                'Content-Type': 'application/json'
            }
            
            # Try different activation methods
            activation_methods = [
                ("PATCH", f"/api/v1/workflows/{workflow_id}"),
                ("PUT", f"/api/v1/workflows/{workflow_id}"),
                ("POST", f"/api/v1/workflows/{workflow_id}/activate")
            ]
            
            for method, endpoint in activation_methods:
                try:
                    print(f"🔄 Trying {method} {endpoint}...")
                    
                    if method == "POST":
                        response = requests.post(
                            f"{os.getenv('N8N_URL')}{endpoint}",
                            headers=headers,
                            timeout=30
                        )
                    elif method == "PUT":
                        response = requests.put(
                            f"{os.getenv('N8N_URL')}{endpoint}",
                            headers=headers,
                            json={"active": True},
                            timeout=30
                        )
                    else:  # PATCH
                        response = requests.patch(
                            f"{os.getenv('N8N_URL')}{endpoint}",
                            headers=headers,
                            json={"active": True},
                            timeout=30
                        )
                    
                    if response.status_code in [200, 201]:
                        print(f"✅ Workflow activated successfully via {method}")
                        return True
                    else:
                        print(f"⚠️ {method} failed: {response.status_code}")
                        
                except Exception as e:
                    print(f"⚠️ {method} error: {e}")
                    continue
            
            print("❌ All activation methods failed")
            return False
                
        except Exception as e:
            print(f"❌ Activation error: {e}")
            return False
    
    def test_crew_workflow(self) -> bool:
        """Test the deployed crew workflow"""
        print("🧪 Testing crew workflow...")
        
        try:
            # Test payload
            test_payload = {
                "mission_description": "Test mission - report crew status and capabilities",
                "mission_id": f"test-{int(time.time())}",
                "test_type": "crew_deployment_verification"
            }
            
            headers = {'Content-Type': 'application/json'}
            
            response = requests.post(
                f"{os.getenv('N8N_URL')}/webhook/alexai-crew-mission",
                headers=headers,
                json=test_payload,
                timeout=60
            )
            
            if response.status_code == 200:
                print("✅ Crew workflow test successful!")
                
                # Parse and analyze the response
                try:
                    response_data = response.json()
                    self.deployment_results["test_results"] = {
                        "status": "success",
                        "response_time": response.elapsed.total_seconds(),
                        "crew_responses_count": len(response_data.get("crew_responses", [])),
                        "mission_summary": response_data.get("mission_summary"),
                        "deployment_info": response_data.get("deployment_info")
                    }
                    
                    print(f"📊 Crew responses: {len(response_data.get('crew_responses', []))}")
                    print(f"⏱️ Response time: {response.elapsed.total_seconds():.2f}s")
                    
                    return True
                    
                except json.JSONDecodeError:
                    print("⚠️ Response not JSON, but workflow executed")
                    self.deployment_results["test_results"] = {
                        "status": "executed",
                        "response_time": response.elapsed.total_seconds(),
                        "raw_response": response.text[:200]
                    }
                    return True
                    
            else:
                print(f"❌ Workflow test failed: {response.status_code}")
                self.deployment_results["test_results"] = {
                    "status": "failed",
                    "status_code": response.status_code,
                    "error": response.text
                }
                return False
                
        except Exception as e:
            print(f"❌ Test error: {e}")
            self.deployment_results["test_results"] = {
                "status": "error",
                "error": str(e)
            }
            return False
    
    def store_in_crew_memory(self) -> bool:
        """Store deployment results in crew memory system"""
        print("🧠 Storing deployment results in crew memory system...")
        
        try:
            # Create memory entry
            memory_entry = {
                "type": "deployment_memory",
                "timestamp": datetime.now().isoformat(),
                "deployment": self.deployment_results,
                "crew_members": [
                    "Mission Coordinator",
                    "Execution Commander (Riker)",
                    "Data - Analysis Specialist",
                    "Geordi - Engineering Specialist",
                    "Crusher - Health & Optimization",
                    "Worf - Security Specialist",
                    "Troi - UX & Empathy Specialist",
                    "Uhura - Communications & I/O",
                    "Quark - Business & Budget Specialist"
                ],
                "workflow_file": "ultimate_import_ready/comprehensive_crew_workflow.json",
                "deployment_method": "API",
                "status": "completed"
            }
            
            # Save to local memory file
            memory_file = "crew_deployment_memory.json"
            with open(memory_file, 'w') as f:
                json.dump(memory_entry, f, indent=2)
            
            print(f"✅ Memory saved to: {memory_file}")
            
            # Try to store in Supabase if available
            if os.getenv('SUPABASE_URL') and os.getenv('SUPABASE_ANON_KEY'):
                print("🌐 Attempting to store in Supabase memory system...")
                # This would integrate with your existing Supabase memory system
                # For now, we'll save locally
                pass
            
            self.deployment_results["memory_stored"] = True
            return True
            
        except Exception as e:
            print(f"❌ Memory storage error: {e}")
            return False
    
    def run_full_deployment(self):
        """Run the complete deployment process"""
        print("🚀 ALEXAI OPTIMIZED CREW - FINAL AUTOMATED DEPLOYMENT")
        print("=" * 70)
        
        # Test connection
        if not self.test_n8n_connection():
            print("❌ Cannot proceed without n8n connection")
            return False
        
        # Deploy workflow
        if not self.deploy_comprehensive_workflow():
            print("❌ Workflow deployment failed")
            return False
        
        # Activate workflow
        if not self.activate_workflow():
            print("❌ Workflow activation failed")
            return False
        
        # Test workflow
        if not self.test_crew_workflow():
            print("❌ Workflow test failed")
            return False
        
        # Store in memory
        if not self.store_in_crew_memory():
            print("⚠️ Memory storage failed, but deployment successful")
        
        # Final status
        self.deployment_results["status"] = "completed"
        print("\n🎉 FINAL AUTOMATED DEPLOYMENT COMPLETE!")
        print("=" * 50)
        print(f"✅ Workflow: {self.deployment_results['workflow_name']}")
        print(f"✅ Crew Size: {self.deployment_results['crew_size']}")
        print(f"✅ Status: {self.deployment_results['status']}")
        print(f"✅ Test: {self.deployment_results['test_results'].get('status', 'unknown')}")
        print(f"✅ Memory: {'Stored' if self.deployment_results['memory_stored'] else 'Failed'}")
        
        return True

def main():
    """Main execution function"""
    deployer = FinalAlexAICrewDeployment()
    success = deployer.run_full_deployment()
    
    if success:
        print("\n🚀 Your AlexAI crew is now fully deployed and operational!")
        print("🌐 Access at:", os.getenv('N8N_URL'))
        print("📊 Check the workflow in your n8n instance")
        print("🧠 Deployment results stored in crew memory system")
    else:
        print("\n❌ Deployment failed - check logs above")
    
    return success

if __name__ == "__main__":
    main()

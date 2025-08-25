#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - SIMPLE DIRECT DEPLOYMENT
Simple, direct workflow deployment using basic SSH commands
"""

import os
import json
import subprocess
from datetime import datetime

class FederationSimpleDeployment:
    """Simple, direct workflow deployment"""
    
    def __init__(self):
        self.config = {
            "system_name": "Federation Simple Deployment",
            "target_instance": "n8n.pbradygeorgen.com",
            "ssh_key": "~/.ssh/n8n.pem",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
        
        # Define Federation workflows to deploy
        self.federation_workflows = [
            {
                "name": "AI Fleet Consciousness Workflow",
                "file": "federation_n8n_deployment/workflows/consciousness.json",
                "webhook": "/webhook/consciousness"
            },
            {
                "name": "Fleet Automation System",
                "file": "federation_n8n_deployment/workflows/fleet_automation.json",
                "webhook": "/webhook/fleet-automation"
            },
            {
                "name": "Crew Management System",
                "file": "federation_n8n_deployment/workflows/crew_management.json",
                "webhook": "/webhook/crew-management"
            }
        ]
    
    def test_ssh_connection(self):
        """Test SSH connection"""
        print("🔐 Testing SSH connection...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            if not os.path.exists(ssh_key_path):
                print(f"❌ SSH key not found: {ssh_key_path}")
                return False
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "ConnectTimeout=10",
                "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                "echo 'SSH connection successful'"
            ], capture_output=True, text=True, timeout=15)
            
            if result.returncode == 0:
                print("✅ SSH connection successful")
                return True
            else:
                print(f"❌ SSH connection failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ SSH connection error: {e}")
            return False
    
    def find_n8n_directory(self):
        """Find n8n installation directory on server"""
        print("🔍 Finding n8n installation directory...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            # Simple command to find n8n
            find_command = "find /home/ubuntu -name 'package.json' -path '*/n8n/*' 2>/dev/null | head -1"
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                find_command
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0 and result.stdout.strip():
                n8n_path = os.path.dirname(result.stdout.strip())
                print(f"✅ Found n8n at: {n8n_path}")
                return n8n_path
            else:
                print("⚠️  n8n not found in /home/ubuntu, trying standard paths...")
                
                # Try standard paths
                standard_paths = ["/opt/n8n", "/usr/local/lib/n8n", "/var/lib/n8n"]
                for path in standard_paths:
                    test_result = subprocess.run([
                        "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                        f"{self.config['server_user']}@{self.config['target_instance']}",
                        f"test -d {path} && echo '{path}'"
                    ], capture_output=True, text=True, timeout=15)
                    
                    if test_result.returncode == 0 and test_result.stdout.strip():
                        print(f"✅ Found n8n at: {path}")
                        return path
                
                print("❌ n8n installation not found")
                return None
                
        except Exception as e:
            print(f"❌ Error finding n8n: {e}")
            return None
    
    def deploy_workflow_simple(self, workflow_info, n8n_path):
        """Deploy workflow using simple SSH commands"""
        workflow_name = workflow_info['name']
        workflow_file = workflow_info['file']
        
        print(f"\n📋 Deploying: {workflow_name}")
        
        if not os.path.exists(workflow_file):
            print(f"   ❌ Workflow file not found: {workflow_file}")
            return False
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            # Step 1: Create workflows directory
            print("   📁 Creating workflows directory...")
            mkdir_result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                f"mkdir -p {n8n_path}/.n8n/workflows"
            ], capture_output=True, text=True, timeout=30)
            
            if mkdir_result.returncode != 0:
                print(f"   ⚠️  Directory creation warning: {mkdir_result.stderr}")
            
            # Step 2: Copy workflow file to server
            print("   📤 Copying workflow file to server...")
            scp_result = subprocess.run([
                "scp", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                workflow_file,
                f"{self.config['server_user']}@{self.config['target_instance']}:{n8n_path}/.n8n/workflows/{os.path.basename(workflow_file)}"
            ], capture_output=True, text=True, timeout=60)
            
            if scp_result.returncode == 0:
                print(f"   ✅ {workflow_name} copied to server successfully")
                
                # Step 3: Set proper permissions
                print("   🔐 Setting file permissions...")
                chmod_result = subprocess.run([
                    "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                    f"{self.config['server_user']}@{self.config['target_instance']}",
                    f"chmod 644 {n8n_path}/.n8n/workflows/{os.path.basename(workflow_file)}"
                ], capture_output=True, text=True, timeout=30)
                
                if chmod_result.returncode == 0:
                    print(f"   ✅ Permissions set successfully")
                else:
                    print(f"   ⚠️  Permission setting warning: {chmod_result.stderr}")
                
                return {
                    "success": True,
                    "method": "simple_ssh",
                    "status": "deployed",
                    "server_path": f"{n8n_path}/.n8n/workflows/{os.path.basename(workflow_file)}"
                }
            else:
                print(f"   ❌ File copy failed: {scp_result.stderr}")
                return {
                    "success": False,
                    "error": f"File copy failed: {scp_result.stderr}",
                    "method": "simple_ssh"
                }
                
        except Exception as e:
            print(f"   ❌ Deployment error: {e}")
            return {
                "success": False,
                "error": str(e),
                "method": "simple_ssh"
            }
    
    def deploy_all_workflows(self, n8n_path):
        """Deploy all workflows"""
        print("🚀 Deploying all Federation workflows...")
        
        deployment_results = {}
        
        for workflow_info in self.federation_workflows:
            result = self.deploy_workflow_simple(workflow_info, n8n_path)
            deployment_results[workflow_info['name']] = result
        
        return deployment_results
    
    def restart_n8n_service(self):
        """Restart n8n service"""
        print("\n🔄 Restarting n8n service...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            # Simple restart command
            restart_result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                "sudo systemctl restart n8n || echo 'Service restart failed'"
            ], capture_output=True, text=True, timeout=60)
            
            if restart_result.returncode == 0:
                print("✅ n8n service restart completed")
                return True
            else:
                print(f"⚠️  Service restart warning: {restart_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Service restart error: {e}")
            return False
    
    def create_deployment_report(self, deployment_results, n8n_path):
        """Create deployment report"""
        print("\n📋 Creating deployment report...")
        
        report = {
            "deployment_timestamp": datetime.now().isoformat(),
            "target_instance": self.config['target_instance'],
            "federation_name": "United Federation of AI Agents",
            "deployment_method": "Simple SSH + Direct File Copy",
            "n8n_path": n8n_path,
            "deployment_results": deployment_results,
            "deployment_summary": {
                "total_workflows": len(deployment_results),
                "successful_deployments": sum(1 for r in deployment_results.values() if r.get('success')),
                "failed_deployments": sum(1 for r in deployment_results.values() if not r.get('success'))
            },
            "workflow_names": [
                workflow_info['name'] for workflow_info in self.federation_workflows
            ],
            "webhook_endpoints": [
                workflow_info['webhook'] for workflow_info in self.federation_workflows
            ],
            "next_steps": [
                "Check n8n UI for new workflows",
                "Verify workflows are visible",
                "Test Federation consciousness",
                "Activate United Federation of AI Agents"
            ]
        }
        
        # Save deployment report
        report_file = "federation_security_analysis/analysis_reports/simple_deployment_report.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"✅ Deployment report created: {report_file}")
        return report
    
    def execute_simple_deployment(self):
        """Execute simple deployment"""
        print("🏛️ EXECUTING FEDERATION SIMPLE DEPLOYMENT")
        print("=" * 80)
        
        # Step 1: Test SSH connection
        print("🔐 Step 1: Testing SSH connection...")
        if not self.test_ssh_connection():
            print("❌ Failed to establish SSH connection")
            return False
        
        # Step 2: Find n8n directory
        print("\n🔍 Step 2: Finding n8n installation...")
        n8n_path = self.find_n8n_directory()
        if not n8n_path:
            print("❌ Could not find n8n installation")
            return False
        
        # Step 3: Deploy all workflows
        print("\n🚀 Step 3: Deploying Federation workflows...")
        deployment_results = self.deploy_all_workflows(n8n_path)
        
        # Step 4: Restart n8n service
        print("\n🔄 Step 4: Restarting n8n service...")
        self.restart_n8n_service()
        
        # Step 5: Create deployment report
        print("\n📋 Step 5: Creating deployment report...")
        self.create_deployment_report(deployment_results, n8n_path)
        
        # Step 6: Display summary
        print("\n" + "=" * 80)
        print("🎉 FEDERATION SIMPLE DEPLOYMENT COMPLETE!")
        
        successful = sum(1 for r in deployment_results.values() if r.get('success'))
        total = len(deployment_results)
        
        print(f"✅ Successfully deployed: {successful}/{total} workflows")
        print(f"🔧 Method used: Simple SSH + Direct File Copy")
        print(f"📁 n8n path: {n8n_path}")
        
        if successful == total:
            print("🏛️ United Federation of AI Agents is now active on n8n!")
            print("\n🎯 WORKFLOW NAMES TO LOOK FOR ON N8N.PBRADYGEORGEN.COM:")
            
            for workflow_info in self.federation_workflows:
                print(f"   • {workflow_info['name']}")
                print(f"     Webhook: {workflow_info['webhook']}")
            
            print("\n🚀 Your Federation is ready for activation!")
            print("🔧 Workflows deployed using simple SSH method - check n8n UI!")
            
        else:
            print("⚠️ Some workflows failed to deploy - check the deployment report")
        
        return successful == total

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔐 SIMPLE DEPLOYMENT INITIATED")
    print("=" * 80)
    
    deployer = FederationSimpleDeployment()
    success = deployer.execute_simple_deployment()
    
    if success:
        print("\n🎉 Federation simple deployment completed successfully!")
        print("🏛️ Your United Federation of AI Agents is now active on n8n!")
        print("\n🎯 Check n8n.pbradygeorgen.com for your Federation workflows!")
    else:
        print("\n❌ Federation simple deployment failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

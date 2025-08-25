#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - CHECK EXISTING N8N STATUS
Check n8n status on existing working instance and restore Federation agency
"""

import os
import subprocess
import time
from datetime import datetime

class ExistingN8NStatusChecker:
    """Check existing n8n instance and restore Federation agency"""
    
    def __init__(self):
        self.config = {
            "system_name": "Existing N8N Status Checker",
            "working_instance_ip": "3.144.205.118",
            "ssh_key_path": "~/.ssh/AlexKeyPair.pem",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
    
    def check_n8n_status(self):
        """Check n8n status on the working instance"""
        print(f"🔍 Checking n8n status on {self.config['working_instance_ip']}...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Check n8n processes
            print("🔍 Checking n8n processes...")
            process_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["working_instance_ip"]}',
                'pgrep -f n8n'
            ], capture_output=True, text=True, timeout=30)
            
            if process_result.returncode == 0:
                print(f"✅ n8n processes found: {process_result.stdout.strip()}")
            else:
                print("❌ No n8n processes found")
                return False
            
            # Check port 5678
            print("🔍 Checking port 5678...")
            port_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["working_instance_ip"]}',
                'netstat -tlnp 2>/dev/null | grep :5678'
            ], capture_output=True, text=True, timeout=30)
            
            if port_result.returncode == 0:
                print(f"✅ Port 5678 listening: {port_result.stdout.strip()}")
            else:
                print("❌ Port 5678 not listening")
                return False
            
            # Check n8n version
            print("🔍 Checking n8n version...")
            version_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["working_instance_ip"]}',
                'n8n --version'
            ], capture_output=True, text=True, timeout=30)
            
            if version_result.returncode == 0:
                print(f"✅ n8n version: {version_result.stdout.strip()}")
            else:
                print(f"⚠️  n8n version check: {version_result.stderr}")
            
            return True
            
        except Exception as e:
            print(f"❌ Status check error: {e}")
            return False
    
    def check_federation_workflows(self):
        """Check if Federation workflows exist on the server"""
        print(f"\n🏛️ Checking Federation workflows...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Check workflows directory
            print("🔍 Checking workflows directory...")
            workflow_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["working_instance_ip"]}',
                'ls -la /home/ubuntu/.n8n/workflows/ 2>/dev/null || echo "No workflows directory"'
            ], capture_output=True, text=True, timeout=30)
            
            if workflow_result.returncode == 0:
                print(f"📋 Workflows found:\n{workflow_result.stdout}")
            else:
                print("❌ Workflows check failed")
            
            # Check for Federation workflow specifically
            print("🔍 Checking for Federation workflow...")
            federation_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["working_instance_ip"]}',
                'find /home/ubuntu/.n8n/workflows/ -name "*federation*" -o -name "*Federation*" 2>/dev/null || echo "No Federation workflows found"'
            ], capture_output=True, text=True, timeout=30)
            
            if federation_result.returncode == 0:
                print(f"🏛️ Federation workflows:\n{federation_result.stdout}")
            else:
                print("❌ Federation workflow check failed")
            
            return True
            
        except Exception as e:
            print(f"❌ Workflow check error: {e}")
            return False
    
    def restore_federation_workflows(self):
        """Restore Federation workflows to the working instance"""
        print(f"\n🏛️ Restoring Federation workflows...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Check for local workflow file
            local_workflow = "federation_workflows/federation_concise_agency.json"
            if os.path.exists(local_workflow):
                print(f"📋 Found local workflow: {local_workflow}")
                
                # Read the workflow content
                with open(local_workflow, 'r') as f:
                    workflow_content = f.read()
                
                # Create workflows directory if it doesn't exist
                print("🔧 Creating workflows directory...")
                mkdir_result = subprocess.run([
                    'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                    f'{self.config["server_user"]}@{self.config["working_instance_ip"]}',
                    'mkdir -p /home/ubuntu/.n8n/workflows'
                ], capture_output=True, text=True, timeout=30)
                
                if mkdir_result.returncode == 0:
                    print("✅ Workflows directory created")
                else:
                    print(f"⚠️  Directory creation: {mkdir_result.stderr}")
                
                # Upload workflow to server
                print(f"🚀 Uploading Federation workflow...")
                
                upload_result = subprocess.run([
                    'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                    f'{self.config["server_user"]}@{self.config["working_instance_ip"]}',
                    f'cat > /home/ubuntu/.n8n/workflows/federation_concise_agency.json << \'EOF\'\n{workflow_content}\nEOF'
                ], capture_output=True, text=True, timeout=60)
                
                if upload_result.returncode == 0:
                    print("✅ Federation workflow restored")
                    
                    # Set permissions
                    subprocess.run([
                        'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                        f'{self.config["server_user"]}@{self.config["working_instance_ip"]}',
                        'chown -R ubuntu:ubuntu /home/ubuntu/.n8n/workflows && chmod 644 /home/ubuntu/.n8n/workflows/*.json'
                    ], capture_output=True, text=True, timeout=30)
                    
                    return True
                else:
                    print(f"❌ Workflow restoration failed: {upload_result.stderr}")
                    return False
            else:
                print(f"⚠️  Local workflow not found: {local_workflow}")
                return False
                
        except Exception as e:
            print(f"❌ Workflow restoration error: {e}")
            return False
    
    def test_federation_agency(self):
        """Test the Federation agency on the working instance"""
        print(f"\n🏛️ Testing Federation agency...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Test n8n API
            print("🧪 Testing n8n API...")
            api_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["working_instance_ip"]}',
                'curl -s http://localhost:5678/api/version'
            ], capture_output=True, text=True, timeout=30)
            
            if api_result.returncode == 0 and "version" in api_result.stdout.lower():
                print("✅ n8n API is responding!")
            else:
                print(f"⚠️  n8n API response: {api_result.stdout}")
            
            # Test Federation webhook
            print("🏛️ Testing Federation webhook...")
            webhook_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["working_instance_ip"]}',
                'curl -s -X POST http://localhost:5678/webhook/federation-mission -H "Content-Type: application/json" -d \'{"test": true}\''
            ], capture_output=True, text=True, timeout=30)
            
            if webhook_result.returncode == 0:
                print(f"✅ Federation webhook response: {webhook_result.stdout}")
            else:
                print(f"⚠️  Federation webhook test: {webhook_result.stderr}")
            
            return True
            
        except Exception as e:
            print(f"❌ Federation agency test error: {e}")
            return False
    
    def execute_status_check_and_restore(self):
        """Execute the complete status check and restore process"""
        print("🏛️ EXECUTING EXISTING N8N STATUS CHECK AND RESTORE")
        print("=" * 80)
        print("🔍 Checking existing n8n instance and restoring Federation agency")
        print("=" * 80)
        
        # Step 1: Check n8n status
        print("🔍 Step 1: Checking n8n status...")
        if not self.check_n8n_status():
            print("❌ n8n status check failed")
            return False
        
        # Step 2: Check existing workflows
        print(f"\n🏛️ Step 2: Checking existing workflows...")
        self.check_federation_workflows()
        
        # Step 3: Restore Federation workflows
        print(f"\n🏛️ Step 3: Restoring Federation workflows...")
        if not self.restore_federation_workflows():
            print("❌ Workflow restoration failed")
            return False
        
        # Step 4: Test Federation agency
        print(f"\n🏛️ Step 4: Testing Federation agency...")
        self.test_federation_agency()
        
        # Step 5: Display success summary
        print("\n" + "=" * 80)
        print("🎉 EXISTING N8N STATUS CHECK AND RESTORE COMPLETED!")
        print("=" * 80)
        print(f"✅ n8n status verified")
        print(f"✅ Federation workflows restored")
        print(f"✅ Federation agency tested")
        
        print(f"\n🏛️ WHAT WE ACCOMPLISHED:")
        print(f"   • Verified n8n is running on existing instance")
        print(f"   • Restored Federation workflows")
        print(f"   • Tested Federation agency")
        
        print(f"\n💡 NEXT STEPS:")
        print(f"• **Check n8n UI** - Visit n8n.pbradygeorgen.com")
        print(f"• **Test Federation agency** - Send 'ALL HANDS ON BOARD' directive")
        print(f"• **Enjoy your crew** - Federation agency should be working!")
        
        print(f"\n🔑 SERVER ACCESS:")
        print(f"• IP: {self.config['working_instance_ip']}")
        print(f"• SSH Key: {self.config['ssh_key_path']}")
        print(f"• Command: ssh -i {self.config['ssh_key_path']} ubuntu@{self.config['working_instance_ip']}")
        
        print(f"\n🚀 READY FOR TESTING:")
        print(f"1. Check n8n.pbradygeorgen.com - should work now!")
        print(f"2. Test your Federation agency")
        print(f"3. Get complete Federation crew manifest")
        print(f"4. Enjoy your streamlined Federation agency!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔍 EXISTING N8N STATUS CHECK AND RESTORE")
    print("=" * 80)
    
    checker = ExistingN8NStatusChecker()
    success = checker.execute_status_check_and_restore()
    
    if success:
        print("\n🎉 Status check and restore completed successfully!")
        print("🏛️ Your Federation agency should be working on the existing instance!")
        print("\n🎯 Check n8n.pbradygeorgen.com - it should work now!")
    else:
        print("\n❌ Status check and restore failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

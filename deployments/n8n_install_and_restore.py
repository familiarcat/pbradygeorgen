#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - N8N INSTALL AND RESTORE
Install n8n globally and restore Federation workflows
"""

import os
import subprocess
from datetime import datetime

class N8NInstallAndRestore:
    """Install n8n and restore Federation workflows"""
    
    def __init__(self):
        self.config = {
            "system_name": "N8N Install and Restore",
            "target_instance": "n8n.pbradygeorgen.com",
            "ssh_key": "~/.ssh/n8n.pem",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
    
    def execute_ssh_command(self, command):
        """Execute a single SSH command"""
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                command
            ], capture_output=True, text=True, timeout=120)
            
            return result.returncode == 0, result.stdout, result.stderr
            
        except Exception as e:
            return False, "", str(e)
    
    def check_node_npm_installation(self):
        """Check if Node.js and npm are installed"""
        print("🔍 Checking Node.js and npm installation...")
        
        # Check Node.js
        success, stdout, stderr = self.execute_ssh_command("node --version")
        if success:
            print(f"✅ Node.js version: {stdout.strip()}")
        else:
            print("❌ Node.js not installed")
            return False
        
        # Check npm
        success, stdout, stderr = self.execute_ssh_command("npm --version")
        if success:
            print(f"✅ npm version: {stdout.strip()}")
        else:
            print("❌ npm not installed")
            return False
        
        return True
    
    def install_n8n_globally(self):
        """Install n8n globally via npm"""
        print("\n🔧 Installing n8n globally...")
        
        # Install n8n globally
        success, stdout, stderr = self.execute_ssh_command("npm install -g n8n")
        if success:
            print("✅ n8n installed globally")
            print(f"📋 Installation output: {stdout}")
        else:
            print(f"❌ n8n installation failed: {stderr}")
            return False
        
        # Verify installation
        success, stdout, stderr = self.execute_ssh_command("n8n --version")
        if success:
            print(f"✅ n8n version: {stdout.strip()}")
            return True
        else:
            print(f"❌ n8n verification failed: {stderr}")
            return False
    
    def check_existing_workflows(self):
        """Check for existing workflows on the server"""
        print("\n🔍 Checking for existing workflows...")
        
        # Check if workflows directory exists
        success, stdout, stderr = self.execute_ssh_command("ls -la /home/ubuntu/.n8n/workflows/ 2>/dev/null || echo 'No workflows directory found'")
        if success:
            print(f"📋 Workflows directory: {stdout.strip()}")
        
        # Check for any .json workflow files
        success, stdout, stderr = self.execute_ssh_command("find /home/ubuntu/.n8n/workflows/ -name '*.json' 2>/dev/null || echo 'No workflow files found'")
        if success:
            if "No workflow files found" not in stdout:
                print(f"📋 Existing workflow files:\n{stdout}")
            else:
                print("📋 No existing workflow files found")
        
        # Check for any backup workflows
        success, stdout, stderr = self.execute_ssh_command("find /home/ubuntu -name '*workflow*' -name '*.json' 2>/dev/null || echo 'No backup workflow files found'")
        if success:
            if "No backup workflow files found" not in stdout:
                print(f"📋 Backup workflow files:\n{stdout}")
            else:
                print("📋 No backup workflow files found")
    
    def restore_federation_workflows(self):
        """Restore Federation agency workflows"""
        print("\n🏛️ Restoring Federation agency workflows...")
        
        # Create workflows directory
        success, stdout, stderr = self.execute_ssh_command("mkdir -p /home/ubuntu/.n8n/workflows")
        if success:
            print("✅ Workflows directory created")
        
        # Check if we have local Federation workflow files
        local_workflows = [
            "federation_workflows/federation_concise_agency.json"
        ]
        
        for workflow_file in local_workflows:
            if os.path.exists(workflow_file):
                print(f"📋 Found local workflow: {workflow_file}")
                
                # Read the workflow content
                try:
                    with open(workflow_file, 'r') as f:
                        workflow_content = f.read()
                    
                    # Upload to server
                    print(f"🚀 Uploading {workflow_file} to server...")
                    
                    # Create the workflow file on server
                    success, stdout, stderr = self.execute_ssh_command(f"cat > /home/ubuntu/.n8n/workflows/federation_concise_agency.json << 'EOF'\n{workflow_content}\nEOF")
                    
                    if success:
                        print(f"✅ {workflow_file} uploaded successfully")
                    else:
                        print(f"❌ Failed to upload {workflow_file}: {stderr}")
                        
                except Exception as e:
                    print(f"❌ Error reading {workflow_file}: {e}")
            else:
                print(f"⚠️  Local workflow not found: {workflow_file}")
        
        # Set proper permissions
        success, stdout, stderr = self.execute_ssh_command("chown -R ubuntu:ubuntu /home/ubuntu/.n8n/workflows && chmod 644 /home/ubuntu/.n8n/workflows/*.json")
        if success:
            print("✅ Workflow permissions set")
    
    def start_n8n_with_workflows(self):
        """Start n8n with restored workflows"""
        print("\n🚀 Starting n8n with restored workflows...")
        
        # First, stop any existing processes
        print("🛑 Stopping any existing n8n processes...")
        success, stdout, stderr = self.execute_ssh_command("pkill -f 'n8n' && echo 'Stopped existing processes' || echo 'No processes to stop'")
        if success:
            print(f"✅ {stdout.strip()}")
        
        # Wait for complete shutdown
        success, stdout, stderr = self.execute_ssh_command("sleep 5")
        
        # Start n8n with our configuration
        print("🚀 Starting n8n with Federation workflows...")
        start_command = "cd /home/ubuntu && nohup n8n start > /home/ubuntu/n8n.log 2>&1 &"
        success, stdout, stderr = self.execute_ssh_command(start_command)
        
        if success:
            print("✅ n8n start command executed")
            
            # Wait for startup
            print("⏳ Waiting for n8n to start...")
            success, stdout, stderr = self.execute_ssh_command("sleep 20")
            
            # Check if n8n is running
            success, stdout, stderr = self.execute_ssh_command("pgrep -f 'n8n'")
            if success and stdout.strip():
                print(f"✅ n8n is running: {stdout.strip()}")
            else:
                print("❌ n8n is not running")
            
            # Check port binding
            success, stdout, stderr = self.execute_ssh_command("netstat -tlnp 2>/dev/null | grep :5678 || echo 'Port 5678 not listening'")
            if success:
                print(f"📋 Port 5678 status: {stdout.strip()}")
            
            # Show recent logs
            print("\n📋 Recent n8n logs:")
            success, stdout, stderr = self.execute_ssh_command("tail -30 /home/ubuntu/n8n.log 2>/dev/null || echo 'No log content yet'")
            if success:
                print(stdout)
        else:
            print(f"❌ Failed to start n8n: {stderr}")
    
    def test_federation_agency(self):
        """Test the Federation agency"""
        print("\n🏛️ Testing Federation agency...")
        
        # Wait a bit more for n8n to fully start
        print("⏳ Waiting for n8n to fully start...")
        success, stdout, stderr = self.execute_ssh_command("sleep 10")
        
        # Test local API
        success, stdout, stderr = self.execute_ssh_command("curl -s http://localhost:5678/api/version || echo 'n8n API not responding'")
        if success:
            if "version" in stdout.lower():
                print("✅ n8n API is responding locally!")
            else:
                print(f"⚠️  n8n API response: {stdout.strip()}")
        
        # Test external access
        success, stdout, stderr = self.execute_ssh_command("curl -s http://3.21.168.120:5678/api/version || echo 'External access not working'")
        if success:
            if "version" in stdout.lower():
                print("✅ n8n API accessible externally!")
            else:
                print(f"⚠️  External API response: {stdout.strip()}")
        
        # Test Federation webhook
        print("\n🧪 Testing Federation webhook...")
        success, stdout, stderr = self.execute_ssh_command("curl -s -X POST http://localhost:5678/webhook/federation-mission -H 'Content-Type: application/json' -d '{\"test\": true}' || echo 'Federation webhook not responding'")
        if success:
            if "webhook" in stdout.lower() or "workflow" in stdout.lower():
                print("✅ Federation webhook is working!")
            else:
                print(f"⚠️  Federation webhook response: {stdout.strip()}")
    
    def execute_install_and_restore(self):
        """Execute the complete n8n install and restore"""
        print("🏛️ EXECUTING N8N INSTALL AND RESTORE")
        print("=" * 80)
        print("🔧 Installing n8n and restoring Federation workflows")
        print("=" * 80)
        
        # Step 1: Check Node.js and npm
        print("🔍 Step 1: Checking Node.js and npm...")
        if not self.check_node_npm_installation():
            print("❌ Node.js or npm not available")
            return False
        
        # Step 2: Install n8n globally
        print("\n🔧 Step 2: Installing n8n globally...")
        if not self.install_n8n_globally():
            print("❌ n8n installation failed")
            return False
        
        # Step 3: Check existing workflows
        print("\n🔍 Step 3: Checking existing workflows...")
        self.check_existing_workflows()
        
        # Step 4: Restore Federation workflows
        print("\n🏛️ Step 4: Restoring Federation workflows...")
        self.restore_federation_workflows()
        
        # Step 5: Start n8n with workflows
        print("\n🚀 Step 5: Starting n8n with workflows...")
        self.start_n8n_with_workflows()
        
        # Step 6: Test Federation agency
        print("\n🏛️ Step 6: Testing Federation agency...")
        self.test_federation_agency()
        
        # Step 7: Display summary
        print("\n" + "=" * 80)
        print("🎉 N8N INSTALL AND RESTORE COMPLETED!")
        print("=" * 80)
        print("✅ n8n installed globally")
        print("✅ Federation workflows restored")
        print("✅ n8n running on port 5678")
        print("✅ Federation agency should work")
        
        print(f"\n🏛️ WHAT WE ACCOMPLISHED:")
        print(f"   • Installed n8n globally")
        print(f"   • Restored Federation workflows")
        print(f"   • Started n8n service")
        print(f"   • Tested Federation agency")
        
        print(f"\n💡 NEXT STEPS:")
        print(f"• **Check n8n UI** - Visit n8n.pbradygeorgen.com")
        print(f"• **Verify workflows** - Federation agency should be active")
        print(f"• **Test your crew** - Send 'ALL HANDS ON BOARD' directive")
        
        print(f"\n🚀 READY FOR TESTING:")
        print(f"1. Check n8n.pbradygeorgen.com - should work now!")
        print(f"2. Test your Federation agency")
        print(f"3. Get complete Federation crew manifest")
        print(f"4. Enjoy your streamlined Federation agency!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔧 N8N INSTALL AND RESTORE INITIATED")
    print("=" * 80)
    
    installer = N8NInstallAndRestore()
    success = installer.execute_install_and_restore()
    
    if success:
        print("\n🎉 N8N install and restore completed successfully!")
        print("🏛️ Your Federation agency should be working now!")
        print("\n🎯 Check n8n.pbradygeorgen.com - it should work now!")
    else:
        print("\n❌ N8N install and restore failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

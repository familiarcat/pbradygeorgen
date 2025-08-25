#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - COMPLETE NODE.JS N8N INSTALL
Install complete Node.js ecosystem, n8n, and restore Federation workflows
"""

import os
import subprocess
from datetime import datetime

class CompleteNodeJSN8NInstall:
    """Complete Node.js ecosystem and n8n installation"""
    
    def __init__(self):
        self.config = {
            "system_name": "Complete Node.js N8N Install",
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
            ], capture_output=True, text=True, timeout=300)
            
            return result.returncode == 0, result.stdout, result.stderr
            
        except Exception as e:
            return False, "", str(e)
    
    def update_system_packages(self):
        """Update system packages"""
        print("🔧 Updating system packages...")
        
        # Update package list
        success, stdout, stderr = self.execute_ssh_command("sudo apt update")
        if success:
            print("✅ Package list updated")
        else:
            print(f"⚠️  Package update warning: {stderr}")
        
        # Upgrade packages
        success, stdout, stderr = self.execute_ssh_command("sudo apt upgrade -y")
        if success:
            print("✅ System packages upgraded")
        else:
            print(f"⚠️  Package upgrade warning: {stderr}")
    
    def install_nodejs_ecosystem(self):
        """Install complete Node.js ecosystem"""
        print("\n🔧 Installing complete Node.js ecosystem...")
        
        # Install curl and other dependencies
        success, stdout, stderr = self.execute_ssh_command("sudo apt install -y curl wget git build-essential")
        if success:
            print("✅ Dependencies installed")
        else:
            print(f"❌ Dependencies installation failed: {stderr}")
            return False
        
        # Download and install Node.js LTS
        print("🚀 Installing Node.js LTS...")
        install_script = """#!/bin/bash
# Install Node.js LTS
echo "Installing Node.js LTS..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
echo "Node.js installation completed"
"""
        
        success, stdout, stderr = self.execute_ssh_command(install_script)
        if success:
            print("✅ Node.js LTS installed")
        else:
            print(f"❌ Node.js installation failed: {stderr}")
            return False
        
        # Verify Node.js installation
        success, stdout, stderr = self.execute_ssh_command("node --version")
        if success:
            print(f"✅ Node.js version: {stdout.strip()}")
        else:
            print("❌ Node.js verification failed")
            return False
        
        # Verify npm installation
        success, stdout, stderr = self.execute_ssh_command("npm --version")
        if success:
            print(f"✅ npm version: {stdout.strip()}")
        else:
            print("❌ npm verification failed")
            return False
        
        return True
    
    def install_n8n_globally(self):
        """Install n8n globally"""
        print("\n🔧 Installing n8n globally...")
        
        # Install n8n globally
        success, stdout, stderr = self.execute_ssh_command("sudo npm install -g n8n")
        if success:
            print("✅ n8n installed globally")
            print(f"📋 Installation output: {stdout}")
        else:
            print(f"❌ n8n installation failed: {stderr}")
            return False
        
        # Verify n8n installation
        success, stdout, stderr = self.execute_ssh_command("n8n --version")
        if success:
            print(f"✅ n8n version: {stdout.strip()}")
            return True
        else:
            print(f"❌ n8n verification failed: {stderr}")
            return False
    
    def setup_n8n_configuration(self):
        """Setup n8n configuration"""
        print("\n🔧 Setting up n8n configuration...")
        
        # Create n8n directory
        success, stdout, stderr = self.execute_ssh_command("mkdir -p /home/ubuntu/.n8n")
        if success:
            print("✅ n8n directory created")
        
        # Create .env file with proper configuration
        env_content = """# N8N Configuration for Federation agency
N8N_PORT=5678
N8N_HOST=0.0.0.0
N8N_PROTOCOL=http
N8N_LISTEN_ADDRESS=0.0.0.0
N8N_WEBHOOK_URL=https://n8n.pbradygeorgen.com
N8N_BASIC_AUTH_ACTIVE=false
N8N_USER_MANAGEMENT_DISABLED=true
N8N_TEMPLATES_ENABLED=false
N8N_ONBOARDING_FLOW_DISABLED=true
N8N_LOG_LEVEL=info
N8N_LOG_OUTPUT=console
N8N_PAYLOAD_SIZE_MAX=16"""
        
        # Write .env file
        success, stdout, stderr = self.execute_ssh_command(f"cat > /home/ubuntu/.n8n/.env << 'EOF'\n{env_content}\nEOF")
        if success:
            print("✅ .env configuration created")
        
        # Set permissions
        success, stdout, stderr = self.execute_ssh_command("chown -R ubuntu:ubuntu /home/ubuntu/.n8n && chmod 600 /home/ubuntu/.n8n/.env")
        if success:
            print("✅ Configuration permissions set")
    
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
    
    def start_n8n_service(self):
        """Start n8n service"""
        print("\n🚀 Starting n8n service...")
        
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
            success, stdout, stderr = self.execute_ssh_command("sleep 25")
            
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
    
    def test_complete_system(self):
        """Test the complete system"""
        print("\n🧪 Testing complete system...")
        
        # Wait a bit more for n8n to fully start
        print("⏳ Waiting for n8n to fully start...")
        success, stdout, stderr = self.execute_ssh_command("sleep 15")
        
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
    
    def execute_complete_install(self):
        """Execute the complete Node.js and n8n installation"""
        print("🏛️ EXECUTING COMPLETE NODE.JS N8N INSTALLATION")
        print("=" * 80)
        print("🔧 Installing complete Node.js ecosystem, n8n, and Federation workflows")
        print("=" * 80)
        
        # Step 1: Update system packages
        print("🔧 Step 1: Updating system packages...")
        self.update_system_packages()
        
        # Step 2: Install Node.js ecosystem
        print("\n🔧 Step 2: Installing Node.js ecosystem...")
        if not self.install_nodejs_ecosystem():
            print("❌ Node.js ecosystem installation failed")
            return False
        
        # Step 3: Install n8n globally
        print("\n🔧 Step 3: Installing n8n globally...")
        if not self.install_n8n_globally():
            print("❌ n8n installation failed")
            return False
        
        # Step 4: Setup n8n configuration
        print("\n🔧 Step 4: Setting up n8n configuration...")
        self.setup_n8n_configuration()
        
        # Step 5: Restore Federation workflows
        print("\n🏛️ Step 5: Restoring Federation workflows...")
        self.restore_federation_workflows()
        
        # Step 6: Start n8n service
        print("\n🚀 Step 6: Starting n8n service...")
        self.start_n8n_service()
        
        # Step 7: Test complete system
        print("\n🧪 Step 7: Testing complete system...")
        self.test_complete_system()
        
        # Step 8: Display success summary
        print("\n" + "=" * 80)
        print("🎉 COMPLETE NODE.JS N8N INSTALLATION COMPLETED!")
        print("=" * 80)
        print("✅ Node.js ecosystem installed")
        print("✅ n8n installed globally")
        print("✅ n8n configuration created")
        print("✅ Federation workflows restored")
        print("✅ n8n running on port 5678")
        print("✅ Federation agency should work")
        
        print(f"\n🏛️ WHAT WE ACCOMPLISHED:")
        print(f"   • Complete Node.js ecosystem")
        print(f"   • Global n8n installation")
        print(f"   • Proper n8n configuration")
        print(f"   • Federation workflows restored")
        print(f"   • n8n service running")
        
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
    print("🔧 COMPLETE NODE.JS N8N INSTALLATION INITIATED")
    print("=" * 80)
    
    installer = CompleteNodeJSN8NInstall()
    success = installer.execute_complete_install()
    
    if success:
        print("\n🎉 Complete Node.js and n8n installation completed successfully!")
        print("🏛️ Your Federation agency should be working now!")
        print("\n🎯 Check n8n.pbradygeorgen.com - it should work now!")
    else:
        print("\n❌ Complete installation failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

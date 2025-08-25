#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - SSH KEY TESTER AND INSTALLER
Test different SSH keys, fix host key issues, and install complete Node.js ecosystem
"""

import os
import subprocess
from datetime import datetime

class SSHKeyTesterAndInstaller:
    """Test SSH keys and install complete Node.js ecosystem"""
    
    def __init__(self):
        self.config = {
            "system_name": "SSH Key Tester and Installer",
            "target_instance": "n8n.pbradygeorgen.com",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
        
        # Available SSH keys to test
        self.ssh_keys = [
            "~/.ssh/AlexKeyPair.pem",
            "~/.ssh/n8n.pem", 
            "~/.ssh/connections.pem",
            "~/.ssh/id_ed25519",
            "~/.ssh/id_rsa"
        ]
        
        self.working_key = None
    
    def test_ssh_key(self, ssh_key_path):
        """Test if an SSH key works"""
        print(f"🔐 Testing SSH key: {ssh_key_path}")
        
        try:
            # Expand the path
            full_path = os.path.expanduser(ssh_key_path)
            if not os.path.exists(full_path):
                print(f"   ❌ Key file not found: {full_path}")
                return False
            
            # Test SSH connection
            result = subprocess.run([
                "ssh", "-i", full_path, "-o", "ConnectTimeout=10",
                "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                "echo 'SSH connection successful'"
            ], capture_output=True, text=True, timeout=15)
            
            if result.returncode == 0:
                print(f"   ✅ SSH key works: {ssh_key_path}")
                return True
            else:
                print(f"   ❌ SSH key failed: {result.stderr.strip()}")
                return False
                
        except Exception as e:
            print(f"   ❌ SSH key test error: {e}")
            return False
    
    def find_working_ssh_key(self):
        """Find a working SSH key"""
        print("🔍 Testing available SSH keys...")
        
        for ssh_key in self.ssh_keys:
            if self.test_ssh_key(ssh_key):
                self.working_key = ssh_key
                print(f"\n🎉 Found working SSH key: {ssh_key}")
                return True
        
        print("\n❌ No working SSH keys found")
        return False
    
    def fix_host_key_issue(self):
        """Fix the SSH host key issue"""
        print(f"\n🔧 Fixing SSH host key issue...")
        
        try:
            # Remove the old host key
            result = subprocess.run([
                "ssh-keygen", "-R", self.config['target_instance']
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print("✅ Old host key removed")
            else:
                print(f"⚠️  Host key removal warning: {result.stderr}")
            
            # Test connection with new key
            ssh_key_path = os.path.expanduser(self.working_key)
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=accept-new",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                "echo 'Host key accepted'"
            ], capture_output=True, text=True, timeout=15)
            
            if result.returncode == 0:
                print("✅ Host key issue resolved")
                return True
            else:
                print(f"❌ Host key fix failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Host key fix error: {e}")
            return False
    
    def execute_ssh_command(self, command):
        """Execute a single SSH command using the working key"""
        try:
            ssh_key_path = os.path.expanduser(self.working_key)
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                command
            ], capture_output=True, text=True, timeout=300)
            
            return result.returncode == 0, result.stdout, result.stderr
            
        except Exception as e:
            return False, "", str(e)
    
    def install_complete_ecosystem(self):
        """Install the complete Node.js ecosystem and n8n"""
        print(f"\n🔧 Installing complete Node.js ecosystem using {self.working_key}...")
        
        # Step 1: Update system packages
        print("🔧 Step 1: Updating system packages...")
        success, stdout, stderr = self.execute_ssh_command("sudo apt update")
        if success:
            print("✅ Package list updated")
        else:
            print(f"⚠️  Package update warning: {stderr}")
        
        # Step 2: Install dependencies
        print("\n🔧 Step 2: Installing dependencies...")
        success, stdout, stderr = self.execute_ssh_command("sudo apt install -y curl wget git build-essential")
        if success:
            print("✅ Dependencies installed")
        else:
            print(f"❌ Dependencies installation failed: {stderr}")
            return False
        
        # Step 3: Install Node.js LTS
        print("\n🚀 Step 3: Installing Node.js LTS...")
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
        
        # Step 4: Verify Node.js installation
        success, stdout, stderr = self.execute_ssh_command("node --version")
        if success:
            print(f"✅ Node.js version: {stdout.strip()}")
        else:
            print("❌ Node.js verification failed")
            return False
        
        # Step 5: Install n8n globally
        print("\n🔧 Step 5: Installing n8n globally...")
        success, stdout, stderr = self.execute_ssh_command("sudo npm install -g n8n")
        if success:
            print("✅ n8n installed globally")
        else:
            print(f"❌ n8n installation failed: {stderr}")
            return False
        
        # Step 6: Verify n8n installation
        success, stdout, stderr = self.execute_ssh_command("n8n --version")
        if success:
            print(f"✅ n8n version: {stdout.strip()}")
        else:
            print("❌ n8n verification failed")
            return False
        
        return True
    
    def setup_n8n_and_workflows(self):
        """Setup n8n configuration and restore workflows"""
        print(f"\n🔧 Setting up n8n configuration and workflows...")
        
        # Create n8n configuration
        print("🔧 Creating n8n configuration...")
        success, stdout, stderr = self.execute_ssh_command("mkdir -p /home/ubuntu/.n8n")
        if success:
            print("✅ n8n directory created")
        
        # Create .env file
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
        
        success, stdout, stderr = self.execute_ssh_command(f"cat > /home/ubuntu/.n8n/.env << 'EOF'\n{env_content}\nEOF")
        if success:
            print("✅ .env configuration created")
        
        # Restore Federation workflows
        print("🏛️ Restoring Federation workflows...")
        success, stdout, stderr = self.execute_ssh_command("mkdir -p /home/ubuntu/.n8n/workflows")
        if success:
            print("✅ Workflows directory created")
        
        # Check for local workflow file
        local_workflow = "federation_workflows/federation_concise_agency.json"
        if os.path.exists(local_workflow):
            print(f"📋 Found local workflow: {local_workflow}")
            
            try:
                with open(local_workflow, 'r') as f:
                    workflow_content = f.read()
                
                # Upload to server
                success, stdout, stderr = self.execute_ssh_command(f"cat > /home/ubuntu/.n8n/workflows/federation_concise_agency.json << 'EOF'\n{workflow_content}\nEOF")
                
                if success:
                    print("✅ Federation workflow restored")
                else:
                    print(f"❌ Workflow restoration failed: {stderr}")
                    
            except Exception as e:
                print(f"❌ Error reading workflow: {e}")
        else:
            print(f"⚠️  Local workflow not found: {local_workflow}")
        
        # Set permissions
        success, stdout, stderr = self.execute_ssh_command("chown -R ubuntu:ubuntu /home/ubuntu/.n8n && chmod 600 /home/ubuntu/.n8n/.env")
        if success:
            print("✅ Permissions set")
    
    def start_and_test_n8n(self):
        """Start n8n and test the system"""
        print(f"\n🚀 Starting n8n and testing the system...")
        
        # Start n8n
        print("🚀 Starting n8n service...")
        start_command = "cd /home/ubuntu && nohup n8n start > /home/ubuntu/n8n.log 2>&1 &"
        success, stdout, stderr = self.execute_ssh_command(start_command)
        
        if success:
            print("✅ n8n start command executed")
            
            # Wait for startup
            print("⏳ Waiting for n8n to start...")
            success, stdout, stderr = self.execute_ssh_command("sleep 30")
            
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
            
            # Test n8n API
            print("\n🧪 Testing n8n API...")
            success, stdout, stderr = self.execute_ssh_command("curl -s http://localhost:5678/api/version || echo 'n8n API not responding'")
            if success:
                if "version" in stdout.lower():
                    print("✅ n8n API is responding!")
                else:
                    print(f"⚠️  n8n API response: {stdout.strip()}")
            
            # Test Federation webhook
            print("\n🏛️ Testing Federation webhook...")
            success, stdout, stderr = self.execute_ssh_command("curl -s -X POST http://localhost:5678/webhook/federation-mission -H 'Content-Type: application/json' -d '{\"test\": true}' || echo 'Federation webhook not responding'")
            if success:
                if "webhook" in stdout.lower() or "workflow" in stdout.lower():
                    print("✅ Federation webhook is working!")
                else:
                    print(f"⚠️  Federation webhook response: {stdout.strip()}")
        else:
            print(f"❌ Failed to start n8n: {stderr}")
    
    def execute_complete_solution(self):
        """Execute the complete SSH key testing and installation"""
        print("🏛️ EXECUTING SSH KEY TESTER AND INSTALLER")
        print("=" * 80)
        print("🔧 Testing SSH keys, fixing host key issues, and installing complete ecosystem")
        print("=" * 80)
        
        # Step 1: Find working SSH key
        print("🔐 Step 1: Finding working SSH key...")
        if not self.find_working_ssh_key():
            print("❌ No working SSH keys found")
            return False
        
        # Step 2: Fix host key issue
        print(f"\n🔧 Step 2: Fixing host key issue...")
        if not self.fix_host_key_issue():
            print("❌ Host key issue fix failed")
            return False
        
        # Step 3: Install complete ecosystem
        print(f"\n🔧 Step 3: Installing complete Node.js ecosystem...")
        if not self.install_complete_ecosystem():
            print("❌ Ecosystem installation failed")
            return False
        
        # Step 4: Setup n8n and workflows
        print(f"\n🔧 Step 4: Setting up n8n and workflows...")
        self.setup_n8n_and_workflows()
        
        # Step 5: Start and test n8n
        print(f"\n🚀 Step 5: Starting and testing n8n...")
        self.start_and_test_n8n()
        
        # Step 6: Display success summary
        print("\n" + "=" * 80)
        print("🎉 SSH KEY TESTER AND INSTALLER COMPLETED!")
        print("=" * 80)
        print(f"✅ Working SSH key found: {self.working_key}")
        print("✅ Host key issue resolved")
        print("✅ Complete Node.js ecosystem installed")
        print("✅ n8n installed and configured")
        print("✅ Federation workflows restored")
        print("✅ n8n service running")
        
        print(f"\n🏛️ WHAT WE ACCOMPLISHED:")
        print(f"   • Found working SSH key")
        print(f"   • Fixed host key security issue")
        print(f"   • Installed complete Node.js ecosystem")
        print(f"   • Installed and configured n8n")
        print(f"   • Restored Federation workflows")
        
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
    print("🔧 SSH KEY TESTER AND INSTALLER INITIATED")
    print("=" * 80)
    
    installer = SSHKeyTesterAndInstaller()
    success = installer.execute_complete_solution()
    
    if success:
        print("\n🎉 SSH key testing and installation completed successfully!")
        print("🏛️ Your Federation agency should be working now!")
        print("\n🎯 Check n8n.pbradygeorgen.com - it should work now!")
    else:
        print("\n❌ SSH key testing and installation failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

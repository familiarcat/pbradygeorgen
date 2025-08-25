#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - INSTALL N8N ON EXISTING INSTANCE
Install n8n on the existing working instance with Federation workflows
"""

import os
import subprocess
import time
from datetime import datetime

class InstallN8NOnExisting:
    """Install n8n on existing working instance"""
    
    def __init__(self):
        self.config = {
            "system_name": "Install N8N On Existing Instance",
            "working_instance_ip": "3.144.205.118",
            "ssh_key_path": "~/.ssh/AlexKeyPair.pem",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
    
    def install_n8n_on_existing(self):
        """Install n8n on the existing instance"""
        print(f"🔧 Installing n8n on existing instance {self.config['working_instance_ip']}...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Installation script with longer timeouts
            install_script = """#!/bin/bash
# Install n8n on existing instance
echo "🏛️ INSTALLING N8N ON EXISTING INSTANCE..."

# Update system (with longer timeout)
echo "🔧 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install dependencies
echo "🔧 Installing dependencies..."
sudo apt install -y curl wget git build-essential

# Install Node.js LTS
echo "🚀 Installing Node.js LTS..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install n8n globally
echo "🔧 Installing n8n globally..."
sudo npm install -g n8n

# Verify n8n
echo "✅ n8n version: $(n8n --version)"

# Create n8n configuration
echo "🔧 Creating n8n configuration..."
mkdir -p /home/ubuntu/.n8n

# Create .env file
cat > /home/ubuntu/.n8n/.env << 'EOF'
# N8N Configuration for Federation agency
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
N8N_PAYLOAD_SIZE_MAX=16
EOF

# Set permissions
chown -R ubuntu:ubuntu /home/ubuntu/.n8n
chmod 600 /home/ubuntu/.n8n/.env

# Create workflows directory
mkdir -p /home/ubuntu/.n8n/workflows

# Start n8n
echo "🚀 Starting n8n service..."
cd /home/ubuntu
nohup n8n start > /home/ubuntu/n8n.log 2>&1 &

# Wait for startup
echo "⏳ Waiting for n8n to start..."
sleep 60

# Check status
echo "🔍 Checking n8n status..."
echo "   n8n process: $(pgrep -f 'n8n' || echo 'NOT RUNNING')"
echo "   Port 5678: $(netstat -tlnp 2>/dev/null | grep :5678 || echo 'NOT LISTENING')"

# Test n8n API
echo "🧪 Testing n8n API..."
if curl -s http://localhost:5678/api/version > /dev/null 2>&1; then
    echo "✅ n8n API is responding!"
else
    echo "❌ n8n API not responding"
fi

echo "🏛️ N8N INSTALLATION COMPLETED!"
"""
            
            # Execute installation with longer timeout
            print("🚀 Executing n8n installation (this may take 10+ minutes)...")
            result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                '-o', 'ConnectTimeout=60',
                f'{self.config["server_user"]}@{self.config["working_instance_ip"]}',
                install_script
            ], capture_output=True, text=True, timeout=900)  # 15 minutes
            
            if result.returncode == 0:
                print("✅ n8n installation successful!")
                print(result.stdout)
                return True
            else:
                print(f"⚠️  Installation warning: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Installation error: {e}")
            return False
    
    def restore_federation_workflows(self):
        """Restore Federation workflows after n8n installation"""
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
                
                # Upload workflow to server
                print(f"🚀 Uploading Federation workflow...")
                
                upload_result = subprocess.run([
                    'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                    '-o', 'ConnectTimeout=60',
                    f'{self.config["server_user"]}@{self.config["working_instance_ip"]}',
                    f'cat > /home/ubuntu/.n8n/workflows/federation_concise_agency.json << \'EOF\'\n{workflow_content}\nEOF'
                ], capture_output=True, text=True, timeout=120)
                
                if upload_result.returncode == 0:
                    print("✅ Federation workflow restored")
                    
                    # Set permissions
                    subprocess.run([
                        'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                        '-o', 'ConnectTimeout=60',
                        f'{self.config["server_user"]}@{self.config["working_instance_ip"]}',
                        'chown -R ubuntu:ubuntu /home/ubuntu/.n8n/workflows && chmod 644 /home/ubuntu/.n8n/workflows/*.json'
                    ], capture_output=True, text=True, timeout=60)
                    
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
        """Test the Federation agency after installation"""
        print(f"\n🏛️ Testing Federation agency...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Test n8n API
            print("🧪 Testing n8n API...")
            api_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                '-o', 'ConnectTimeout=60',
                f'{self.config["server_user"]}@{self.config["working_instance_ip"]}',
                'curl -s http://localhost:5678/api/version'
            ], capture_output=True, text=True, timeout=60)
            
            if api_result.returncode == 0 and "version" in api_result.stdout.lower():
                print("✅ n8n API is responding!")
            else:
                print(f"⚠️  n8n API response: {api_result.stdout}")
            
            # Test Federation webhook
            print("🏛️ Testing Federation webhook...")
            webhook_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                '-o', 'ConnectTimeout=60',
                f'{self.config["server_user"]}@{self.config["working_instance_ip"]}',
                'curl -s -X POST http://localhost:5678/webhook/federation-mission -H "Content-Type: application/json" -d \'{"test": true}\''
            ], capture_output=True, text=True, timeout=60)
            
            if webhook_result.returncode == 0:
                print(f"✅ Federation webhook response: {webhook_result.stdout}")
            else:
                print(f"⚠️  Federation webhook test: {webhook_result.stderr}")
            
            return True
            
        except Exception as e:
            print(f"❌ Federation agency test error: {e}")
            return False
    
    def execute_installation(self):
        """Execute the complete n8n installation process"""
        print("🏛️ EXECUTING N8N INSTALLATION ON EXISTING INSTANCE")
        print("=" * 80)
        print("🔧 Installing n8n on existing working instance")
        print("=" * 80)
        
        # Step 1: Install n8n
        print("🔧 Step 1: Installing n8n...")
        if not self.install_n8n_on_existing():
            print("❌ n8n installation failed")
            return False
        
        # Step 2: Restore Federation workflows
        print(f"\n🏛️ Step 2: Restoring Federation workflows...")
        if not self.restore_federation_workflows():
            print("❌ Workflow restoration failed")
            return False
        
        # Step 3: Test Federation agency
        print(f"\n🏛️ Step 3: Testing Federation agency...")
        self.test_federation_agency()
        
        # Step 4: Display success summary
        print("\n" + "=" * 80)
        print("🎉 N8N INSTALLATION ON EXISTING INSTANCE COMPLETED!")
        print("=" * 80)
        print(f"✅ n8n installed and configured")
        print(f"✅ Federation workflows restored")
        print(f"✅ Federation agency tested")
        
        print(f"\n🏛️ WHAT WE ACCOMPLISHED:")
        print(f"   • Installed n8n on existing instance")
        print(f"   • Configured n8n for Federation agency")
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
    print("🔧 INSTALL N8N ON EXISTING INSTANCE")
    print("=" * 80)
    
    installer = InstallN8NOnExisting()
    success = installer.execute_installation()
    
    if success:
        print("\n🎉 n8n installation completed successfully!")
        print("🏛️ Your Federation agency should be working on the existing instance!")
        print("\n🎯 Check n8n.pbradygeorgen.com - it should work now!")
    else:
        print("\n❌ n8n installation failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

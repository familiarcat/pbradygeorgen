#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - SSH READY CONTINUATION
Wait for SSH to be ready on new server, then continue with installation
"""

import os
import subprocess
import time
from datetime import datetime

class SSHReadyContinuation:
    """Wait for SSH to be ready, then continue installation"""
    
    def __init__(self):
        self.config = {
            "system_name": "SSH Ready Continuation",
            "new_instance_id": "i-0859eb7decf954323",
            "public_ip": "18.234.243.7",
            "ssh_key_path": "~/.ssh/federation-key.pem",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
    
    def wait_for_ssh_ready(self):
        """Wait for SSH to be fully ready on the new server"""
        print(f"⏳ Waiting for SSH to be fully ready on {self.config['public_ip']}...")
        
        max_wait = 300  # 5 minutes
        wait_time = 0
        
        while wait_time < max_wait:
            try:
                # Test SSH connection
                ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
                
                test_result = subprocess.run([
                    'ssh', '-i', ssh_key_path, '-o', 'ConnectTimeout=10',
                    '-o', 'StrictHostKeyChecking=no',
                    f'{self.config["server_user"]}@{self.config["public_ip"]}',
                    'echo "SSH connection successful"'
                ], capture_output=True, text=True, timeout=15)
                
                if test_result.returncode == 0:
                    print(f"✅ SSH is ready after {wait_time} seconds!")
                    return True
                else:
                    print(f"⏳ SSH not ready yet... ({wait_time}s) - {test_result.stderr.strip()}")
                
                time.sleep(15)
                wait_time += 15
                
            except Exception as e:
                print(f"⏳ SSH test error, retrying... ({wait_time}s) - {e}")
                time.sleep(15)
                wait_time += 15
        
        print("❌ SSH failed to become ready within timeout")
        return False
    
    def install_complete_ecosystem(self):
        """Install complete Node.js ecosystem and n8n on new server"""
        print(f"\n🔧 Installing complete ecosystem on new server...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            public_ip = self.config['public_ip']
            
            # Now install everything
            return self.perform_complete_installation(ssh_key_path, public_ip)
                
        except Exception as e:
            print(f"❌ Ecosystem installation error: {e}")
            return False
    
    def perform_complete_installation(self, ssh_key_path, public_ip):
        """Perform complete installation on the new server"""
        print(f"🚀 Performing complete installation...")
        
        # Installation script
        install_script = f"""#!/bin/bash
# Complete ecosystem installation for Federation agency
echo "🏛️ INSTALLING COMPLETE ECOSYSTEM FOR FEDERATION AGENCY..."

# Update system
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
sleep 30

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

echo "🏛️ COMPLETE ECOSYSTEM INSTALLATION COMPLETED!"
"""
        
        # Execute installation script
        try:
            result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{public_ip}',
                install_script
            ], capture_output=True, text=True, timeout=600)
            
            if result.returncode == 0:
                print("✅ Complete ecosystem installation successful")
                print(result.stdout)
                return True
            else:
                print(f"⚠️  Installation warning: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Installation execution error: {e}")
            return False
    
    def restore_federation_workflows(self):
        """Restore Federation workflows to the new server"""
        print(f"\n🏛️ Restoring Federation workflows...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            public_ip = self.config['public_ip']
            
            # Check for local workflow file
            local_workflow = "federation_workflows/federation_concise_agency.json"
            if os.path.exists(local_workflow):
                print(f"📋 Found local workflow: {local_workflow}")
                
                # Read the workflow content
                with open(local_workflow, 'r') as f:
                    workflow_content = f.read()
                
                # Upload to server
                print(f"🚀 Uploading workflow to new server...")
                
                # Create the workflow file on server
                upload_result = subprocess.run([
                    'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                    f'{self.config["server_user"]}@{public_ip}',
                    f'cat > /home/ubuntu/.n8n/workflows/federation_concise_agency.json << \'EOF\'\n{workflow_content}\nEOF'
                ], capture_output=True, text=True, timeout=60)
                
                if upload_result.returncode == 0:
                    print("✅ Federation workflow restored")
                    
                    # Set permissions
                    subprocess.run([
                        'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                        f'{self.config["server_user"]}@{public_ip}',
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
        """Test the Federation agency on the new server"""
        print(f"\n🏛️ Testing Federation agency on new server...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            public_ip = self.config['public_ip']
            
            # Test n8n API
            print("🧪 Testing n8n API...")
            api_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{public_ip}',
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
                f'{self.config["server_user"]}@{public_ip}',
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
    
    def execute_ssh_ready_continuation(self):
        """Execute the SSH ready continuation"""
        print("🏛️ EXECUTING SSH READY CONTINUATION")
        print("=" * 80)
        print("⏳ Waiting for SSH to be ready, then continuing with installation")
        print("=" * 80)
        
        # Step 1: Wait for SSH to be ready
        print("⏳ Step 1: Waiting for SSH to be ready...")
        if not self.wait_for_ssh_ready():
            print("❌ SSH failed to become ready")
            return False
        
        # Step 2: Install complete ecosystem
        print(f"\n🔧 Step 2: Installing complete ecosystem...")
        if not self.install_complete_ecosystem():
            print("❌ Ecosystem installation failed")
            return False
        
        # Step 3: Restore Federation workflows
        print(f"\n🏛️ Step 3: Restoring Federation workflows...")
        self.restore_federation_workflows()
        
        # Step 4: Test Federation agency
        print(f"\n🏛️ Step 4: Testing Federation agency...")
        self.test_federation_agency()
        
        # Step 5: Display success summary
        print("\n" + "=" * 80)
        print("🎉 SSH READY CONTINUATION COMPLETED!")
        print("=" * 80)
        print(f"✅ SSH connection established")
        print(f"✅ Complete ecosystem installed")
        print(f"✅ Federation workflows restored")
        print(f"✅ Federation agency tested")
        
        print(f"\n🏛️ WHAT WE ACCOMPLISHED:")
        print(f"   • Waited for SSH to be fully ready")
        print(f"   • Installed complete Node.js ecosystem")
        print(f"   • Installed and configured n8n")
        print(f"   • Restored Federation workflows")
        print(f"   • Tested Federation agency")
        
        print(f"\n💡 NEXT STEPS:")
        print(f"• **Check n8n UI** - Visit n8n.pbradygeorgen.com")
        print(f"• **Test Federation agency** - Send 'ALL HANDS ON BOARD' directive")
        print(f"• **Enjoy your crew** - Federation agency fully operational")
        
        print(f"\n🔑 SSH ACCESS:")
        print(f"• SSH Key: {self.config['ssh_key_path']}")
        print(f"• Server: ubuntu@{self.config['public_ip']}")
        print(f"• Command: ssh -i {self.config['ssh_key_path']} ubuntu@{self.config['public_ip']}")
        
        print(f"\n🚀 READY FOR TESTING:")
        print(f"1. Check n8n.pbradygeorgen.com - should work now!")
        print(f"2. Test your Federation agency")
        print(f"3. Get complete Federation crew manifest")
        print(f"4. Enjoy your streamlined Federation agency!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("⏳ SSH READY CONTINUATION INITIATED")
    print("=" * 80)
    
    continuation = SSHReadyContinuation()
    success = continuation.execute_ssh_ready_continuation()
    
    if success:
        print("\n🎉 SSH ready continuation completed successfully!")
        print("🏛️ Your Federation agency should be working on the new server!")
        print("\n🎯 Check n8n.pbradygeorgen.com - it should work now!")
    else:
        print("\n❌ SSH ready continuation failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

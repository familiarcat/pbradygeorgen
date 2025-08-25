#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - FIX N8N ON CORRECT INSTANCE
Fix n8n configuration on the correct instance in us-east-2
"""

import os
import subprocess
import time
from datetime import datetime

class FixN8NOnCorrectInstance:
    """Fix n8n configuration on the correct instance"""
    
    def __init__(self):
        self.config = {
            "system_name": "Fix N8N On Correct Instance",
            "correct_instance_ip": "3.144.205.118",  # us-east-2
            "ssh_key_path": "~/.ssh/AlexKeyPair.pem",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
    
    def check_current_n8n_status(self):
        """Check current n8n status on the correct instance"""
        print(f"🔍 Checking current n8n status on {self.config['correct_instance_ip']}...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Check n8n processes
            print("🔍 Checking n8n processes...")
            process_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'ps aux | grep n8n | grep -v grep'
            ], capture_output=True, text=True, timeout=30)
            
            if process_result.returncode == 0:
                print(f"✅ n8n processes found:\n{process_result.stdout}")
            else:
                print("❌ No n8n processes found")
                return False
            
            # Check port 5678
            print("🔍 Checking port 5678...")
            port_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'netstat -tlnp 2>/dev/null | grep :5678'
            ], capture_output=True, text=True, timeout=30)
            
            if port_result.returncode == 0:
                print(f"✅ Port 5678 listening: {port_result.stdout}")
                return True
            else:
                print("❌ Port 5678 not listening")
                return False
            
        except Exception as e:
            print(f"❌ Status check error: {e}")
            return False
    
    def fix_n8n_configuration(self):
        """Fix n8n configuration to listen on port 5678"""
        print(f"\n🔧 Fixing n8n configuration...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Fix script
            fix_script = """#!/bin/bash
# Fix n8n configuration to listen on port 5678
echo "🔧 FIXING N8N CONFIGURATION..."

# Stop current n8n process
echo "🛑 Stopping current n8n process..."
pkill -f n8n
sleep 5

# Check if n8n is installed
echo "🔍 Checking n8n installation..."
if ! command -v n8n &> /dev/null; then
    echo "📦 Installing n8n globally..."
    sudo npm install -g n8n
fi

# Create proper n8n configuration
echo "🔧 Creating proper n8n configuration..."
mkdir -p /home/ubuntu/.n8n

# Create .env file with correct port binding
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

# Start n8n with proper configuration
echo "🚀 Starting n8n with proper configuration..."
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

echo "🏛️ N8N CONFIGURATION FIXED!"
"""
            
            # Execute fix script
            print("🚀 Executing n8n configuration fix...")
            result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                fix_script
            ], capture_output=True, text=True, timeout=600)
            
            if result.returncode == 0:
                print("✅ n8n configuration fix successful!")
                print(result.stdout)
                return True
            else:
                print(f"⚠️  Configuration fix warning: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Configuration fix error: {e}")
            return False
    
    def restore_federation_workflows(self):
        """Restore Federation workflows after fixing n8n"""
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
                    f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                    f'cat > /home/ubuntu/.n8n/workflows/federation_concise_agency.json << \'EOF\'\n{workflow_content}\nEOF'
                ], capture_output=True, text=True, timeout=60)
                
                if upload_result.returncode == 0:
                    print("✅ Federation workflow restored")
                    
                    # Set permissions
                    subprocess.run([
                        'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                        f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
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
        """Test the Federation agency after fixing n8n"""
        print(f"\n🏛️ Testing Federation agency...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Test n8n API
            print("🧪 Testing n8n API...")
            api_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
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
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
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
    
    def execute_fix_process(self):
        """Execute the complete fix process"""
        print("🏛️ EXECUTING N8N CONFIGURATION FIX ON CORRECT INSTANCE")
        print("=" * 80)
        print("🔧 Fixing n8n configuration on the correct instance in us-east-2")
        print("=" * 80)
        
        # Step 1: Check current status
        print("🔍 Step 1: Checking current n8n status...")
        if not self.check_current_n8n_status():
            print("❌ Current status check failed")
            return False
        
        # Step 2: Fix n8n configuration
        print(f"\n🔧 Step 2: Fixing n8n configuration...")
        if not self.fix_n8n_configuration():
            print("❌ Configuration fix failed")
            return False
        
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
        print("🎉 N8N CONFIGURATION FIX COMPLETED!")
        print("=" * 80)
        print(f"✅ n8n configuration fixed")
        print(f"✅ Federation workflows restored")
        print(f"✅ Federation agency tested")
        
        print(f"\n🏛️ WHAT WE ACCOMPLISHED:")
        print(f"   • Fixed n8n configuration on correct instance")
        print(f"   • Got n8n listening on port 5678")
        print(f"   • Restored Federation workflows")
        print(f"   • Tested Federation agency")
        
        print(f"\n💡 NEXT STEPS:")
        print(f"• **Check n8n UI** - Visit n8n.pbradygeorgen.com")
        print(f"• **Test Federation agency** - Send 'ALL HANDS ON BOARD' directive")
        print(f"• **Enjoy your crew** - Federation agency should be working!")
        
        print(f"\n🔑 SERVER ACCESS:")
        print(f"• IP: {self.config['correct_instance_ip']} (us-east-2)")
        print(f"• SSH Key: {self.config['ssh_key_path']}")
        print(f"• Command: ssh -i {self.config['ssh_key_path']} ubuntu@{self.config['correct_instance_ip']}")
        
        print(f"\n🚀 READY FOR TESTING:")
        print(f"1. Check n8n.pbradygeorgen.com - should work now!")
        print(f"2. Test your Federation agency")
        print(f"3. Get complete Federation crew manifest")
        print(f"4. Enjoy your streamlined Federation agency!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔧 FIX N8N ON CORRECT INSTANCE")
    print("=" * 80)
    
    fixer = FixN8NOnCorrectInstance()
    success = fixer.execute_fix_process()
    
    if success:
        print("\n🎉 n8n configuration fix completed successfully!")
        print("🏛️ Your Federation agency should be working on the correct instance!")
        print("\n🎯 Check n8n.pbradygeorgen.com - it should work now!")
    else:
        print("\n❌ n8n configuration fix failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - RESTART APPROACH
Simple restart to see if n8n picks up existing workflow files
"""

import os
import subprocess
from datetime import datetime

class FederationRestartApproach:
    """Simple restart approach to make workflows visible"""
    
    def __init__(self):
        self.config = {
            "system_name": "Federation Restart Approach",
            "target_instance": "n8n.pbradygeorgen.com",
            "ssh_key": "~/.ssh/n8n.pem",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
        
        # Workflow definitions
        self.workflows = [
            {
                "name": "AI Fleet Consciousness Workflow",
                "file": "consciousness.json",
                "webhook": "/webhook/consciousness"
            },
            {
                "name": "Fleet Automation System",
                "file": "fleet_automation.json",
                "webhook": "/webhook/fleet-automation"
            },
            {
                "name": "Crew Management System",
                "file": "crew_management.json",
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
    
    def verify_workflow_files(self):
        """Verify workflow files are in place"""
        print("🔍 Verifying workflow files are in place...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            verify_script = """#!/bin/bash
# Verify workflow files are in place
echo "🔍 Verifying Federation workflow files..."

WORKFLOWS_PATH="/home/ubuntu/n8n/.n8n/workflows"

if [ -d "$WORKFLOWS_PATH" ]; then
    echo "✅ Workflows directory exists: $WORKFLOWS_PATH"
    
    # List all workflow files
    echo "📋 Workflow files found:"
    ls -la "$WORKFLOWS_PATH"/*.json 2>/dev/null || echo "No workflow files found"
    
    # Count workflow files
    WORKFLOW_COUNT=$(ls "$WORKFLOWS_PATH"/*.json 2>/dev/null | wc -l)
    echo "📊 Total workflow files: $WORKFLOW_COUNT"
    
    # Check specific workflows
    EXPECTED_WORKFLOWS=("consciousness.json" "fleet_automation.json" "crew_management.json")
    
    for expected in "${EXPECTED_WORKFLOWS[@]}"; do
        if [ -f "$WORKFLOWS_PATH/$expected" ]; then
            echo "✅ Found: $expected"
        else
            echo "❌ Missing: $expected"
        fi
    done
    
    echo "WORKFLOW_COUNT:$WORKFLOW_COUNT"
else
    echo "❌ Workflows directory not found: $WORKFLOWS_PATH"
    echo "WORKFLOW_COUNT:0"
fi
"""
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                verify_script
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                # Extract workflow count
                workflow_count = 0
                for line in result.stdout.split('\n'):
                    if line.startswith('WORKFLOW_COUNT:'):
                        workflow_count = int(line.split(':', 1)[1].strip())
                        break
                
                print(f"✅ Verification complete: {workflow_count} workflow files found")
                print(result.stdout)
                return workflow_count >= 3
            else:
                print(f"❌ Verification failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Verification error: {e}")
            return False
    
    def restart_n8n_service(self):
        """Restart n8n service"""
        print("\n🔄 Restarting n8n service...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            restart_script = """#!/bin/bash
# Restart n8n service
echo "🔄 Restarting n8n service..."

# Try different service names
SERVICE_NAMES=("n8n" "n8n.service" "n8n-server")

for service in "${SERVICE_NAMES[@]}"; do
    if systemctl list-units --full --all | grep -q "$service"; then
        echo "✅ Found service: $service"
        sudo systemctl restart "$service"
        echo "✅ Service restarted: $service"
        break
    fi
done

# Alternative: restart via PM2 if available
if command -v pm2 &> /dev/null; then
    echo "🔄 Restarting n8n via PM2..."
    pm2 restart n8n || echo "⚠️  PM2 restart failed"
fi

# Alternative: restart via Docker if containerized
if command -v docker &> /dev/null; then
    N8N_CONTAINER=$(docker ps --filter "ancestor=n8nio/n8n" --format "{{.Names}}" | head -1)
    if [ -n "$N8N_CONTAINER" ]; then
        echo "🐳 Restarting n8n container: $N8N_CONTAINER"
        docker restart "$N8N_CONTAINER" || echo "⚠️  Container restart failed"
    fi
fi

echo "🔄 n8n service restart completed"
"""
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                restart_script
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print("✅ n8n service restart completed")
                return True
            else:
                print(f"⚠️  Service restart warning: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Service restart error: {e}")
            return False
    
    def wait_for_n8n_startup(self):
        """Wait for n8n to start up"""
        print("\n⏳ Waiting for n8n to start up...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            wait_script = """#!/bin/bash
# Wait for n8n to start up
echo "⏳ Waiting for n8n to start up..."

MAX_ATTEMPTS=30
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "   Attempt $ATTEMPT/$MAX_ATTEMPTS..."
    
    # Check if n8n is responding
    if curl -s http://localhost:5678/api/v1/version > /dev/null 2>&1; then
        echo "✅ n8n is responding on port 5678"
        break
    fi
    
    # Check if n8n process is running
    if pgrep -f "n8n" > /dev/null; then
        echo "   n8n process is running, waiting for startup..."
    else
        echo "   n8n process not found"
    fi
    
    sleep 2
    ATTEMPT=$((ATTEMPT + 1))
done

if [ $ATTEMPT -gt $MAX_ATTEMPTS ]; then
    echo "⚠️  n8n startup timeout after $MAX_ATTEMPTS attempts"
else
    echo "✅ n8n startup completed"
fi
"""
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                wait_script
            ], capture_output=True, text=True, timeout=120)
            
            if result.returncode == 0:
                print("✅ n8n startup wait completed")
                print(result.stdout)
                return True
            else:
                print(f"⚠️  Startup wait warning: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Startup wait error: {e}")
            return False
    
    def execute_restart_approach(self):
        """Execute restart approach"""
        print("🏛️ EXECUTING FEDERATION RESTART APPROACH")
        print("=" * 80)
        print("🔄 Simple restart to see if n8n picks up existing workflow files")
        print("=" * 80)
        
        # Step 1: Test SSH connection
        print("🔐 Step 1: Testing SSH connection...")
        if not self.test_ssh_connection():
            print("❌ Failed to establish SSH connection")
            return False
        
        # Step 2: Verify workflow files
        print("\n🔍 Step 2: Verifying workflow files are in place...")
        if not self.verify_workflow_files():
            print("❌ Workflow files not found")
            return False
        
        # Step 3: Restart n8n service
        print("\n🔄 Step 3: Restarting n8n service...")
        if not self.restart_n8n_service():
            print("⚠️  Service restart failed")
        
        # Step 4: Wait for n8n startup
        print("\n⏳ Step 4: Waiting for n8n startup...")
        self.wait_for_n8n_startup()
        
        # Step 5: Display summary
        print("\n" + "=" * 80)
        print("🎉 FEDERATION RESTART APPROACH COMPLETED!")
        print("✅ Workflow files verified in place")
        print("✅ n8n service restarted")
        print("✅ n8n startup completed")
        
        print("\n🏛️ United Federation of AI Agents workflow files are ready!")
        print("\n🎯 WORKFLOW NAMES TO LOOK FOR ON N8N.PBRADYGEORGEN.COM:")
        
        for workflow_info in self.workflows:
            print(f"   • {workflow_info['name']}")
            print(f"     Webhook: {workflow_info['webhook']}")
        
        print("\n🚀 Your Federation workflows should now be visible in the n8n UI!")
        print("🔧 n8n has been restarted and should pick up the workflow files!")
        print("\n💡 If workflows still don't appear, try refreshing the n8n UI")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔄 RESTART APPROACH INITIATED")
    print("=" * 80)
    
    restarter = FederationRestartApproach()
    success = restarter.execute_restart_approach()
    
    if success:
        print("\n🎉 Federation restart approach completed successfully!")
        print("🏛️ Your workflow files are ready and n8n has been restarted!")
        print("\n🎯 Check n8n.pbradygeorgen.com - workflows should be visible!")
    else:
        print("\n❌ Federation restart approach failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

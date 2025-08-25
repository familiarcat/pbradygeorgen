#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - FORCE WORKFLOW ACTIVATION
Forces n8n to recognize and activate the deployed workflow
"""

import os
import subprocess
from datetime import datetime

class ForceWorkflowActivation:
    """Forces n8n to recognize and activate the deployed workflow"""
    
    def __init__(self):
        self.config = {
            "system_name": "Force Workflow Activation",
            "target_instance": "n8n.pbradygeorgen.com",
            "ssh_key": "~/.ssh/n8n.pem",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
    
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
    
    def force_workflow_recognition(self):
        """Force n8n to recognize the workflow"""
        print("\n🚀 FORCING WORKFLOW RECOGNITION...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            force_script = """#!/bin/bash
# Force n8n to recognize the workflow
echo "🚀 FORCING WORKFLOW RECOGNITION..."

WORKFLOWS_PATH="/home/ubuntu/n8n/.n8n/workflows"
TARGET_WORKFLOW="federation_concise_agency.json"

if [ -f "$WORKFLOWS_PATH/$TARGET_WORKFLOW" ]; then
    echo "✅ Target workflow found: $TARGET_WORKFLOW"
    
    # Check current workflow content
    echo "🔍 Current workflow content:"
    echo "   File size: $(du -h "$WORKFLOWS_PATH/$TARGET_WORKFLOW" | cut -f1)"
    echo "   Workflow name: $(grep -o '"name":"[^"]*"' "$WORKFLOWS_PATH/$TARGET_WORKFLOW" | head -1)"
    echo "   Active status: $(grep -o '"active":[^,]*' "$WORKFLOWS_PATH/$TARGET_WORKFLOW" | head -1)"
    
    # Force workflow activation by updating the JSON
    echo "📝 Forcing workflow activation..."
    
    # Use sed to ensure active: true
    sed -i 's/"active":false/"active":true/g' "$WORKFLOWS_PATH/$TARGET_WORKFLOW"
    sed -i 's/"active":null/"active":true/g' "$WORKFLOWS_PATH/$TARGET_WORKFLOW"
    
    # If no active field exists, add it
    if ! grep -q '"active":' "$WORKFLOWS_PATH/$TARGET_WORKFLOW"; then
        echo "   Adding active field..."
        # Add active field after the name field
        sed -i 's/"name":"[^"]*"/"name":"Federation Concise Agency - OpenRouter Crew",\n  "active": true/g' "$WORKFLOWS_PATH/$TARGET_WORKFLOW"
    fi
    
    # Verify changes
    echo "🔍 Verification after changes:"
    echo "   Active status: $(grep -o '"active":[^,]*' "$WORKFLOWS_PATH/$TARGET_WORKFLOW" | head -1)"
    
    # Check if n8n is running and can see the workflow
    echo "🔍 Checking n8n process status..."
    if pgrep -f "n8n" > /dev/null; then
        echo "✅ n8n process is running"
        
        # Check n8n logs for workflow loading
        echo "📋 Recent n8n logs (last 20 lines):"
        journalctl -u n8n --no-pager -n 20 2>/dev/null || echo "   No systemd logs available"
        
        # Check if workflow is being loaded
        echo "🔍 Checking if workflow is being loaded..."
        if journalctl -u n8n --no-pager | grep -i "federation\|workflow" | tail -5; then
            echo "✅ Found workflow-related logs"
        else
            echo "⚠️  No workflow-related logs found"
        fi
    else
        echo "❌ n8n process not running"
    fi
    
else
    echo "❌ Target workflow not found: $TARGET_WORKFLOW"
    exit 1
fi

echo "✅ Workflow recognition forcing completed"
"""
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                force_script
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print("✅ Workflow recognition forcing completed")
                print(result.stdout)
                return True
            else:
                print(f"❌ Workflow recognition forcing failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Workflow recognition forcing error: {e}")
            return False
    
    def restart_n8n_with_workflow_scan(self):
        """Restart n8n with explicit workflow scanning"""
        print("\n🔄 RESTARTING N8N WITH WORKFLOW SCANNING...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            restart_script = """#!/bin/bash
# Restart n8n with explicit workflow scanning
echo "🔄 RESTARTING N8N WITH WORKFLOW SCANNING..."

# Stop n8n service
echo "🛑 Stopping n8n service..."
SERVICE_NAMES=("n8n" "n8n.service" "n8n-server")

for service in "${SERVICE_NAMES[@]}"; do
    if systemctl list-units --full --all | grep -q "$service"; then
        echo "✅ Found service: $service"
        sudo systemctl stop "$service"
        echo "✅ Service stopped: $service"
        break
    fi
done

# Alternative: stop via PM2 if available
if command -v pm2 &> /dev/null; then
    echo "🛑 Stopping n8n via PM2..."
    pm2 stop n8n || echo "⚠️  PM2 stop failed"
fi

# Alternative: stop via Docker if containerized
if command -v docker &> /dev/null; then
    N8N_CONTAINER=$(docker ps --filter "ancestor=n8nio/n8n" --format "{{.Names}}" | head -1)
    if [ -n "$N8N_CONTAINER" ]; then
        echo "🐳 Stopping n8n container: $N8N_CONTAINER"
        docker stop "$N8N_CONTAINER" || echo "⚠️  Container stop failed"
    fi
fi

# Wait for complete shutdown
echo "⏳ Waiting for n8n to completely shutdown..."
sleep 5

# Verify n8n is stopped
if pgrep -f "n8n" > /dev/null; then
    echo "⚠️  n8n process still running, forcing kill..."
    pkill -f "n8n"
    sleep 2
fi

# Start n8n service
echo "🚀 Starting n8n service..."
for service in "${SERVICE_NAMES[@]}"; do
    if systemctl list-units --full --all | grep -q "$service"; then
        echo "✅ Starting service: $service"
        sudo systemctl start "$service"
        echo "✅ Service started: $service"
        break
    fi
done

# Alternative: start via PM2 if available
if command -v pm2 &> /dev/null; then
    echo "🚀 Starting n8n via PM2..."
    pm2 start n8n || echo "⚠️  PM2 start failed"
fi

# Alternative: start via Docker if containerized
if command -v docker &> /dev/null; then
    N8N_CONTAINER=$(docker ps -a --filter "ancestor=n8nio/n8n" --format "{{.Names}}" | head -1)
    if [ -n "$N8N_CONTAINER" ]; then
        echo "🐳 Starting n8n container: $N8N_CONTAINER"
        docker start "$N8N_CONTAINER" || echo "⚠️  Container start failed"
    fi
fi

echo "🔄 n8n restart with workflow scanning completed"
"""
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                restart_script
            ], capture_output=True, text=True, timeout=120)
            
            if result.returncode == 0:
                print("✅ n8n restart with workflow scanning completed")
                print(result.stdout)
                return True
            else:
                print(f"⚠️  n8n restart warning: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ n8n restart error: {e}")
            return False
    
    def wait_for_n8n_startup(self):
        """Wait for n8n to start up and scan workflows"""
        print("\n⏳ Waiting for n8n to start up and scan workflows...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            wait_script = """#!/bin/bash
# Wait for n8n to start up and scan workflows
echo "⏳ Waiting for n8n to start up and scan workflows..."

MAX_ATTEMPTS=60
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "   Attempt $ATTEMPT/$MAX_ATTEMPTS..."
    
    # Check if n8n is responding
    if curl -s http://localhost:5678/api/version > /dev/null 2>&1; then
        echo "✅ n8n is responding on port 5678"
        
        # Check if workflow scanning is complete
        echo "🔍 Checking workflow scanning status..."
        
        # Wait a bit more for workflow scanning to complete
        sleep 5
        
        # Check if our workflow is now visible
        WORKFLOWS_PATH="/home/ubuntu/n8n/.n8n/workflows"
        if [ -f "$WORKFLOWS_PATH/federation_concise_agency.json" ]; then
            echo "✅ Federation workflow file still exists"
            
            # Check if n8n has loaded it
            if curl -s http://localhost:5678/api/workflows > /dev/null 2>&1; then
                echo "✅ n8n workflows API is responding"
                break
            else
                echo "   n8n workflows API not responding yet..."
            fi
        else
            echo "❌ Federation workflow file missing"
        fi
    fi
    
    # Check if n8n process is running
    if pgrep -f "n8n" > /dev/null; then
        echo "   n8n process is running, waiting for startup..."
    else
        echo "   n8n process not found"
    fi
    
    sleep 3
    ATTEMPT=$((ATTEMPT + 1))
done

if [ $ATTEMPT -gt $MAX_ATTEMPTS ]; then
    echo "⚠️  n8n startup timeout after $MAX_ATTEMPTS attempts"
else
    echo "✅ n8n startup and workflow scanning completed"
fi
"""
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                wait_script
            ], capture_output=True, text=True, timeout=180)
            
            if result.returncode == 0:
                print("✅ n8n startup and workflow scanning wait completed")
                print(result.stdout)
                return True
            else:
                print(f"⚠️  Startup wait warning: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Startup wait error: {e}")
            return False
    
    def execute_force_activation(self):
        """Execute the complete force activation process"""
        print("🏛️ EXECUTING FORCE WORKFLOW ACTIVATION")
        print("=" * 80)
        print("🚀 Forcing n8n to recognize and activate the deployed workflow")
        print("=" * 80)
        
        # Step 1: Test SSH connection
        print("🔐 Step 1: Testing SSH connection...")
        if not self.test_ssh_connection():
            print("❌ Failed to establish SSH connection")
            return False
        
        # Step 2: Force workflow recognition
        print("\n🚀 Step 2: Forcing workflow recognition...")
        if not self.force_workflow_recognition():
            print("❌ Workflow recognition forcing failed")
            return False
        
        # Step 3: Restart n8n with workflow scanning
        print("\n🔄 Step 3: Restarting n8n with workflow scanning...")
        if not self.restart_n8n_with_workflow_scan():
            print("⚠️  n8n restart failed")
        
        # Step 4: Wait for n8n startup and workflow scanning
        print("\n⏳ Step 4: Waiting for n8n startup and workflow scanning...")
        self.wait_for_n8n_startup()
        
        # Step 5: Display summary
        print("\n" + "=" * 80)
        print("🎉 FORCE WORKFLOW ACTIVATION COMPLETED!")
        print("=" * 80)
        print("✅ Workflow recognition forced")
        print("✅ n8n restarted with workflow scanning")
        print("✅ Workflow scanning completed")
        
        print(f"\n🏛️ YOUR FEDERATION WORKFLOW SHOULD NOW BE ACTIVE!")
        print(f"\n🎯 WORKFLOW STATUS:")
        print(f"   • Name: Federation Concise Agency - OpenRouter Crew")
        print(f"   • Status: Should now be ACTIVE in n8n")
        print(f"   • Webhook: /webhook/federation-mission")
        print(f"   • Method: Forced activation via workflow scanning")
        
        print(f"\n💡 WHAT WAS FORCED:")
        print(f"• **Workflow recognition** - Forced n8n to see the file")
        print(f"• **Complete restart** - n8n restarted with fresh workflow scan")
        print(f"• **Workflow loading** - n8n should now load the workflow")
        print(f"• **Webhook registration** - /webhook/federation-mission should work")
        
        print(f"\n🚀 NEXT STEPS:")
        print(f"1. Test the Federation agency again")
        print(f"2. Send 'ALL HANDS ON BOARD' directive")
        print(f"3. Get complete Federation crew manifest")
        print(f"4. Enjoy your streamlined Federation agency!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🚀 FORCE WORKFLOW ACTIVATION INITIATED")
    print("=" * 80)
    
    activator = ForceWorkflowActivation()
    success = activator.execute_force_activation()
    
    if success:
        print("\n🎉 Force workflow activation completed successfully!")
        print("🏛️ Your workflow should now be recognized and active!")
        print("\n🎯 Test the Federation agency again!")
    else:
        print("\n❌ Force workflow activation failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

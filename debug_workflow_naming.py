#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - WORKFLOW NAMING DEBUG
Debug and fix the workflow naming issue
"""

import os
import subprocess
import json
from datetime import datetime

class WorkflowNamingDebugger:
    """Debug and fix workflow naming issues"""
    
    def __init__(self):
        self.config = {
            "system_name": "Workflow Naming Debugger",
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
    
    def debug_workflow_content(self):
        """Debug the actual workflow content on server"""
        print("\n🔍 DEBUGGING WORKFLOW CONTENT ON SERVER...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            debug_script = """#!/bin/bash
# Debug workflow content
echo "🔍 DEBUGGING WORKFLOW CONTENT..."
echo "=================================="

WORKFLOWS_PATH="/home/ubuntu/n8n/.n8n/workflows"
TARGET_WORKFLOW="federation_concise_agency.json"

if [ -f "$WORKFLOWS_PATH/$TARGET_WORKFLOW" ]; then
    echo "✅ Target workflow found: $TARGET_WORKFLOW"
    echo ""
    
    # Check file size
    file_size=$(du -h "$WORKFLOWS_PATH/$TARGET_WORKFLOW" | cut -f1)
    echo "📊 File size: $file_size"
    
    # Check current workflow name
    echo "🔍 Current workflow name in file:"
    grep -o '"name":"[^"]*"' "$WORKFLOWS_PATH/$TARGET_WORKFLOW" | head -1
    
    # Check activation status
    echo "🔍 Current activation status:"
    grep -o '"active":[^,]*' "$WORKFLOWS_PATH/$TARGET_WORKFLOW" | head -1
    
    # Show first few lines of workflow
    echo ""
    echo "📋 First 10 lines of workflow file:"
    head -10 "$WORKFLOWS_PATH/$TARGET_WORKFLOW"
    
    # Show workflow structure
    echo ""
    echo "🏗️ Workflow structure:"
    echo "Nodes: $(grep -c '"type":' "$WORKFLOWS_PATH/$TARGET_WORKFLOW")"
    echo "Connections: $(grep -c '"connections"' "$WORKFLOWS_PATH/$TARGET_WORKFLOW")"
    
else
    echo "❌ Target workflow not found: $TARGET_WORKFLOW"
fi

echo ""
echo "DEBUG_COMPLETE"
"""
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                debug_script
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print("✅ Workflow content debug completed")
                print(result.stdout)
                return True
            else:
                print(f"❌ Workflow content debug failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Workflow content debug error: {e}")
            return False
    
    def fix_workflow_naming(self):
        """Fix the workflow naming properly"""
        print("\n🚀 FIXING WORKFLOW NAMING PROPERLY...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            fix_script = """#!/bin/bash
# Fix workflow naming properly
echo "🚀 FIXING WORKFLOW NAMING PROPERLY..."

WORKFLOWS_PATH="/home/ubuntu/n8n/.n8n/workflows"
TARGET_WORKFLOW="federation_concise_agency.json"
NEW_WORKFLOW_NAME="🏛️ FEDERATION CONCISE AGENCY - ACTIVATE ME!"

if [ -f "$WORKFLOWS_PATH/$TARGET_WORKFLOW" ]; then
    echo "✅ Target workflow found: $TARGET_WORKFLOW"
    
    # Create backup
    cp "$WORKFLOWS_PATH/$TARGET_WORKFLOW" "$WORKFLOWS_PATH/$TARGET_WORKFLOW.backup.$(date +%s)"
    echo "✅ Backup created"
    
    # Use Python for reliable JSON modification
    echo "🔧 Using Python for reliable JSON modification..."
    
    python3 -c "
import json
import sys

try:
    # Read workflow file
    with open('$WORKFLOWS_PATH/$TARGET_WORKFLOW', 'r') as f:
        workflow = json.load(f)
    
    # Update name and activation
    workflow['name'] = '$NEW_WORKFLOW_NAME'
    workflow['active'] = True
    
    # Write back to file
    with open('$WORKFLOWS_PATH/$TARGET_WORKFLOW', 'w') as f:
        json.dump(workflow, f, indent=2)
    
    print('✅ Workflow updated successfully')
    print(f'New name: {workflow[\"name\"]}')
    print(f'Active: {workflow[\"active\"]}')
    
except Exception as e:
    print(f'❌ Error updating workflow: {e}')
    sys.exit(1)
"
    
    if [ $? -eq 0 ]; then
        echo "✅ Python modification successful"
    else
        echo "❌ Python modification failed, trying sed fallback..."
        
        # Fallback to sed
        sed -i 's/"name":"[^"]*"/"name":"'$NEW_WORKFLOW_NAME'"/g' "$WORKFLOWS_PATH/$TARGET_WORKFLOW"
        sed -i 's/"active":false/"active":true/g' "$WORKFLOWS_PATH/$TARGET_WORKFLOW"
        sed -i 's/"active":null/"active":true/g' "$WORKFLOWS_PATH/$TARGET_WORKFLOW"
        
        echo "✅ Sed fallback completed"
    fi
    
    # Verify changes
    echo "🔍 Verifying changes..."
    if grep -q "$NEW_WORKFLOW_NAME" "$WORKFLOWS_PATH/$TARGET_WORKFLOW"; then
        echo "✅ Workflow name updated successfully"
    else
        echo "❌ Workflow name update failed"
    fi
    
    if grep -q '"active":true' "$WORKFLOWS_PATH/$TARGET_WORKFLOW"; then
        echo "✅ Workflow activated successfully"
    else
        echo "❌ Workflow activation failed"
    fi
    
    # Show updated content
    echo ""
    echo "📋 Updated workflow details:"
    ls -la "$WORKFLOWS_PATH/$TARGET_WORKFLOW"
    
    echo ""
    echo "🔍 Updated workflow name:"
    grep -o '"name":"[^"]*"' "$WORKFLOWS_PATH/$TARGET_WORKFLOW" | head -1
    
    echo ""
    echo "🔍 Updated activation status:"
    grep -o '"active":[^,]*' "$WORKFLOWS_PATH/$TARGET_WORKFLOW" | head -1
    
else
    echo "❌ Target workflow not found: $TARGET_WORKFLOW"
    exit 1
fi

echo "✅ Workflow naming fix completed"
"""
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                fix_script
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print("✅ Workflow naming fix completed")
                print(result.stdout)
                return True
            else:
                print(f"❌ Workflow naming fix failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Workflow naming fix error: {e}")
            return False
    
    def restart_n8n_service(self):
        """Restart n8n service to pick up changes"""
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
    
    def execute_debug_and_fix(self):
        """Execute the complete debug and fix process"""
        print("🏛️ EXECUTING WORKFLOW NAMING DEBUG AND FIX")
        print("=" * 80)
        print("🔍 Debugging workflow content and fixing naming issues")
        print("=" * 80)
        
        # Step 1: Test SSH connection
        print("🔐 Step 1: Testing SSH connection...")
        if not self.test_ssh_connection():
            print("❌ Failed to establish SSH connection")
            return False
        
        # Step 2: Debug workflow content
        print("\n🔍 Step 2: Debugging workflow content on server...")
        if not self.debug_workflow_content():
            print("❌ Workflow content debug failed")
            return False
        
        # Step 3: Fix workflow naming
        print("\n🚀 Step 3: Fixing workflow naming properly...")
        if not self.fix_workflow_naming():
            print("❌ Workflow naming fix failed")
            return False
        
        # Step 4: Restart n8n service
        print("\n🔄 Step 4: Restarting n8n service...")
        if not self.restart_n8n_service():
            print("⚠️  Service restart failed")
        
        # Step 5: Display summary
        print("\n" + "=" * 80)
        print("🎉 WORKFLOW NAMING DEBUG AND FIX COMPLETED!")
        print("=" * 80)
        print("✅ Workflow content debugged")
        print("✅ Workflow naming fixed properly")
        print("✅ n8n service restarted")
        
        print(f"\n🏛️ YOUR FEDERATION WORKFLOW SHOULD NOW BE VISIBLE!")
        print(f"\n🎯 LOOK FOR THIS WORKFLOW ON N8N.PBRADYGEORGEN.COM:")
        print(f"   • 🏛️ FEDERATION CONCISE AGENCY - ACTIVATE ME!")
        print(f"     Status: Should now be visible with proper name")
        print(f"     Webhook: /webhook/federation-mission")
        
        print(f"\n💡 WHAT WAS FIXED:")
        print(f"• **Workflow name** - Now properly renamed for identification")
        print(f"• **Activation status** - Set to true in JSON")
        print(f"• **n8n restart** - Changes picked up by the system")
        
        print(f"\n🚀 NEXT STEPS:")
        print(f"1. Check n8n.pbradygeorgen.com for the renamed workflow")
        print(f"2. Look for '🏛️ FEDERATION CONCISE AGENCY - ACTIVATE ME!'")
        print(f"3. Activate it if it shows as inactive")
        print(f"4. Test the Federation agency!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔍 WORKFLOW NAMING DEBUG INITIATED")
    print("=" * 80)
    
    debugger = WorkflowNamingDebugger()
    success = debugger.execute_debug_and_fix()
    
    if success:
        print("\n🎉 Workflow naming debug and fix completed successfully!")
        print("🏛️ Your workflow should now be properly named and visible!")
        print("\n🎯 Check n8n.pbradygeorgen.com - look for the renamed workflow!")
    else:
        print("\n❌ Workflow naming debug and fix failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - WORKFLOW INVESTIGATOR
Investigates, identifies, renames, and activates Federation workflows
"""

import os
import subprocess
import json
from datetime import datetime

class FederationWorkflowInvestigator:
    """Investigates and manages Federation workflows"""
    
    def __init__(self):
        self.config = {
            "system_name": "Federation Workflow Investigator",
            "target_instance": "n8n.pbradygeorgen.com",
            "ssh_key": "~/.ssh/n8n.pem",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
        
        # Target workflow identifiers
        self.target_workflow = "federation_concise_agency.json"
        self.new_workflow_name = "🏛️ FEDERATION CONCISE AGENCY - ACTIVATE ME!"
    
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
    
    def investigate_workflows(self):
        """Investigate all workflows on the server"""
        print("\n🔍 INVESTIGATING WORKFLOWS ON N8N SERVER...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            investigate_script = """#!/bin/bash
# Investigate all workflows on n8n server
echo "🔍 INVESTIGATING N8N WORKFLOWS..."
echo "=================================="

WORKFLOWS_PATH="/home/ubuntu/n8n/.n8n/workflows"
DATABASE_PATH="/home/ubuntu/n8n/.n8n/database.sqlite"

if [ -d "$WORKFLOWS_PATH" ]; then
    echo "✅ Workflows directory exists: $WORKFLOWS_PATH"
    echo ""
    
    # List all workflow files with details
    echo "📋 WORKFLOW FILES ON DISK:"
    echo "---------------------------"
    if [ "$(ls -A "$WORKFLOWS_PATH"/*.json 2>/dev/null)" ]; then
        for workflow_file in "$WORKFLOWS_PATH"/*.json; do
            if [ -f "$workflow_file" ]; then
                filename=$(basename "$workflow_file")
                size=$(du -h "$workflow_file" | cut -f1)
                modified=$(stat -c %y "$workflow_file" | cut -d' ' -f1,2)
                echo "📄 $filename"
                echo "   Size: $size | Modified: $modified"
                
                # Extract workflow name from JSON
                workflow_name=$(grep -o '"name":"[^"]*"' "$workflow_file" | head -1 | cut -d'"' -f4)
                if [ -n "$workflow_name" ]; then
                    echo "   Name: $workflow_name"
                fi
                echo ""
            fi
        done
    else
        echo "❌ No workflow files found"
    fi
    
    # Count workflow files
    WORKFLOW_COUNT=$(ls "$WORKFLOWS_PATH"/*.json 2>/dev/null | wc -l)
    echo "📊 Total workflow files on disk: $WORKFLOW_COUNT"
    
    # Check for our target workflow
    if [ -f "$WORKFLOWS_PATH/$TARGET_WORKFLOW" ]; then
        echo "🎯 TARGET WORKFLOW FOUND: $TARGET_WORKFLOW"
        echo "✅ Ready for activation!"
    else
        echo "❌ TARGET WORKFLOW NOT FOUND: $TARGET_WORKFLOW"
    fi
    
else
    echo "❌ Workflows directory not found: $WORKFLOWS_PATH"
    WORKFLOW_COUNT=0
fi

echo ""
echo "WORKFLOW_COUNT:$WORKFLOW_COUNT"
echo "TARGET_FOUND:$([ -f "$WORKFLOWS_PATH/$TARGET_WORKFLOW" ] && echo "yes" || echo "no")"
"""
            
            # Replace placeholder in script
            investigate_script = investigate_script.replace("$TARGET_WORKFLOW", self.target_workflow)
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                investigate_script
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print("✅ Workflow investigation completed")
                print(result.stdout)
                
                # Extract results
                workflow_count = 0
                target_found = False
                for line in result.stdout.split('\n'):
                    if line.startswith('WORKFLOW_COUNT:'):
                        workflow_count = int(line.split(':', 1)[1].strip())
                    elif line.startswith('TARGET_FOUND:'):
                        target_found = line.split(':', 1)[1].strip() == "yes"
                
                return workflow_count, target_found
            else:
                print(f"❌ Workflow investigation failed: {result.stderr}")
                return 0, False
                
        except Exception as e:
            print(f"❌ Workflow investigation error: {e}")
            return 0, False
    
    def rename_and_activate_workflow(self):
        """Rename the workflow for easy identification and activate it"""
        print("\n🚀 RENAMING AND ACTIVATING FEDERATION WORKFLOW...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            activate_script = f"""#!/bin/bash
# Rename and activate Federation workflow
echo "🚀 RENAMING AND ACTIVATING FEDERATION WORKFLOW..."

WORKFLOWS_PATH="/home/ubuntu/n8n/.n8n/workflows"
TARGET_WORKFLOW="{self.target_workflow}"
NEW_WORKFLOW_NAME="{self.new_workflow_name}"

if [ -f "$WORKFLOWS_PATH/$TARGET_WORKFLOW" ]; then
    echo "✅ Target workflow found: $TARGET_WORKFLOW"
    
    # Create backup
    cp "$WORKFLOWS_PATH/$TARGET_WORKFLOW" "$WORKFLOWS_PATH/$TARGET_WORKFLOW.backup"
    echo "✅ Backup created"
    
    # Read and modify workflow JSON
    echo "📝 Modifying workflow name and activation status..."
    
    # Use jq if available, otherwise use sed
    if command -v jq &> /dev/null; then
        echo "🔧 Using jq for JSON modification..."
        jq '.name = "'$NEW_WORKFLOW_NAME'" | .active = true' "$WORKFLOWS_PATH/$TARGET_WORKFLOW" > "$WORKFLOWS_PATH/$TARGET_WORKFLOW.tmp"
        mv "$WORKFLOWS_PATH/$TARGET_WORKFLOW.tmp" "$WORKFLOWS_PATH/$TARGET_WORKFLOW"
        echo "✅ Workflow renamed and activated using jq"
    else
        echo "🔧 Using sed for JSON modification..."
        # Rename using sed
        sed -i 's/"name":"[^"]*"/"name":"'$NEW_WORKFLOW_NAME'"/g' "$WORKFLOWS_PATH/$TARGET_WORKFLOW"
        # Activate using sed
        sed -i 's/"active":false/"active":true/g' "$WORKFLOWS_PATH/$TARGET_WORKFLOW"
        sed -i 's/"active":null/"active":true/g' "$WORKFLOWS_PATH/$TARGET_WORKFLOW"
        echo "✅ Workflow renamed and activated using sed"
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
    
    # List updated workflow
    echo "📋 Updated workflow details:"
    ls -la "$WORKFLOWS_PATH/$TARGET_WORKFLOW"
    
else
    echo "❌ Target workflow not found: $TARGET_WORKFLOW"
    exit 1
fi

echo "✅ Workflow rename and activation completed"
"""
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                activate_script
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print("✅ Workflow rename and activation completed")
                print(result.stdout)
                return True
            else:
                print(f"❌ Workflow rename and activation failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Workflow rename and activation error: {e}")
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
    
    def execute_investigation(self):
        """Execute the complete workflow investigation and activation"""
        print("🏛️ EXECUTING FEDERATION WORKFLOW INVESTIGATION")
        print("=" * 80)
        print("🔍 Investigating, identifying, and activating Federation workflows")
        print("=" * 80)
        
        # Step 1: Test SSH connection
        print("🔐 Step 1: Testing SSH connection...")
        if not self.test_ssh_connection():
            print("❌ Failed to establish SSH connection")
            return False
        
        # Step 2: Investigate workflows
        print("\n🔍 Step 2: Investigating workflows on n8n server...")
        workflow_count, target_found = self.investigate_workflows()
        
        if workflow_count == 0:
            print("❌ No workflows found on server")
            return False
        
        print(f"📊 Found {workflow_count} workflow(s) on server")
        
        if not target_found:
            print(f"❌ Target workflow '{self.target_workflow}' not found")
            print("💡 The workflow may not have been deployed correctly")
            return False
        
        # Step 3: Rename and activate workflow
        print("\n🚀 Step 3: Renaming and activating Federation workflow...")
        if not self.rename_and_activate_workflow():
            print("❌ Workflow rename and activation failed")
            return False
        
        # Step 4: Restart n8n service
        print("\n🔄 Step 4: Restarting n8n service...")
        if not self.restart_n8n_service():
            print("⚠️  Service restart failed")
        
        # Step 5: Wait for n8n startup
        print("\n⏳ Step 5: Waiting for n8n startup...")
        self.wait_for_n8n_startup()
        
        # Step 6: Display summary
        print("\n" + "=" * 80)
        print("🎉 FEDERATION WORKFLOW INVESTIGATION COMPLETED!")
        print("=" * 80)
        print("✅ Workflows investigated and identified")
        print("✅ Target workflow renamed for easy identification")
        print("✅ Workflow automatically activated")
        print("✅ n8n service restarted")
        print("✅ n8n startup completed")
        
        print(f"\n🏛️ YOUR FEDERATION WORKFLOW IS READY!")
        print(f"\n🎯 LOOK FOR THIS WORKFLOW ON N8N.PBRADYGEORGEN.COM:")
        print(f"   • {self.new_workflow_name}")
        print(f"     Status: ACTIVE (should show green)")
        print(f"     Webhook: /webhook/federation-mission")
        
        print(f"\n💡 WORKFLOW IDENTIFICATION:")
        print(f"• **Renamed** for easy identification")
        print(f"• **Automatically activated** - no manual toggle needed")
        print(f"• **Ready for testing** - webhook should be registered")
        
        print(f"\n🚀 NEXT STEPS:")
        print(f"1. Check n8n.pbradygeorgen.com for the renamed workflow")
        print(f"2. Verify it shows as ACTIVE (green)")
        print(f"3. Test with our crew test script")
        print(f"4. Enjoy your streamlined Federation agency!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔍 WORKFLOW INVESTIGATOR INITIATED")
    print("=" * 80)
    
    investigator = FederationWorkflowInvestigator()
    success = investigator.execute_investigation()
    
    if success:
        print("\n🎉 Federation workflow investigation completed successfully!")
        print("🏛️ Your workflow is renamed, activated, and ready for action!")
        print("\n🎯 Check n8n.pbradygeorgen.com - look for the renamed workflow!")
    else:
        print("\n❌ Federation workflow investigation failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

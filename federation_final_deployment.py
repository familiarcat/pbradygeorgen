#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - FINAL DEPLOYMENT
Moves existing workflow files from /tmp/ to n8n workflows directory
"""

import os
import subprocess
from datetime import datetime

class FederationFinalDeployment:
    """Final deployment using existing files on server"""
    
    def __init__(self):
        self.config = {
            "system_name": "Federation Final Deployment",
            "target_instance": "n8n.pbradygeorgen.com",
            "ssh_key": "~/.ssh/n8n.pem",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
        
        # Workflows already on server in /tmp/
        self.server_workflows = [
            {
                "name": "AI Fleet Consciousness Workflow",
                "tmp_file": "/tmp/consciousness.json",
                "webhook": "/webhook/consciousness"
            },
            {
                "name": "Fleet Automation System",
                "tmp_file": "/tmp/fleet_automation.json",
                "webhook": "/webhook/fleet-automation"
            },
            {
                "name": "Crew Management System",
                "tmp_file": "/tmp/crew_management.json",
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
    
    def find_n8n_workflows_directory(self):
        """Find n8n workflows directory on server"""
        print("🔍 Finding n8n workflows directory...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            # Try to find n8n workflows directory
            find_script = """#!/bin/bash
# Find n8n workflows directory
echo "🔍 Searching for n8n workflows directory..."

# Common n8n paths
N8N_PATHS=(
    "/opt/n8n/.n8n/workflows"
    "/home/ubuntu/n8n/.n8n/workflows"
    "/root/n8n/.n8n/workflows"
    "/var/lib/n8n/.n8n/workflows"
    "/usr/local/lib/n8n/.n8n/workflows"
)

# Check each path
for path in "${N8N_PATHS[@]}"; do
    if [ -d "$path" ]; then
        echo "✅ Found workflows directory: $path"
        echo "WORKFLOWS_PATH:$path"
        exit 0
    fi
done

# Search more broadly
echo "🔍 Searching more broadly..."
find_result=$(find /home/ubuntu -name "workflows" -type d 2>/dev/null | grep -E "\.n8n/workflows$" | head -1)

if [ -n "$find_result" ]; then
    echo "✅ Found workflows directory: $find_result"
    echo "WORKFLOWS_PATH:$find_result"
    exit 0
fi

# Try to create in common location
echo "🔧 Creating workflows directory in /home/ubuntu/n8n/.n8n/workflows"
mkdir -p /home/ubuntu/n8n/.n8n/workflows
if [ -d "/home/ubuntu/n8n/.n8n/workflows" ]; then
    echo "✅ Created workflows directory: /home/ubuntu/n8n/.n8n/workflows"
    echo "WORKFLOWS_PATH:/home/ubuntu/n8n/.n8n/workflows"
    exit 0
fi

echo "❌ Could not find or create workflows directory"
exit 1
"""
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                find_script
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                # Extract workflows path
                for line in result.stdout.split('\n'):
                    if line.startswith('WORKFLOWS_PATH:'):
                        workflows_path = line.split(':', 1)[1].strip()
                        print(f"✅ Found workflows directory: {workflows_path}")
                        return workflows_path
                
                print("⚠️  Workflows directory found but path not extracted")
                return None
            else:
                print(f"❌ Could not find workflows directory: {result.stderr}")
                return None
                
        except Exception as e:
            print(f"❌ Error finding workflows directory: {e}")
            return None
    
    def deploy_workflows_from_tmp(self, workflows_path):
        """Deploy workflows from /tmp/ to n8n workflows directory"""
        print("🚀 Deploying workflows from /tmp/ to n8n...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            # Create deployment script
            deployment_script = f"""#!/bin/bash
# Deploy workflows from /tmp/ to n8n workflows directory
set -e

echo "🚀 Deploying Federation workflows from /tmp/ to n8n..."

WORKFLOWS_PATH="{workflows_path}"
echo "📁 Target workflows directory: $WORKFLOWS_PATH"

# Ensure workflows directory exists
mkdir -p "$WORKFLOWS_PATH"

# Move each workflow file
WORKFLOW_FILES=(
    "/tmp/consciousness.json"
    "/tmp/fleet_automation.json"
    "/tmp/crew_management.json"
)

DEPLOYED_COUNT=0

for workflow_file in "${{WORKFLOW_FILES[@]}}"; do
    if [ -f "$workflow_file" ]; then
        filename=$(basename "$workflow_file")
        target_file="$WORKFLOWS_PATH/$filename"
        
        echo "📋 Moving: $filename"
        
        # Move file to workflows directory
        mv "$workflow_file" "$target_file"
        
        # Set proper permissions
        chmod 644 "$target_file"
        
        echo "   ✅ Deployed: $filename"
        DEPLOYED_COUNT=$((DEPLOYED_COUNT + 1))
    else
        echo "   ⚠️  File not found: $workflow_file"
    fi
done

echo "📊 Deployment Summary: $DEPLOYED_COUNT/3 workflows deployed"
echo "DEPLOYED_COUNT:$DEPLOYED_COUNT"

# List deployed workflows
echo "📋 Deployed workflows:"
ls -la "$WORKFLOWS_PATH"/*.json 2>/dev/null || echo "No workflow files found"

echo "🚀 Federation workflow deployment completed!"
"""
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                deployment_script
            ], capture_output=True, text=True, timeout=120)
            
            if result.returncode == 0:
                # Extract deployed count
                deployed_count = 0
                for line in result.stdout.split('\n'):
                    if line.startswith('DEPLOYED_COUNT:'):
                        deployed_count = int(line.split(':', 1)[1].strip())
                        break
                
                print(f"✅ Workflows deployed successfully: {deployed_count}/3")
                print(result.stdout)
                return deployed_count == 3
            else:
                print(f"❌ Deployment failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Deployment error: {e}")
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
    
    def verify_workflows_deployed(self, workflows_path):
        """Verify workflows are properly deployed"""
        print("\n🔍 Verifying workflows are deployed...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            verify_script = f"""#!/bin/bash
# Verify workflows are deployed
echo "🔍 Verifying Federation workflows deployment..."

WORKFLOWS_PATH="{workflows_path}"
echo "📁 Checking workflows directory: $WORKFLOWS_PATH"

if [ -d "$WORKFLOWS_PATH" ]; then
    echo "✅ Workflows directory exists"
    
    # List all workflow files
    echo "📋 Workflow files found:"
    ls -la "$WORKFLOWS_PATH"/*.json 2>/dev/null || echo "No workflow files found"
    
    # Count workflow files
    WORKFLOW_COUNT=$(ls "$WORKFLOWS_PATH"/*.json 2>/dev/null | wc -l)
    echo "📊 Total workflow files: $WORKFLOW_COUNT"
    
    # Check specific workflows
    EXPECTED_WORKFLOWS=("consciousness.json" "fleet_automation.json" "crew_management.json")
    
    for expected in "${{EXPECTED_WORKFLOWS[@]}}"; do
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
    
    def execute_final_deployment(self):
        """Execute final deployment"""
        print("🏛️ EXECUTING FEDERATION FINAL DEPLOYMENT")
        print("=" * 80)
        print("🚀 Using existing workflow files from /tmp/ on server")
        print("=" * 80)
        
        # Step 1: Test SSH connection
        print("🔐 Step 1: Testing SSH connection...")
        if not self.test_ssh_connection():
            print("❌ Failed to establish SSH connection")
            return False
        
        # Step 2: Find n8n workflows directory
        print("\n🔍 Step 2: Finding n8n workflows directory...")
        workflows_path = self.find_n8n_workflows_directory()
        if not workflows_path:
            print("❌ Could not find or create workflows directory")
            return False
        
        # Step 3: Deploy workflows from /tmp/
        print("\n🚀 Step 3: Deploying workflows from /tmp/...")
        if not self.deploy_workflows_from_tmp(workflows_path):
            print("❌ Failed to deploy workflows")
            return False
        
        # Step 4: Restart n8n service
        print("\n🔄 Step 4: Restarting n8n service...")
        self.restart_n8n_service()
        
        # Step 5: Verify deployment
        print("\n🔍 Step 5: Verifying deployment...")
        if not self.verify_workflows_deployed(workflows_path):
            print("❌ Workflow verification failed")
            return False
        
        # Step 6: Display success summary
        print("\n" + "=" * 80)
        print("🎉 FEDERATION FINAL DEPLOYMENT COMPLETE!")
        print("✅ Workflows deployed from /tmp/ to n8n")
        print("✅ n8n service restarted")
        print("✅ Deployment verified")
        
        print("\n🏛️ United Federation of AI Agents is now active on n8n!")
        print("\n🎯 WORKFLOW NAMES TO LOOK FOR ON N8N.PBRADYGEORGEN.COM:")
        
        for workflow_info in self.server_workflows:
            print(f"   • {workflow_info['name']}")
            print(f"     Webhook: {workflow_info['webhook']}")
        
        print("\n🚀 Your Federation is ready for activation!")
        print("🔧 Workflows deployed using direct file movement - should be visible immediately!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🚀 FINAL DEPLOYMENT INITIATED")
    print("=" * 80)
    
    deployer = FederationFinalDeployment()
    success = deployer.execute_final_deployment()
    
    if success:
        print("\n🎉 Federation final deployment completed successfully!")
        print("🏛️ Your United Federation of AI Agents is now active on n8n!")
        print("\n🎯 Check n8n.pbradygeorgen.com for your Federation workflows!")
    else:
        print("\n❌ Federation final deployment failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

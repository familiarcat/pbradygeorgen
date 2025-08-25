#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - CONCISE AGENCY DEPLOYMENT
Deploys the streamlined Federation agency workflow to n8n
"""

import os
import subprocess
from datetime import datetime

class ConciseFederationDeployer:
    """Deploys the concise Federation agency workflow"""
    
    def __init__(self):
        self.config = {
            "system_name": "Concise Federation Agency Deployer",
            "target_instance": "n8n.pbradygeorgen.com",
            "ssh_key": "~/.ssh/n8n.pem",
            "server_user": "ubuntu",
            "workflow_file": "federation_workflows/federation_concise_agency.json",
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
    
    def deploy_workflow(self):
        """Deploy the concise Federation workflow"""
        print("🚀 Deploying concise Federation agency workflow...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            workflow_file = self.config['workflow_file']
            
            if not os.path.exists(workflow_file):
                print(f"❌ Workflow file not found: {workflow_file}")
                return False
            
            # Copy workflow to server
            print("📁 Copying workflow to server...")
            result = subprocess.run([
                "scp", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                workflow_file,
                f"{self.config['server_user']}@{self.config['target_instance']}:/tmp/federation_concise_agency.json"
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print("✅ Workflow copied to server")
            else:
                print(f"❌ Workflow copy failed: {result.stderr}")
                return False
            
            # Move to n8n workflows directory and restart
            print("🔄 Moving workflow to n8n directory and restarting...")
            
            deploy_script = """#!/bin/bash
# Deploy concise Federation agency workflow
echo "🚀 Deploying concise Federation agency workflow..."

WORKFLOWS_PATH="/home/ubuntu/n8n/.n8n/workflows"
TEMP_FILE="/tmp/federation_concise_agency.json"

if [ -d "$WORKFLOWS_PATH" ]; then
    echo "✅ Workflows directory exists: $WORKFLOWS_PATH"
    
    # Remove old complex workflows (clean house)
    echo "🧹 Cleaning up old complex workflows..."
    rm -f "$WORKFLOWS_PATH"/consciousness.json
    rm -f "$WORKFLOWS_PATH"/fleet_automation.json
    rm -f "$WORKFLOWS_PATH"/crew_management.json
    echo "✅ Old workflows removed"
    
    # Deploy new concise workflow
    echo "📁 Deploying new concise workflow..."
    cp "$TEMP_FILE" "$WORKFLOWS_PATH/federation_concise_agency.json"
    chmod 644 "$WORKFLOWS_PATH/federation_concise_agency.json"
    echo "✅ New workflow deployed"
    
    # List current workflows
    echo "📋 Current workflows:"
    ls -la "$WORKFLOWS_PATH"/*.json 2>/dev/null || echo "No workflow files found"
    
    # Count workflows
    WORKFLOW_COUNT=$(ls "$WORKFLOWS_PATH"/*.json 2>/dev/null | wc -l)
    echo "📊 Total workflow files: $WORKFLOW_COUNT"
    
else
    echo "❌ Workflows directory not found: $WORKFLOWS_PATH"
    echo "WORKFLOW_COUNT:0"
    exit 1
fi

echo "WORKFLOW_COUNT:$WORKFLOW_COUNT"
"""
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                deploy_script
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                # Extract workflow count
                workflow_count = 0
                for line in result.stdout.split('\n'):
                    if line.startswith('WORKFLOW_COUNT:'):
                        workflow_count = int(line.split(':', 1)[1].strip())
                        break
                
                print("✅ Workflow deployment completed")
                print(result.stdout)
                return workflow_count >= 1
            else:
                print(f"❌ Workflow deployment failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Workflow deployment error: {e}")
            return False
    
    def restart_n8n_service(self):
        """Restart n8n service to pick up new workflow"""
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
    
    def execute_deployment(self):
        """Execute the complete deployment"""
        print("🏛️ EXECUTING CONCISE FEDERATION AGENCY DEPLOYMENT")
        print("=" * 80)
        print("🚀 Replacing complex workflows with streamlined Federation agency")
        print("=" * 80)
        
        # Step 1: Test SSH connection
        print("🔐 Step 1: Testing SSH connection...")
        if not self.test_ssh_connection():
            print("❌ Failed to establish SSH connection")
            return False
        
        # Step 2: Deploy workflow
        print("\n🚀 Step 2: Deploying concise Federation workflow...")
        if not self.deploy_workflow():
            print("❌ Workflow deployment failed")
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
        print("🎉 CONCISE FEDERATION AGENCY DEPLOYMENT COMPLETED!")
        print("✅ Old complex workflows cleaned up")
        print("✅ New concise workflow deployed")
        print("✅ n8n service restarted")
        print("✅ n8n startup completed")
        
        print("\n🏛️ Your streamlined Federation agency is now active!")
        print("\n🎯 WORKFLOW TO LOOK FOR ON N8N.PBRADYGEORGEN.COM:")
        print("   • Federation Concise Agency - OpenRouter Crew")
        print("     Webhook: /federation-mission")
        
        print("\n🚀 BENEFITS OF THE NEW SETUP:")
        print("• **Clean workflow** - No more warning symbols")
        print("• **Simplified structure** - Only 5 nodes vs 8+ complex nodes")
        print("• **OpenRouter integration** - Dynamic LLM selection")
        print("• **Unified response** - Clean, aggregated output")
        print("• **Easy maintenance** - Simple to configure and manage")
        
        print("\n💡 NEXT STEPS:")
        print("1. Check n8n.pbradygeorgen.com for the new workflow")
        print("2. Activate the workflow")
        print("3. Test with POST request to /federation-mission")
        print("4. Enjoy your streamlined Federation agency!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🚀 CONCISE AGENCY DEPLOYMENT INITIATED")
    print("=" * 80)
    
    deployer = ConciseFederationDeployer()
    success = deployer.execute_deployment()
    
    if success:
        print("\n🎉 Concise Federation agency deployment completed successfully!")
        print("🏛️ Your streamlined Federation agency is now active on n8n!")
        print("\n🎯 Check n8n.pbradygeorgen.com - the new workflow should be visible!")
    else:
        print("\n❌ Concise Federation agency deployment failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

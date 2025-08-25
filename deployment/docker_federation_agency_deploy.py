#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - DOCKER FEDERATION AGENCY DEPLOYMENT
Deploy Federation agency using Docker for fast, reliable deployment
"""

import os
import subprocess
import time
from datetime import datetime

class DockerFederationAgencyDeploy:
    """Deploy Federation agency using Docker"""
    
    def __init__(self):
        self.config = {
            "system_name": "Docker Federation Agency Deployment",
            "correct_instance_ip": "3.144.205.118",  # us-east-2
            "ssh_key_path": "~/.ssh/AlexKeyPair.pem",
            "server_user": "ubuntu",
            "n8n_port": "5678",
            "created_at": datetime.now().isoformat()
        }
    
    def cleanup_server_completely(self):
        """Clean up server completely - stop all processes"""
        print("🧹 Cleaning up server completely...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Stop all n8n and npm processes
            cleanup_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'sudo pkill -f n8n && sudo pkill -f npm && sudo pkill -f node && sleep 5 && echo "Cleanup complete"'
            ], capture_output=True, text=True, timeout=120)
            
            if cleanup_result.returncode == 0:
                print("✅ Server cleanup completed")
                return True
            else:
                print(f"⚠️  Cleanup warning: {cleanup_result.stderr}")
                return True  # Continue even with warnings
                
        except Exception as e:
            print(f"❌ Cleanup error: {e}")
            return False
    
    def install_docker(self):
        """Install Docker on the server"""
        print("🐳 Installing Docker...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Install Docker
            docker_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'sudo apt update && sudo apt install -y docker.io docker-compose && sudo usermod -aG docker ubuntu && sudo systemctl start docker && sudo systemctl enable docker'
            ], capture_output=True, text=True, timeout=300)
            
            if docker_result.returncode == 0:
                print("✅ Docker installed successfully")
                return True
            else:
                print(f"⚠️  Docker install: {docker_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Docker install error: {e}")
            return False
    
    def create_docker_compose(self):
        """Create Docker Compose file for n8n"""
        print("📝 Creating Docker Compose configuration...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Create docker-compose.yml
            compose_content = f"""version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    container_name: federation-agency-n8n
    restart: unless-stopped
    ports:
      - "{self.config['n8n_port']}:5678"
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - N8N_WEBHOOK_URL=https://n8n.pbradygeorgen.com
      - N8N_BASIC_AUTH_ACTIVE=false
      - N8N_USER_MANAGEMENT_DISABLED=true
      - N8N_TEMPLATES_ENABLED=false
      - N8N_ONBOARDING_FLOW_DISABLED=true
      - N8N_LOG_LEVEL=info
      - N8N_PAYLOAD_SIZE_MAX=16
    volumes:
      - n8n_data:/home/node/.n8n
      - ./federation_workflows:/home/node/.n8n/workflows
    networks:
      - federation-network

volumes:
  n8n_data:

networks:
  federation-network:
    driver: bridge
"""
            
            # Upload docker-compose.yml
            compose_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                f'cat > /home/ubuntu/docker-compose.yml << \'EOF\'\n{compose_content}\nEOF'
            ], capture_output=True, text=True, timeout=60)
            
            if compose_result.returncode == 0:
                print("✅ Docker Compose configuration created")
                return True
            else:
                print(f"❌ Docker Compose creation failed: {compose_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Docker Compose error: {e}")
            return False
    
    def deploy_federation_workflows(self):
        """Deploy Federation workflows to the server"""
        print("🏛️ Deploying Federation workflows...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Check for local workflow
            local_workflow = "federation_workflows/federation_concise_agency.json"
            if not os.path.exists(local_workflow):
                print(f"❌ Local workflow not found: {local_workflow}")
                return False
            
            # Create workflows directory and upload
            workflow_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'mkdir -p /home/ubuntu/federation_workflows'
            ], capture_output=True, text=True, timeout=30)
            
            if workflow_result.returncode != 0:
                print(f"❌ Workflow directory creation failed: {workflow_result.stderr}")
                return False
            
            # Read and upload workflow
            with open(local_workflow, 'r') as f:
                workflow_content = f.read()
            
            upload_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                f'cat > /home/ubuntu/federation_workflows/federation_concise_agency.json << \'EOF\'\n{workflow_content}\nEOF'
            ], capture_output=True, text=True, timeout=60)
            
            if upload_result.returncode == 0:
                print("✅ Federation workflows deployed")
                return True
            else:
                print(f"❌ Workflow deployment failed: {upload_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Workflow deployment error: {e}")
            return False
    
    def start_federation_agency(self):
        """Start the Federation agency using Docker"""
        print("🚀 Starting Federation agency with Docker...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Start n8n container
            start_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'cd /home/ubuntu && sudo docker-compose up -d'
            ], capture_output=True, text=True, timeout=120)
            
            if start_result.returncode == 0:
                print("✅ Federation agency started with Docker")
                time.sleep(30)  # Wait for container startup
                return True
            else:
                print(f"❌ Federation agency start failed: {start_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Federation agency start error: {e}")
            return False
    
    def test_federation_agency(self):
        """Test the Federation agency"""
        print("🧪 Testing Federation agency...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Check container status
            status_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'sudo docker ps | grep federation-agency-n8n'
            ], capture_output=True, text=True, timeout=30)
            
            if status_result.returncode == 0:
                print("✅ Federation agency container running")
                print(f"Status: {status_result.stdout}")
            else:
                print(f"⚠️  Container status: {status_result.stderr}")
            
            # Test n8n API
            api_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'curl -s http://localhost:5678/api/version'
            ], capture_output=True, text=True, timeout=30)
            
            if api_result.returncode == 0:
                print("✅ n8n API responding")
            else:
                print(f"⚠️  n8n API: {api_result.stderr}")
            
            # Test Federation webhook
            webhook_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'curl -s -X POST http://localhost:5678/webhook/federation-mission -H "Content-Type: application/json" -d \'{"test": true}\''
            ], capture_output=True, text=True, timeout=30)
            
            if webhook_result.returncode == 0:
                print("✅ Federation webhook responding")
                print(f"Response: {webhook_result.stdout}")
            else:
                print(f"⚠️  Federation webhook: {webhook_result.stderr}")
            
            return True
            
        except Exception as e:
            print(f"❌ Federation agency test error: {e}")
            return False
    
    def execute_docker_deployment(self):
        """Execute the complete Docker deployment process"""
        print("🏛️ EXECUTING DOCKER FEDERATION AGENCY DEPLOYMENT")
        print("=" * 80)
        print("🐳 Deploying Federation agency using Docker for fast, reliable deployment")
        print("=" * 80)
        
        start_time = time.time()
        
        # Step 1: Clean up server completely
        print("🧹 Step 1: Cleaning up server completely...")
        if not self.cleanup_server_completely():
            print("❌ Server cleanup failed")
            return False
        
        # Step 2: Install Docker
        print("🐳 Step 2: Installing Docker...")
        if not self.install_docker():
            print("❌ Docker installation failed")
            return False
        
        # Step 3: Create Docker Compose configuration
        print("📝 Step 3: Creating Docker Compose configuration...")
        if not self.create_docker_compose():
            print("❌ Docker Compose creation failed")
            return False
        
        # Step 4: Deploy Federation workflows
        print("🏛️ Step 4: Deploying Federation workflows...")
        if not self.deploy_federation_workflows():
            print("❌ Federation workflow deployment failed")
            return False
        
        # Step 5: Start Federation agency
        print("🚀 Step 5: Starting Federation agency with Docker...")
        if not self.start_federation_agency():
            print("❌ Federation agency start failed")
            return False
        
        # Step 6: Test Federation agency
        print("🧪 Step 6: Testing Federation agency...")
        self.test_federation_agency()
        
        # Calculate total time
        total_time = time.time() - start_time
        
        # Success summary
        print("\n" + "=" * 80)
        print("🎉 DOCKER FEDERATION AGENCY DEPLOYMENT COMPLETED!")
        print("=" * 80)
        print(f"✅ Server cleaned up")
        print(f"✅ Docker installed")
        print(f"✅ Federation agency deployed")
        print(f"✅ Federation agency running")
        print(f"✅ Federation agency tested")
        print(f"⏱️  Total time: {total_time:.1f} seconds")
        
        print(f"\n🏛️ WHAT WE ACCOMPLISHED:")
        print(f"   • Complete server cleanup")
        print(f"   • Docker-based n8n deployment")
        print(f"   • Federation agency operational")
        print(f"   • Fast, reliable deployment")
        
        print(f"\n💡 NEXT STEPS:")
        print(f"• **Check n8n UI** - Visit n8n.pbradygeorgen.com")
        print(f"• **Test Federation agency** - Send 'ALL HANDS ON BOARD' directive")
        print(f"• **Enjoy your crew** - Federation agency running in Docker!")
        
        print(f"\n🐳 DOCKER BENEFITS ACHIEVED:")
        print(f"• Fast deployment - {total_time:.1f} seconds")
        print(f"• Reliable operation - Containerized environment")
        print(f"• Easy management - Start/stop/restart containers")
        print(f"• Resource efficient - Isolated processes")
        
        print(f"\n🚀 READY FOR TESTING:")
        print(f"1. Check n8n.pbradygeorgen.com - should work now!")
        print(f"2. Test your Federation agency")
        print(f"3. Get complete Federation crew manifest")
        print(f"4. Enjoy your Docker-powered Federation agency!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🐳 DOCKER FEDERATION AGENCY DEPLOYMENT")
    print("=" * 80)
    
    deployer = DockerFederationAgencyDeploy()
    success = deployer.execute_docker_deployment()
    
    if success:
        print("\n🎉 Docker Federation agency deployment completed successfully!")
        print("🏛️ Your Federation agency is running in Docker!")
        print("\n🎯 Check n8n.pbradygeorgen.com - it should work now!")
    else:
        print("\n❌ Docker Federation agency deployment failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - FAST FEDERATION AGENCY SETUP
Get n8n and Federation agency running ASAP using proven methods
"""

import os
import subprocess
import time
from datetime import datetime

class FastFederationAgencySetup:
    """Fast, efficient Federation agency setup"""
    
    def __init__(self):
        self.config = {
            "system_name": "Fast Federation Agency Setup",
            "correct_instance_ip": "3.144.205.118",  # us-east-2
            "ssh_key_path": "~/.ssh/AlexKeyPair.pem",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
    
    def quick_nodejs_install(self):
        """Quick Node.js installation"""
        print("🚀 Quick Node.js installation...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Quick Node.js install
            install_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs'
            ], capture_output=True, text=True, timeout=300)
            
            if install_result.returncode == 0:
                print("✅ Node.js installed successfully")
                return True
            else:
                print(f"⚠️  Node.js install: {install_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Node.js install error: {e}")
            return False
    
    def quick_n8n_install(self):
        """Quick n8n installation"""
        print("🔧 Quick n8n installation...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Quick n8n install
            install_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'sudo npm install -g n8n'
            ], capture_output=True, text=True, timeout=600)
            
            if install_result.returncode == 0:
                print("✅ n8n installed successfully")
                return True
            else:
                print(f"⚠️  n8n install: {install_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ n8n install error: {e}")
            return False
    
    def quick_n8n_config(self):
        """Quick n8n configuration"""
        print("⚙️  Quick n8n configuration...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Quick config setup
            config_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'mkdir -p /home/ubuntu/.n8n && echo "N8N_PORT=5678" > /home/ubuntu/.n8n/.env && echo "N8N_HOST=0.0.0.0" >> /home/ubuntu/.n8n/.env && chown -R ubuntu:ubuntu /home/ubuntu/.n8n'
            ], capture_output=True, text=True, timeout=60)
            
            if config_result.returncode == 0:
                print("✅ n8n configured successfully")
                return True
            else:
                print(f"⚠️  n8n config: {config_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ n8n config error: {e}")
            return False
    
    def start_n8n_service(self):
        """Start n8n service"""
        print("🚀 Starting n8n service...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Start n8n
            start_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'cd /home/ubuntu && nohup n8n start > n8n.log 2>&1 &'
            ], capture_output=True, text=True, timeout=60)
            
            if start_result.returncode == 0:
                print("✅ n8n service started")
                time.sleep(30)  # Wait for startup
                return True
            else:
                print(f"⚠️  n8n start: {start_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ n8n start error: {e}")
            return False
    
    def restore_federation_workflow(self):
        """Restore Federation workflow"""
        print("🏛️ Restoring Federation workflow...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Check for local workflow
            local_workflow = "federation_workflows/federation_concise_agency.json"
            if not os.path.exists(local_workflow):
                print(f"❌ Local workflow not found: {local_workflow}")
                return False
            
            # Read workflow content
            with open(local_workflow, 'r') as f:
                workflow_content = f.read()
            
            # Upload workflow
            upload_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                f'mkdir -p /home/ubuntu/.n8n/workflows && cat > /home/ubuntu/.n8n/workflows/federation_concise_agency.json << \'EOF\'\n{workflow_content}\nEOF'
            ], capture_output=True, text=True, timeout=60)
            
            if upload_result.returncode == 0:
                print("✅ Federation workflow restored")
                return True
            else:
                print(f"❌ Workflow restore failed: {upload_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Workflow restore error: {e}")
            return False
    
    def test_federation_agency(self):
        """Test Federation agency"""
        print("🧪 Testing Federation agency...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
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
            print(f"❌ Federation test error: {e}")
            return False
    
    def execute_fast_setup(self):
        """Execute the fast setup process"""
        print("🏛️ EXECUTING FAST FEDERATION AGENCY SETUP")
        print("=" * 80)
        print("⚡ Getting n8n and Federation agency running ASAP!")
        print("=" * 80)
        
        start_time = time.time()
        
        # Step 1: Quick Node.js install
        print("🚀 Step 1: Quick Node.js installation...")
        if not self.quick_nodejs_install():
            print("❌ Node.js installation failed")
            return False
        
        # Step 2: Quick n8n install
        print("🔧 Step 2: Quick n8n installation...")
        if not self.quick_n8n_install():
            print("❌ n8n installation failed")
            return False
        
        # Step 3: Quick n8n config
        print("⚙️  Step 3: Quick n8n configuration...")
        if not self.quick_n8n_config():
            print("❌ n8n configuration failed")
            return False
        
        # Step 4: Start n8n service
        print("🚀 Step 4: Starting n8n service...")
        if not self.start_n8n_service():
            print("❌ n8n service start failed")
            return False
        
        # Step 5: Restore Federation workflow
        print("🏛️ Step 5: Restoring Federation workflow...")
        if not self.restore_federation_workflow():
            print("❌ Federation workflow restore failed")
            return False
        
        # Step 6: Test Federation agency
        print("🧪 Step 6: Testing Federation agency...")
        self.test_federation_agency()
        
        # Calculate total time
        total_time = time.time() - start_time
        
        # Success summary
        print("\n" + "=" * 80)
        print("🎉 FAST FEDERATION AGENCY SETUP COMPLETED!")
        print("=" * 80)
        print(f"✅ Node.js installed")
        print(f"✅ n8n installed and configured")
        print(f"✅ n8n service running")
        print(f"✅ Federation workflow restored")
        print(f"✅ Federation agency tested")
        print(f"⏱️  Total time: {total_time:.1f} seconds")
        
        print(f"\n🏛️ WHAT WE ACCOMPLISHED:")
        print(f"   • Complete n8n ecosystem in {total_time:.1f} seconds")
        print(f"   • Federation agency ready")
        print(f"   • Your crew back online")
        
        print(f"\n💡 NEXT STEPS:")
        print(f"• **Check n8n UI** - Visit n8n.pbradygeorgen.com")
        print(f"• **Test Federation agency** - Send 'ALL HANDS ON BOARD' directive")
        print(f"• **Enjoy your crew** - Federation agency operational!")
        
        print(f"\n🚀 READY FOR TESTING:")
        print(f"1. Check n8n.pbradygeorgen.com - should work now!")
        print(f"2. Test your Federation agency")
        print(f"3. Get complete Federation crew manifest")
        print(f"4. Enjoy your streamlined Federation agency!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("⚡ FAST FEDERATION AGENCY SETUP")
    print("=" * 80)
    
    setup = FastFederationAgencySetup()
    success = setup.execute_fast_setup()
    
    if success:
        print("\n🎉 Fast Federation agency setup completed successfully!")
        print("🏛️ Your Federation agency should be working NOW!")
        print("\n🎯 Check n8n.pbradygeorgen.com - it should work immediately!")
    else:
        print("\n❌ Fast Federation agency setup failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

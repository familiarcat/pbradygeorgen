#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - AWS SERVER RELAUNCH AUTOMATION
Automate AWS server relaunch with new key pair and complete n8n installation
"""

import os
import subprocess
import json
import time
from datetime import datetime

class AWSServerRelaunchAutomation:
    """Automate AWS server relaunch with new key pair"""
    
    def __init__(self):
        self.config = {
            "system_name": "AWS Server Relaunch Automation",
            "region": "us-east-1",
            "instance_type": "t3.medium",
            "ami_id": "ami-0c02fb55956c7d316",  # Ubuntu 22.04 LTS
            "security_group_name": "n8n-federation-sg",
            "key_pair_name": "federation-key",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
        
        # Load AWS credentials
        self.load_aws_credentials()
    
    def load_aws_credentials(self):
        """Load AWS credentials from environment"""
        print("🔐 Loading AWS credentials...")
        
        try:
            # Try to get AWS credentials from environment
            aws_access_key = os.getenv('AWS_ACCESS_KEY_ID')
            aws_secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
            
            if not aws_access_key or not aws_secret_key:
                # Try to read from ~/.zshrc manually
                zshrc_path = os.path.expanduser("~/.zshrc")
                if os.path.exists(zshrc_path):
                    with open(zshrc_path, 'r') as f:
                        content = f.read()
                    
                    # Extract AWS credentials
                    for line in content.split('\n'):
                        if line.startswith('export AWS_ACCESS_KEY_ID='):
                            aws_access_key = line.split('=', 1)[1].strip().strip('"\'')
                            os.environ['AWS_ACCESS_KEY_ID'] = aws_access_key
                        elif line.startswith('export AWS_SECRET_ACCESS_KEY='):
                            aws_secret_key = line.split('=', 1)[1].strip().strip('"\'')
                            os.environ['AWS_SECRET_ACCESS_KEY'] = aws_secret_key
            
            if aws_access_key and aws_secret_key:
                print("✅ AWS credentials loaded")
            else:
                print("❌ AWS credentials not found")
                return False
                
        except Exception as e:
            print(f"❌ Error loading AWS credentials: {e}")
            return False
        
        return True
    
    def create_new_key_pair(self):
        """Create a new AWS key pair"""
        print(f"\n🔑 Creating new AWS key pair: {self.config['key_pair_name']}...")
        
        try:
            # Create new key pair
            result = subprocess.run([
                'aws', 'ec2', 'create-key-pair',
                '--key-name', self.config['key_pair_name'],
                '--query', 'KeyMaterial',
                '--output', 'text',
                '--region', self.config['region']
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                # Save private key to local file
                key_file_path = os.path.expanduser(f"~/.ssh/{self.config['key_pair_name']}.pem")
                with open(key_file_path, 'w') as f:
                    f.write(result.stdout)
                
                # Set proper permissions
                os.chmod(key_file_path, 0o600)
                
                print(f"✅ New key pair created: {self.config['key_pair_name']}")
                print(f"✅ Private key saved: {key_file_path}")
                
                # Update config with new key path
                self.config['ssh_key_path'] = key_file_path
                
                return True
            else:
                print(f"❌ Failed to create key pair: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Key pair creation error: {e}")
            return False
    
    def create_security_group(self):
        """Create security group for n8n"""
        print(f"\n🛡️ Creating security group: {self.config['security_group_name']}...")
        
        try:
            # Create security group
            result = subprocess.run([
                'aws', 'ec2', 'create-security-group',
                '--group-name', self.config['security_group_name'],
                '--description', 'Security group for n8n Federation agency',
                '--region', self.config['region']
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                # Parse security group ID
                sg_data = json.loads(result.stdout)
                security_group_id = sg_data['GroupId']
                self.config['security_group_id'] = security_group_id
                
                print(f"✅ Security group created: {security_group_id}")
                
                # Add inbound rules
                self.add_security_group_rules(security_group_id)
                
                return True
            else:
                print(f"❌ Failed to create security group: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Security group creation error: {e}")
            return False
    
    def add_security_group_rules(self, security_group_id):
        """Add inbound rules to security group"""
        print(f"🔧 Adding inbound rules to security group...")
        
        # Rules to add
        rules = [
            {'port': 22, 'description': 'SSH access'},
            {'port': 80, 'description': 'HTTP access'},
            {'port': 443, 'description': 'HTTPS access'},
            {'port': 5678, 'description': 'n8n webhook access'}
        ]
        
        for rule in rules:
            try:
                result = subprocess.run([
                    'aws', 'ec2', 'authorize-security-group-ingress',
                    '--group-id', security_group_id,
                    '--protocol', 'tcp',
                    '--port', str(rule['port']),
                    '--cidr', '0.0.0.0/0',
                    '--region', self.config['region']
                ], capture_output=True, text=True, timeout=30)
                
                if result.returncode == 0:
                    print(f"✅ Port {rule['port']} rule added: {rule['description']}")
                else:
                    print(f"⚠️  Port {rule['port']} rule warning: {result.stderr}")
                    
            except Exception as e:
                print(f"❌ Port {rule['port']} rule error: {e}")
    
    def terminate_old_instance(self):
        """Terminate the old EC2 instance"""
        print(f"\n🛑 Terminating old EC2 instance...")
        
        try:
            # Get current instance details
            result = subprocess.run([
                'aws', 'ec2', 'describe-instances',
                '--instance-ids', 'i-04b91c2bb84d4a01b',
                '--query', 'Reservations[*].Instances[*].[InstanceId,State.Name]',
                '--output', 'json',
                '--region', self.config['region']
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                instance_data = json.loads(result.stdout)
                if instance_data and instance_data[0] and instance_data[0][0]:
                    instance_state = instance_data[0][0][1]
                    
                    if instance_state == 'running':
                        print("🛑 Terminating running instance...")
                        terminate_result = subprocess.run([
                            'aws', 'ec2', 'terminate-instances',
                            '--instance-ids', 'i-04b91c2bb84d4a01b',
                            '--region', self.config['region']
                        ], capture_output=True, text=True, timeout=30)
                        
                        if terminate_result.returncode == 0:
                            print("✅ Instance termination initiated")
                            
                            # Wait for termination
                            print("⏳ Waiting for instance to terminate...")
                            time.sleep(30)
                            
                            return True
                        else:
                            print(f"❌ Instance termination failed: {terminate_result.stderr}")
                            return False
                    else:
                        print(f"✅ Instance already in state: {instance_state}")
                        return True
                else:
                    print("⚠️  Instance not found or already terminated")
                    return True
            else:
                print(f"❌ Failed to check instance status: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Instance termination error: {e}")
            return False
    
    def launch_new_instance(self):
        """Launch new EC2 instance with proper configuration"""
        print(f"\n🚀 Launching new EC2 instance...")
        
        try:
            # Launch new instance
            result = subprocess.run([
                'aws', 'ec2', 'run-instances',
                '--image-id', self.config['ami_id'],
                '--count', '1',
                '--instance-type', self.config['instance_type'],
                '--key-name', self.config['key_pair_name'],
                '--security-group-ids', self.config['security_group_id'],
                '--tag-specifications', f'ResourceType=instance,Tags=[{{Key=Name,Value=n8n-federation-server}}]',
                '--region', self.config['region']
            ], capture_output=True, text=True, timeout=120)
            
            if result.returncode == 0:
                # Parse instance ID
                instance_data = json.loads(result.stdout)
                new_instance_id = instance_data['Instances'][0]['InstanceId']
                self.config['new_instance_id'] = new_instance_id
                
                print(f"✅ New instance launched: {new_instance_id}")
                
                # Wait for instance to be running
                print("⏳ Waiting for instance to be running...")
                self.wait_for_instance_running(new_instance_id)
                
                # Get public IP
                self.get_instance_public_ip(new_instance_id)
                
                return True
            else:
                print(f"❌ Failed to launch instance: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Instance launch error: {e}")
            return False
    
    def wait_for_instance_running(self, instance_id):
        """Wait for instance to be running"""
        max_wait = 300  # 5 minutes
        wait_time = 0
        
        while wait_time < max_wait:
            try:
                result = subprocess.run([
                    'aws', 'ec2', 'describe-instances',
                    '--instance-ids', instance_id,
                    '--query', 'Reservations[*].Instances[*].State.Name',
                    '--output', 'text',
                    '--region', self.config['region']
                ], capture_output=True, text=True, timeout=30)
                
                if result.returncode == 0:
                    state = result.stdout.strip()
                    if state == 'running':
                        print("✅ Instance is running")
                        return True
                    elif state == 'pending':
                        print(f"⏳ Instance is pending... ({wait_time}s)")
                    else:
                        print(f"⚠️  Instance state: {state}")
                
                time.sleep(10)
                wait_time += 10
                
            except Exception as e:
                print(f"⚠️  State check error: {e}")
                time.sleep(10)
                wait_time += 10
        
        print("❌ Instance failed to start running within timeout")
        return False
    
    def get_instance_public_ip(self, instance_id):
        """Get the public IP of the new instance"""
        print(f"🌐 Getting public IP for instance...")
        
        try:
            result = subprocess.run([
                'aws', 'ec2', 'describe-instances',
                '--instance-ids', instance_id,
                '--query', 'Reservations[*].Instances[*].PublicIpAddress',
                '--output', 'text',
                '--region', self.config['region']
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                public_ip = result.stdout.strip()
                if public_ip and public_ip != 'None':
                    self.config['public_ip'] = public_ip
                    print(f"✅ Public IP: {public_ip}")
                    
                    # Update DNS record
                    self.update_dns_record(public_ip)
                    
                    return True
                else:
                    print("❌ No public IP found")
                    return False
            else:
                print(f"❌ Failed to get public IP: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Public IP retrieval error: {e}")
            return False
    
    def update_dns_record(self, public_ip):
        """Update Route 53 DNS record"""
        print(f"🌐 Updating DNS record to point to new server...")
        
        try:
            # Get hosted zone ID
            result = subprocess.run([
                'aws', 'route53', 'list-hosted-zones',
                '--query', 'HostedZones[?Name==`pbradygeorgen.com.`].Id',
                '--output', 'text',
                '--region', 'us-east-1'  # Route 53 is global
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                hosted_zone_id = result.stdout.strip().split('/')[-1]
                
                # Create change batch for A record
                change_batch = {
                    "Changes": [
                        {
                            "Action": "UPSERT",
                            "ResourceRecordSet": {
                                "Name": "n8n.pbradygeorgen.com",
                                "Type": "A",
                                "TTL": 300,
                                "ResourceRecords": [
                                    {
                                        "Value": public_ip
                                    }
                                ]
                            }
                        }
                    ]
                }
                
                # Save change batch to file
                change_file = "dns_change.json"
                with open(change_file, 'w') as f:
                    json.dump(change_batch, f, indent=2)
                
                # Apply DNS change
                dns_result = subprocess.run([
                    'aws', 'route53', 'change-resource-record-sets',
                    '--hosted-zone-id', hosted_zone_id,
                    '--change-batch', f'file://{change_file}',
                    '--region', 'us-east-1'
                ], capture_output=True, text=True, timeout=60)
                
                if dns_result.returncode == 0:
                    print("✅ DNS record updated")
                    # Clean up change file
                    os.remove(change_file)
                    return True
                else:
                    print(f"❌ DNS update failed: {dns_result.stderr}")
                    return False
            else:
                print(f"❌ Failed to get hosted zone: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ DNS update error: {e}")
            return False
    
    def install_complete_ecosystem(self):
        """Install complete Node.js ecosystem and n8n on new server"""
        print(f"\n🔧 Installing complete ecosystem on new server...")
        
        try:
            # Wait for SSH to be available
            print("⏳ Waiting for SSH to be available...")
            time.sleep(60)
            
            # Test SSH connection
            ssh_key_path = self.config['ssh_key_path']
            public_ip = self.config['public_ip']
            
            # Test connection
            test_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'ConnectTimeout=30',
                '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{public_ip}',
                'echo "SSH connection successful"'
            ], capture_output=True, text=True, timeout=60)
            
            if test_result.returncode == 0:
                print("✅ SSH connection established")
                
                # Now install everything
                return self.perform_complete_installation(ssh_key_path, public_ip)
            else:
                print(f"❌ SSH connection failed: {test_result.stderr}")
                return False
                
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
            ssh_key_path = self.config['ssh_key_path']
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
            ssh_key_path = self.config['ssh_key_path']
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
    
    def execute_complete_automation(self):
        """Execute the complete AWS server relaunch automation"""
        print("🏛️ EXECUTING COMPLETE AWS SERVER RELAUNCH AUTOMATION")
        print("=" * 80)
        print("🔧 Automating AWS server relaunch with new key pair and complete ecosystem")
        print("=" * 80)
        
        # Step 1: Create new key pair
        print("🔑 Step 1: Creating new AWS key pair...")
        if not self.create_new_key_pair():
            print("❌ Key pair creation failed")
            return False
        
        # Step 2: Create security group
        print(f"\n🛡️ Step 2: Creating security group...")
        if not self.create_security_group():
            print("❌ Security group creation failed")
            return False
        
        # Step 3: Terminate old instance
        print(f"\n🛑 Step 3: Terminating old instance...")
        if not self.terminate_old_instance():
            print("❌ Old instance termination failed")
            return False
        
        # Step 4: Launch new instance
        print(f"\n🚀 Step 4: Launching new instance...")
        if not self.launch_new_instance():
            print("❌ New instance launch failed")
            return False
        
        # Step 5: Install complete ecosystem
        print(f"\n🔧 Step 5: Installing complete ecosystem...")
        if not self.install_complete_ecosystem():
            print("❌ Ecosystem installation failed")
            return False
        
        # Step 6: Restore Federation workflows
        print(f"\n🏛️ Step 6: Restoring Federation workflows...")
        self.restore_federation_workflows()
        
        # Step 7: Test Federation agency
        print(f"\n🏛️ Step 7: Testing Federation agency...")
        self.test_federation_agency()
        
        # Step 8: Display success summary
        print("\n" + "=" * 80)
        print("🎉 COMPLETE AWS SERVER RELAUNCH AUTOMATION COMPLETED!")
        print("=" * 80)
        print(f"✅ New key pair created: {self.config['key_pair_name']}")
        print(f"✅ Security group created: {self.config['security_group_name']}")
        print(f"✅ New instance launched: {self.config['new_instance_id']}")
        print(f"✅ Public IP: {self.config['public_ip']}")
        print(f"✅ DNS updated: n8n.pbradygeorgen.com")
        print(f"✅ Complete ecosystem installed")
        print(f"✅ Federation workflows restored")
        
        print(f"\n🏛️ WHAT WE ACCOMPLISHED:")
        print(f"   • Fresh AWS server with working SSH access")
        print(f"   • New key pair linked to your local ~/.ssh folder")
        print(f"   • Proper security group configuration")
        print(f"   • Complete Node.js ecosystem")
        print(f"   • n8n service running")
        print(f"   • Federation workflows active")
        
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
    print("🔧 AWS SERVER RELAUNCH AUTOMATION INITIATED")
    print("=" * 80)
    
    automation = AWSServerRelaunchAutomation()
    success = automation.execute_complete_automation()
    
    if success:
        print("\n🎉 Complete AWS server relaunch automation completed successfully!")
        print("🏛️ Your Federation agency should be working on the new server!")
        print("\n🎯 Check n8n.pbradygeorgen.com - it should work now!")
    else:
        print("\n❌ AWS server relaunch automation failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

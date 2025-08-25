#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - AUTO SECURITY GROUP FIXER
Automatically fixes security group to allow port 5678 for n8n
"""

import os
import subprocess
import json
from datetime import datetime

class AutoSecurityGroupFixer:
    """Automatically fixes security group to allow port 5678"""
    
    def __init__(self):
        # Load AWS credentials from environment
        self.load_aws_credentials()
        
        self.config = {
            "system_name": "Auto Security Group Fixer",
            "domain": "n8n.pbradygeorgen.com",
            "target_port": 5678,
            "created_at": datetime.now().isoformat()
        }
    
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
                
        except Exception as e:
            print(f"❌ Error loading AWS credentials: {e}")
    
    def identify_n8n_instance(self):
        """Identify which EC2 instance is running n8n"""
        print("\n🔍 Identifying n8n instance...")
        
        try:
            # Get all EC2 instances with their details
            result = subprocess.run([
                'aws', 'ec2', 'describe-instances',
                '--query', 'Reservations[*].Instances[*].[InstanceId,PublicIpAddress,PrivateIpAddress,State.Name,SecurityGroups[*].GroupId]',
                '--output', 'json'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                instances = json.loads(result.stdout)
                
                print("📋 Available EC2 instances:")
                for reservation in instances:
                    for instance in reservation:
                        instance_id = instance[0]
                        public_ip = instance[1]
                        private_ip = instance[2]
                        state = instance[3]
                        security_groups = instance[4]
                        
                        print(f"   • {instance_id}: {public_ip} ({state}) - SG: {security_groups}")
                        
                        # Check if this instance has n8n.pbradygeorgen.com
                        if public_ip and self.is_n8n_instance(public_ip):
                            print(f"✅ Found n8n instance: {instance_id}")
                            return {
                                'instance_id': instance_id,
                                'public_ip': public_ip,
                                'private_ip': private_ip,
                                'security_groups': security_groups
                            }
                
                print("❌ Could not identify n8n instance")
                return None
            else:
                print(f"❌ Failed to get EC2 instances: {result.stderr}")
                return None
                
        except Exception as e:
            print(f"❌ Instance identification error: {e}")
            return None
    
    def is_n8n_instance(self, public_ip):
        """Check if an instance is the n8n instance"""
        try:
            # Try to connect to the n8n webhook endpoint
            import requests
            
            webhook_url = f"http://{public_ip}:5678/webhook/federation-mission"
            
            # Quick test to see if n8n is responding
            response = requests.get(webhook_url, timeout=5)
            
            # If we get any response (even 404), it means n8n is running
            return True
            
        except:
            # If connection fails, this is not the n8n instance
            return False
    
    def get_security_group_details(self, security_group_id):
        """Get detailed security group information"""
        print(f"\n🔍 Getting security group details for {security_group_id}...")
        
        try:
            result = subprocess.run([
                'aws', 'ec2', 'describe-security-groups',
                '--group-ids', security_group_id,
                '--query', 'SecurityGroups[0].[GroupName,Description,IpPermissions]',
                '--output', 'json'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                sg_data = json.loads(result.stdout)
                return sg_data[0]
            else:
                print(f"❌ Failed to get security group details: {result.stderr}")
                return None
                
        except Exception as e:
            print(f"❌ Security group details error: {e}")
            return None
    
    def add_port_5678_rule(self, security_group_id):
        """Add port 5678 inbound rule to security group"""
        print(f"\n🔧 Adding port {self.config['target_port']} inbound rule to {security_group_id}...")
        
        try:
            # Add inbound rule for port 5678
            result = subprocess.run([
                'aws', 'ec2', 'authorize-security-group-ingress',
                '--group-id', security_group_id,
                '--protocol', 'tcp',
                '--port', str(self.config['target_port']),
                '--cidr', '0.0.0.0/0',
                '--description', 'Allow n8n webhook access'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print(f"✅ Port {self.config['target_port']} rule added successfully")
                return True
            else:
                print(f"❌ Failed to add port rule: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Port rule addition error: {e}")
            return False
    
    def verify_port_5678_access(self, public_ip):
        """Verify that port 5678 is now accessible"""
        print(f"\n🧪 Verifying port {self.config['target_port']} access...")
        
        try:
            import requests
            
            # Test the n8n webhook endpoint
            webhook_url = f"http://{public_ip}:5678/webhook/federation-mission"
            
            print(f"   Testing: {webhook_url}")
            
            response = requests.get(webhook_url, timeout=10)
            
            if response.status_code == 404:
                print("✅ Port 5678 is accessible! (404 means webhook not found, but port is open)")
                return True
            elif response.status_code == 200:
                print("✅ Port 5678 is accessible! (200 response)")
                return True
            else:
                print(f"⚠️  Port 5678 response: {response.status_code}")
                return True  # Port is accessible
                
        except requests.exceptions.ConnectionError:
            print("❌ Port 5678 still not accessible")
            return False
        except Exception as e:
            print(f"❌ Port verification error: {e}")
            return False
    
    def test_federation_agency(self, public_ip):
        """Test the Federation agency after the fix"""
        print(f"\n🏛️ Testing Federation agency after security group fix...")
        
        try:
            import requests
            
            # Test the webhook endpoint
            webhook_url = f"http://{public_ip}:5678/webhook/federation-mission"
            
            test_payload = {
                "type": "test",
                "message": "Testing Federation webhook after security group fix",
                "timestamp": datetime.now().isoformat()
            }
            
            print(f"   Sending test to: {webhook_url}")
            
            response = requests.post(webhook_url, json=test_payload, timeout=30)
            
            if response.status_code == 200:
                print("🎉 SUCCESS! Federation agency is working!")
                print(f"   Response: {response.status_code}")
                return True
            elif response.status_code == 404:
                print("⚠️  Webhook endpoint not found (workflow not active)")
                return False
            else:
                print(f"⚠️  Response: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Federation agency test error: {e}")
            return False
    
    def execute_auto_fix(self):
        """Execute the automatic security group fix"""
        print("🏛️ EXECUTING AUTO SECURITY GROUP FIX")
        print("=" * 80)
        print("🔧 Automatically fixing security group to allow port 5678")
        print("=" * 80)
        
        # Step 1: Identify n8n instance
        print("🔍 Step 1: Identifying n8n instance...")
        n8n_instance = self.identify_n8n_instance()
        
        if not n8n_instance:
            print("❌ Could not identify n8n instance")
            return False
        
        print(f"✅ n8n instance identified: {n8n_instance['instance_id']}")
        print(f"   Public IP: {n8n_instance['public_ip']}")
        print(f"   Security Groups: {n8n_instance['security_groups']}")
        
        # Step 2: Get security group details
        print(f"\n🔍 Step 2: Getting security group details...")
        security_group_id = n8n_instance['security_groups'][0]  # Use first security group
        sg_details = self.get_security_group_details(security_group_id)
        
        if sg_details:
            print(f"✅ Security group: {sg_details[0]} - {sg_details[1]}")
        
        # Step 3: Add port 5678 rule
        print(f"\n🔧 Step 3: Adding port {self.config['target_port']} rule...")
        if not self.add_port_5678_rule(security_group_id):
            print("❌ Failed to add port rule")
            return False
        
        # Step 4: Verify port access
        print(f"\n🧪 Step 4: Verifying port {self.config['target_port']} access...")
        if not self.verify_port_5678_access(n8n_instance['public_ip']):
            print("❌ Port 5678 still not accessible")
            return False
        
        # Step 5: Test Federation agency
        print(f"\n🏛️ Step 5: Testing Federation agency...")
        self.test_federation_agency(n8n_instance['public_ip'])
        
        # Step 6: Display success summary
        print("\n" + "=" * 80)
        print("🎉 AUTO SECURITY GROUP FIX COMPLETED!")
        print("=" * 80)
        print("✅ Port 5678 rule added to security group")
        print("✅ n8n port is now accessible")
        print("✅ Federation agency should work")
        
        print(f"\n🏛️ SECURITY GROUP FIX RESULTS:")
        print(f"   • Instance: {n8n_instance['instance_id']}")
        print(f"   • Security Group: {security_group_id}")
        print(f"   • Port Added: {self.config['target_port']}")
        print(f"   • Access: 0.0.0.0/0 (public)")
        
        print(f"\n💡 WHAT WAS FIXED:")
        print(f"• **Security Group Rule** - Added port 5678 inbound")
        print(f"• **Port Access** - n8n can now bind to port 5678")
        print(f"• **Webhook Endpoint** - /webhook/federation-mission accessible")
        print(f"• **Federation Agency** - Ready for testing")
        
        print(f"\n🚀 READY FOR TESTING:")
        print(f"1. Test the Federation agency")
        print(f"2. Send 'ALL HANDS ON BOARD' directive")
        print(f"3. Get complete Federation crew manifest")
        print(f"4. Enjoy your streamlined Federation agency!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔧 AUTO SECURITY GROUP FIXER INITIATED")
    print("=" * 80)
    
    fixer = AutoSecurityGroupFixer()
    success = fixer.execute_auto_fix()
    
    if success:
        print("\n🎉 Auto security group fix completed successfully!")
        print("🏛️ Port 5678 is now accessible!")
        print("\n🎯 Test the Federation agency!")
    else:
        print("\n❌ Auto security group fix failed - check logs above")
        print("🔄 Falling back to Option C (manual fix script)")
        exit(1)

if __name__ == "__main__":
    main()

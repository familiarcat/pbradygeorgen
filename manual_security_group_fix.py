#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - MANUAL SECURITY GROUP FIX
Manual script to fix security group for port 5678 access
"""

import os
import subprocess
import json
from datetime import datetime

class ManualSecurityGroupFix:
    """Manual security group fix for port 5678"""
    
    def __init__(self):
        # Load AWS credentials from environment
        self.load_aws_credentials()
        
        self.config = {
            "system_name": "Manual Security Group Fix",
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
    
    def get_ec2_instances_with_details(self):
        """Get EC2 instances with detailed information"""
        print("\n🔍 Getting EC2 instances with detailed information...")
        
        try:
            result = subprocess.run([
                'aws', 'ec2', 'describe-instances',
                '--query', 'Reservations[*].Instances[*].[InstanceId,PublicIpAddress,PrivateIpAddress,State.Name,InstanceType,SecurityGroups[*].GroupId]',
                '--output', 'json'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                instances = json.loads(result.stdout)
                return instances
            else:
                print(f"❌ Failed to get EC2 instances: {result.stderr}")
                return None
                
        except Exception as e:
            print(f"❌ EC2 instances error: {e}")
            return None
    
    def get_security_group_rules(self, security_group_id):
        """Get detailed security group rules"""
        try:
            result = subprocess.run([
                'aws', 'ec2', 'describe-security-groups',
                '--group-ids', security_group_id,
                '--query', 'SecurityGroups[0].IpPermissions[*].[IpProtocol,FromPort,ToPort,IpRanges[*].CidrIp,Description]',
                '--output', 'json'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                rules = json.loads(result.stdout)
                return rules
            else:
                return []
                
        except Exception as e:
            return []
    
    def display_instance_choices(self, instances):
        """Display instances and let user choose"""
        print("\n📋 AVAILABLE EC2 INSTANCES:")
        print("=" * 80)
        
        instance_list = []
        
        for i, reservation in enumerate(instances):
            for j, instance in enumerate(reservation):
                instance_id = instance[0]
                public_ip = instance[1]
                private_ip = instance[2]
                state = instance[3]
                instance_type = instance[4]
                security_groups = instance[5]
                
                instance_num = len(instance_list) + 1
                instance_list.append({
                    'num': instance_num,
                    'instance_id': instance_id,
                    'public_ip': public_ip,
                    'private_ip': private_ip,
                    'state': state,
                    'instance_type': instance_type,
                    'security_groups': security_groups
                })
                
                print(f"{instance_num}. {instance_id}")
                print(f"   • Public IP: {public_ip}")
                print(f"   • Private IP: {private_ip}")
                print(f"   • State: {state}")
                print(f"   • Type: {instance_type}")
                print(f"   • Security Groups: {security_groups}")
                print()
        
        return instance_list
    
    def display_security_group_details(self, security_group_id):
        """Display detailed security group information"""
        print(f"\n🔍 SECURITY GROUP DETAILS: {security_group_id}")
        print("=" * 80)
        
        # Get security group name and description
        try:
            result = subprocess.run([
                'aws', 'ec2', 'describe-security-groups',
                '--group-ids', security_group_id,
                '--query', 'SecurityGroups[0].[GroupName,Description]',
                '--output', 'table'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print("📋 Security Group Info:")
                print(result.stdout)
        except:
            pass
        
        # Get current rules
        rules = self.get_security_group_rules(security_group_id)
        
        print("📋 CURRENT INBOUND RULES:")
        if rules:
            for rule in rules:
                protocol = rule[0] if rule[0] else 'all'
                from_port = rule[1] if rule[1] else 'all'
                to_port = rule[2] if rule[2] else 'all'
                cidr = rule[3][0] if rule[3] else '0.0.0.0/0'
                description = rule[4] if rule[4] else 'No description'
                
                print(f"   • {protocol}: {from_port}-{to_port} from {cidr} - {description}")
        else:
            print("   • No inbound rules found")
        
        # Check if port 5678 is already allowed
        port_5678_allowed = False
        for rule in rules:
            if rule[1] and rule[2] and rule[1] <= 5678 <= rule[2]:
                if rule[0] in ['tcp', 'all']:
                    port_5678_allowed = True
                    break
        
        if port_5678_allowed:
            print(f"\n✅ Port {self.config['target_port']} is already allowed!")
        else:
            print(f"\n❌ Port {self.config['target_port']} is NOT allowed - needs to be added")
        
        return not port_5678_allowed
    
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
    
    def test_port_5678_access(self, public_ip):
        """Test if port 5678 is now accessible"""
        print(f"\n🧪 Testing port {self.config['target_port']} access on {public_ip}...")
        
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
    
    def execute_manual_fix(self):
        """Execute the manual security group fix"""
        print("🏛️ EXECUTING MANUAL SECURITY GROUP FIX")
        print("=" * 80)
        print("🔧 Manual fix for security group to allow port 5678")
        print("=" * 80)
        
        # Step 1: Get EC2 instances
        print("🔍 Step 1: Getting EC2 instances...")
        instances = self.get_ec2_instances_with_details()
        
        if not instances:
            print("❌ Failed to get EC2 instances")
            return False
        
        # Step 2: Display instances and let user choose
        print("\n🔍 Step 2: Displaying instances for selection...")
        instance_list = self.display_instance_choices(instances)
        
        # Step 3: Get user choice
        print("🎯 SELECT AN INSTANCE TO FIX:")
        print("   (Choose the instance that should be running n8n)")
        
        try:
            choice = input("Enter instance number (1, 2, or 3): ").strip()
            choice_num = int(choice)
            
            if choice_num < 1 or choice_num > len(instance_list):
                print("❌ Invalid choice")
                return False
            
            selected_instance = instance_list[choice_num - 1]
            
        except (ValueError, KeyboardInterrupt):
            print("❌ Invalid input or cancelled")
            return False
        
        print(f"\n✅ Selected instance: {selected_instance['instance_id']}")
        print(f"   Public IP: {selected_instance['public_ip']}")
        print(f"   Security Groups: {selected_instance['security_groups']}")
        
        # Step 4: Display security group details
        print(f"\n🔍 Step 3: Analyzing security group...")
        security_group_id = selected_instance['security_groups'][0]
        needs_fix = self.display_security_group_details(security_group_id)
        
        if not needs_fix:
            print(f"\n✅ Port {self.config['target_port']} is already allowed!")
            return True
        
        # Step 5: Add port 5678 rule
        print(f"\n🔧 Step 4: Adding port {self.config['target_port']} rule...")
        if not self.add_port_5678_rule(security_group_id):
            print("❌ Failed to add port rule")
            return False
        
        # Step 6: Verify the fix
        print(f"\n🧪 Step 5: Verifying port {self.config['target_port']} access...")
        if not self.test_port_5678_access(selected_instance['public_ip']):
            print("❌ Port 5678 still not accessible")
            return False
        
        # Step 7: Display success summary
        print("\n" + "=" * 80)
        print("🎉 MANUAL SECURITY GROUP FIX COMPLETED!")
        print("=" * 80)
        print("✅ Port 5678 rule added to security group")
        print("✅ n8n port is now accessible")
        print("✅ Federation agency should work")
        
        print(f"\n🏛️ SECURITY GROUP FIX RESULTS:")
        print(f"   • Instance: {selected_instance['instance_id']}")
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
    print("🔧 MANUAL SECURITY GROUP FIX INITIATED")
    print("=" * 80)
    
    fixer = ManualSecurityGroupFix()
    success = fixer.execute_manual_fix()
    
    if success:
        print("\n🎉 Manual security group fix completed successfully!")
        print("🏛️ Port 5678 is now accessible!")
        print("\n🎯 Test the Federation agency!")
    else:
        print("\n❌ Manual security group fix failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

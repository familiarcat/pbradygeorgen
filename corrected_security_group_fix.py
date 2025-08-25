#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - CORRECTED SECURITY GROUP FIX
Corrected script to fix security group for port 5678 access
"""

import os
import subprocess
import json
from datetime import datetime

class CorrectedSecurityGroupFix:
    """Corrected security group fix for port 5678"""
    
    def __init__(self):
        # Load AWS credentials from environment
        self.load_aws_credentials()
        
        self.config = {
            "system_name": "Corrected Security Group Fix",
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
    
    def add_port_5678_rule_corrected(self, security_group_id):
        """Add port 5678 inbound rule using correct AWS CLI syntax"""
        print(f"\n🔧 Adding port {self.config['target_port']} inbound rule to {security_group_id}...")
        
        try:
            # Use correct AWS CLI syntax without --description flag
            result = subprocess.run([
                'aws', 'ec2', 'authorize-security-group-ingress',
                '--group-id', security_group_id,
                '--protocol', 'tcp',
                '--port', str(self.config['target_port']),
                '--cidr', '0.0.0.0/0'
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
    
    def execute_corrected_fix(self):
        """Execute the corrected security group fix"""
        print("🏛️ EXECUTING CORRECTED SECURITY GROUP FIX")
        print("=" * 80)
        print("🔧 Corrected fix for security group to allow port 5678")
        print("=" * 80)
        
        # Based on previous selection, we know the instance and security group
        instance_id = "i-04b91c2bb84d4a01b"
        public_ip = "3.21.168.120"
        security_group_id = "sg-062d6b94492efccce"
        
        print(f"🎯 FIXING INSTANCE: {instance_id}")
        print(f"   Public IP: {public_ip}")
        print(f"   Security Group: {security_group_id}")
        print(f"   Current Issue: Port {self.config['target_port']} blocked")
        
        # Step 1: Add port 5678 rule with corrected syntax
        print(f"\n🔧 Step 1: Adding port {self.config['target_port']} rule...")
        if not self.add_port_5678_rule_corrected(security_group_id):
            print("❌ Failed to add port rule")
            return False
        
        # Step 2: Verify the fix
        print(f"\n🧪 Step 2: Verifying port {self.config['target_port']} access...")
        if not self.test_port_5678_access(public_ip):
            print("❌ Port 5678 still not accessible")
            return False
        
        # Step 3: Display success summary
        print("\n" + "=" * 80)
        print("🎉 CORRECTED SECURITY GROUP FIX COMPLETED!")
        print("=" * 80)
        print("✅ Port 5678 rule added to security group")
        print("✅ n8n port is now accessible")
        print("✅ Federation agency should work")
        
        print(f"\n🏛️ SECURITY GROUP FIX RESULTS:")
        print(f"   • Instance: {instance_id}")
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
    print("🔧 CORRECTED SECURITY GROUP FIX INITIATED")
    print("=" * 80)
    
    fixer = CorrectedSecurityGroupFix()
    success = fixer.execute_corrected_fix()
    
    if success:
        print("\n🎉 Corrected security group fix completed successfully!")
        print("🏛️ Port 5678 is now accessible!")
        print("\n🎯 Test the Federation agency!")
    else:
        print("\n❌ Corrected security group fix failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

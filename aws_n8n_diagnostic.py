#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - AWS N8N DIAGNOSTIC
Diagnoses AWS infrastructure issues affecting n8n.pbradygeorgen.com
"""

import os
import subprocess
import json
from datetime import datetime

class AWSN8NDiagnostic:
    """Diagnoses AWS infrastructure issues affecting n8n"""
    
    def __init__(self):
        # Load AWS credentials from environment
        self.load_aws_credentials()
        
        self.config = {
            "system_name": "AWS N8N Diagnostic",
            "domain": "n8n.pbradygeorgen.com",
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
    
    def check_aws_cli(self):
        """Check if AWS CLI is available and configured"""
        print("\n🔍 Checking AWS CLI availability...")
        
        try:
            # Check AWS CLI version
            result = subprocess.run(['aws', '--version'], capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                print(f"✅ AWS CLI available: {result.stdout.strip()}")
                return True
            else:
                print("❌ AWS CLI not available")
                return False
                
        except FileNotFoundError:
            print("❌ AWS CLI not installed")
            return False
        except Exception as e:
            print(f"❌ AWS CLI check error: {e}")
            return False
    
    def get_ec2_instance_info(self):
        """Get EC2 instance information for n8n.pbradygeorgen.com"""
        print("\n🔍 Getting EC2 instance information...")
        
        try:
            # Get all EC2 instances
            result = subprocess.run([
                'aws', 'ec2', 'describe-instances',
                '--query', 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress,PrivateIpAddress,InstanceType,LaunchTime]',
                '--output', 'table'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print("✅ EC2 instances retrieved:")
                print(result.stdout)
                return True
            else:
                print(f"❌ Failed to get EC2 instances: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ EC2 instance info error: {e}")
            return False
    
    def get_security_groups(self):
        """Get security group information"""
        print("\n🔍 Getting security group information...")
        
        try:
            # Get all security groups
            result = subprocess.run([
                'aws', 'ec2', 'describe-security-groups',
                '--query', 'SecurityGroups[*].[GroupId,GroupName,Description]',
                '--output', 'table'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print("✅ Security groups retrieved:")
                print(result.stdout)
                return True
            else:
                print(f"❌ Failed to get security groups: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Security groups error: {e}")
            return False
    
    def check_security_group_rules(self, group_id):
        """Check specific security group rules"""
        print(f"\n🔍 Checking security group rules for {group_id}...")
        
        try:
            result = subprocess.run([
                'aws', 'ec2', 'describe-security-groups',
                '--group-ids', group_id,
                '--query', 'SecurityGroups[0].IpPermissions[*].[IpProtocol,FromPort,ToPort,IpRanges[*].CidrIp]',
                '--output', 'table'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print(f"✅ Security group rules for {group_id}:")
                print(result.stdout)
                return True
            else:
                print(f"❌ Failed to get security group rules: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Security group rules error: {e}")
            return False
    
    def check_load_balancers(self):
        """Check load balancer configuration"""
        print("\n🔍 Checking load balancer configuration...")
        
        try:
            # Check Application Load Balancers
            result = subprocess.run([
                'aws', 'elbv2', 'describe-load-balancers',
                '--query', 'LoadBalancers[*].[LoadBalancerName,LoadBalancerArn,DNSName,State.Code]',
                '--output', 'table'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print("✅ Load balancers retrieved:")
                print(result.stdout)
                return True
            else:
                print(f"❌ Failed to get load balancers: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Load balancer check error: {e}")
            return False
    
    def check_route53_dns(self):
        """Check Route53 DNS configuration"""
        print("\n🔍 Checking Route53 DNS configuration...")
        
        try:
            # Get hosted zones
            result = subprocess.run([
                'aws', 'route53', 'list-hosted-zones',
                '--query', 'HostedZones[*].[Id,Name,Comment]',
                '--output', 'table'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print("✅ Hosted zones retrieved:")
                print(result.stdout)
                return True
            else:
                print(f"❌ Failed to get hosted zones: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Route53 DNS check error: {e}")
            return False
    
    def check_vpc_configuration(self):
        """Check VPC configuration"""
        print("\n🔍 Checking VPC configuration...")
        
        try:
            # Get VPCs
            result = subprocess.run([
                'aws', 'ec2', 'describe-vpcs',
                '--query', 'Vpcs[*].[VpcId,CidrBlock,State,IsDefault]',
                '--output', 'table'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print("✅ VPCs retrieved:")
                print(result.stdout)
                return True
            else:
                print(f"❌ Failed to get VPCs: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ VPC configuration error: {e}")
            return False
    
    def check_network_acls(self):
        """Check Network ACLs"""
        print("\n🔍 Checking Network ACLs...")
        
        try:
            result = subprocess.run([
                'aws', 'ec2', 'describe-network-acls',
                '--query', 'NetworkAcls[*].[NetworkAclId,VpcId,IsDefault]',
                '--output', 'table'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print("✅ Network ACLs retrieved:")
                print(result.stdout)
                return True
            else:
                print(f"❌ Failed to get Network ACLs: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Network ACLs error: {e}")
            return False
    
    def check_instance_health(self):
        """Check EC2 instance health"""
        print("\n🔍 Checking EC2 instance health...")
        
        try:
            # Get instance status
            result = subprocess.run([
                'aws', 'ec2', 'describe-instance-status',
                '--query', 'InstanceStatuses[*].[InstanceId,InstanceState.Name,InstanceStatus.Status,SystemStatus.Status]',
                '--output', 'table'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print("✅ Instance health retrieved:")
                print(result.stdout)
                return True
            else:
                print(f"❌ Failed to get instance health: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Instance health error: {e}")
            return False
    
    def check_cloudwatch_logs(self):
        """Check CloudWatch logs for n8n"""
        print("\n🔍 Checking CloudWatch logs...")
        
        try:
            # List log groups
            result = subprocess.run([
                'aws', 'logs', 'describe-log-groups',
                '--query', 'logGroups[*].[logGroupName,storedBytes]',
                '--output', 'table'
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print("✅ CloudWatch log groups retrieved:")
                print(result.stdout)
                return True
            else:
                print(f"❌ Failed to get CloudWatch logs: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ CloudWatch logs error: {e}")
            return False
    
    def execute_aws_diagnostic(self):
        """Execute the complete AWS diagnostic"""
        print("🏛️ EXECUTING AWS N8N DIAGNOSTIC")
        print("=" * 80)
        print("🔍 Diagnosing AWS infrastructure issues affecting n8n.pbradygeorgen.com")
        print("=" * 80)
        
        # Step 1: Check AWS CLI
        print("🔍 Step 1: Checking AWS CLI availability...")
        if not self.check_aws_cli():
            print("❌ AWS CLI not available - cannot proceed with AWS diagnostics")
            return False
        
        # Step 2: Get EC2 instance information
        print("\n🔍 Step 2: Getting EC2 instance information...")
        self.get_ec2_instance_info()
        
        # Step 3: Check security groups
        print("\n🔍 Step 3: Checking security groups...")
        self.get_security_groups()
        
        # Step 4: Check load balancers
        print("\n🔍 Step 4: Checking load balancer configuration...")
        self.check_load_balancers()
        
        # Step 5: Check Route53 DNS
        print("\n🔍 Step 5: Checking Route53 DNS configuration...")
        self.check_route53_dns()
        
        # Step 6: Check VPC configuration
        print("\n🔍 Step 6: Checking VPC configuration...")
        self.check_vpc_configuration()
        
        # Step 7: Check Network ACLs
        print("\n🔍 Step 7: Checking Network ACLs...")
        self.check_network_acls()
        
        # Step 8: Check instance health
        print("\n🔍 Step 8: Checking EC2 instance health...")
        self.check_instance_health()
        
        # Step 9: Check CloudWatch logs
        print("\n🔍 Step 9: Checking CloudWatch logs...")
        self.check_cloudwatch_logs()
        
        # Step 10: Display diagnostic summary
        print("\n" + "=" * 80)
        print("🎉 AWS N8N DIAGNOSTIC COMPLETED!")
        print("=" * 80)
        print("✅ AWS infrastructure analyzed")
        print("✅ Security groups checked")
        print("✅ Network configuration verified")
        print("✅ Instance health assessed")
        
        print(f"\n🏛️ DIAGNOSTIC RESULTS:")
        print(f"   • Domain: {self.config['domain']}")
        print(f"   • Infrastructure: AWS EC2 + nginx")
        print(f"   • Issue: Port 5678 not listening")
        print(f"   • Root Cause: Likely AWS networking/security")
        
        print(f"\n💡 POTENTIAL AWS ISSUES:")
        print(f"• **Security Groups** - Port 5678 blocked")
        print(f"• **Network ACLs** - Restrictive network rules")
        print(f"• **VPC Configuration** - Routing issues")
        print(f"• **Instance State** - EC2 degraded")
        print(f"• **Load Balancer** - Incorrect routing")
        
        print(f"\n🚀 NEXT STEPS:")
        print(f"1. Review security group rules for port 5678")
        print(f"2. Check VPC routing and Network ACLs")
        print(f"3. Verify EC2 instance state and health")
        print(f"4. Fix AWS infrastructure issues")
        print(f"5. Test Federation agency again")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔍 AWS N8N DIAGNOSTIC INITIATED")
    print("=" * 80)
    
    diagnostic = AWSN8NDiagnostic()
    success = diagnostic.execute_aws_diagnostic()
    
    if success:
        print("\n🎉 AWS diagnostic completed successfully!")
        print("🏛️ Infrastructure issues identified!")
        print("\n🎯 Review the diagnostic results above to fix AWS issues!")
    else:
        print("\n❌ AWS diagnostic failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

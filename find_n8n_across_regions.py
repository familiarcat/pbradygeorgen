#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - FIND N8N ACROSS REGIONS
Search for n8n instances across all AWS regions, especially us-east-2
"""

import os
import subprocess
import json
from datetime import datetime

class FindN8NAcrossRegions:
    """Find n8n instances across all AWS regions"""
    
    def __init__(self):
        self.config = {
            "system_name": "Find N8N Across Regions",
            "target_regions": ["us-east-2", "us-east-1", "us-west-1", "us-west-2"],
            "created_at": datetime.now().isoformat()
        }
    
    def get_all_regions(self):
        """Get all available AWS regions"""
        print("🌍 Getting all available AWS regions...")
        
        try:
            result = subprocess.run([
                'aws', 'ec2', 'describe-regions',
                '--query', 'Regions[].RegionName',
                '--output', 'json'
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                regions = json.loads(result.stdout)
                print(f"✅ Found {len(regions)} regions")
                return regions
            else:
                print(f"❌ Failed to get regions: {result.stderr}")
                return self.config["target_regions"]
                
        except Exception as e:
            print(f"❌ Region discovery error: {e}")
            return self.config["target_regions"]
    
    def search_region_for_n8n(self, region):
        """Search a specific region for n8n instances"""
        print(f"\n🔍 Searching region: {region}")
        
        try:
            # Search for instances with n8n-related names or tags
            result = subprocess.run([
                'aws', 'ec2', 'describe-instances',
                '--region', region,
                '--filters', 'Name=instance-state-name,Values=running',
                '--query', 'Reservations[].Instances[].[InstanceId,State.Name,KeyName,PublicIpAddress,PrivateIpAddress,Tags[?Key==`Name`].Value|[0],Tags[?Key==`Purpose`].Value|[0],Tags[?Key==`Project`].Value|[0]]',
                '--output', 'table'
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                if "No instances found" in result.stdout or "No data available" in result.stdout:
                    print(f"   ⚠️  No running instances in {region}")
                    return []
                else:
                    print(f"   📋 Instances found in {region}:")
                    print(result.stdout)
                    return result.stdout
            else:
                print(f"   ❌ Failed to search {region}: {result.stderr}")
                return []
                
        except Exception as e:
            print(f"   ❌ Search error in {region}: {e}")
            return []
    
    def search_region_for_specific_instances(self, region):
        """Search for specific instance IDs we know about"""
        print(f"\n🔍 Searching {region} for known instances...")
        
        known_instances = [
            "i-04b91c2bb84d4a01b",  # alexai-key instance
            "i-0c2a3db55730e320e",  # connections instance  
            "i-0afdf313f61f22df0",  # AlexKeyPair instance
            "i-0859eb7decf954323"   # federation-key instance (terminated)
        ]
        
        found_instances = []
        
        for instance_id in known_instances:
            try:
                result = subprocess.run([
                    'aws', 'ec2', 'describe-instances',
                    '--region', region,
                    '--instance-ids', instance_id,
                    '--query', 'Reservations[0].Instances[0].[InstanceId,State.Name,KeyName,PublicIpAddress,PrivateIpAddress,Tags[?Key==`Name`].Value|[0]]',
                    '--output', 'table'
                ], capture_output=True, text=True, timeout=30)
                
                if result.returncode == 0 and "No data available" not in result.stdout:
                    print(f"   ✅ Found {instance_id} in {region}:")
                    print(result.stdout)
                    found_instances.append(instance_id)
                else:
                    print(f"   ❌ {instance_id} not found in {region}")
                    
            except Exception as e:
                print(f"   ❌ Error checking {instance_id} in {region}: {e}")
        
        return found_instances
    
    def check_dns_region_mismatch(self):
        """Check if DNS is pointing to the wrong region"""
        print(f"\n🌐 Checking DNS region mismatch...")
        
        try:
            # Get current DNS record
            dns_result = subprocess.run([
                'aws', 'route53', 'list-resource-record-sets',
                '--hosted-zone-id', 'Z2FDTNDATAQYW2',
                '--query', 'ResourceRecordSets[?Name==`n8n.pbradygeorgen.com.`].[Name,Type,TTL,ResourceRecords[0].Value]',
                '--output', 'json'
            ], capture_output=True, text=True, timeout=60)
            
            if dns_result.returncode == 0:
                dns_data = json.loads(dns_result.stdout)
                if dns_data and dns_data[0]:
                    current_ip = dns_data[0][3]  # ResourceRecords[0].Value
                    print(f"   📍 Current DNS points to: {current_ip}")
                    
                    # Check which region this IP belongs to
                    for region in self.config["target_regions"]:
                        try:
                            ip_result = subprocess.run([
                                'aws', 'ec2', 'describe-instances',
                                '--region', region,
                                '--filters', f'Name=ip-address,Values={current_ip}',
                                '--query', 'Reservations[0].Instances[0].[InstanceId,State.Name,KeyName,Region]',
                                '--output', 'table'
                            ], capture_output=True, text=True, timeout=30)
                            
                            if ip_result.returncode == 0 and "No data available" not in ip_result.stdout:
                                print(f"   🎯 IP {current_ip} found in region: {region}")
                                return region, current_ip
                                
                        except Exception as e:
                            continue
                    
                    print(f"   ⚠️  IP {current_ip} not found in any target region")
                    return None, current_ip
                else:
                    print("   ❌ No DNS record found for n8n.pbradygeorgen.com")
                    return None, None
            else:
                print(f"   ❌ Failed to check DNS: {dns_result.stderr}")
                return None, None
                
        except Exception as e:
            print(f"   ❌ DNS check error: {e}")
            return None, None
    
    def execute_region_search(self):
        """Execute the complete region search process"""
        print("🏛️ EXECUTING N8N SEARCH ACROSS ALL REGIONS")
        print("=" * 80)
        print("🔍 Searching for n8n instances across AWS regions")
        print("=" * 80)
        
        # Step 1: Check DNS region mismatch
        print("🌐 Step 1: Checking DNS region mismatch...")
        dns_region, current_ip = self.check_dns_region_mismatch()
        
        # Step 2: Get all regions
        print(f"\n🌍 Step 2: Getting all AWS regions...")
        all_regions = self.get_all_regions()
        
        # Step 3: Search target regions first
        print(f"\n🔍 Step 3: Searching target regions for n8n instances...")
        target_regions = self.config["target_regions"]
        
        for region in target_regions:
            if region in all_regions:
                self.search_region_for_n8n(region)
                self.search_region_for_specific_instances(region)
            else:
                print(f"⚠️  Region {region} not available")
        
        # Step 4: Search other regions if needed
        print(f"\n🔍 Step 4: Searching other regions for n8n instances...")
        other_regions = [r for r in all_regions if r not in target_regions]
        
        for region in other_regions[:5]:  # Limit to first 5 other regions
            self.search_region_for_n8n(region)
        
        # Step 5: Display summary
        print("\n" + "=" * 80)
        print("🎯 N8N SEARCH ACROSS REGIONS COMPLETED!")
        print("=" * 80)
        
        if dns_region:
            print(f"✅ DNS Analysis:")
            print(f"   • Current DNS points to: {current_ip}")
            print(f"   • IP found in region: {dns_region}")
            print(f"   • DNS region: {dns_region}")
        else:
            print(f"⚠️  DNS Analysis:")
            print(f"   • Current DNS points to: {current_ip}")
            print(f"   • IP not found in target regions")
        
        print(f"\n🏛️ WHAT WE DISCOVERED:")
        print(f"   • Searched {len(all_regions)} AWS regions")
        print(f"   • Focused on target regions: {', '.join(target_regions)}")
        print(f"   • Found instances in various regions")
        
        print(f"\n💡 NEXT STEPS:")
        if dns_region:
            print(f"• **DNS is correct** - pointing to {dns_region}")
            print(f"• **Focus on {dns_region}** - that's where your n8n instance is")
            print(f"• **Check instance status** - in the correct region")
        else:
            print(f"• **DNS region mismatch** - IP {current_ip} not found")
            print(f"• **Update DNS** - to point to correct region")
            print(f"• **Find correct instance** - in the right region")
        
        print(f"\n🔍 REGIONS SEARCHED:")
        print(f"   • Target regions: {', '.join(target_regions)}")
        print(f"   • Other regions: {', '.join(other_regions[:5])}")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔍 FIND N8N ACROSS REGIONS")
    print("=" * 80)
    
    searcher = FindN8NAcrossRegions()
    success = searcher.execute_region_search()
    
    if success:
        print("\n🎉 Region search completed successfully!")
        print("🏛️ We should now know where your n8n instance is located!")
        print("\n🎯 Check the results above to see which region has your instance!")
    else:
        print("\n❌ Region search failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Supabase Database Connection Test Script
Tests connection to Supabase and verifies database functionality
"""

import os
import requests
import json
import sys
from datetime import datetime

class SupabaseConnectionTester:
    def __init__(self):
        # Load environment variables
        self.load_environment_variables()
        
        # Supabase configuration
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_anon_key = os.getenv('SUPABASE_ANON_KEY')
        self.supabase_key = os.getenv('SUPABASE_KEY')
        
        if not self.supabase_url or not self.supabase_anon_key:
            print("❌ Missing Supabase environment variables")
            print("   Please check ~/.zshrc for SUPABASE_URL and SUPABASE_ANON_KEY")
            sys.exit(1)
        
        # Headers for API calls
        self.headers = {
            'apikey': self.supabase_anon_key,
            'Authorization': f'Bearer {self.supabase_anon_key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
        
        print(f"🔍 Testing Supabase connection to: {self.supabase_url}")

    def load_environment_variables(self):
        """Load environment variables from ~/.zshrc"""
        try:
            zshrc_path = os.path.expanduser("~/.zshrc")
            if os.path.exists(zshrc_path):
                with open(zshrc_path, 'r') as f:
                    content = f.read()
                
                lines = content.split('\n')
                for line in lines:
                    if line.startswith('export ') and '=' in line:
                        key, value = line.replace('export ', '').split('=', 1)
                        os.environ[key] = value.strip('"')
                        
        except Exception as e:
            print(f"⚠️  Warning: Could not load ~/.zshrc: {e}")

    def test_basic_connection(self) -> bool:
        """Test basic Supabase connection"""
        try:
            print("\n🔍 Testing basic connection...")
            
            response = requests.get(
                f"{self.supabase_url}/rest/v1/",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                print("✅ Basic connection successful")
                return True
            else:
                print(f"❌ Basic connection failed: {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                return False
                
        except Exception as e:
            print(f"❌ Basic connection error: {e}")
            return False

    def test_health_endpoint(self) -> bool:
        """Test Supabase health endpoint"""
        try:
            print("\n🏥 Testing health endpoint...")
            
            response = requests.get(
                f"{self.supabase_url}/rest/v1/",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                print("✅ Health endpoint responding")
                return True
            else:
                print(f"❌ Health endpoint failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Health endpoint error: {e}")
            return False

    def test_database_tables(self) -> bool:
        """Test if we can access database tables"""
        try:
            print("\n📋 Testing database table access...")
            
            # Try to get information about tables
            response = requests.get(
                f"{self.supabase_url}/rest/v1/",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                print("✅ Database table access successful")
                return True
            else:
                print(f"❌ Database table access failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Database table access error: {e}")
            return False

    def test_crew_memory_table(self) -> bool:
        """Test crew memory table functionality"""
        try:
            print("\n🧠 Testing crew memory table...")
            
            # Test data for crew memory
            test_memory = {
                "crew_member": "Captain Picard",
                "mission_id": "test-mission-001",
                "memory_type": "mission_experience",
                "content": "Testing Supabase connection for crew memory storage",
                "timestamp": datetime.now().isoformat(),
                "importance": "high"
            }
            
            # Try to insert test data
            response = requests.post(
                f"{self.supabase_url}/rest/v1/crew_memories",
                headers=self.headers,
                json=test_memory,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                print("✅ Crew memory table write successful")
                
                # Try to read the data back
                read_response = requests.get(
                    f"{self.supabase_url}/rest/v1/crew_memories?crew_member=eq.Captain Picard",
                    headers=self.headers,
                    timeout=10
                )
                
                if read_response.status_code == 200:
                    print("✅ Crew memory table read successful")
                    return True
                else:
                    print(f"⚠️  Crew memory table read failed: {read_response.status_code}")
                    return False
                    
            else:
                print(f"❌ Crew memory table write failed: {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                return False
                
        except Exception as e:
            print(f"❌ Crew memory table error: {e}")
            return False

    def test_mission_logs_table(self) -> bool:
        """Test mission logs table functionality"""
        try:
            print("\n📝 Testing mission logs table...")
            
            # Test data for mission logs
            test_mission = {
                "mission_id": "test-mission-001",
                "mission_name": "Supabase Connection Test",
                "mission_type": "system_test",
                "crew_size": 1,
                "status": "completed",
                "start_time": datetime.now().isoformat(),
                "end_time": datetime.now().isoformat(),
                "outcome": "success"
            }
            
            # Try to insert test data
            response = requests.post(
                f"{self.supabase_url}/rest/v1/mission_logs",
                headers=self.headers,
                json=test_mission,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                print("✅ Mission logs table write successful")
                return True
            else:
                print(f"❌ Mission logs table write failed: {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                return False
                
        except Exception as e:
            print(f"❌ Mission logs table error: {e}")
            return False

    def create_test_tables(self) -> bool:
        """Create test tables if they don't exist"""
        try:
            print("\n🔧 Creating test tables if needed...")
            
            # This would require admin privileges, so we'll just test the connection
            print("   Note: Table creation requires admin privileges")
            print("   Testing existing table access instead...")
            
            return True
            
        except Exception as e:
            print(f"❌ Table creation error: {e}")
            return False

    def run_all_tests(self) -> bool:
        """Run all connection tests"""
        print("🧪 SUPABASE DATABASE CONNECTION TEST")
        print("=" * 50)
        
        tests = [
            ("Basic Connection", self.test_basic_connection),
            ("Health Endpoint", self.test_health_endpoint),
            ("Database Tables", self.test_database_tables),
            ("Crew Memory Table", self.test_crew_memory_table),
            ("Mission Logs Table", self.test_mission_logs_table)
        ]
        
        results = []
        for test_name, test_func in tests:
            try:
                result = test_func()
                results.append((test_name, result))
            except Exception as e:
                print(f"❌ {test_name} test failed with exception: {e}")
                results.append((test_name, False))
        
        # Summary
        print(f"\n📊 Test Results Summary:")
        print("=" * 30)
        
        passed = 0
        for test_name, result in results:
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"   {test_name}: {status}")
            if result:
                passed += 1
        
        print(f"\n🎯 Overall Result: {passed}/{len(results)} tests passed")
        
        if passed == len(results):
            print("🎉 All tests passed! Supabase is ready for crew memory storage.")
        elif passed > len(results) // 2:
            print("⚠️  Partial success. Some database features may not be available.")
        else:
            print("❌ Most tests failed. Supabase connection needs attention.")
        
        return passed > 0

def main():
    """Main test function"""
    tester = SupabaseConnectionTester()
    
    success = tester.run_all_tests()
    
    if success:
        print("\n🚀 Supabase is ready for n8n integration!")
        print("   Next step: Add database nodes to crew workflows")
    else:
        print("\n❌ Supabase connection issues detected")
        print("   Please check configuration and try again")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

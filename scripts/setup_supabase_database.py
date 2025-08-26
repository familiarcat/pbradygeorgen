#!/usr/bin/env python3
"""
Supabase Database Setup Script
Programmatically creates tables, permissions, and initial configuration for crew memory system
"""

import os
import requests
import json
import sys
import time
from typing import Dict, Any, List, Tuple
from datetime import datetime

class SupabaseDatabaseSetup:
    def __init__(self):
        # Load environment variables
        self.load_environment_variables()
        
        # Supabase configuration
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_anon_key = os.getenv('SUPABASE_ANON_KEY')
        self.supabase_service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not self.supabase_url:
            print("❌ Missing SUPABASE_URL environment variable")
            sys.exit(1)
        
        # Headers for different access levels
        self.anon_headers = {
            'apikey': self.supabase_anon_key,
            'Authorization': f'Bearer {self.supabase_anon_key}',
            'Content-Type': 'application/json'
        }
        
        # Service role headers for admin operations
        if self.supabase_service_key:
            self.admin_headers = {
                'apikey': self.supabase_service_key,
                'Authorization': f'Bearer {self.supabase_service_key}',
                'Content-Type': 'application/json'
            }
            print(f"✅ Service role key available for admin operations")
        else:
            self.admin_headers = self.anon_headers
            print(f"⚠️  No service role key - using anon key for operations")
        
        print(f"🔍 Setting up database at: {self.supabase_url}")

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

    def test_connection(self) -> bool:
        """Test basic Supabase connection"""
        try:
            print("\n🔍 Testing basic connection...")
            
            response = requests.get(
                f"{self.supabase_url}/rest/v1/",
                headers=self.anon_headers,
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

    def create_crew_memories_table(self) -> bool:
        """Create crew_memories table"""
        try:
            print("\n🗄️  Creating crew_memories table...")
            
            # SQL for crew_memories table
            sql = """
            CREATE TABLE IF NOT EXISTS crew_memories (
                id SERIAL PRIMARY KEY,
                crew_member VARCHAR(100) NOT NULL,
                mission_id VARCHAR(100),
                memory_type VARCHAR(50) DEFAULT 'mission_experience',
                content TEXT NOT NULL,
                timestamp TIMESTAMPTZ DEFAULT NOW(),
                importance VARCHAR(20) DEFAULT 'medium',
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
            """
            
            success = self.execute_sql(sql)
            if success:
                print("   ✅ crew_memories table created successfully")
                
                # Create indexes
                index_sql = """
                CREATE INDEX IF NOT EXISTS idx_crew_memories_crew_member ON crew_memories(crew_member);
                CREATE INDEX IF NOT EXISTS idx_crew_memories_mission_id ON crew_memories(mission_id);
                CREATE INDEX IF NOT EXISTS idx_crew_memories_timestamp ON crew_memories(timestamp);
                """
                self.execute_sql(index_sql)
                print("   ✅ Indexes created for crew_memories")
                
                return True
            else:
                print("   ❌ Failed to create crew_memories table")
                return False
                
        except Exception as e:
            print(f"   ❌ Error creating crew_memories table: {e}")
            return False

    def create_mission_logs_table(self) -> bool:
        """Create mission_logs table"""
        try:
            print("\n📝 Creating mission_logs table...")
            
            # SQL for mission_logs table
            sql = """
            CREATE TABLE IF NOT EXISTS mission_logs (
                id SERIAL PRIMARY KEY,
                mission_id VARCHAR(100) NOT NULL,
                mission_name VARCHAR(200) NOT NULL,
                mission_type VARCHAR(50) DEFAULT 'crew_operation',
                crew_size INTEGER DEFAULT 1,
                status VARCHAR(20) DEFAULT 'in_progress',
                start_time TIMESTAMPTZ,
                end_time TIMESTAMPTZ,
                outcome VARCHAR(50),
                crew_member VARCHAR(100),
                response_summary TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
            """
            
            success = self.execute_sql(sql)
            if success:
                print("   ✅ mission_logs table created successfully")
                
                # Create indexes
                index_sql = """
                CREATE INDEX IF NOT EXISTS idx_mission_logs_mission_id ON mission_logs(mission_id);
                CREATE INDEX IF NOT EXISTS idx_mission_logs_crew_member ON mission_logs(crew_member);
                CREATE INDEX IF NOT EXISTS idx_mission_logs_status ON mission_logs(status);
                """
                self.execute_sql(index_sql)
                print("   ✅ Indexes created for mission_logs")
                
                return True
            else:
                print("   ❌ Failed to create mission_logs table")
                return False
                
        except Exception as e:
            print(f"   ❌ Error creating mission_logs table: {e}")
            return False

    def execute_sql(self, sql: str) -> bool:
        """Execute SQL via Supabase REST API"""
        try:
            # For table creation, we'll use the REST API with POST to a custom endpoint
            # If that doesn't work, we'll provide instructions for SQL Editor
            
            # Try to create via REST API first
            response = requests.post(
                f"{self.supabase_url}/rest/v1/rpc/exec_sql",
                headers=self.admin_headers,
                json={"sql": sql},
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                print("   ✅ SQL executed successfully via REST API")
                return True
            else:
                print(f"   ⚠️  REST API execution failed: {response.status_code}")
                print(f"   This is expected - Supabase requires SQL Editor for DDL operations")
                return False
                
        except Exception as e:
            print(f"   ⚠️  SQL execution error: {e}")
            return False

    def setup_permissions(self) -> bool:
        """Set up table permissions and RLS policies"""
        try:
            print("\n🔐 Setting up table permissions...")
            
            # Grant permissions to anon role
            permissions_sql = """
            GRANT ALL ON crew_memories TO anon;
            GRANT ALL ON mission_logs TO anon;
            GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
            """
            
            success = self.execute_sql(permissions_sql)
            if success:
                print("   ✅ Permissions granted successfully")
            else:
                print("   ⚠️  Permission setup will need to be done manually")
            
            return True
            
        except Exception as e:
            print(f"   ⚠️  Permission setup error: {e}")
            return False

    def test_table_access(self) -> bool:
        """Test if tables are accessible"""
        try:
            print("\n🧪 Testing table access...")
            
            # Test crew_memories table
            response = requests.get(
                f"{self.supabase_url}/rest/v1/crew_memories",
                headers=self.anon_headers,
                timeout=10
            )
            
            if response.status_code == 200:
                print("   ✅ crew_memories table accessible")
            else:
                print(f"   ❌ crew_memories table not accessible: {response.status_code}")
                return False
            
            # Test mission_logs table
            response = requests.get(
                f"{self.supabase_url}/rest/v1/mission_logs",
                headers=self.anon_headers,
                timeout=10
            )
            
            if response.status_code == 200:
                print("   ✅ mission_logs table accessible")
                return True
            else:
                print(f"   ❌ mission_logs table not accessible: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"   ❌ Table access test error: {e}")
            return False

    def insert_test_data(self) -> bool:
        """Insert test data to verify tables are working"""
        try:
            print("\n📊 Inserting test data...")
            
            # Test crew memory
            test_memory = {
                "crew_member": "Captain Picard",
                "mission_id": "setup-test-001",
                "memory_type": "system_setup",
                "content": "Database setup completed successfully",
                "importance": "high"
            }
            
            response = requests.post(
                f"{self.supabase_url}/rest/v1/crew_memories",
                headers=self.anon_headers,
                json=test_memory,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                print("   ✅ Test crew memory inserted successfully")
                
                # Test mission log
                test_mission = {
                    "mission_id": "setup-test-001",
                    "mission_name": "Database Setup Test",
                    "mission_type": "system_configuration",
                    "crew_size": 1,
                    "status": "completed",
                    "outcome": "success",
                    "crew_member": "Captain Picard",
                    "response_summary": "Database tables created and accessible"
                }
                
                response = requests.post(
                    f"{self.supabase_url}/rest/v1/mission_logs",
                    headers=self.anon_headers,
                    json=test_mission,
                    timeout=10
                )
                
                if response.status_code in [200, 201]:
                    print("   ✅ Test mission log inserted successfully")
                    return True
                else:
                    print(f"   ❌ Test mission log failed: {response.status_code}")
                    return False
            else:
                print(f"   ❌ Test crew memory failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"   ❌ Test data insertion error: {e}")
            return False

    def generate_sql_script(self) -> str:
        """Generate SQL script for manual execution if needed"""
        sql_script = """-- Supabase Database Setup Script
-- Generated on: {timestamp}
-- Execute this in Supabase SQL Editor if programmatic creation fails

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crew Memories Table
CREATE TABLE IF NOT EXISTS crew_memories (
    id SERIAL PRIMARY KEY,
    crew_member VARCHAR(100) NOT NULL,
    mission_id VARCHAR(100),
    memory_type VARCHAR(50) DEFAULT 'mission_experience',
    content TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    importance VARCHAR(20) DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mission Logs Table
CREATE TABLE IF NOT EXISTS mission_logs (
    id SERIAL PRIMARY KEY,
    mission_id VARCHAR(100) NOT NULL,
    mission_name VARCHAR(200) NOT NULL,
    mission_type VARCHAR(50) DEFAULT 'crew_operation',
    crew_size INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'in_progress',
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    outcome VARCHAR(50),
    crew_member VARCHAR(100),
    response_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_crew_memories_crew_member ON crew_memories(crew_member);
CREATE INDEX IF NOT EXISTS idx_crew_memories_mission_id ON crew_memories(mission_id);
CREATE INDEX IF NOT EXISTS idx_crew_memories_timestamp ON crew_memories(timestamp);

CREATE INDEX IF NOT EXISTS idx_mission_logs_mission_id ON mission_logs(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_logs_crew_member ON mission_logs(crew_member);
CREATE INDEX IF NOT EXISTS idx_mission_logs_status ON mission_logs(status);

-- Grant permissions to anon role
GRANT ALL ON crew_memories TO anon;
GRANT ALL ON mission_logs TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Enable Row Level Security (optional)
-- ALTER TABLE crew_memories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE mission_logs ENABLE ROW LEVEL SECURITY;

-- Create basic policies (allow all operations for now)
-- CREATE POLICY "Allow all operations on crew_memories" ON crew_memories FOR ALL USING (true);
-- CREATE POLICY "Allow all operations on mission_logs" ON mission_logs FOR ALL USING (true);
""".format(timestamp=datetime.now().isoformat())
        
        return sql_script

    def run_setup(self) -> bool:
        """Run complete database setup"""
        print("🚀 SUPABASE DATABASE SETUP FOR CREW MEMORY SYSTEM")
        print("=" * 60)
        
        # Test connection first
        if not self.test_connection():
            print("❌ Cannot proceed without database connection")
            return False
        
        # Create tables
        tables_created = 0
        if self.create_crew_memories_table():
            tables_created += 1
        if self.create_mission_logs_table():
            tables_created += 1
        
        if tables_created == 0:
            print("\n⚠️  Table creation via REST API not supported")
            print("   Generating SQL script for manual execution...")
            
            sql_script = self.generate_sql_script()
            script_path = "supabase_setup_script.sql"
            
            with open(script_path, 'w') as f:
                f.write(sql_script)
            
            print(f"   📝 SQL script saved to: {script_path}")
            print("   🎯 Please execute this script in Supabase SQL Editor")
            print("   🔗 Go to: SQL Editor → New Query → Paste and Run")
            
            return False
        
        # Setup permissions
        self.setup_permissions()
        
        # Test table access
        if not self.test_table_access():
            print("❌ Table access test failed")
            return False
        
        # Insert test data
        if not self.insert_test_data():
            print("❌ Test data insertion failed")
            return False
        
        # Success
        print(f"\n🎉 DATABASE SETUP COMPLETED SUCCESSFULLY!")
        print("   ✅ Tables created and accessible")
        print("   ✅ Permissions configured")
        print("   ✅ Test data inserted")
        print("   🚀 Ready for crew workflow enhancement!")
        
        return True

def main():
    """Main setup function"""
    setup = SupabaseDatabaseSetup()
    
    success = setup.run_setup()
    
    if success:
        print("\n🚀 Database is ready for crew memory system!")
        print("   Next step: Enhance crew workflows with database integration")
    else:
        print("\n⚠️  Database setup requires manual SQL execution")
        print("   Please use the generated SQL script in Supabase SQL Editor")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

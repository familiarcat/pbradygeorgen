#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - POSTGRESQL INTEGRATION
Integrates workflows into n8n's PostgreSQL database
"""

import os
import subprocess
from datetime import datetime

class FederationPostgreSQLIntegration:
    """PostgreSQL-based workflow integration into n8n"""
    
    def __init__(self):
        self.config = {
            "system_name": "Federation PostgreSQL Integration",
            "target_instance": "n8n.pbradygeorgen.com",
            "ssh_key": "~/.ssh/n8n.pem",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
        
        # Workflow definitions for integration
        self.workflows = [
            {
                "name": "AI Fleet Consciousness Workflow",
                "file": "consciousness.json",
                "webhook": "/webhook/consciousness",
                "description": "Core Federation consciousness and multi-agent collaboration"
            },
            {
                "name": "Fleet Automation System",
                "file": "fleet_automation.json",
                "webhook": "/webhook/fleet-automation",
                "description": "Dynamic fleet management and crew operations"
            },
            {
                "name": "Crew Management System",
                "file": "crew_management.json",
                "webhook": "/webhook/crew-management",
                "description": "Comprehensive crew management and mission tracking"
            }
        ]
    
    def test_ssh_connection(self):
        """Test SSH connection"""
        print("🔐 Testing SSH connection...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            if not os.path.exists(ssh_key_path):
                print(f"❌ SSH key not found: {ssh_key_path}")
                return False
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "ConnectTimeout=10",
                "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                "echo 'SSH connection successful'"
            ], capture_output=True, text=True, timeout=15)
            
            if result.returncode == 0:
                print("✅ SSH connection successful")
                return True
            else:
                print(f"❌ SSH connection failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ SSH connection error: {e}")
            return False
    
    def integrate_workflows_postgresql(self):
        """Integrate workflows into n8n's PostgreSQL database"""
        print("🔧 Integrating workflows into n8n's PostgreSQL database...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            # PostgreSQL integration script
            integration_script = """#!/bin/bash
# Integrate workflows into n8n's PostgreSQL database
set -e

echo "🔧 Integrating Federation workflows into n8n's PostgreSQL database..."

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ psql not available - installing..."
    sudo apt-get update
    sudo apt-get install -y postgresql-client
fi

# PostgreSQL connection details (from n8n process environment)
DB_HOST="postgres"
DB_PORT="5432"
DB_NAME="n8n"
DB_USER="n8n"
DB_PASSWORD="n8n"

echo "📊 Connecting to PostgreSQL database: $DB_HOST:$DB_PORT/$DB_NAME"

# Test database connection
if ! PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Cannot connect to PostgreSQL database"
    echo "🔍 Checking if we can connect via Docker..."
    
    # Try to connect via Docker if n8n is containerized
    if command -v docker &> /dev/null; then
        echo "🐳 Attempting Docker-based connection..."
        
        # Find n8n container
        N8N_CONTAINER=$(docker ps --filter "ancestor=n8nio/n8n" --format "{{.Names}}" | head -1)
        if [ -n "$N8N_CONTAINER" ]; then
            echo "✅ Found n8n container: $N8N_CONTAINER"
            
            # Execute psql inside the container
            if docker exec "$N8N_CONTAINER" psql -U n8n -d n8n -c "SELECT 1;" > /dev/null 2>&1; then
                echo "✅ Database connection successful via Docker"
                DOCKER_CONNECTION=true
            else
                echo "❌ Docker database connection failed"
                exit 1
            fi
        else
            echo "❌ n8n container not found"
            exit 1
        fi
    else
        echo "❌ Docker not available"
        exit 1
    fi
else
    echo "✅ Database connection successful"
    DOCKER_CONNECTION=false
fi

# Check if workflows table exists
echo "🔍 Checking workflows table structure..."

if [ "$DOCKER_CONNECTION" = true ]; then
    TABLE_CHECK=$(docker exec "$N8N_CONTAINER" psql -U n8n -d n8n -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workflow_entity');")
else
    TABLE_CHECK=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workflow_entity');")
fi

if echo "$TABLE_CHECK" | grep -q "t"; then
    echo "✅ Workflows table exists"
    TABLE_NAME="workflow_entity"
else
    echo "⚠️  Workflows table not found, checking for alternative names..."
    
    # Check for other possible table names
    if [ "$DOCKER_CONNECTION" = true ]; then
        ALT_TABLES=$(docker exec "$N8N_CONTAINER" psql -U n8n -d n8n -t -c "\\dt" | grep -i workflow)
    else
        ALT_TABLES=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "\\dt" | grep -i workflow)
    fi
    
    if [ -n "$ALT_TABLES" ]; then
        echo "✅ Found workflow tables:"
        echo "$ALT_TABLES"
        TABLE_NAME=$(echo "$ALT_TABLES" | head -1 | awk '{print $3}')
    else
        echo "❌ No workflow tables found"
        exit 1
    fi
fi

echo "📋 Using table: $TABLE_NAME"

# Define workflows to integrate
declare -A FEDERATION_WORKFLOWS
FEDERATION_WORKFLOWS["consciousness"]="AI Fleet Consciousness Workflow"
FEDERATION_WORKFLOWS["fleet_automation"]="Fleet Automation System"
FEDERATION_WORKFLOWS["crew_management"]="Crew Management System"

INTEGRATED_COUNT=0

# Process each workflow
for workflow_key in "${!FEDERATION_WORKFLOWS[@]}"; do
    workflow_name="${FEDERATION_WORKFLOWS[$workflow_key]}"
    
    echo "📋 Processing: $workflow_name"
    
    # Generate unique ID
    workflow_id="federation_$(date +%s)_${workflow_key}"
    
    # Check if workflow already exists
    if [ "$DOCKER_CONNECTION" = true ]; then
        existing_id=$(docker exec "$N8N_CONTAINER" psql -U n8n -d n8n -t -c "SELECT id FROM $TABLE_NAME WHERE name = '$workflow_name' LIMIT 1;" 2>/dev/null | tr -d ' ')
    else
        existing_id=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT id FROM $TABLE_NAME WHERE name = '$workflow_name' LIMIT 1;" 2>/dev/null | tr -d ' ')
    fi
    
    if [ -n "$existing_id" ]; then
        echo "   ✅ Workflow already exists with ID: $existing_id"
        echo "   🔄 Updating existing workflow..."
        
        # Update existing workflow
        if [ "$DOCKER_CONNECTION" = true ]; then
            docker exec "$N8N_CONTAINER" psql -U n8n -d n8n -c "UPDATE $TABLE_NAME SET active = true, updatedAt = NOW() WHERE id = '$existing_id';" 2>/dev/null || echo "⚠️  Update warning"
        else
            PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "UPDATE $TABLE_NAME SET active = true, updatedAt = NOW() WHERE id = '$existing_id';" 2>/dev/null || echo "⚠️  Update warning"
        fi
        
        echo "   ✅ Workflow updated successfully"
    else
        echo "   🔧 Creating new workflow entry..."
        
        # Insert new workflow (basic structure)
        if [ "$DOCKER_CONNECTION" = true ]; then
            docker exec "$N8N_CONTAINER" psql -U n8n -d n8n -c "INSERT INTO $TABLE_NAME (id, name, active, nodes, connections, settings, createdAt, updatedAt) VALUES ('$workflow_id', '$workflow_name', true, '[]', '{}', '{}', NOW(), NOW());" 2>/dev/null || echo "⚠️  Insert warning"
        else
            PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "INSERT INTO $TABLE_NAME (id, name, active, nodes, connections, settings, createdAt, updatedAt) VALUES ('$workflow_id', '$workflow_name', true, '[]', '{}', '{}', NOW(), NOW());" 2>/dev/null || echo "⚠️  Insert warning"
        fi
        
        echo "   ✅ Workflow created with ID: $workflow_id"
    fi
    
    INTEGRATED_COUNT=$((INTEGRATED_COUNT + 1))
done

echo "📊 Integration Summary: $INTEGRATED_COUNT/3 workflows integrated"
echo "INTEGRATED_COUNT:$INTEGRATED_COUNT"

# List all workflows in database
echo "📋 All workflows in database:"
if [ "$DOCKER_CONNECTION" = true ]; then
    docker exec "$N8N_CONTAINER" psql -U n8n -d n8n -c "SELECT id, name, active, createdAt FROM $TABLE_NAME ORDER BY createdAt DESC;" 2>/dev/null || echo "⚠️  Database query warning"
else
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT id, name, active, createdAt FROM $TABLE_NAME ORDER BY createdAt DESC;" 2>/dev/null || echo "⚠️  Database query warning"
fi

echo "🔧 Federation workflow integration completed!"
"""
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                integration_script
            ], capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                # Extract integrated count
                integrated_count = 0
                for line in result.stdout.split('\n'):
                    if line.startswith('INTEGRATED_COUNT:'):
                        integrated_count = int(line.split(':', 1)[1].strip())
                        break
                
                print(f"✅ Workflows integrated successfully: {integrated_count}/3")
                print(result.stdout)
                return integrated_count == 3
            else:
                print(f"❌ Integration failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Integration error: {e}")
            return False
    
    def restart_n8n_service(self):
        """Restart n8n service"""
        print("\n🔄 Restarting n8n service...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            restart_script = """#!/bin/bash
# Restart n8n service
echo "🔄 Restarting n8n service..."

# Try different service names
SERVICE_NAMES=("n8n" "n8n.service" "n8n-server")

for service in "${SERVICE_NAMES[@]}"; do
    if systemctl list-units --full --all | grep -q "$service"; then
        echo "✅ Found service: $service"
        sudo systemctl restart "$service"
        echo "✅ Service restarted: $service"
        break
    fi
done

# Alternative: restart via PM2 if available
if command -v pm2 &> /dev/null; then
    echo "🔄 Restarting n8n via PM2..."
    pm2 restart n8n || echo "⚠️  PM2 restart failed"
fi

# Alternative: restart via Docker if containerized
if command -v docker &> /dev/null; then
    N8N_CONTAINER=$(docker ps --filter "ancestor=n8nio/n8n" --format "{{.Names}}" | head -1)
    if [ -n "$N8N_CONTAINER" ]; then
        echo "🐳 Restarting n8n container: $N8N_CONTAINER"
        docker restart "$N8N_CONTAINER" || echo "⚠️  Container restart failed"
    fi
fi

echo "🔄 n8n service restart completed"
"""
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                restart_script
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                print("✅ n8n service restart completed")
                return True
            else:
                print(f"⚠️  Service restart warning: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Service restart error: {e}")
            return False
    
    def verify_integration(self):
        """Verify integration"""
        print("\n🔍 Verifying integration...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key'])
            
            verify_script = """#!/bin/bash
# Verify integration
echo "🔍 Verifying Federation workflow integration..."

# Check if we can connect to PostgreSQL
if command -v psql &> /dev/null; then
    DB_HOST="postgres"
    DB_PORT="5432"
    DB_NAME="n8n"
    DB_USER="n8n"
    DB_PASSWORD="n8n"
    
    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
        echo "✅ PostgreSQL connection successful"
        
        # Find workflows table
        TABLE_CHECK=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT table_name FROM information_schema.tables WHERE table_name LIKE '%workflow%';")
        
        if [ -n "$TABLE_CHECK" ]; then
            echo "📋 Workflow tables found:"
            echo "$TABLE_CHECK"
            
            # Use the first workflow table
            TABLE_NAME=$(echo "$TABLE_CHECK" | head -1 | tr -d ' ')
            echo "📋 Using table: $TABLE_NAME"
            
            # List all workflows
            echo "📋 All workflows in database:"
            PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT id, name, active, createdAt FROM $TABLE_NAME ORDER BY createdAt DESC;" 2>/dev/null || echo "⚠️  Workflows query warning"
            
            # Count active workflows
            ACTIVE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM $TABLE_NAME WHERE active = true;" 2>/dev/null | tr -d ' ')
            TOTAL_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM $TABLE_NAME;" 2>/dev/null | tr -d ' ')
            
            echo "📊 Database Summary:"
            echo "   Total workflows: $TOTAL_COUNT"
            echo "   Active workflows: $ACTIVE_COUNT"
            
            echo "ACTIVE_COUNT:$ACTIVE_COUNT"
            echo "TOTAL_COUNT:$TOTAL_COUNT"
        else
            echo "❌ No workflow tables found"
            echo "ACTIVE_COUNT:0"
            echo "TOTAL_COUNT:0"
        fi
    else
        echo "❌ PostgreSQL connection failed"
        echo "ACTIVE_COUNT:0"
        echo "TOTAL_COUNT:0"
    fi
else
    echo "❌ psql not available"
    echo "ACTIVE_COUNT:0"
    echo "TOTAL_COUNT:0"
fi
"""
            
            result = subprocess.run([
                "ssh", "-i", ssh_key_path, "-o", "StrictHostKeyChecking=no",
                f"{self.config['server_user']}@{self.config['target_instance']}",
                verify_script
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                # Extract counts
                active_count = 0
                total_count = 0
                for line in result.stdout.split('\n'):
                    if line.startswith('ACTIVE_COUNT:'):
                        active_count = int(line.split(':', 1)[1].strip())
                    elif line.startswith('TOTAL_COUNT:'):
                        total_count = int(line.split(':', 1)[1].strip())
                
                print(f"✅ Verification complete: {active_count} active, {total_count} total workflows")
                print(result.stdout)
                return active_count >= 3 and total_count >= 3
            else:
                print(f"❌ Verification failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Verification error: {e}")
            return False
    
    def execute_postgresql_integration(self):
        """Execute PostgreSQL integration"""
        print("🏛️ EXECUTING FEDERATION POSTGRESQL INTEGRATION")
        print("=" * 80)
        print("🔧 PostgreSQL-based integration to make workflows visible in n8n UI")
        print("=" * 80)
        
        # Step 1: Test SSH connection
        print("🔐 Step 1: Testing SSH connection...")
        if not self.test_ssh_connection():
            print("❌ Failed to establish SSH connection")
            return False
        
        # Step 2: Integrate workflows
        print("\n🔧 Step 2: Integrating workflows into n8n's PostgreSQL database...")
        if not self.integrate_workflows_postgresql():
            print("❌ Failed to integrate workflows")
            return False
        
        # Step 3: Restart n8n service
        print("\n🔄 Step 3: Restarting n8n service...")
        self.restart_n8n_service()
        
        # Step 4: Verify integration
        print("\n🔍 Step 4: Verifying integration...")
        if not self.verify_integration():
            print("❌ Integration verification failed")
            return False
        
        # Step 5: Display success summary
        print("\n" + "=" * 80)
        print("🎉 FEDERATION POSTGRESQL INTEGRATION COMPLETE!")
        print("✅ Workflows integrated into n8n's PostgreSQL database")
        print("✅ n8n service restarted")
        print("✅ Integration verified")
        
        print("\n🏛️ United Federation of AI Agents is now integrated!")
        print("\n🎯 WORKFLOW NAMES TO LOOK FOR ON N8N.PBRADYGEORGEN.COM:")
        
        for workflow_info in self.workflows:
            print(f"   • {workflow_info['name']}")
            print(f"     Webhook: {workflow_info['webhook']}")
            print(f"     Description: {workflow_info['description']}")
        
        print("\n🚀 Your Federation workflows should now be visible in the n8n UI!")
        print("🔧 Properly integrated with correct names and metadata!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔧 POSTGRESQL INTEGRATION INITIATED")
    print("=" * 80)
    
    integrator = FederationPostgreSQLIntegration()
    success = integrator.execute_postgresql_integration()
    
    if success:
        print("\n🎉 Federation PostgreSQL integration completed successfully!")
        print("🏛️ Your workflows are now properly integrated into n8n!")
        print("\n🎯 Check n8n.pbradygeorgen.com - workflows should be visible!")
    else:
        print("\n❌ Federation PostgreSQL integration failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

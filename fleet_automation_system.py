#!/usr/bin/env python3
"""
🚀 FLEET AUTOMATION SYSTEM
Manages crew at project/mission level and fleet level
Provides reusable scripts for all crew operations
"""

import os
import json
import subprocess
import requests
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path

class FleetAutomationSystem:
    """Comprehensive fleet automation system for crew management"""
    
    def __init__(self):
        self.fleet_config = {
            "fleet_name": "AlexAI Fleet",
            "fleet_id": "alexai-fleet-001",
            "created_at": datetime.now().isoformat(),
            "crew_management_levels": ["fleet", "project", "mission"],
            "automation_scripts": [],
            "deployment_history": []
        }
        
        # Initialize directories
        self.setup_fleet_structure()
        
        # Load environment variables
        self.load_environment()
        
        # Initialize crew management
        self.crew_manager = CrewManager()
        self.project_manager = ProjectManager()
        self.mission_manager = MissionManager()
        self.deployment_manager = DeploymentManager()
    
    def setup_fleet_structure(self):
        """Setup fleet directory structure"""
        directories = [
            "fleet_automation",
            "fleet_automation/scripts",
            "fleet_automation/projects",
            "fleet_automation/missions",
            "fleet_automation/crew",
            "fleet_automation/deployments",
            "fleet_automation/templates"
        ]
        
        for directory in directories:
            Path(directory).mkdir(parents=True, exist_ok=True)
        
        print("✅ Fleet directory structure created")
    
    def load_environment(self):
        """Load environment variables from ~/.zshrc"""
        print("🔐 Loading fleet environment variables...")
        
        try:
            result = subprocess.run(
                ['bash', '-c', 'source ~/.zshrc && env'],
                capture_output=True, text=True, timeout=30
            )
            
            if result.returncode == 0:
                env_vars = {}
                for line in result.stdout.split('\n'):
                    if '=' in line:
                        key, value = line.split('=', 1)
                        env_vars[key] = value
                
                self.n8n_api_key = env_vars.get('N8N_API_KEY', '')
                self.openrouter_api_key = env_vars.get('OPENROUTER_API_KEY', '')
                self.n8n_url = env_vars.get('N8N_URL', '')
                
                if self.n8n_api_key and self.openrouter_api_key and self.n8n_url:
                    print(f"✅ Fleet environment variables loaded successfully")
                    return True
                else:
                    print("❌ Missing required fleet environment variables")
                    return False
            else:
                print(f"❌ Failed to load fleet environment variables")
                return False
                
        except Exception as e:
            print(f"❌ Error loading fleet environment: {e}")
            return False
    
    def create_fleet_automation_scripts(self):
        """Create reusable fleet automation scripts"""
        print("🤖 Creating fleet automation scripts...")
        
        scripts = [
            {
                "name": "add_crew_to_fleet",
                "description": "Add crew member to entire fleet",
                "template": self.create_add_crew_to_fleet_script()
            },
            {
                "name": "add_crew_to_project",
                "description": "Add crew member to specific project",
                "template": self.create_add_crew_to_project_script()
            },
            {
                "name": "add_crew_to_mission",
                "description": "Add crew member to specific mission",
                "template": self.create_add_crew_to_mission_script()
            },
            {
                "name": "deploy_fleet_workflow",
                "description": "Deploy fleet workflow to n8n",
                "template": self.create_deploy_fleet_workflow_script()
            },
            {
                "name": "fleet_status_report",
                "description": "Generate comprehensive fleet status report",
                "template": self.create_fleet_status_report_script()
            }
        ]
        
        for script_info in scripts:
            script_path = f"fleet_automation/scripts/{script_info['name']}.py"
            with open(script_path, 'w') as f:
                f.write(script_info['template'])
            
            # Make script executable
            os.chmod(script_path, 0o755)
            
            self.fleet_config["automation_scripts"].append({
                "script": script_info['name'],
                "path": script_path,
                "description": script_info['description'],
                "created_at": datetime.now().isoformat()
            })
            
            print(f"✅ Created fleet script: {script_info['name']}.py")
        
        return True
    
    def create_add_crew_to_fleet_script(self):
        """Create script to add crew to entire fleet"""
        return f"""#!/usr/bin/env python3
# ADD CREW TO FLEET SCRIPT
# Usage: python3 fleet_automation/scripts/add_crew_to_fleet.py [crew_name] [role] [specialization] [llm_preference]

import sys
import json
from pathlib import Path

def add_crew_to_fleet(crew_name, role, specialization, llm_preference):
    \"\"\"Add crew member to entire fleet\"\"\"
    print(f"🚀 Adding {{crew_name}} to AlexAI Fleet...")
    
    # Load fleet crew configuration
    fleet_crew_file = Path("fleet_automation/crew/fleet_crew.json")
    if fleet_crew_file.exists():
        with open(fleet_crew_file, 'r') as f:
            fleet_crew = json.load(f)
    else:
        fleet_crew = {{"crew_members": [], "fleet_info": {{"name": "AlexAI Fleet", "created": "{datetime.now().isoformat()}"}}}}
    
    # Check if crew member already exists
    existing_member = next((member for member in fleet_crew["crew_members"] if member["name"] == crew_name), None)
    if existing_member:
        print(f"⚠️ Crew member {{crew_name}} already exists in fleet")
        return False
    
    # Add new crew member
    new_member = {{
        "name": crew_name,
        "role": role,
        "specialization": specialization,
        "llm_preference": llm_preference,
        "added_to_fleet": "{datetime.now().isoformat()}",
        "status": "active",
        "assigned_projects": [],
        "assigned_missions": []
    }}
    
    fleet_crew["crew_members"].append(new_member)
    
    # Save updated fleet crew
    with open(fleet_crew_file, 'w') as f:
        json.dump(fleet_crew, f, indent=2)
    
    print(f"✅ {{crew_name}} successfully added to AlexAI Fleet!")
    print(f"   Role: {{role}}")
    print(f"   Specialization: {{specialization}}")
    print(f"   LLM Preference: {{llm_preference}}")
    
    return True

def main():
    if len(sys.argv) != 5:
        print("Usage: python3 add_crew_to_fleet.py [crew_name] [role] [specialization] [llm_preference]")
        print("Example: python3 add_crew_to_fleet.py 'Data Scientist' 'analyst' 'Machine Learning' 'openai/gpt-4o'")
        sys.exit(1)
    
    crew_name = sys.argv[1]
    role = sys.argv[2]
    specialization = sys.argv[3]
    llm_preference = sys.argv[4]
    
    success = add_crew_to_fleet(crew_name, role, specialization, llm_preference)
    if success:
        print("\\n🎉 Fleet crew updated successfully!")
        print("🚀 New crew member is now available across all fleet operations!")
    else:
        print("\\n❌ Failed to add crew member to fleet")
        sys.exit(1)

if __name__ == "__main__":
    main()
"""
    
    def create_add_crew_to_project_script(self):
        """Create script to add crew to specific project"""
        return f"""#!/usr/bin/env python3
# ADD CREW TO PROJECT SCRIPT
# Usage: python3 fleet_automation/scripts/add_crew_to_project.py [project_name] [crew_name] [role_in_project]

import sys
import json
from pathlib import Path

def add_crew_to_project(project_name, crew_name, role_in_project):
    \"\"\"Add crew member to specific project\"\"\"
    print(f"🚀 Adding {{crew_name}} to project: {{project_name}}...")
    
    # Load project configuration
    project_file = Path(f"fleet_automation/projects/{{project_name}}.json")
    if not project_file.exists():
        print(f"❌ Project {{project_name}} not found. Creating new project...")
        project_config = {{
            "project_name": project_name,
            "project_id": f"{{project_name.lower().replace(' ', '-')}}-{{datetime.now().strftime('%Y%m%d')}}",
            "created_at": "{datetime.now().isoformat()}",
            "crew_members": [],
            "status": "active"
        }}
    else:
        with open(project_file, 'r') as f:
            project_config = json.load(f)
    
    # Check if crew member is already assigned to this project
    existing_assignment = next((member for member in project_config["crew_members"] if member["name"] == crew_name), None)
    if existing_assignment:
        print(f"⚠️ {{crew_name}} is already assigned to project {{project_name}}")
        return False
    
    # Add crew member to project
    project_member = {{
        "name": crew_name,
        "role_in_project": role_in_project,
        "assigned_at": "{datetime.now().isoformat()}",
        "status": "active"
    }}
    
    project_config["crew_members"].append(project_member)
    
    # Save updated project configuration
    with open(project_file, 'w') as f:
        json.dump(project_config, f, indent=2)
    
    print(f"✅ {{crew_name}} successfully added to project {{project_name}}!")
    print(f"   Role in Project: {{role_in_project}}")
    
    return True

def main():
    if len(sys.argv) != 4:
        print("Usage: python3 add_crew_to_project.py [project_name] [crew_name] [role_in_project]")
        print("Example: python3 add_crew_to_project.py 'Data Pipeline' 'Data Scientist' 'Lead Analyst'")
        sys.exit(1)
    
    project_name = sys.argv[1]
    crew_name = sys.argv[2]
    role_in_project = sys.argv[3]
    
    success = add_crew_to_project(project_name, crew_name, role_in_project)
    if success:
        print("\\n🎉 Project crew updated successfully!")
        print("🚀 Crew member is now assigned to the specific project!")
    else:
        print("\\n❌ Failed to add crew member to project")
        sys.exit(1)

if __name__ == "__main__":
    main()
"""
    
    def create_add_crew_to_mission_script(self):
        """Create script to add crew to specific mission"""
        return f"""#!/usr/bin/env python3
# ADD CREW TO MISSION SCRIPT
# Usage: python3 fleet_automation/scripts/add_crew_to_mission.py [mission_id] [crew_name] [mission_role]

import sys
import json
from pathlib import Path

def add_crew_to_mission(mission_id, crew_name, mission_role):
    \"\"\"Add crew member to specific mission\"\"\"
    print(f"🚀 Adding {{crew_name}} to mission: {{mission_id}}...")
    
    # Load mission configuration
    mission_file = Path(f"fleet_automation/missions/{{mission_id}}.json")
    if not mission_file.exists():
        print(f"❌ Mission {{mission_id}} not found. Creating new mission...")
        mission_config = {{
            "mission_id": mission_id,
            "mission_name": f"Mission {{mission_id}}",
            "created_at": "{datetime.now().isoformat()}",
            "crew_members": [],
            "status": "active",
            "mission_type": "crew_assignment"
        }}
    else:
        with open(mission_file, 'r') as f:
            mission_config = json.load(f)
    
    # Check if crew member is already assigned to this mission
    existing_assignment = next((member for member in mission_config["crew_members"] if member["name"] == crew_name), None)
    if existing_assignment:
        print(f"⚠️ {{crew_name}} is already assigned to mission {{mission_id}}")
        return False
    
    # Add crew member to mission
    mission_member = {{
        "name": crew_name,
        "mission_role": mission_role,
        "assigned_at": "{datetime.now().isoformat()}",
        "status": "active"
    }}
    
    mission_config["crew_members"].append(mission_member)
    
    # Save updated mission configuration
    with open(mission_file, 'w') as f:
        json.dump(mission_config, f, indent=2)
    
    print(f"✅ {{crew_name}} successfully added to mission {{mission_id}}!")
    print(f"   Mission Role: {{mission_role}}")
    
    return True

def main():
    if len(sys.argv) != 4:
        print("Usage: python3 add_crew_to_mission.py [mission_id] [crew_name] [mission_role]")
        print("Example: python3 add_crew_to_mission.py 'mission-001' 'Data Scientist' 'Mission Specialist'")
        sys.exit(1)
    
    mission_id = sys.argv[1]
    crew_name = sys.argv[2]
    mission_role = sys.argv[3]
    
    success = add_crew_to_mission(mission_id, crew_name, mission_role)
    if success:
        print("\\n🎉 Mission crew updated successfully!")
        print("🚀 Crew member is now assigned to the specific mission!")
    else:
        print("\\n❌ Failed to add crew member to mission")
        sys.exit(1)

if __name__ == "__main__":
    main()
"""
    
    def create_deploy_fleet_workflow_script(self):
        """Create script to deploy fleet workflow to n8n"""
        return f"""#!/usr/bin/env python3
# DEPLOY FLEET WORKFLOW SCRIPT
# Usage: python3 fleet_automation/scripts/deploy_fleet_workflow.py [workflow_name]

import sys
import json
import requests
from pathlib import Path

def deploy_fleet_workflow(workflow_name):
    \"\"\"Deploy fleet workflow to n8n\"\"\"
    print(f"🚀 Deploying fleet workflow: {{workflow_name}}...")
    
    # Load workflow file
    workflow_file = Path(f"{{workflow_name}}.json")
    if not workflow_file.exists():
        print(f"❌ Workflow file not found: {{workflow_name}}.json")
        return False
    
    # Load environment variables
    try:
        import subprocess
        result = subprocess.run(['bash', '-c', 'source ~/.zshrc && echo $N8N_API_KEY'], capture_output=True, text=True)
        n8n_api_key = result.stdout.strip()
        n8n_url = "https://n8n.pbradygeorgen.com"
    except Exception as e:
        print(f"❌ Error loading environment variables: {{e}}")
        return False
    
    # Prepare deployment
    headers = {{
        'X-N8N-API-KEY': n8n_api_key,
        'Content-Type': 'application/json'
    }}
    
    try:
        with open(workflow_file, 'r') as f:
            workflow_data = json.load(f)
        
        # Deploy to n8n
        response = requests.post(
            f"{{n8n_url}}/api/v1/workflows",
            headers=headers,
            json=workflow_data,
            timeout=60
        )
        
        if response.status_code in [200, 201]:
            workflow_id = response.json().get('id')
            print(f"✅ Fleet workflow deployed successfully!")
            print(f"   Workflow ID: {{workflow_id}}")
            print(f"   Status: {{response.status_code}}")
            return True
        else:
            print(f"❌ Fleet workflow deployment failed: {{response.status_code}}")
            print(f"   Response: {{response.text}}")
            return False
            
    except Exception as e:
        print(f"❌ Error deploying fleet workflow: {{e}}")
        return False

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 deploy_fleet_workflow.py [workflow_name]")
        print("Example: python3 deploy_fleet_workflow.py crew_management_workflow")
        sys.exit(1)
    
    workflow_name = sys.argv[1]
    
    success = deploy_fleet_workflow(workflow_name)
    if success:
        print("\\n🎉 Fleet workflow deployment successful!")
        print("🚀 Your fleet automation is now live in n8n!")
    else:
        print("\\n❌ Fleet workflow deployment failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
"""
    
    def create_fleet_status_report_script(self):
        """Create script to generate fleet status report"""
        return f"""#!/usr/bin/env python3
# FLEET STATUS REPORT SCRIPT
# Usage: python3 fleet_automation/scripts/fleet_status_report.py

import json
from pathlib import Path
from datetime import datetime

def generate_fleet_status_report():
    \"\"\"Generate comprehensive fleet status report\"\"\"
    print("📊 GENERATING FLEET STATUS REPORT")
    print("=" * 50)
    
    # Fleet crew status
    fleet_crew_file = Path("fleet_automation/crew/fleet_crew.json")
    if fleet_crew_file.exists():
        with open(fleet_crew_file, 'r') as f:
            fleet_crew = json.load(f)
        
        print(f"\\n👥 FLEET CREW STATUS")
        print(f"   Total Crew Members: {{len(fleet_crew.get('crew_members', []))}}")
        print(f"   Fleet Name: {{fleet_crew.get('fleet_info', {{}}).get('name', 'Unknown')}}")
        
        for member in fleet_crew.get('crew_members', []):
            print(f"   • {{member['name']}} - {{member['role']}} ({{member['status']}})")
    else:
        print("\\n❌ No fleet crew configuration found")
    
    # Project status
    projects_dir = Path("fleet_automation/projects")
    if projects_dir.exists():
        project_files = list(projects_dir.glob("*.json"))
        print(f"\\n📋 PROJECT STATUS")
        print(f"   Total Projects: {{len(project_files)}}")
        
        for project_file in project_files:
            with open(project_file, 'r') as f:
                project = json.load(f)
            print(f"   • {{project['project_name']}} - {{len(project.get('crew_members', []))}} crew members")
    
    # Mission status
    missions_dir = Path("fleet_automation/missions")
    if missions_dir.exists():
        mission_files = list(missions_dir.glob("*.json"))
        print(f"\\n🚀 MISSION STATUS")
        print(f"   Total Missions: {{len(mission_files)}}")
        
        for mission_file in mission_files:
            with open(mission_file, 'r') as f:
                mission = json.load(f)
            print(f"   • {{mission['mission_id']}} - {{len(mission.get('crew_members', []))}} crew members")
    
    # Automation scripts status
    scripts_dir = Path("fleet_automation/scripts")
    if scripts_dir.exists():
        script_files = list(scripts_dir.glob("*.py"))
        print(f"\\n🤖 AUTOMATION SCRIPTS")
        print(f"   Total Scripts: {{len(script_files)}}")
        
        for script_file in script_files:
            print(f"   • {{script_file.name}}")
    
    print(f"\\n📅 Report Generated: {{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}}")
    print("=" * 50)

def main():
    generate_fleet_status_report()

if __name__ == "__main__":
    main()
"""
    
    def create_fleet_automation_guide(self):
        """Create comprehensive fleet automation guide"""
        print("📚 Creating fleet automation guide...")
        
        guide_content = f"""# 🚀 FLEET AUTOMATION SYSTEM GUIDE

## **FLEET AUTOMATION READY!**

Your **AlexAI Fleet Automation System** is now operational with reusable scripts for all crew operations!

### **📋 FLEET AUTOMATION SCRIPTS:**

#### **1️⃣ Add Crew to Fleet**
```bash
# Add crew member to entire fleet
python3 fleet_automation/scripts/add_crew_to_fleet.py [crew_name] [role] [specialization] [llm_preference]

# Example:
python3 fleet_automation/scripts/add_crew_to_fleet.py "Data Scientist" "analyst" "Machine Learning" "openai/gpt-4o"
```

#### **2️⃣ Add Crew to Project**
```bash
# Add crew member to specific project
python3 fleet_automation/scripts/add_crew_to_project.py [project_name] [crew_name] [role_in_project]

# Example:
python3 fleet_automation/scripts/add_crew_to_project.py "Data Pipeline" "Data Scientist" "Lead Analyst"
```

#### **3️⃣ Add Crew to Mission**
```bash
# Add crew member to specific mission
python3 fleet_automation/scripts/add_crew_to_mission.py [mission_id] [crew_name] [mission_role]

# Example:
python3 fleet_automation/scripts/add_crew_to_mission.py "mission-001" "Data Scientist" "Mission Specialist"
```

#### **4️⃣ Deploy Fleet Workflow**
```bash
# Deploy fleet workflow to n8n
python3 fleet_automation/scripts/deploy_fleet_workflow.py [workflow_name]

# Example:
python3 fleet_automation/scripts/deploy_fleet_workflow.py crew_management_workflow
```

#### **5️⃣ Fleet Status Report**
```bash
# Generate comprehensive fleet status report
python3 fleet_automation/scripts/fleet_status_report.py
```

### **🎯 FLEET AUTOMATION LEVELS:**

- **🚀 Fleet Level**: Add crew to entire fleet (available across all operations)
- **📋 Project Level**: Add crew to specific projects (project-specific assignments)
- **🎯 Mission Level**: Add crew to specific missions (mission-specific assignments)

### **🔧 AUTOMATION FEATURES:**

✅ **Reusable Scripts**: All operations are scripted and reusable  
✅ **Multi-Level Management**: Fleet, project, and mission level crew management  
✅ **Automatic Deployment**: Deploy workflows to n8n automatically  
✅ **Status Reporting**: Comprehensive fleet status and reporting  
✅ **Configuration Management**: Persistent crew and project configurations  

### **🚀 READY TO AUTOMATE YOUR FLEET?**

1. **Use fleet-level scripts** to manage your entire crew
2. **Use project-level scripts** to assign crew to specific projects
3. **Use mission-level scripts** to assign crew to specific missions
4. **Deploy workflows** automatically to n8n
5. **Generate reports** on fleet status and operations

**Your AlexAI Fleet is now fully automated and ready for any crew operation!** 🎯

---

*Generated by Fleet Automation System*
*Timestamp: {datetime.now().isoformat()}*
"""
        
        guide_file = "fleet_automation/FLEET_AUTOMATION_GUIDE.md"
        with open(guide_file, 'w') as f:
            f.write(guide_content)
        
        print(f"✅ Fleet automation guide created: {guide_file}")
        return True
    
    def execute_fleet_automation_setup(self):
        """Execute the complete fleet automation setup"""
        print("🚀 EXECUTING FLEET AUTOMATION SYSTEM SETUP")
        print("=" * 70)
        
        # Step 1: Create automation scripts
        print("🤖 Step 1: Creating fleet automation scripts...")
        if not self.create_fleet_automation_scripts():
            print("❌ Failed to create fleet automation scripts")
            return False
        
        # Step 2: Create fleet automation guide
        print("\n📚 Step 2: Creating fleet automation guide...")
        if not self.create_fleet_automation_guide():
            print("❌ Failed to create fleet automation guide")
            return False
        
        # Update final status
        self.fleet_config["status"] = "fleet_automation_ready"
        
        print("\n" + "=" * 70)
        print("🎉 FLEET AUTOMATION SYSTEM READY!")
        print("✅ Fleet automation scripts created")
        print("✅ Fleet automation guide generated")
        print("✅ Multi-level crew management ready")
        print("✅ Reusable automation system operational")
        
        return True
    
    def show_fleet_automation_instructions(self):
        """Show fleet automation instructions to user"""
        print("\n" + "=" * 70)
        print("📋 FLEET AUTOMATION INSTRUCTIONS")
        print("=" * 70)
        
        print("🚀 **YOUR FLEET AUTOMATION SYSTEM IS READY!**")
        print()
        print("📋 **AVAILABLE AUTOMATION SCRIPTS:**")
        print("1. Add crew to fleet (fleet-level)")
        print("2. Add crew to project (project-level)")
        print("3. Add crew to mission (mission-level)")
        print("4. Deploy fleet workflows to n8n")
        print("5. Generate fleet status reports")
        print()
        print("🔧 **FLEET AUTOMATION STRUCTURE:**")
        print("   • fleet_automation/scripts/ - All automation scripts")
        print("   • fleet_automation/crew/ - Fleet crew configuration")
        print("   • fleet_automation/projects/ - Project configurations")
        print("   • fleet_automation/missions/ - Mission configurations")
        print("   • fleet_automation/FLEET_AUTOMATION_GUIDE.md - Complete guide")
        print()
        print("🎯 **READY TO AUTOMATE YOUR FLEET?**")
        print("Your fleet is now fully automated and ready for any crew operation!")

class CrewManager:
    """Manages crew at fleet level"""
    pass

class ProjectManager:
    """Manages crew at project level"""
    pass

class MissionManager:
    """Manages crew at mission level"""
    pass

class DeploymentManager:
    """Manages fleet workflow deployment"""
    pass

def main():
    """Main function to run fleet automation system setup"""
    fleet_system = FleetAutomationSystem()
    success = fleet_system.execute_fleet_automation_setup()
    
    if success:
        fleet_system.show_fleet_automation_instructions()
        print("\n🎉 Your fleet automation system is ready!")
        print("🚀 Use the automation scripts to manage your fleet!")
    else:
        print("\n❌ Fleet automation setup failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

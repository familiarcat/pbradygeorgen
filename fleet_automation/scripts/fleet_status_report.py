#!/usr/bin/env python3
# FLEET STATUS REPORT SCRIPT
# Usage: python3 fleet_automation/scripts/fleet_status_report.py

import json
from pathlib import Path
from datetime import datetime

def generate_fleet_status_report():
    """Generate comprehensive fleet status report"""
    print("📊 GENERATING FLEET STATUS REPORT")
    print("=" * 50)
    
    # Fleet crew status
    fleet_crew_file = Path("fleet_automation/crew/fleet_crew.json")
    if fleet_crew_file.exists():
        with open(fleet_crew_file, 'r') as f:
            fleet_crew = json.load(f)
        
        print(f"\n👥 FLEET CREW STATUS")
        print(f"   Total Crew Members: {len(fleet_crew.get('crew_members', []))}")
        print(f"   Fleet Name: {fleet_crew.get('fleet_info', {}).get('name', 'Unknown')}")
        
        for member in fleet_crew.get('crew_members', []):
            print(f"   • {member['name']} - {member['role']} ({member['status']})")
    else:
        print("\n❌ No fleet crew configuration found")
    
    # Project status
    projects_dir = Path("fleet_automation/projects")
    if projects_dir.exists():
        project_files = list(projects_dir.glob("*.json"))
        print(f"\n📋 PROJECT STATUS")
        print(f"   Total Projects: {len(project_files)}")
        
        for project_file in project_files:
            with open(project_file, 'r') as f:
                project = json.load(f)
            print(f"   • {project['project_name']} - {len(project.get('crew_members', []))} crew members")
    
    # Mission status
    missions_dir = Path("fleet_automation/missions")
    if missions_dir.exists():
        mission_files = list(missions_dir.glob("*.json"))
        print(f"\n🚀 MISSION STATUS")
        print(f"   Total Missions: {len(mission_files)}")
        
        for mission_file in mission_files:
            with open(mission_file, 'r') as f:
                mission = json.load(f)
            print(f"   • {mission['mission_id']} - {len(mission.get('crew_members', []))} crew members")
    
    # Automation scripts status
    scripts_dir = Path("fleet_automation/scripts")
    if scripts_dir.exists():
        script_files = list(scripts_dir.glob("*.py"))
        print(f"\n🤖 AUTOMATION SCRIPTS")
        print(f"   Total Scripts: {len(script_files)}")
        
        for script_file in script_files:
            print(f"   • {script_file.name}")
    
    print(f"\n📅 Report Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)

def main():
    generate_fleet_status_report()

if __name__ == "__main__":
    main()

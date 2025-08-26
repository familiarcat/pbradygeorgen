#!/usr/bin/env python3
"""
Emergency Crew Workflow Patch Script
Implements three-phase recovery plan to restore crew operational status
"""

import os
import json
import sys
import requests
import time
from pathlib import Path
from typing import Dict, Any, List, Tuple
from datetime import datetime

class EmergencyCrewWorkflowPatch:
    def __init__(self):
        # Load environment variables
        self.load_environment_variables()
        
        # Configuration
        self.n8n_url = os.getenv('N8N_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        # Headers for n8n API
        self.headers = {
            'Content-Type': 'application/json',
            'X-N8N-API-Key': self.n8n_api_key or 'n8n_api_key_placeholder'
        }
        
        # Crew member configurations
        self.crew_members = {
            'Captain Jean-Luc Picard': {
                'role': 'Strategic Leadership & Mission Command',
                'department': 'Command',
                'webhook_path': 'crew-captain-jean-luc-picard'
            },
            'Commander William Riker': {
                'role': 'Tactical Execution & Workflow Management',
                'department': 'Operations',
                'webhook_path': 'crew-commander-william-riker'
            },
            'Dr. Beverly Crusher': {
                'role': 'Health & Diagnostics Officer',
                'department': 'Medical',
                'webhook_path': 'crew-dr-beverly-crusher'
            },
            'Commander Data': {
                'role': 'Analytics & Logic Operations',
                'department': 'Science',
                'webhook_path': 'crew-commander-data'
            },
            'Lieutenant Commander Geordi La Forge': {
                'role': 'Infrastructure & System Integration',
                'department': 'Engineering',
                'webhook_path': 'crew-lieutenant-commander-geordi-la-forge'
            },
            'Lieutenant Worf': {
                'role': 'Security & Compliance Operations',
                'department': 'Security',
                'webhook_path': 'crew-lieutenant-worf'
            },
            'Lieutenant Uhura': {
                'role': 'Communications & I/O Operations Officer',
                'department': 'Communications',
                'webhook_path': 'crew-lieutenant-uhura'
            },
            'Counselor Deanna Troi': {
                'role': 'User Experience & Empathy Analysis',
                'department': 'Counseling',
                'webhook_path': 'crew-counselor-deanna-troi'
            },
            'Quark': {
                'role': 'Business Intelligence & Budget Optimization',
                'department': 'Finance',
                'webhook_path': 'crew-quark'
            }
        }
        
        # Patch status tracking
        self.patch_status = {
            'phase1_completed': False,
            'phase2_completed': False,
            'phase3_completed': False,
            'phase1_results': {},
            'phase2_results': {},
            'phase3_results': {},
            'errors': [],
            'warnings': []
        }
        
        print("🚨 EMERGENCY CREW WORKFLOW PATCH SYSTEM")
        print("=" * 70)
        print("🎯 Mission: Restore Crew Operational Status")
        print("📋 Approach: Three-Phase Systematic Recovery")

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

    def test_n8n_connection(self) -> bool:
        """Test connection to n8n instance"""
        try:
            print("🔍 Testing n8n connection...")
            
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                print("   ✅ n8n connection successful")
                return True
            else:
                print(f"   ❌ n8n connection failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"   ❌ n8n connection failed: {e}")
            return False

    def get_crew_workflow_status(self) -> Dict[str, Any]:
        """Get the current status of all crew workflows"""
        print("\n📊 ANALYZING CURRENT CREW WORKFLOW STATUS...")
        
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers, timeout=30)
            
            if response.status_code != 200:
                print(f"   ❌ Failed to fetch workflows: {response.status_code}")
                return {}
            
            data = response.json()
            
            # Handle different response formats
            if isinstance(data, list):
                workflows = data
            elif isinstance(data, dict) and 'data' in data:
                workflows = data['data']
            elif isinstance(data, str):
                try:
                    workflows = json.loads(data)
                    if not isinstance(workflows, list):
                        workflows = [workflows]
                except:
                    print(f"   ❌ Unexpected response format: {type(data)}")
                    return {}
            else:
                print(f"   ❌ Unexpected response format: {type(data)}")
                return {}
            
            crew_status = {}
            
            for crew_name, crew_info in self.crew_members.items():
                crew_workflows = [w for w in workflows if crew_name in w.get('name', '')]
                
                if crew_workflows:
                    # Find the active workflow
                    active_workflow = next((w for w in crew_workflows if w.get('active')), None)
                    enhanced_workflow = next((w for w in crew_workflows if 'Memory' in str(w.get('nodes', []))), None)
                    
                    crew_status[crew_name] = {
                        'total_workflows': len(crew_workflows),
                        'active_workflow': active_workflow,
                        'enhanced_workflow': enhanced_workflow,
                        'has_active': active_workflow is not None,
                        'has_enhanced': enhanced_workflow is not None,
                        'webhook_path': crew_info['webhook_path'],
                        'status': self._determine_crew_status(active_workflow, enhanced_workflow),
                        'workflows': crew_workflows
                    }
                else:
                    crew_status[crew_name] = {
                        'total_workflows': 0,
                        'active_workflow': None,
                        'enhanced_workflow': None,
                        'has_active': False,
                        'has_enhanced': False,
                        'webhook_path': crew_info['webhook_path'],
                        'status': 'MISSING',
                        'workflows': []
                    }
            
            return crew_status
            
        except Exception as e:
            print(f"   ❌ Error fetching crew status: {e}")
            return {}

    def _determine_crew_status(self, active_workflow: Dict, enhanced_workflow: Dict) -> str:
        """Determine the operational status of a crew member"""
        if not active_workflow:
            return "INACTIVE"
        
        if not enhanced_workflow:
            return "ACTIVE_BASIC"
        
        if active_workflow.get('id') == enhanced_workflow.get('id'):
            return "ACTIVE_ENHANCED"
        else:
            return "ACTIVE_OUTDATED"

    def phase1_emergency_response(self, crew_status: Dict[str, Any]) -> bool:
        """Phase 1: Emergency Response - Stop the bleeding"""
        print(f"\n🚨 PHASE 1: EMERGENCY RESPONSE")
        print("=" * 50)
        print("🎯 Objective: Activate enhanced workflows, deactivate outdated ones")
        
        phase_results = {}
        phase_success = True
        
        for crew_name, status in crew_status.items():
            print(f"\n🔧 Processing: {crew_name}")
            
            if status['status'] == 'ACTIVE_OUTDATED':
                print(f"   Status: ACTIVE_OUTDATED - Requires workflow activation")
                
                # Deactivate outdated workflow
                if status['active_workflow']:
                    deactivate_result = self._deactivate_workflow(status['active_workflow']['id'])
                    if not deactivate_result:
                        print(f"   ❌ Failed to deactivate outdated workflow")
                        phase_success = False
                    else:
                        print(f"   ✅ Deactivated outdated workflow")
                
                # Activate enhanced workflow
                if status['enhanced_workflow']:
                    activate_result = self._activate_workflow(status['enhanced_workflow']['id'])
                    if not activate_result:
                        print(f"   ❌ Failed to activate enhanced workflow")
                        phase_success = False
                    else:
                        print(f"   ✅ Activated enhanced workflow")
                        
                        # Verify activation
                        verify_result = self._verify_workflow_activation(status['enhanced_workflow']['id'])
                        if verify_result:
                            print(f"   ✅ Workflow activation verified")
                        else:
                            print(f"   ⚠️  Workflow activation verification failed")
                            phase_success = False
                else:
                    print(f"   ❌ No enhanced workflow found")
                    phase_success = False
                
                phase_results[crew_name] = {
                    'action': 'workflow_activation',
                    'success': activate_result if status['enhanced_workflow'] else False,
                    'deactivated_outdated': deactivate_result if status['active_workflow'] else False
                }
                
            elif status['status'] == 'INACTIVE':
                print(f"   Status: INACTIVE - No action required")
                phase_results[crew_name] = {
                    'action': 'none_required',
                    'success': True
                }
                
            elif status['status'] == 'ACTIVE_ENHANCED':
                print(f"   Status: ACTIVE_ENHANCED - No action required")
                phase_results[crew_name] = {
                    'action': 'none_required',
                    'success': True
                }
                
            elif status['status'] == 'ACTIVE_BASIC':
                print(f"   Status: ACTIVE_BASIC - Consider enhancement")
                phase_results[crew_name] = {
                    'action': 'enhancement_considered',
                    'success': True
                }
        
        self.patch_status['phase1_results'] = phase_results
        self.patch_status['phase1_completed'] = phase_success
        
        if phase_success:
            print(f"\n✅ PHASE 1 COMPLETED SUCCESSFULLY")
        else:
            print(f"\n⚠️  PHASE 1 COMPLETED WITH ISSUES")
        
        return phase_success

    def phase2_system_restoration(self, crew_status: Dict[str, Any]) -> bool:
        """Phase 2: System Restoration - Get departments back online"""
        print(f"\n🔧 PHASE 2: SYSTEM RESTORATION")
        print("=" * 50)
        print("🎯 Objective: Restore department operations and verify functionality")
        
        phase_results = {}
        phase_success = True
        
        # Group by department
        departments = {}
        for crew_name, status in crew_status.items():
            dept = self.crew_members[crew_name]['department']
            if dept not in departments:
                departments[dept] = []
            departments[dept].append((crew_name, status))
        
        for dept, crew_list in departments.items():
            print(f"\n🏢 Department: {dept}")
            
            dept_operational = True
            dept_results = {}
            
            for crew_name, status in crew_list:
                print(f"   👤 {crew_name}")
                
                # Test webhook functionality
                webhook_test = self._test_crew_webhook(crew_name, status['webhook_path'])
                
                # Test workflow execution
                workflow_test = self._test_workflow_execution(status['active_workflow']['id'] if status['active_workflow'] else None)
                
                crew_operational = webhook_test and workflow_test
                dept_operational = dept_operational and crew_operational
                
                dept_results[crew_name] = {
                    'webhook_functional': webhook_test,
                    'workflow_executable': workflow_test,
                    'operational': crew_operational
                }
                
                if crew_operational:
                    print(f"      ✅ Operational")
                else:
                    print(f"      ❌ Non-operational")
                    phase_success = False
            
            # Department status
            if dept_operational:
                print(f"   🟢 Department Status: OPERATIONAL")
            else:
                print(f"   🔴 Department Status: NON-OPERATIONAL")
                phase_success = False
            
            phase_results[dept] = dept_results
        
        self.patch_status['phase2_results'] = phase_results
        self.patch_status['phase2_completed'] = phase_success
        
        if phase_success:
            print(f"\n✅ PHASE 2 COMPLETED SUCCESSFULLY")
        else:
            print(f"\n⚠️  PHASE 2 COMPLETED WITH ISSUES")
        
        return phase_success

    def phase3_system_validation(self, crew_status: Dict[str, Any]) -> bool:
        """Phase 3: System Validation - Ensure full operational capability"""
        print(f"\n✅ PHASE 3: SYSTEM VALIDATION")
        print("=" * 50)
        print("🎯 Objective: Comprehensive testing and validation")
        
        phase_results = {}
        phase_success = True
        
        # Comprehensive crew status check
        print(f"\n📊 COMPREHENSIVE CREW STATUS VALIDATION")
        
        total_crew = len(self.crew_members)
        active_crew = 0
        enhanced_crew = 0
        operational_crew = 0
        
        for crew_name, status in crew_status.items():
            print(f"\n🔍 Validating: {crew_name}")
            
            # Check workflow status
            if status['has_active']:
                active_crew += 1
                print(f"   ✅ Active workflow: Yes")
            else:
                print(f"   ❌ Active workflow: No")
                phase_success = False
            
            # Check enhancement status
            if status['has_enhanced']:
                enhanced_crew += 1
                print(f"   ✅ Enhanced workflow: Yes")
            else:
                print(f"   ❌ Enhanced workflow: No")
                phase_success = False
            
            # Check operational status
            if status['status'] in ['ACTIVE_ENHANCED', 'ACTIVE_BASIC']:
                operational_crew += 1
                print(f"   ✅ Operational: Yes")
            else:
                print(f"   ❌ Operational: No")
                phase_success = False
            
            # Memory integration check
            if status['enhanced_workflow']:
                memory_check = self._verify_memory_integration(status['enhanced_workflow']['id'])
                if memory_check:
                    print(f"   ✅ Memory integration: Verified")
                else:
                    print(f"   ❌ Memory integration: Failed")
                    phase_success = False
            
            phase_results[crew_name] = {
                'active_workflow': status['has_active'],
                'enhanced_workflow': status['has_enhanced'],
                'operational': status['status'] in ['ACTIVE_ENHANCED', 'ACTIVE_BASIC'],
                'memory_integration': status['enhanced_workflow'] and self._verify_memory_integration(status['enhanced_workflow']['id'])
            }
        
        # Overall system metrics
        readiness_percentage = (operational_crew / total_crew) * 100 if total_crew > 0 else 0
        
        print(f"\n📊 SYSTEM VALIDATION METRICS")
        print(f"   Total Crew: {total_crew}")
        print(f"   Active Crew: {active_crew}")
        print(f"   Enhanced Crew: {enhanced_crew}")
        print(f"   Operational Crew: {operational_crew}")
        print(f"   Readiness: {readiness_percentage:.1f}%")
        
        if readiness_percentage >= 90:
            print(f"   🎉 System Status: FULLY OPERATIONAL")
        elif readiness_percentage >= 70:
            print(f"   🟡 System Status: MOSTLY OPERATIONAL")
        elif readiness_percentage >= 50:
            print(f"   🟠 System Status: PARTIALLY OPERATIONAL")
        else:
            print(f"   🔴 System Status: CRITICALLY COMPROMISED")
            phase_success = False
        
        self.patch_status['phase3_results'] = phase_results
        self.patch_status['phase3_completed'] = phase_success
        
        if phase_success:
            print(f"\n✅ PHASE 3 COMPLETED SUCCESSFULLY")
        else:
            print(f"\n⚠️  PHASE 3 COMPLETED WITH ISSUES")
        
        return phase_success

    def _deactivate_workflow(self, workflow_id: str) -> bool:
        """Deactivate a workflow"""
        try:
            response = requests.patch(
                f"{self.n8n_url}/api/v1/workflows/{workflow_id}",
                headers=self.headers,
                json={'active': False},
                timeout=30
            )
            return response.status_code in [200, 201]
        except Exception as e:
            self.patch_status['errors'].append(f"Failed to deactivate workflow {workflow_id}: {e}")
            return False

    def _activate_workflow(self, workflow_id: str) -> bool:
        """Activate a workflow"""
        try:
            response = requests.patch(
                f"{self.n8n_url}/api/v1/workflows/{workflow_id}",
                headers=self.headers,
                json={'active': True},
                timeout=30
            )
            return response.status_code in [200, 201]
        except Exception as e:
            self.patch_status['errors'].append(f"Failed to activate workflow {workflow_id}: {e}")
            return False

    def _verify_workflow_activation(self, workflow_id: str) -> bool:
        """Verify that a workflow is active"""
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows/{workflow_id}", headers=self.headers, timeout=10)
            if response.status_code == 200:
                workflow = response.json()
                return workflow.get('active', False)
            return False
        except Exception:
            return False

    def _test_crew_webhook(self, crew_name: str, webhook_path: str) -> bool:
        """Test crew member webhook functionality"""
        try:
            test_payload = {
                "task": f"Test webhook for {crew_name}",
                "test": True,
                "timestamp": datetime.now().isoformat()
            }
            
            webhook_url = f"{self.n8n_url}/webhook/{webhook_path}"
            response = requests.post(webhook_url, json=test_payload, timeout=10)
            
            return response.status_code in [200, 201, 202]
        except Exception:
            return False

    def _test_workflow_execution(self, workflow_id: str) -> bool:
        """Test if a workflow can be executed"""
        if not workflow_id:
            return False
        
        try:
            # Check if workflow is active and has proper structure
            response = requests.get(f"{self.n8n_url}/api/v1/workflows/{workflow_id}", headers=self.headers, timeout=10)
            if response.status_code == 200:
                workflow = response.json()
                return workflow.get('active', False) and len(workflow.get('nodes', [])) > 0
            return False
        except Exception:
            return False

    def _verify_memory_integration(self, workflow_id: str) -> bool:
        """Verify that a workflow has memory integration"""
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows/{workflow_id}", headers=self.headers, timeout=10)
            if response.status_code == 200:
                workflow = response.json()
                nodes = workflow.get('nodes', [])
                return any('Memory' in str(node) for node in nodes)
            return False
        except Exception:
            return False

    def generate_patch_report(self) -> None:
        """Generate comprehensive patch report"""
        print(f"\n📄 EMERGENCY PATCH REPORT")
        print("=" * 70)
        print(f"📅 Patch Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🎯 Mission: Restore Crew Operational Status")
        
        # Phase results
        print(f"\n🚨 PHASE 1: EMERGENCY RESPONSE")
        print(f"   Status: {'✅ COMPLETED' if self.patch_status['phase1_completed'] else '❌ FAILED'}")
        
        print(f"\n🔧 PHASE 2: SYSTEM RESTORATION")
        print(f"   Status: {'✅ COMPLETED' if self.patch_status['phase2_completed'] else '❌ FAILED'}")
        
        print(f"\n✅ PHASE 3: SYSTEM VALIDATION")
        print(f"   Status: {'✅ COMPLETED' if self.patch_status['phase3_completed'] else '❌ FAILED'}")
        
        # Overall status
        all_phases_completed = all([
            self.patch_status['phase1_completed'],
            self.patch_status['phase2_completed'],
            self.patch_status['phase3_completed']
        ])
        
        print(f"\n🎯 OVERALL PATCH STATUS")
        if all_phases_completed:
            print(f"   🎉 SUCCESS: All phases completed successfully")
        else:
            print(f"   ⚠️  PARTIAL: Some phases failed or had issues")
        
        # Errors and warnings
        if self.patch_status['errors']:
            print(f"\n❌ ERRORS ENCOUNTERED")
            for error in self.patch_status['errors']:
                print(f"   • {error}")
        
        if self.patch_status['warnings']:
            print(f"\n⚠️  WARNINGS")
            for warning in self.patch_status['warnings']:
                print(f"   • {warning}")
        
        print(f"\n🎖️ PATCH REPORT COMPLETE")
        print("=" * 70)

    def run_emergency_patch(self) -> bool:
        """Run the complete emergency patch process"""
        try:
            print("🚨 INITIATING EMERGENCY CREW WORKFLOW PATCH...")
            
            # Test n8n connection
            if not self.test_n8n_connection():
                print("\n❌ Cannot proceed without n8n connection")
                return False
            
            # Get current crew status
            crew_status = self.get_crew_workflow_status()
            if not crew_status:
                print("\n❌ Failed to gather crew status")
                return False
            
            # Execute Phase 1: Emergency Response
            phase1_success = self.phase1_emergency_response(crew_status)
            
            # Brief pause between phases
            if phase1_success:
                print(f"\n⏳ Pausing between phases...")
                time.sleep(5)
                
                # Execute Phase 2: System Restoration
                phase2_success = self.phase2_system_restoration(crew_status)
                
                if phase2_success:
                    print(f"\n⏳ Pausing between phases...")
                    time.sleep(5)
                    
                    # Execute Phase 3: System Validation
                    phase3_success = self.phase3_system_validation(crew_status)
                else:
                    phase3_success = False
            else:
                phase2_success = False
                phase3_success = False
            
            # Generate patch report
            self.generate_patch_report()
            
            # Overall success
            overall_success = phase1_success and phase2_success and phase3_success
            
            if overall_success:
                print(f"\n🎉 Emergency patch completed successfully!")
                print("   All crew workflows restored to operational status")
            else:
                print(f"\n⚠️  Emergency patch completed with issues")
                print("   Some phases failed - review the patch report")
            
            return overall_success
            
        except Exception as e:
            print(f"\n❌ Emergency patch failed: {e}")
            self.patch_status['errors'].append(f"Patch execution failed: {e}")
            return False

def main():
    """Main execution function"""
    patch = EmergencyCrewWorkflowPatch()
    
    success = patch.run_emergency_patch()
    
    if success:
        print("   Next: Verify crew operational status and test workflows")
    else:
        print("   Check the patch report for issues and retry failed phases")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

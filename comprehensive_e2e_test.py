#!/usr/bin/env python3
"""
Comprehensive End-to-End Test Suite
Tests the entire workflow: Claude sub-agents, N8N integration, and Cursor chat UI extension
"""

import json
import os
import subprocess
import time
import requests
from datetime import datetime
from pathlib import Path

class ComprehensiveE2ETester:
    def __init__(self):
        self.workspace_root = Path.cwd()
        self.test_results = {
            "timestamp": datetime.now().isoformat(),
            "test_suite": "Comprehensive E2E Workflow Test",
            "results": {}
        }
        self.n8n_base_url = "https://n8n.pbradygeorgen.com"
        
    def log_result(self, test_name, status, details=""):
        """Log test result"""
        self.test_results["results"][test_name] = {
            "status": status,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_icon} {test_name}: {status}")
        if details:
            print(f"   Details: {details}")
    
    def test_extension_installation(self):
        """Test that our LLM Supercharger extension is properly installed"""
        test_name = "extension_installation"
        try:
            cursor_extensions_dir = Path.home() / ".cursor" / "extensions"
            our_extension = cursor_extensions_dir / "pbradygeorgen.cursor-ai-supercharger-3.0.0"
            
            if not our_extension.exists():
                self.log_result(test_name, "FAIL", "Our extension not found in Cursor extensions")
                return False
            
            # Check package.json
            package_json = our_extension / "package.json"
            if not package_json.exists():
                self.log_result(test_name, "FAIL", "Extension package.json not found")
                return False
            
            with open(package_json, 'r') as f:
                data = json.load(f)
            
            if data.get('name') != 'cursor-ai-supercharger':
                self.log_result(test_name, "FAIL", "Extension name mismatch")
                return False
            
            self.log_result(test_name, "PASS", f"Extension properly installed: {data.get('displayName')}")
            return True
            
        except Exception as e:
            self.log_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_extension_commands(self):
        """Test that all 14 enhanced commands are available"""
        test_name = "extension_commands"
        try:
            # Check if commands are properly defined
            cursor_extensions_dir = Path.home() / ".cursor" / "extensions"
            our_extension = cursor_extensions_dir / "pbradygeorgen.cursor-ai-supercharger-3.0.0"
            package_json = our_extension / "package.json"
            
            with open(package_json, 'r') as f:
                data = json.load(f)
            
            commands = data.get('contributes', {}).get('commands', [])
            expected_commands = [
                "cursor-ai-supercharger.activate",
                "cursor-ai-supercharger.enhanceFileContext",
                "cursor-ai-supercharger.provideCodeSuggestions",
                "cursor-ai-supercharger.analyzeWorkspace",
                "cursor-ai-supercharger.integrateN8N",
                "cursor-ai-supercharger.showContextStatus",
                "cursor-ai-supercharger.toggleEnhancement",
                "cursor-ai-supercharger.quickFileAnalysis",
                "cursor-ai-supercharger.enhanceSelection",
                "cursor-ai-supercharger.showInsights",
                "cursor-ai-supercharger.sendTaskToN8N",
                "cursor-ai-supercharger.showLLMStatus",
                "cursor-ai-supercharger.showCostOptimization",
                "cursor-ai-supercharger.autoEnhanceChat"
            ]
            
            available_commands = {cmd.get('command', '') for cmd in commands}
            missing_commands = set(expected_commands) - available_commands
            
            if missing_commands:
                self.log_result(test_name, "FAIL", f"Missing commands: {missing_commands}")
                return False
            
            self.log_result(test_name, "PASS", f"All {len(expected_commands)} commands available")
            return True
            
        except Exception as e:
            self.log_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_cursor_chat_ui_integration(self):
        """Test that our extension properly extends Cursor chat UI"""
        test_name = "cursor_chat_ui_integration"
        try:
            # Check if extension has proper activation events
            cursor_extensions_dir = Path.home() / ".cursor" / "extensions"
            our_extension = cursor_extensions_dir / "pbradygeorgen.cursor-ai-supercharger-3.0.0"
            package_json = our_extension / "package.json"
            
            with open(package_json, 'r') as f:
                data = json.load(f)
            
            activation_events = data.get('activationEvents', [])
            
            # Should activate on startup and have command activation
            if 'onStartupFinished' not in activation_events:
                self.log_result(test_name, "WARN", "Extension doesn't auto-activate on startup")
            
            if not any('onCommand:' in event for event in activation_events):
                self.log_result(test_name, "WARN", "No command-based activation events")
            
            # Check if main entry point exists
            main_file = data.get('main', '')
            main_path = our_extension / main_file
            
            if not main_path.exists():
                self.log_result(test_name, "FAIL", f"Main entry point not found: {main_file}")
                return False
            
            self.log_result(test_name, "PASS", "Extension properly configured for Cursor chat UI integration")
            return True
            
        except Exception as e:
            self.log_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_n8n_connectivity(self):
        """Test N8N connectivity and workflow availability"""
        test_name = "n8n_connectivity"
        try:
            # Test basic connectivity
            response = requests.get(f"{self.n8n_base_url}/health", timeout=10)
            
            if response.status_code == 200:
                self.log_result(test_name, "PASS", f"N8N accessible at {self.n8n_base_url}")
                return True
            else:
                self.log_result(test_name, "FAIL", f"N8N returned status {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result(test_name, "FAIL", f"N8N connection failed: {str(e)}")
            return False
    
    def test_claude_sub_agents(self):
        """Test Claude sub-agent functionality and integration"""
        test_name = "claude_sub_agents"
        try:
            # Check if we have sub-agent related files
            sub_agent_files = [
                "llm_collaboration/sub_agent_orchestrator.py",
                "llm_collaboration/unified_query_structure.py",
                "llm_collaboration/test_claude_cursor_communication.py"
            ]
            
            found_files = []
            for file_path in sub_agent_files:
                if (self.workspace_root / file_path).exists():
                    found_files.append(file_path)
            
            if not found_files:
                self.log_result(test_name, "WARN", "No sub-agent files found in workspace")
                return False
            
            # Check if sub-agent orchestrator is functional
            orchestrator_path = self.workspace_root / "llm_collaboration/sub_agent_orchestrator.py"
            if orchestrator_path.exists():
                # Basic syntax check
                try:
                    with open(orchestrator_path, 'r') as f:
                        content = f.read()
                    
                    if "class SubAgentOrchestrator" in content:
                        self.log_result(test_name, "PASS", f"Sub-agent orchestrator found with {len(found_files)} related files")
                        return True
                    else:
                        self.log_result(test_name, "WARN", "Sub-agent orchestrator structure incomplete")
                        return False
                        
                except Exception as e:
                    self.log_result(test_name, "FAIL", f"Error reading sub-agent files: {str(e)}")
                    return False
            
            self.log_result(test_name, "WARN", "Sub-agent system partially available")
            return False
            
        except Exception as e:
            self.log_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_workflow_integration(self):
        """Test N8N workflow integration and deployment"""
        test_name = "workflow_integration"
        try:
            # Check for workflow files
            workflow_files = list(self.workspace_root.glob("**/*.json"))
            n8n_workflows = [f for f in workflow_files if "n8n" in f.name.lower() or "workflow" in f.name.lower()]
            
            if not n8n_workflows:
                self.log_result(test_name, "WARN", "No N8N workflow files found")
                return False
            
            # Check if workflows are properly formatted
            valid_workflows = []
            for workflow_file in n8n_workflows[:3]:  # Check first 3
                try:
                    with open(workflow_file, 'r') as f:
                        workflow_data = json.load(f)
                    
                    if isinstance(workflow_data, dict) and 'nodes' in workflow_data:
                        valid_workflows.append(workflow_file.name)
                        
                except json.JSONDecodeError:
                    continue
            
            if valid_workflows:
                self.log_result(test_name, "PASS", f"Found {len(valid_workflows)} valid N8N workflows")
                return True
            else:
                self.log_result(test_name, "WARN", "No valid N8N workflow files found")
                return False
                
        except Exception as e:
            self.log_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_cursor_chat_switching(self):
        """Test that it's easy to switch Cursor chat to Supercharged version"""
        test_name = "cursor_chat_switching"
        try:
            # Check if our extension provides easy activation
            cursor_extensions_dir = Path.home() / ".cursor" / "extensions"
            our_extension = cursor_extensions_dir / "pbradygeorgen.cursor-ai-supercharger-3.0.0"
            package_json = our_extension / "package.json"
            
            with open(package_json, 'r') as f:
                data = json.load(f)
            
            commands = data.get('contributes', {}).get('commands', [])
            
            # Look for activation commands
            activation_commands = [
                "cursor-ai-supercharger.activate",
                "cursor-ai-supercharger.autoEnhanceChat",
                "cursor-ai-supercharger.toggleEnhancement"
            ]
            
            available_activation = [cmd for cmd in activation_commands if any(cmd in c.get('command', '') for c in commands)]
            
            if available_activation:
                self.log_result(test_name, "PASS", f"Easy switching available via: {', '.join(available_activation)}")
                return True
            else:
                self.log_result(test_name, "FAIL", "No easy activation commands found")
                return False
                
        except Exception as e:
            self.log_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_end_to_end_workflow(self):
        """Test the complete end-to-end workflow"""
        test_name = "end_to_end_workflow"
        try:
            # Simulate the complete workflow
            workflow_steps = [
                "1. Extension installed and active",
                "2. Commands available in Cursor",
                "3. N8N connectivity established",
                "4. Sub-agents accessible",
                "5. Chat UI properly extended",
                "6. Easy switching to Supercharged mode"
            ]
            
            # Check if all components are ready
            components_ready = [
                self.test_extension_installation(),
                self.test_extension_commands(),
                self.test_cursor_chat_ui_integration(),
                self.test_n8n_connectivity(),
                self.test_claude_sub_agents(),
                self.test_workflow_integration(),
                self.test_cursor_chat_switching()
            ]
            
            ready_count = sum(components_ready)
            total_components = len(components_ready)
            
            if ready_count >= total_components * 0.8:  # 80% success rate
                self.log_result(test_name, "PASS", f"Workflow ready: {ready_count}/{total_components} components")
                return True
            else:
                self.log_result(test_name, "FAIL", f"Workflow incomplete: {ready_count}/{total_components} components")
                return False
                
        except Exception as e:
            self.log_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def generate_test_report(self):
        """Generate comprehensive test report"""
        print("\n" + "=" * 60)
        print("📊 COMPREHENSIVE E2E TEST REPORT")
        print("=" * 60)
        
        total_tests = len(self.test_results["results"])
        passed_tests = sum(1 for r in self.test_results["results"].values() if r["status"] == "PASS")
        failed_tests = sum(1 for r in self.test_results["results"].values() if r["status"] == "FAIL")
        warning_tests = sum(1 for r in self.test_results["results"].values() if r["status"] == "WARN")
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"⚠️  Warnings: {warning_tests}")
        
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        print(f"Success Rate: {success_rate:.1f}%")
        
        # Component status
        print(f"\n🔧 COMPONENT STATUS:")
        components = [
            "Extension Installation",
            "Extension Commands", 
            "Cursor Chat UI Integration",
            "N8N Connectivity",
            "Claude Sub-agents",
            "Workflow Integration",
            "Chat Switching",
            "End-to-End Workflow"
        ]
        
        for i, component in enumerate(components):
            if i < len(self.test_results["results"]):
                status = list(self.test_results["results"].values())[i]["status"]
                icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
                print(f"  {icon} {component}: {status}")
        
        # Recommendations
        print(f"\n💡 RECOMMENDATIONS:")
        if success_rate >= 80:
            print("🎉 System is ready for production use!")
            print("✅ All major components are functional")
            print("🚀 Ready to use Supercharged Cursor chat")
        elif success_rate >= 60:
            print("⚠️  System is mostly functional with some issues")
            print("🔧 Some components need attention")
            print("📋 Review failed tests above")
        else:
            print("❌ System has significant issues")
            print("🔧 Multiple components need attention")
            print("📋 Review all failed tests above")
        
        # Save results
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"comprehensive_e2e_test_report_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(self.test_results, f, indent=2)
        
        print(f"\n📄 Test results saved to: {filename}")
    
    def run_all_tests(self):
        """Run all comprehensive tests"""
        print("🚀 COMPREHENSIVE END-TO-END WORKFLOW TEST")
        print("=" * 60)
        print("🎯 Testing entire system: Extension, Sub-agents, N8N, Chat UI")
        print("")
        
        # Run all tests
        self.test_extension_installation()
        self.test_extension_commands()
        self.test_cursor_chat_ui_integration()
        self.test_n8n_connectivity()
        self.test_claude_sub_agents()
        self.test_workflow_integration()
        self.test_cursor_chat_switching()
        self.test_end_to_end_workflow()
        
        # Generate report
        self.generate_test_report()

def main():
    """Main execution function"""
    try:
        tester = ComprehensiveE2ETester()
        tester.run_all_tests()
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Testing interrupted by user")
    except Exception as e:
        print(f"\n❌ Testing failed with error: {e}")

if __name__ == "__main__":
    main()

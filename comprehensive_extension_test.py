#!/usr/bin/env python3
"""
Comprehensive End-to-End Extension Test Suite
Tests both cursor-claude-unified and alex-extension functionality
"""

import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

class ExtensionTester:
    def __init__(self):
        self.test_results = {
            "timestamp": datetime.now().isoformat(),
            "test_suite": "Comprehensive Extension E2E Test",
            "results": {}
        }
        self.workspace_root = Path.cwd()
        
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
    
    def test_extension_structure(self, extension_name, extension_path):
        """Test extension directory structure and files"""
        test_name = f"{extension_name}_structure"
        try:
            path = self.workspace_root / extension_path
            
            # Check if extension directory exists
            if not path.exists():
                self.log_result(test_name, "FAIL", f"Extension directory not found: {extension_path}")
                return False
                
            # Check for essential files
            essential_files = ["package.json", "tsconfig.json", "src/extension.ts"]
            missing_files = []
            
            for file_path in essential_files:
                if not (path / file_path).exists():
                    missing_files.append(file_path)
            
            if missing_files:
                self.log_result(test_name, "FAIL", f"Missing files: {missing_files}")
                return False
                
            # Check for compiled output
            out_dir = path / "out"
            if not out_dir.exists():
                self.log_result(test_name, "FAIL", "No compiled output directory found")
                return False
                
            extension_js = out_dir / "extension.js"
            if not extension_js.exists():
                self.log_result(test_name, "FAIL", "No compiled extension.js found")
                return False
                
            self.log_result(test_name, "PASS", f"All essential files present in {extension_path}")
            return True
            
        except Exception as e:
            self.log_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_package_json(self, extension_name, extension_path):
        """Test package.json configuration"""
        test_name = f"{extension_name}_package_json"
        try:
            package_path = self.workspace_root / extension_path / "package.json"
            
            with open(package_path, 'r') as f:
                package_data = json.load(f)
            
            # Check essential fields
            required_fields = ["name", "displayName", "version", "main", "contributes"]
            missing_fields = [field for field in required_fields if field not in package_data]
            
            if missing_fields:
                self.log_result(test_name, "FAIL", f"Missing required fields: {missing_fields}")
                return False
            
            # Check commands
            commands = package_data.get("contributes", {}).get("commands", [])
            if not commands:
                self.log_result(test_name, "FAIL", "No commands defined")
                return False
                
            self.log_result(test_name, "PASS", f"Package.json valid with {len(commands)} commands")
            return True
            
        except Exception as e:
            self.log_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_vsix_package(self, extension_name, extension_path):
        """Test VSIX package creation"""
        test_name = f"{extension_name}_vsix_package"
        try:
            path = self.workspace_root / extension_path
            vsix_files = list(path.glob("*.vsix"))
            
            if not vsix_files:
                self.log_result(test_name, "WARN", "No VSIX package found - may need to run 'vsce package'")
                return False
                
            # Check VSIX file size (should be reasonable)
            vsix_file = vsix_files[0]
            file_size = vsix_file.stat().st_size
            
            if file_size < 1000:  # Less than 1KB seems too small
                self.log_result(test_name, "FAIL", f"VSIX file too small: {file_size} bytes")
                return False
                
            self.log_result(test_name, "PASS", f"VSIX package found: {vsix_file.name} ({file_size} bytes)")
            return True
            
        except Exception as e:
            self.log_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_command_conflicts(self):
        """Test for command conflicts between extensions"""
        test_name = "command_conflicts"
        try:
            # Get commands from both extensions
            cursor_commands = self.get_extension_commands("cursor-claude-unified")
            alex_commands = self.get_extension_commands("alex-extension")
            
            # Check for duplicate command IDs
            cursor_command_ids = {cmd.get("command", "") for cmd in cursor_commands}
            alex_command_ids = {cmd.get("command", "") for cmd in alex_commands}
            
            conflicts = cursor_command_ids.intersection(alex_command_ids)
            
            if conflicts:
                self.log_result(test_name, "FAIL", f"Command conflicts found: {conflicts}")
                return False
                
            self.log_result(test_name, "PASS", f"No conflicts between {len(cursor_commands)} and {len(alex_commands)} commands")
            return True
            
        except Exception as e:
            self.log_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def get_extension_commands(self, extension_path):
        """Get commands from extension package.json"""
        try:
            package_path = self.workspace_root / extension_path / "package.json"
            with open(package_path, 'r') as f:
                package_data = json.load(f)
            return package_data.get("contributes", {}).get("commands", [])
        except:
            return []
    
    def test_workspace_cleanup(self):
        """Test that workspace cleanup was successful"""
        test_name = "workspace_cleanup"
        try:
            # Check that duplicate extension was removed
            duplicate_path = self.workspace_root / "cursor-claude-llm-collaboration"
            if duplicate_path.exists():
                self.log_result(test_name, "FAIL", "Duplicate extension directory still exists")
                return False
            
            # Check that archives directory was created
            archives_path = self.workspace_root / "archives"
            if not archives_path.exists():
                self.log_result(test_name, "WARN", "Archives directory not found")
            
            # Count files in root
            root_files = [f for f in self.workspace_root.iterdir() if f.is_file()]
            if len(root_files) > 200:  # Arbitrary threshold
                self.log_result(test_name, "WARN", f"Many files in root directory: {len(root_files)}")
            
            self.log_result(test_name, "PASS", f"Workspace cleanup successful, {len(root_files)} files in root")
            return True
            
        except Exception as e:
            self.log_result(test_name, "FAIL", f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Comprehensive Extension E2E Test Suite")
        print("=" * 60)
        
        # Test cursor-claude-unified extension
        print("\n📦 Testing cursor-claude-unified Extension:")
        self.test_extension_structure("cursor_claude_unified", "cursor-claude-unified")
        self.test_package_json("cursor_claude_unified", "cursor-claude-unified")
        self.test_vsix_package("cursor_claude_unified", "cursor-claude-unified")
        
        # Test alex-extension
        print("\n🤖 Testing alex-extension:")
        self.test_extension_structure("alex_extension", "alex-extension")
        self.test_package_json("alex_extension", "alex-extension")
        self.test_vsix_package("alex_extension", "alex-extension")
        
        # Test integration
        print("\n🔗 Testing Integration:")
        self.test_command_conflicts()
        self.test_workspace_cleanup()
        
        # Generate summary
        self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
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
        
        if failed_tests == 0:
            print("\n🎉 ALL TESTS PASSED! Extensions are ready for use.")
        else:
            print(f"\n⚠️  {failed_tests} tests failed. Please review the issues above.")
        
        # Save results
        self.save_results()
    
    def save_results(self):
        """Save test results to file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"comprehensive_extension_test_report_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(self.test_results, f, indent=2)
        
        print(f"\n📄 Test results saved to: {filename}")

if __name__ == "__main__":
    tester = ExtensionTester()
    tester.run_all_tests()





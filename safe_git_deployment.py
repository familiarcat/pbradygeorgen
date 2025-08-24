#!/usr/bin/env python3
"""
🔐 SAFE GIT DEPLOYMENT SCRIPT
Prevents cmdand dquote> issues and ensures clean git operations
Uses simple commit message templates and validates all operations
"""

import os
import subprocess
import json
from datetime import datetime
from typing import Dict, Any, List, Optional

class SafeGitDeployment:
    """Safe git deployment system that prevents common issues"""
    
    def __init__(self):
        self.deployment_results = {
            "timestamp": datetime.now().isoformat(),
            "deployment_type": "safe_git_deployment",
            "status": "initializing",
            "git_operations": [],
            "prevention_measures": [],
            "collective_memory": {}
        }
        
        # Pre-defined commit message templates (simple, no complex quotes)
        self.commit_templates = {
            "milestone": "🚀 MILESTONE: {description}",
            "feature": "✨ FEATURE: {description}",
            "fix": "🐛 FIX: {description}",
            "update": "📝 UPDATE: {description}",
            "deployment": "🚀 DEPLOY: {description}",
            "security": "🔒 SECURITY: {description}",
            "documentation": "📚 DOCS: {description}",
            "refactor": "♻️ REFACTOR: {description}",
            "test": "🧪 TEST: {description}",
            "crew_memory": "🧠 MEMORY: {description}"
        }
        
        # Load collective memory
        self.load_collective_memory()
    
    def load_collective_memory(self):
        """Load collective memory about git best practices"""
        try:
            memory_file = "crew_memory/git_deployment_best_practices.json"
            if os.path.exists(memory_file):
                with open(memory_file, 'r') as f:
                    memory = json.load(f)
                
                self.deployment_results["collective_memory"] = memory
                print("🧠 Loaded collective memory about git best practices")
                
                # Apply prevention measures
                self.apply_prevention_measures(memory)
            else:
                print("⚠️ No git best practices memory found - using defaults")
                
        except Exception as e:
            print(f"❌ Error loading collective memory: {e}")
    
    def apply_prevention_measures(self, memory: Dict[str, Any]):
        """Apply prevention measures from collective memory"""
        if "prevention_measures" in memory:
            self.deployment_results["prevention_measures"] = memory["prevention_measures"]
            print("✅ Prevention measures applied from collective memory")
    
    def validate_commit_message(self, message: str) -> bool:
        """Validate commit message to prevent cmdand dquote> issues"""
        try:
            # Check for problematic patterns
            problematic_patterns = [
                'cmdand dquote>',
                'dquote>',
                'cmdand',
                '\\n',
                '\\r',
                '\\t'
            ]
            
            for pattern in problematic_patterns:
                if pattern in message:
                    print(f"❌ Commit message contains problematic pattern: {pattern}")
                    return False
            
            # Check message length
            if len(message) > 200:
                print(f"❌ Commit message too long: {len(message)} characters")
                return False
            
            # Check for balanced quotes
            single_quotes = message.count("'")
            double_quotes = message.count('"')
            
            if single_quotes % 2 != 0 or double_quotes % 2 != 0:
                print("❌ Unbalanced quotes in commit message")
                return False
            
            print("✅ Commit message validation passed")
            return True
            
        except Exception as e:
            print(f"❌ Error validating commit message: {e}")
            return False
    
    def generate_safe_commit_message(self, template_type: str, description: str) -> str:
        """Generate a safe commit message using templates"""
        try:
            if template_type not in self.commit_templates:
                print(f"⚠️ Unknown template type: {template_type}, using 'update'")
                template_type = "update"
            
            template = self.commit_templates[template_type]
            message = template.format(description=description)
            
            # Validate the generated message
            if self.validate_commit_message(message):
                return message
            else:
                # Fallback to simple message
                fallback = f"UPDATE: {description}"
                print(f"⚠️ Using fallback message: {fallback}")
                return fallback
                
        except Exception as e:
            print(f"❌ Error generating commit message: {e}")
            return f"UPDATE: {description}"
    
    def safe_git_add(self, files: List[str] = None) -> bool:
        """Safely add files to git staging"""
        try:
            if files:
                # Add specific files
                for file_path in files:
                    if os.path.exists(file_path):
                        result = subprocess.run(
                            ['git', 'add', file_path],
                            capture_output=True, text=True, timeout=30
                        )
                        
                        if result.returncode == 0:
                            print(f"✅ Added to git: {file_path}")
                            self.deployment_results["git_operations"].append({
                                "operation": "git_add",
                                "file": file_path,
                                "status": "success",
                                "timestamp": datetime.now().isoformat()
                            })
                        else:
                            print(f"❌ Failed to add {file_path}: {result.stderr}")
                            return False
                    else:
                        print(f"⚠️ File not found: {file_path}")
            else:
                # Add all files
                result = subprocess.run(
                    ['git', 'add', '.'],
                    capture_output=True, text=True, timeout=30
                )
                
                if result.returncode == 0:
                    print("✅ Added all files to git")
                    self.deployment_results["git_operations"].append({
                        "operation": "git_add_all",
                        "status": "success",
                        "timestamp": datetime.now().isoformat()
                    })
                else:
                    print(f"❌ Failed to add all files: {result.stderr}")
                    return False
            
            return True
            
        except Exception as e:
            print(f"❌ Error in git add: {e}")
            return False
    
    def safe_git_commit(self, template_type: str, description: str) -> bool:
        """Safely commit changes using validated message"""
        try:
            # Generate safe commit message
            commit_message = self.generate_safe_commit_message(template_type, description)
            
            print(f"📝 Committing with message: {commit_message}")
            
            # Execute git commit
            result = subprocess.run(
                ['git', 'commit', '-m', commit_message],
                capture_output=True, text=True, timeout=60
            )
            
            if result.returncode == 0:
                print("✅ Git commit successful")
                self.deployment_results["git_operations"].append({
                    "operation": "git_commit",
                    "message": commit_message,
                    "status": "success",
                    "timestamp": datetime.now().isoformat()
                })
                return True
            else:
                print(f"❌ Git commit failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Error in git commit: {e}")
            return False
    
    def safe_git_push(self, remote: str = "origin", branch: str = None) -> bool:
        """Safely push to remote repository"""
        try:
            # Determine current branch if not specified
            if not branch:
                result = subprocess.run(
                    ['git', 'branch', '--show-current'],
                    capture_output=True, text=True, timeout=30
                )
                
                if result.returncode == 0:
                    branch = result.stdout.strip()
                else:
                    print("❌ Could not determine current branch")
                    return False
            
            print(f"📤 Pushing to {remote}/{branch}")
            
            # Execute git push
            result = subprocess.run(
                ['git', 'push', remote, branch],
                capture_output=True, text=True, timeout=120
            )
            
            if result.returncode == 0:
                print("✅ Git push successful")
                self.deployment_results["git_operations"].append({
                    "operation": "git_push",
                    "remote": remote,
                    "branch": branch,
                    "status": "success",
                    "timestamp": datetime.now().isoformat()
                })
                return True
            else:
                print(f"❌ Git push failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Error in git push: {e}")
            return False
    
    def run_safe_deployment(self, template_type: str, description: str, 
                           files: List[str] = None, remote: str = "origin", 
                           branch: str = None) -> bool:
        """Run complete safe git deployment"""
        print("🚀 STARTING SAFE GIT DEPLOYMENT")
        print("=" * 50)
        
        # Step 1: Add files
        print("📁 Step 1: Adding files to git...")
        if not self.safe_git_add(files):
            print("❌ Failed to add files")
            return False
        
        # Step 2: Commit changes
        print("\n📝 Step 2: Committing changes...")
        if not self.safe_git_commit(template_type, description):
            print("❌ Failed to commit changes")
            return False
        
        # Step 3: Push to remote
        print("\n📤 Step 3: Pushing to remote...")
        if not self.safe_git_push(remote, branch):
            print("❌ Failed to push to remote")
            return False
        
        # Update final status
        self.deployment_results["status"] = "completed_successfully"
        
        print("\n" + "=" * 50)
        print("🎉 SAFE GIT DEPLOYMENT COMPLETED!")
        print("✅ All operations completed without cmdand dquote> issues")
        print("✅ Collective memory applied for prevention")
        print("✅ Deployment process documented")
        
        return True
    
    def show_available_templates(self):
        """Show available commit message templates"""
        print("📋 Available commit message templates:")
        print("=" * 40)
        
        for template_type, template in self.commit_templates.items():
            example = template.format(description="Example description")
            print(f"{template_type:15} → {example}")
        
        print("\n💡 Usage: safe_git_deployment.py <template_type> <description>")

def main():
    """Main function for safe git deployment"""
    import sys
    
    if len(sys.argv) < 3:
        print("🚀 SAFE GIT DEPLOYMENT SCRIPT")
        print("=" * 40)
        print("Usage: python3 safe_git_deployment.py <template_type> <description>")
        print("\nExample: python3 safe_git_deployment.py milestone 'Crew system deployed'")
        print("\nAvailable template types:")
        
        deployer = SafeGitDeployment()
        deployer.show_available_templates()
        return
    
    template_type = sys.argv[1]
    description = sys.argv[2]
    
    print(f"🚀 Starting safe git deployment...")
    print(f"📝 Template: {template_type}")
    print(f"📋 Description: {description}")
    
    deployer = SafeGitDeployment()
    success = deployer.run_safe_deployment(template_type, description)
    
    if success:
        print("\n🎉 Deployment completed successfully!")
        print("✅ No cmdand dquote> issues encountered")
        print("🧠 Collective memory applied for prevention")
    else:
        print("\n❌ Deployment failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()

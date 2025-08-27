#!/usr/bin/env python3
"""
Phase 1 Backup Creator
Creates comprehensive backup of current project state before restructuring.
"""

import os
import shutil
import json
from pathlib import Path
from datetime import datetime
import subprocess

class Phase1BackupCreator:
    def __init__(self):
        self.project_root = Path.cwd()
        self.backup_dir = self.project_root / "optimization_backups" / f"phase1_start_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        
    def create_comprehensive_backup(self):
        """Create comprehensive backup of current project state."""
        print("💾 PHASE 1 COMPREHENSIVE BACKUP CREATION")
        print("=" * 60)
        print(f"Backup Directory: {self.backup_dir}")
        print()
        
        # Step 1: Create directory structure backup
        print("📁 Step 1: Creating directory structure backup...")
        self.backup_directory_structure()
        
        # Step 2: Backup critical files
        print("📄 Step 2: Backing up critical files...")
        self.backup_critical_files()
        
        # Step 3: Create project state snapshot
        print("📊 Step 3: Creating project state snapshot...")
        self.create_project_snapshot()
        
        # Step 4: Backup git status
        print("🔧 Step 4: Backing up git status...")
        self.backup_git_status()
        
        # Step 5: Create backup manifest
        print("📋 Step 5: Creating backup manifest...")
        self.create_backup_manifest()
        
        print(f"\n🎉 COMPREHENSIVE BACKUP COMPLETE!")
        print(f"   Backup Location: {self.backup_dir}")
        print(f"   Ready for Phase 1 implementation")
        
        return str(self.backup_dir)
    
    def backup_directory_structure(self):
        """Backup current directory structure."""
        structure_file = self.backup_dir / "directory_structure.txt"
        
        with open(structure_file, 'w') as f:
            f.write("PROJECT DIRECTORY STRUCTURE BACKUP\n")
            f.write("=" * 50 + "\n")
            f.write(f"Generated: {datetime.now().isoformat()}\n")
            f.write(f"Project Root: {self.project_root}\n\n")
            
            for root, dirs, files in os.walk(str(self.project_root)):
                # Skip backup directories and node_modules
                if "optimization_backups" in root or "node_modules" in root:
                    continue
                    
                level = root.replace(str(self.project_root), '').count(os.sep)
                indent = '  ' * level
                f.write(f"{indent}{os.path.basename(root)}/\n")
                
                for file in files:
                    f.write(f"{indent}  {file}\n")
        
        print(f"      ✅ Directory structure backed up to: {structure_file}")
    
    def backup_critical_files(self):
        """Backup critical project files."""
        critical_patterns = [
            "*.py", "*.js", "*.ts", "*.tsx", "*.json", "*.yml", "*.yaml",
            "*.md", "*.txt", "*.sh", "*.env*", "package.json", "tsconfig.json"
        ]
        
        critical_dir = self.backup_dir / "critical_files"
        critical_dir.mkdir(exist_ok=True)
        
        for pattern in critical_patterns:
            files = list(self.project_root.glob(pattern))
            for file in files:
                if file.is_file() and "optimization_backups" not in str(file):
                    try:
                        # Create relative path structure
                        relative_path = file.relative_to(self.project_root)
                        backup_path = critical_dir / relative_path
                        backup_path.parent.mkdir(parents=True, exist_ok=True)
                        
                        # Copy file
                        shutil.copy2(file, backup_path)
                    except Exception as e:
                        print(f"      ⚠️  Warning: Could not backup {file}: {e}")
        
        print(f"      ✅ Critical files backed up to: {critical_dir}")
    
    def create_project_snapshot(self):
        """Create comprehensive project state snapshot."""
        snapshot_file = self.backup_dir / "project_snapshot.json"
        
        snapshot = {
            "timestamp": datetime.now().isoformat(),
            "project_root": str(self.project_root),
            "backup_location": str(self.backup_dir),
            "file_counts": self.count_files_by_type(),
            "directory_stats": self.get_directory_stats(),
            "git_info": self.get_git_info()
        }
        
        with open(snapshot_file, 'w') as f:
            json.dump(snapshot, f, indent=2)
        
        print(f"      ✅ Project snapshot created: {snapshot_file}")
    
    def count_files_by_type(self):
        """Count files by type."""
        file_counts = {}
        
        for root, dirs, files in os.walk(str(self.project_root)):
            if "optimization_backups" in root or "node_modules" in root:
                continue
                
            for file in files:
                ext = Path(file).suffix
                file_counts[ext] = file_counts.get(ext, 0) + 1
        
        return file_counts
    
    def get_directory_stats(self):
        """Get directory statistics."""
        stats = {
            "total_dirs": 0,
            "total_files": 0,
            "max_depth": 0,
            "root_items": 0
        }
        
        try:
            root_items = list(self.project_root.iterdir())
            stats["root_items"] = len(root_items)
        except:
            stats["root_items"] = 0
        
        for root, dirs, files in os.walk(str(self.project_root)):
            if "optimization_backups" in root or "node_modules" in root:
                continue
                
            stats["total_dirs"] += len(dirs)
            stats["total_files"] += len(files)
            
            depth = len(Path(root).relative_to(self.project_root).parts)
            stats["max_depth"] = max(stats["max_depth"], depth)
        
        return stats
    
    def get_git_info(self):
        """Get git repository information."""
        git_info = {}
        
        try:
            # Get current branch
            result = subprocess.run(["git", "branch", "--show-current"], 
                                  capture_output=True, text=True, cwd=self.project_root)
            git_info["current_branch"] = result.stdout.strip()
            
            # Get last commit
            result = subprocess.run(["git", "log", "-1", "--oneline"], 
                                  capture_output=True, text=True, cwd=self.project_root)
            git_info["last_commit"] = result.stdout.strip()
            
            # Get git status
            result = subprocess.run(["git", "status", "--porcelain"], 
                                  capture_output=True, text=True, cwd=self.project_root)
            git_info["git_status"] = result.stdout.strip()
            
        except Exception as e:
            git_info["error"] = str(e)
        
        return git_info
    
    def backup_git_status(self):
        """Backup current git status."""
        git_status_file = self.backup_dir / "git_status.txt"
        
        try:
            with open(git_status_file, 'w') as f:
                f.write("GIT STATUS BACKUP\n")
                f.write("=" * 30 + "\n")
                f.write(f"Generated: {datetime.now().isoformat()}\n\n")
                
                # Current branch
                result = subprocess.run(["git", "branch", "--show-current"], 
                                      capture_output=True, text=True, cwd=self.project_root)
                f.write(f"Current Branch: {result.stdout.strip()}\n\n")
                
                # Git status
                result = subprocess.run(["git", "status"], 
                                      capture_output=True, text=True, cwd=self.project_root)
                f.write("Git Status:\n")
                f.write(result.stdout)
                
                # Recent commits
                result = subprocess.run(["git", "log", "--oneline", "-10"], 
                                      capture_output=True, text=True, cwd=self.project_root)
                f.write("\nRecent Commits:\n")
                f.write(result.stdout)
                
        except Exception as e:
            with open(git_status_file, 'w') as f:
                f.write(f"Error getting git status: {e}")
        
        print(f"      ✅ Git status backed up to: {git_status_file}")
    
    def create_backup_manifest(self):
        """Create backup manifest file."""
        manifest_file = self.backup_dir / "BACKUP_MANIFEST.md"
        
        with open(manifest_file, 'w') as f:
            f.write("# Phase 1 Optimization Backup Manifest\n\n")
            f.write(f"**Backup Created:** {datetime.now().isoformat()}\n")
            f.write(f"**Backup Location:** {self.backup_dir}\n")
            f.write(f"**Project Root:** {self.project_root}\n\n")
            
            f.write("## Backup Contents\n\n")
            f.write("1. **directory_structure.txt** - Complete project directory structure\n")
            f.write("2. **critical_files/** - All critical project files\n")
            f.write("3. **project_snapshot.json** - Comprehensive project state\n")
            f.write("4. **git_status.txt** - Current git repository state\n")
            f.write("5. **BACKUP_MANIFEST.md** - This manifest file\n\n")
            
            f.write("## Purpose\n\n")
            f.write("This backup preserves the current project state before beginning Phase 1\n")
            f.write("project structure optimization. It can be used to restore the project\n")
            f.write("to its current state if needed during the optimization process.\n\n")
            
            f.write("## Restoration Instructions\n\n")
            f.write("To restore from this backup:\n")
            f.write("1. Review the backup contents\n")
            f.write("2. Copy critical files back to their original locations\n")
            f.write("3. Restore git state if necessary\n")
            f.write("4. Verify project functionality\n\n")
            
            f.write("## Phase 1 Optimization Goals\n\n")
            f.write("- Reduce directory depth from 11 to ≤4 levels\n")
            f.write("- Implement backup management system\n")
            f.write("- Organize root directory (174 items → 8-12 categories)\n")
            f.write("- Improve project maintainability and user experience\n")
        
        print(f"      ✅ Backup manifest created: {manifest_file}")

if __name__ == "__main__":
    try:
        backup_creator = Phase1BackupCreator()
        backup_location = backup_creator.create_comprehensive_backup()
        
        print(f"\n🎉 Phase 1 backup creation complete!")
        print(f"   Backup location: {backup_location}")
        print(f"   Ready to proceed with Phase 1 implementation")
            
    except Exception as e:
        print(f"❌ Phase 1 backup creation failed: {e}")
        import traceback
        traceback.print_exc()

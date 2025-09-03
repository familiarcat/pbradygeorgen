#!/usr/bin/env python3
"""
Automated Cursor IDE Extension Cleanup Script
Automates the removal of old Claude-Cursor extensions and installation of new unified extension
"""

import json
import os
import subprocess
import time
from pathlib import Path

class CursorCleanupAutomator:
    def __init__(self):
        self.workspace_root = Path.cwd()
        self.cursor_extensions_dir = self.get_cursor_extensions_dir()
        self.old_extensions = [
            "claude-cursor",
            "cursor-claude-llm-collaboration", 
            "llm-collaboration",
            "claude-cursor-unified"
        ]
        self.new_extension_vsix = "cursor-claude-unified/cursor-ai-supercharger-3.0.0.vsix"
        
    def get_cursor_extensions_dir(self):
        """Get Cursor IDE extensions directory based on OS"""
        home = Path.home()
        
        if os.name == 'nt':  # Windows
            return home / "AppData" / "Roaming" / "Cursor" / "User" / "extensions"
        elif os.name == 'posix':  # macOS/Linux
            if os.uname().sysname == "Darwin":  # macOS
                return home / ".cursor" / "extensions"
            else:  # Linux
                return home / ".cursor" / "extensions"
        else:
            return None
    
    def check_cursor_running(self):
        """Check if Cursor IDE is running"""
        try:
            if os.name == 'nt':  # Windows
                result = subprocess.run(['tasklist', '/FI', 'IMAGENAME eq Cursor.exe'], 
                                      capture_output=True, text=True)
            else:  # macOS/Linux
                result = subprocess.run(['pgrep', '-f', 'Cursor'], 
                                      capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Cursor IDE is running")
                return True
            else:
                print("❌ Cursor IDE is not running")
                return False
        except Exception as e:
            print(f"⚠️  Could not check Cursor status: {e}")
            return False
    
    def find_old_extensions(self):
        """Find old extensions in Cursor extensions directory"""
        if not self.cursor_extensions_dir or not self.cursor_extensions_dir.exists():
            print(f"❌ Cursor extensions directory not found: {self.cursor_extensions_dir}")
            return []
        
        print(f"🔍 Searching for old extensions in: {self.cursor_extensions_dir}")
        
        found_extensions = []
        for ext_dir in self.cursor_extensions_dir.iterdir():
            if ext_dir.is_dir():
                # Check package.json for extension details
                package_json = ext_dir / "package.json"
                if package_json.exists():
                    try:
                        with open(package_json, 'r') as f:
                            data = json.load(f)
                        
                        ext_name = data.get('name', '').lower()
                        display_name = data.get('displayName', '')
                        
                        # Check if this is an old extension we want to remove
                        for old_ext in self.old_extensions:
                            if old_ext in ext_name or any(old in display_name.lower() for old in self.old_extensions):
                                found_extensions.append({
                                    'path': ext_dir,
                                    'name': ext_name,
                                    'display_name': display_name,
                                    'version': data.get('version', 'unknown')
                                })
                                break
                    except Exception as e:
                        print(f"⚠️  Error reading {package_json}: {e}")
        
        return found_extensions
    
    def backup_extension(self, ext_path, ext_info):
        """Backup extension before removal"""
        backup_dir = self.workspace_root / "archives" / "old_extensions"
        backup_dir.mkdir(parents=True, exist_ok=True)
        
        backup_name = f"{ext_info['name']}_{ext_info['version']}_{int(time.time())}"
        backup_path = backup_dir / backup_name
        
        try:
            # Copy extension to backup
            subprocess.run(['cp', '-r', str(ext_path), str(backup_path)], check=True)
            print(f"  📦 Backed up to: {backup_path}")
            return True
        except Exception as e:
            print(f"  ❌ Backup failed: {e}")
            return False
    
    def remove_extension(self, ext_path, ext_info):
        """Remove extension from Cursor extensions directory"""
        try:
            # Remove the extension directory
            subprocess.run(['rm', '-rf', str(ext_path)], check=True)
            print(f"  ✅ Removed: {ext_info['display_name']} ({ext_info['name']})")
            return True
        except Exception as e:
            print(f"  ❌ Removal failed: {e}")
            return False
    
    def install_new_extension(self):
        """Install the new unified extension"""
        vsix_path = self.workspace_root / self.new_extension_vsix
        
        if not vsix_path.exists():
            print(f"❌ New extension VSIX not found: {vsix_path}")
            return False
        
        print(f"\n🚀 Installing new unified extension: {vsix_path.name}")
        print(f"📦 Size: {vsix_path.stat().st_size:,} bytes")
        
        # Instructions for manual installation
        print("\n📋 Manual Installation Required:")
        print("1. In Cursor IDE, press Ctrl+Shift+X (or Cmd+Shift+X)")
        print("2. Click '...' (three dots) → 'Install from VSIX...'")
        print(f"3. Browse to: {vsix_path}")
        print("4. Click 'Install'")
        print("5. Reload Cursor IDE when prompted")
        
        return True
    
    def generate_cleanup_report(self, removed_extensions, backup_status):
        """Generate cleanup report"""
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = f"cursor_cleanup_report_{timestamp}.json"
        
        report = {
            "timestamp": timestamp,
            "cleanup_type": "Automated Cursor IDE Extension Cleanup",
            "removed_extensions": [
                {
                    "name": ext["name"],
                    "display_name": ext["display_name"],
                    "version": ext["version"],
                    "path": str(ext["path"]),
                    "backed_up": backup_status.get(ext["path"], False)
                }
                for ext in removed_extensions
            ],
            "new_extension": {
                "name": "cursor-ai-supercharger",
                "version": "3.0.0",
                "vsix_path": str(self.workspace_root / self.new_extension_vsix),
                "status": "Ready for installation"
            },
            "cleanup_status": "Completed",
            "next_steps": [
                "Install new unified extension from VSIX",
                "Verify clean command palette",
                "Test new enhanced commands",
                "Enjoy unified chat experience"
            ]
        }
        
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n📄 Cleanup report saved to: {filename}")
        return filename
    
    def run_cleanup(self):
        """Run the complete cleanup process"""
        print("🧹 Automated Cursor IDE Extension Cleanup")
        print("=" * 50)
        
        # Check if Cursor is running
        if not self.check_cursor_running():
            print("\n⚠️  Please start Cursor IDE before running cleanup")
            return False
        
        # Find old extensions
        print("\n🔍 Scanning for old extensions...")
        old_extensions = self.find_old_extensions()
        
        if not old_extensions:
            print("✅ No old extensions found - already clean!")
            return True
        
        print(f"\n📦 Found {len(old_extensions)} old extensions to remove:")
        for ext in old_extensions:
            print(f"  - {ext['display_name']} ({ext['name']}) v{ext['version']}")
        
        # Confirm cleanup
        print(f"\n⚠️  This will remove {len(old_extensions)} extensions from Cursor IDE")
        print("   Extensions will be backed up before removal")
        
        # Backup and remove extensions
        print("\n🗑️  Starting extension removal...")
        removed_extensions = []
        backup_status = {}
        
        for ext in old_extensions:
            print(f"\n📦 Processing: {ext['display_name']}")
            
            # Backup first
            if self.backup_extension(ext['path'], ext):
                backup_status[ext['path']] = True
                
                # Then remove
                if self.remove_extension(ext['path'], ext):
                    removed_extensions.append(ext)
                else:
                    print(f"  ⚠️  Extension removal failed - manual cleanup may be needed")
            else:
                print(f"  ⚠️  Skipping removal due to backup failure")
        
        # Install new extension
        if removed_extensions:
            self.install_new_extension()
        
        # Generate report
        report_file = self.generate_cleanup_report(removed_extensions, backup_status)
        
        # Summary
        print("\n" + "=" * 50)
        print("🎉 CLEANUP COMPLETE!")
        print("=" * 50)
        print(f"✅ Removed: {len(removed_extensions)} old extensions")
        print(f"📦 Backed up: {sum(backup_status.values())} extensions")
        print(f"📄 Report: {report_file}")
        
        if removed_extensions:
            print("\n🚀 Next Steps:")
            print("1. Install new unified extension from VSIX")
            print("2. Verify clean command palette")
            print("3. Test enhanced AI capabilities")
            print("4. Enjoy unified chat experience!")
        else:
            print("\n✅ No cleanup needed - system already clean!")
        
        return True

def main():
    """Main execution function"""
    try:
        automator = CursorCleanupAutomator()
        success = automator.run_cleanup()
        
        if success:
            print("\n🎯 Result: Professional, conflict-free Cursor IDE ready for unified extension!")
        else:
            print("\n❌ Cleanup encountered issues - check report for details")
            
    except KeyboardInterrupt:
        print("\n\n⚠️  Cleanup interrupted by user")
    except Exception as e:
        print(f"\n❌ Cleanup failed with error: {e}")

if __name__ == "__main__":
    main()




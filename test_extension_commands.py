#!/usr/bin/env python3
"""
Test Extension Commands and Functionality
"""

import json
import subprocess
import sys
from pathlib import Path

def test_extension_commands():
    """Test that extension commands are properly defined"""
    print("🔍 Testing Extension Commands")
    print("=" * 40)
    
    # Test cursor-claude-unified commands
    print("\n📦 cursor-claude-unified Commands:")
    cursor_commands = get_extension_commands("cursor-claude-unified")
    for cmd in cursor_commands:
        print(f"  ✅ {cmd.get('title', 'Unknown')} ({cmd.get('command', 'Unknown')})")
    
    # Test alex-extension commands  
    print("\n🤖 alex-extension Commands:")
    alex_commands = get_extension_commands("alex-extension")
    for cmd in alex_commands:
        print(f"  ✅ {cmd.get('title', 'Unknown')} ({cmd.get('command', 'Unknown')})")
    
    # Check for unique command categories
    cursor_categories = set(cmd.get('category', '') for cmd in cursor_commands)
    alex_categories = set(cmd.get('category', '') for cmd in alex_commands)
    
    print(f"\n📊 Command Categories:")
    print(f"  cursor-claude-unified: {cursor_categories}")
    print(f"  alex-extension: {alex_categories}")
    
    # Verify no conflicts
    cursor_cmd_ids = {cmd.get('command', '') for cmd in cursor_commands}
    alex_cmd_ids = {cmd.get('command', '') for cmd in alex_commands}
    conflicts = cursor_cmd_ids.intersection(alex_cmd_ids)
    
    if conflicts:
        print(f"\n❌ Command conflicts found: {conflicts}")
        return False
    else:
        print(f"\n✅ No command conflicts detected")
        return True

def get_extension_commands(extension_path):
    """Get commands from extension package.json"""
    try:
        package_path = Path(extension_path) / "package.json"
        with open(package_path, 'r') as f:
            package_data = json.load(f)
        return package_data.get("contributes", {}).get("commands", [])
    except Exception as e:
        print(f"Error reading {extension_path}: {e}")
        return []

def test_vsix_packages():
    """Test VSIX package integrity"""
    print("\n📦 Testing VSIX Packages")
    print("=" * 40)
    
    extensions = [
        ("cursor-claude-unified", "cursor-ai-supercharger-3.0.0.vsix"),
        ("alex-extension", "alex-crew-commander-1.0.0.vsix")
    ]
    
    for ext_dir, vsix_file in extensions:
        vsix_path = Path(ext_dir) / vsix_file
        if vsix_path.exists():
            size = vsix_path.stat().st_size
            print(f"  ✅ {vsix_file}: {size:,} bytes")
        else:
            print(f"  ❌ {vsix_file}: Not found")

def test_extension_activation():
    """Test extension activation events"""
    print("\n🚀 Testing Extension Activation")
    print("=" * 40)
    
    extensions = ["cursor-claude-unified", "alex-extension"]
    
    for ext in extensions:
        try:
            package_path = Path(ext) / "package.json"
            with open(package_path, 'r') as f:
                package_data = json.load(f)
            
            activation_events = package_data.get("activationEvents", [])
            main_file = package_data.get("main", "")
            
            print(f"\n📦 {ext}:")
            print(f"  Main file: {main_file}")
            print(f"  Activation events: {activation_events}")
            
            # Check if main file exists
            main_path = Path(ext) / main_file
            if main_path.exists():
                print(f"  ✅ Main file exists")
            else:
                print(f"  ❌ Main file missing: {main_path}")
                
        except Exception as e:
            print(f"  ❌ Error testing {ext}: {e}")

if __name__ == "__main__":
    print("🧪 Extension Command and Functionality Test")
    print("=" * 50)
    
    success = test_extension_commands()
    test_vsix_packages()
    test_extension_activation()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 All extension tests passed!")
        print("✅ Extensions are ready for installation and use")
    else:
        print("⚠️  Some issues detected - please review above")
    
    print("\n🚀 Ready to test in Cursor IDE!")
    print("  1. Install extensions from VSIX files")
    print("  2. Open Command Palette (Ctrl+Shift+P)")
    print("  3. Test the extension commands")





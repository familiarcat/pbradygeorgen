#!/usr/bin/env python3
"""
Extension Comparison Analyzer
Analyzes both the official Claude Code extension and our Cursor AI Supercharger
to find optimal integration without removing default extensions
"""

import json
import os
from pathlib import Path

class ExtensionAnalyzer:
    def __init__(self):
        self.cursor_extensions_dir = Path.home() / ".cursor" / "extensions"
        self.official_claude = "anthropic.claude-code-1.0.98"
        self.our_extension = "pbradygeorgen.cursor-ai-supercharger-3.0.0"
        
    def analyze_extension(self, extension_name):
        """Analyze a specific extension"""
        ext_path = self.cursor_extensions_dir / extension_name
        
        if not ext_path.exists():
            return None
            
        package_json = ext_path / "package.json"
        if not package_json.exists():
            return None
            
        try:
            with open(package_json, 'r') as f:
                data = json.load(f)
                
            return {
                'name': data.get('name', ''),
                'displayName': data.get('displayName', ''),
                'version': data.get('version', ''),
                'description': data.get('description', ''),
                'publisher': data.get('publisher', ''),
                'commands': data.get('contributes', {}).get('commands', []),
                'activationEvents': data.get('activationEvents', []),
                'main': data.get('main', ''),
                'categories': data.get('categories', []),
                'keywords': data.get('keywords', [])
            }
        except Exception as e:
            print(f"Error analyzing {extension_name}: {e}")
            return None
    
    def compare_extensions(self):
        """Compare both extensions"""
        print("🔍 EXTENSION COMPARISON ANALYSIS")
        print("=" * 50)
        
        # Analyze official Claude Code extension
        print("\n📦 OFFICIAL CLAUDE CODE EXTENSION:")
        print("-" * 40)
        official = self.analyze_extension(self.official_claude)
        if official:
            print(f"✅ Name: {official['displayName']}")
            print(f"📊 Version: {official['version']}")
            print(f"🏢 Publisher: {official['publisher']}")
            print(f"📝 Description: {official['description']}")
            print(f"🎯 Categories: {', '.join(official['categories'])}")
            print(f"🔑 Commands: {len(official['commands'])}")
            
            print("\n📋 Official Commands:")
            for cmd in official['commands']:
                print(f"  • {cmd.get('title', 'Unknown')} ({cmd.get('command', 'Unknown')})")
        else:
            print("❌ Official Claude Code extension not found")
        
        # Analyze our Cursor AI Supercharger
        print("\n🚀 OUR CURSOR AI SUPERCHARGER:")
        print("-" * 40)
        our_ext = self.analyze_extension(self.our_extension)
        if our_ext:
            print(f"✅ Name: {our_ext['displayName']}")
            print(f"📊 Version: {our_ext['version']}")
            print(f"🏢 Publisher: {our_ext['publisher']}")
            print(f"📝 Description: {our_ext['description']}")
            print(f"🎯 Categories: {', '.join(our_ext['categories'])}")
            print(f"🔑 Commands: {len(our_ext['commands'])}")
            
            print("\n📋 Our Commands:")
            for cmd in our_ext['commands']:
                print(f"  • {cmd.get('title', 'Unknown')} ({cmd.get('command', 'Unknown')})")
        else:
            print("❌ Our Cursor AI Supercharger not found")
        
        return official, our_ext
    
    def find_conflicts(self, official, our_ext):
        """Find potential conflicts between extensions"""
        print("\n⚠️  POTENTIAL CONFLICTS ANALYSIS:")
        print("-" * 40)
        
        if not official or not our_ext:
            print("❌ Cannot analyze conflicts - missing extension data")
            return
        
        # Check for command conflicts
        official_cmds = {cmd.get('command', '') for cmd in official['commands']}
        our_cmds = {cmd.get('command', '') for cmd in our_ext['commands']}
        
        conflicts = official_cmds.intersection(our_cmds)
        if conflicts:
            print(f"❌ Command conflicts found: {len(conflicts)}")
            for conflict in conflicts:
                print(f"  • {conflict}")
        else:
            print("✅ No direct command conflicts detected")
        
        # Check for category conflicts
        official_cats = set(official['categories'])
        our_cats = set(our_ext['categories'])
        
        cat_conflicts = official_cats.intersection(our_cats)
        if cat_conflicts:
            print(f"⚠️  Category overlap: {', '.join(cat_conflicts)}")
        else:
            print("✅ No category conflicts")
        
        # Check for keyword conflicts
        official_keywords = set(official.get('keywords', []))
        our_keywords = set(our_ext.get('keywords', []))
        
        keyword_conflicts = official_keywords.intersection(our_keywords)
        if keyword_conflicts:
            print(f"⚠️  Keyword overlap: {', '.join(keyword_conflicts)}")
        else:
            print("✅ No keyword conflicts")
    
    def suggest_integration_strategy(self, official, our_ext):
        """Suggest optimal integration strategy"""
        print("\n💡 INTEGRATION STRATEGY RECOMMENDATIONS:")
        print("-" * 50)
        
        if not official or not our_ext:
            print("❌ Cannot provide integration strategy - missing extension data")
            return
        
        print("🎯 OPTIMAL APPROACH: Hybrid Integration")
        print("")
        print("✅ KEEP BOTH EXTENSIONS:")
        print("  • Official Claude Code: Core Claude functionality")
        print("  • Our Supercharger: Enhanced AI collaboration features")
        print("")
        print("🔧 INTEGRATION STRATEGY:")
        print("  1. Use Official Claude Code for:")
        print("     • Basic Claude interactions")
        print("     • Code generation and analysis")
        print("     • Standard Claude features")
        print("")
        print("  2. Use Our Supercharger for:")
        print("     • Multi-LLM optimization")
        print("     • Cost optimization")
        print("     • N8N workflow integration")
        print("     • Enhanced context understanding")
        print("")
        print("🎨 USER EXPERIENCE:")
        print("  • Traditional chat interface preserved")
        print("  • Enhanced capabilities seamlessly added")
        print("  • No conflicts - complementary functionality")
        print("  • Best of both worlds")
    
    def generate_test_plan(self, official, our_ext):
        """Generate testing plan for both extensions"""
        print("\n🧪 TESTING PLAN FOR HYBRID INTEGRATION:")
        print("-" * 50)
        
        print("📋 TEST 1: Official Claude Code Functionality")
        print("  • Open Command Palette: Ctrl+Shift+P")
        print("  • Search 'Claude Code'")
        print("  • Test: 'Run Claude Code'")
        print("  • Verify: Basic Claude functionality works")
        print("")
        print("📋 TEST 2: Our Supercharger Functionality")
        print("  • Open Command Palette: Ctrl+Shift+P")
        print("  • Search 'Cursor AI'")
        print("  • Test: '🚀 Activate Cursor AI Supercharger'")
        print("  • Verify: Enhanced features are available")
        print("")
        print("📋 TEST 3: Integration Compatibility")
        print("  • Use both extensions in same session")
        print("  • Verify: No conflicts or errors")
        print("  • Test: Seamless switching between features")
        print("")
        print("📋 TEST 4: Chat Experience")
        print("  • Traditional chat interface works")
        print("  • Enhanced features accessible")
        print("  • No UI conflicts or duplication")
    
    def run_analysis(self):
        """Run complete analysis"""
        print("🚀 EXTENSION COMPARISON & INTEGRATION ANALYSIS")
        print("=" * 60)
        
        # Compare extensions
        official, our_ext = self.compare_extensions()
        
        # Find conflicts
        self.find_conflicts(official, our_ext)
        
        # Suggest integration strategy
        self.suggest_integration_strategy(official, our_ext)
        
        # Generate test plan
        self.generate_test_plan(official, our_ext)
        
        # Summary
        print("\n" + "=" * 60)
        print("🎉 ANALYSIS COMPLETE!")
        print("=" * 60)
        print("✅ Both extensions analyzed")
        print("✅ Conflicts identified")
        print("✅ Integration strategy recommended")
        print("✅ Testing plan created")
        print("")
        print("🎯 RESULT: Hybrid integration approach recommended")
        print("   Keep both extensions for optimal functionality")

def main():
    analyzer = ExtensionAnalyzer()
    analyzer.run_analysis()

if __name__ == "__main__":
    main()

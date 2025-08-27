#!/usr/bin/env python3
"""
Clean Riker Template
Removes all non-essential fields that cause API rejection.
"""

import json
from typing import Dict

class RikerTemplateCleaner:
    def __init__(self):
        self.input_file = "riker_corrected_template.json"
        self.output_file = "riker_clean_template.json"
    
    def load_template(self) -> Dict:
        """Load the current Riker template."""
        try:
            with open(self.input_file, 'r') as f:
                template = json.load(f)
            print(f"✅ Loaded template: {self.input_file}")
            print(f"📊 Current fields: {list(template.keys())}")
            return template
        except Exception as e:
            print(f"❌ Failed to load template: {e}")
            return {}
    
    def clean_template(self, template: Dict) -> Dict:
        """Clean the template to remove all non-essential fields."""
        print(f"\n🧹 CLEANING TEMPLATE...")
        print("=" * 40)
        
        # Keep only essential fields
        essential_fields = ['name', 'nodes', 'connections', 'settings']
        
        cleaned_template = {}
        for field in essential_fields:
            if field in template:
                cleaned_template[field] = template[field]
                print(f"   ✅ Kept: {field}")
            else:
                print(f"   ⚠️  Missing: {field}")
        
        # Remove problematic fields
        removed_fields = []
        for field in template.keys():
            if field not in essential_fields:
                removed_fields.append(field)
                print(f"   🗑️  Removed: {field}")
        
        print(f"\n📊 CLEANING RESULTS:")
        print(f"   ✅ Kept: {len(essential_fields)} essential fields")
        print(f"   🗑️  Removed: {len(removed_fields)} problematic fields")
        print(f"   📋 Removed fields: {removed_fields}")
        
        return cleaned_template
    
    def save_clean_template(self, template: Dict):
        """Save the cleaned template."""
        try:
            with open(self.output_file, 'w') as f:
                json.dump(template, f, indent=2)
            print(f"\n💾 Clean template saved: {self.output_file}")
            print(f"📊 Template size: {len(json.dumps(template))} characters")
        except Exception as e:
            print(f"❌ Failed to save template: {e}")
    
    def run_cleaning(self):
        """Run the complete template cleaning process."""
        print("🧹 CLEANING RIKER TEMPLATE FOR API COMPATIBILITY")
        print("=" * 70)
        
        # Step 1: Load template
        print("📁 Step 1: Loading current template...")
        template = self.load_template()
        
        if not template:
            print("❌ Failed to load template!")
            return None
        
        # Step 2: Clean template
        print("\n🧹 Step 2: Cleaning template...")
        cleaned_template = self.clean_template(template)
        
        # Step 3: Save clean template
        print("\n💾 Step 3: Saving clean template...")
        self.save_clean_template(cleaned_template)
        
        print(f"\n🎉 TEMPLATE CLEANING COMPLETE!")
        print("✅ Template is now API compatible")
        print("✅ Only essential fields remain")
        print("✅ Ready for deployment")
        
        return cleaned_template

if __name__ == "__main__":
    try:
        cleaner = RikerTemplateCleaner()
        clean_template = cleaner.run_cleaning()
        
        if clean_template:
            print(f"\n🚀 Clean template is ready for deployment!")
        else:
            print(f"\n❌ Template cleaning failed!")
            
    except Exception as e:
        print(f"❌ Template cleaning failed: {e}")

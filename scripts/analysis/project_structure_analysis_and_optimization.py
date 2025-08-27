#!/usr/bin/env python3
"""
Project Structure Analysis and Optimization
Analyzes project structure from technical and user experience perspectives.
Team: Commander Data (Technical) + Counselor Troi (UX/Workflow)
"""

import os
import json
from pathlib import Path
from typing import Dict, List, Tuple
from datetime import datetime
import re

class ProjectStructureAnalyzer:
    def __init__(self):
        self.project_root = Path.cwd()
        self.analysis_results = {}
        self.optimization_recommendations = []
        
    def analyze_directory_structure(self, directory: Path, max_depth: int = 3, current_depth: int = 0) -> Dict:
        """Analyze directory structure recursively."""
        if current_depth > max_depth:
            return {"type": "truncated", "depth": current_depth}
        
        structure = {
            "name": directory.name,
            "path": str(directory.relative_to(self.project_root)),
            "type": "directory",
            "depth": current_depth,
            "contents": [],
            "file_count": 0,
            "dir_count": 0,
            "size_estimate": 0
        }
        
        try:
            for item in directory.iterdir():
                if item.is_file():
                    structure["contents"].append({
                        "name": item.name,
                        "type": "file",
                        "extension": item.suffix,
                        "size": item.stat().st_size if item.exists() else 0
                    })
                    structure["file_count"] += 1
                    structure["size_estimate"] += item.stat().st_size if item.exists() else 0
                elif item.is_dir():
                    if current_depth < max_depth:
                        sub_structure = self.analyze_directory_structure(item, max_depth, current_depth + 1)
                        structure["contents"].append(sub_structure)
                        structure["dir_count"] += 1
                    else:
                        structure["contents"].append({
                            "name": item.name,
                            "type": "directory",
                            "depth": current_depth + 1,
                            "contents": f"[{len(list(item.iterdir()))} items]"
                        })
                        structure["dir_count"] += 1
        except PermissionError:
            structure["contents"].append({"type": "error", "message": "Permission denied"})
        
        return structure
    
    def analyze_file_patterns(self) -> Dict:
        """Analyze file patterns and organization."""
        patterns = {
            "scripts": {"count": 0, "types": {}, "locations": []},
            "docs": {"count": 0, "types": {}, "locations": []},
            "config": {"count": 0, "types": {}, "locations": []},
            "backups": {"count": 0, "types": {}, "locations": []},
            "workflows": {"count": 0, "types": {}, "locations": []}
        }
        
        for root, dirs, files in os.walk(str(self.project_root)):
            for file in files:
                file_path = Path(root) / file
                relative_path = file_path.relative_to(self.project_root)
                
                # Categorize files
                if "scripts" in str(relative_path):
                    patterns["scripts"]["count"] += 1
                    patterns["scripts"]["types"][file.suffix] = patterns["scripts"]["types"].get(file.suffix, 0) + 1
                    patterns["scripts"]["locations"].append(str(relative_path))
                elif "docs" in str(relative_path):
                    patterns["docs"]["count"] += 1
                    patterns["docs"]["types"][file.suffix] = patterns["docs"]["types"].get(file.suffix, 0) + 1
                    patterns["docs"]["locations"].append(str(relative_path))
                elif "config" in str(relative_path) or file.name.endswith(('.json', '.yml', '.yaml', '.env')):
                    patterns["config"]["count"] += 1
                    patterns["config"]["types"][file.suffix] = patterns["config"]["types"].get(file.suffix, 0) + 1
                    patterns["config"]["locations"].append(str(relative_path))
                elif "backup" in str(relative_path) or "backup" in file.name.lower():
                    patterns["backups"]["count"] += 1
                    patterns["backups"]["types"][file.suffix] = patterns["backups"]["types"].get(file.suffix, 0) + 1
                    patterns["backups"]["locations"].append(str(relative_path))
                elif "workflow" in str(relative_path) or file.name.endswith('.json'):
                    patterns["workflows"]["count"] += 1
                    patterns["workflows"]["types"][file.suffix] = patterns["workflows"]["types"].get(file.suffix, 0) + 1
                    patterns["workflows"]["locations"].append(str(relative_path))
        
        return patterns
    
    def commander_data_technical_analysis(self, structure: Dict, patterns: Dict) -> List[str]:
        """Commander Data's technical analysis and recommendations."""
        recommendations = []
        
        # Analyze directory depth and complexity
        max_depth = max([item.get("depth", 0) for item in self._flatten_structure(structure)])
        if max_depth > 4:
            recommendations.append("🔧 TECHNICAL: Directory depth exceeds optimal levels (>4). Consider flattening structure for better maintainability.")
        
        # Analyze file organization
        script_count = patterns["scripts"]["count"]
        if script_count > 50:
            recommendations.append("🔧 TECHNICAL: High script count ({}). Consider grouping scripts by functionality into subdirectories.".format(script_count))
        
        # Analyze backup organization
        backup_count = patterns["backups"]["count"]
        if backup_count > 20:
            recommendations.append("🔧 TECHNICAL: Excessive backup files ({}). Implement automated cleanup and archival strategy.".format(backup_count))
        
        # Analyze configuration spread
        config_locations = len(set([Path(loc).parent for loc in patterns["config"]["locations"]]))
        if config_locations > 5:
            recommendations.append("🔧 TECHNICAL: Configuration files scattered across {} locations. Consolidate into centralized config directory.".format(config_locations))
        
        # Analyze workflow organization
        workflow_count = patterns["workflows"]["count"]
        if workflow_count > 30:
            recommendations.append("🔧 TECHNICAL: High workflow count ({}). Implement workflow categorization and versioning system.".format(workflow_count))
        
        return recommendations
    
    def counselor_troi_ux_analysis(self, structure: Dict, patterns: Dict) -> List[str]:
        """Counselor Troi's user experience and workflow analysis."""
        recommendations = []
        
        # Analyze cognitive load
        root_items = len(structure.get("contents", []))
        if root_items > 15:
            recommendations.append("🧠 UX: Root directory contains {} items. High cognitive load - consider grouping related items into logical categories.".format(root_items))
        
        # Analyze naming consistency
        naming_patterns = self._analyze_naming_consistency(structure)
        if naming_patterns["inconsistent"] > naming_patterns["consistent"]:
            recommendations.append("🧠 UX: Inconsistent naming patterns detected. Standardize naming conventions for better discoverability.")
        
        # Analyze file type organization
        mixed_types = self._analyze_mixed_file_types(structure)
        if mixed_types > 10:
            recommendations.append("🧠 UX: {} directories contain mixed file types. Separate by content type for better organization.".format(mixed_types))
        
        # Analyze workflow accessibility
        if patterns["workflows"]["count"] > 0:
            workflow_accessibility = self._analyze_workflow_accessibility(patterns["workflows"]["locations"])
            if workflow_accessibility < 0.7:
                recommendations.append("🧠 UX: Workflow accessibility below optimal levels. Improve organization and documentation for better user experience.")
        
        return recommendations
    
    def _flatten_structure(self, structure: Dict) -> List[Dict]:
        """Flatten nested structure for analysis."""
        items = [structure]
        for item in structure.get("contents", []):
            if isinstance(item, dict):
                items.extend(self._flatten_structure(item))
        return items
    
    def _analyze_naming_consistency(self, structure: Dict) -> Dict:
        """Analyze naming consistency across directories."""
        items = self._flatten_structure(structure)
        names = [item.get("name", "") for item in items if item.get("type") == "directory"]
        
        # Check for consistent patterns
        consistent = 0
        inconsistent = 0
        
        for name in names:
            if re.match(r'^[a-z][a-z0-9-]*$', name) or re.match(r'^[A-Z][a-zA-Z0-9]*$', name):
                consistent += 1
            else:
                inconsistent += 1
        
        return {"consistent": consistent, "inconsistent": inconsistent}
    
    def _analyze_mixed_file_types(self, structure: Dict) -> int:
        """Count directories with mixed file types."""
        items = self._flatten_structure(structure)
        mixed_count = 0
        
        for item in items:
            if item.get("type") == "directory":
                extensions = set()
                for content in item.get("contents", []):
                    if content.get("type") == "file":
                        extensions.add(content.get("extension", ""))
                if len(extensions) > 3:  # More than 3 file types
                    mixed_count += 1
        
        return mixed_count
    
    def _analyze_workflow_accessibility(self, workflow_locations: List[str]) -> float:
        """Analyze workflow accessibility score."""
        if not workflow_locations:
            return 1.0
        
        # Check for organized structure
        organized = 0
        total = len(workflow_locations)
        
        for location in workflow_locations:
            path = Path(location)
            if "workflow" in path.parts or "n8n" in path.parts:
                organized += 1
        
        return organized / total if total > 0 else 1.0
    
    def generate_optimization_plan(self, recommendations: List[str]) -> Dict:
        """Generate structured optimization plan."""
        plan = {
            "immediate_actions": [],
            "short_term_improvements": [],
            "long_term_restructuring": [],
            "priority_ranking": []
        }
        
        for rec in recommendations:
            if "🔧 TECHNICAL" in rec:
                if "exceeds optimal levels" in rec or "Excessive" in rec:
                    plan["immediate_actions"].append(rec)
                elif "High" in rec or "scattered" in rec:
                    plan["short_term_improvements"].append(rec)
                else:
                    plan["long_term_restructuring"].append(rec)
            elif "🧠 UX" in rec:
                if "High cognitive load" in rec or "below optimal levels" in rec:
                    plan["immediate_actions"].append(rec)
                elif "Inconsistent" in rec or "mixed file types" in rec:
                    plan["short_term_improvements"].append(rec)
                else:
                    plan["long_term_restructuring"].append(rec)
        
        # Priority ranking
        plan["priority_ranking"] = plan["immediate_actions"] + plan["short_term_improvements"] + plan["long_term_restructuring"]
        
        return plan
    
    def run_complete_analysis(self):
        """Run complete project structure analysis."""
        print("🔍 PROJECT STRUCTURE ANALYSIS AND OPTIMIZATION")
        print("=" * 70)
        print("Analysis Team: Commander Data (Technical) + Counselor Troi (UX/Workflow)")
        print()
        
        # Step 1: Analyze directory structure
        print("📡 Step 1: Analyzing project directory structure...")
        structure = self.analyze_directory_structure(self.project_root)
        
        # Step 2: Analyze file patterns
        print("📡 Step 2: Analyzing file patterns and organization...")
        patterns = self.analyze_file_patterns()
        
        # Step 3: Commander Data's technical analysis
        print("📡 Step 3: Commander Data's technical analysis...")
        data_recommendations = self.commander_data_technical_analysis(structure, patterns)
        
        # Step 4: Counselor Troi's UX analysis
        print("📡 Step 4: Counselor Troi's user experience analysis...")
        troi_recommendations = self.counselor_troi_ux_analysis(structure, patterns)
        
        # Step 5: Generate optimization plan
        print("📡 Step 5: Generating optimization plan...")
        all_recommendations = data_recommendations + troi_recommendations
        optimization_plan = self.generate_optimization_plan(all_recommendations)
        
        # Step 6: Display results
        print("\n📊 ANALYSIS RESULTS:")
        print("=" * 50)
        
        print(f"\n🔧 COMMANDER DATA'S TECHNICAL RECOMMENDATIONS ({len(data_recommendations)}):")
        for i, rec in enumerate(data_recommendations, 1):
            print(f"   {i}. {rec}")
        
        print(f"\n🧠 COUNSELOR TROI'S UX RECOMMENDATIONS ({len(troi_recommendations)}):")
        for i, rec in enumerate(troi_recommendations, 1):
            print(f"   {i}. {rec}")
        
        print(f"\n🎯 OPTIMIZATION PLAN:")
        print("=" * 50)
        
        print(f"\n🚨 IMMEDIATE ACTIONS ({len(optimization_plan['immediate_actions'])}):")
        for i, action in enumerate(optimization_plan['immediate_actions'], 1):
            print(f"   {i}. {action}")
        
        print(f"\n📋 SHORT-TERM IMPROVEMENTS ({len(optimization_plan['short_term_improvements'])}):")
        for i, improvement in enumerate(optimization_plan['short_term_improvements'], 1):
            print(f"   {i}. {improvement}")
        
        print(f"\n🔮 LONG-TERM RESTRUCTURING ({len(optimization_plan['long_term_restructuring'])}):")
        for i, restructuring in enumerate(optimization_plan['long_term_restructuring'], 1):
            print(f"   {i}. {restructuring}")
        
        # Step 7: Save analysis report
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_filename = f"project_structure_analysis_report_{timestamp}.json"
        
        report = {
            "timestamp": timestamp,
            "project_root": str(self.project_root),
            "structure_analysis": structure,
            "file_patterns": patterns,
            "commander_data_recommendations": data_recommendations,
            "counselor_troi_recommendations": troi_recommendations,
            "optimization_plan": optimization_plan
        }
        
        with open(report_filename, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n💾 Analysis report saved: {report_filename}")
        
        # Step 8: Summary and next steps
        print(f"\n📊 SUMMARY:")
        print(f"   Total Recommendations: {len(all_recommendations)}")
        print(f"   Immediate Actions: {len(optimization_plan['immediate_actions'])}")
        print(f"   Short-term Improvements: {len(optimization_plan['short_term_improvements'])}")
        print(f"   Long-term Restructuring: {len(optimization_plan['long_term_restructuring'])}")
        
        print(f"\n🎯 NEXT STEPS:")
        print(f"   1. Review immediate actions for critical issues")
        print(f"   2. Plan short-term improvements for better organization")
        print(f"   3. Consider long-term restructuring for optimal architecture")
        print(f"   4. Implement changes incrementally to maintain system stability")
        
        return report

if __name__ == "__main__":
    try:
        analyzer = ProjectStructureAnalyzer()
        report = analyzer.run_complete_analysis()
        
        print(f"\n🎉 Project structure analysis complete!")
        print(f"   Analysis team has provided comprehensive recommendations")
        print(f"   Optimization plan generated and saved")
        print(f"   Ready for implementation planning")
            
    except Exception as e:
        print(f"❌ Project structure analysis failed: {e}")

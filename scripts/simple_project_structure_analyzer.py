#!/usr/bin/env python3
"""
Simple Project Structure Analyzer
Analyzes project structure from technical and UX perspectives.
Team: Commander Data (Technical) + Counselor Troi (UX/Workflow)
"""

import os
from pathlib import Path
from datetime import datetime

class SimpleProjectStructureAnalyzer:
    def __init__(self):
        self.project_root = Path.cwd()
        
    def analyze_project_structure(self):
        """Analyze project structure and provide recommendations."""
        print("🔍 SIMPLE PROJECT STRUCTURE ANALYSIS AND OPTIMIZATION")
        print("=" * 70)
        print("Analysis Team: Commander Data (Technical) + Counselor Troi (UX/Workflow)")
        print()
        
        # Get basic project statistics
        stats = self.get_project_statistics()
        
        # Commander Data's technical analysis
        print("📡 Commander Data's Technical Analysis...")
        data_recommendations = self.commander_data_analysis(stats)
        
        # Counselor Troi's UX analysis
        print("📡 Counselor Troi's User Experience Analysis...")
        troi_recommendations = self.counselor_troi_analysis(stats)
        
        # Display results
        print("\n📊 ANALYSIS RESULTS:")
        print("=" * 50)
        
        print(f"\n🔧 COMMANDER DATA'S TECHNICAL RECOMMENDATIONS ({len(data_recommendations)}):")
        for i, rec in enumerate(data_recommendations, 1):
            print(f"   {i}. {rec}")
        
        print(f"\n🧠 COUNSELOR TROI'S UX RECOMMENDATIONS ({len(troi_recommendations)}):")
        for i, rec in enumerate(troi_recommendations, 1):
            print(f"   {i}. {rec}")
        
        # Generate optimization plan
        all_recommendations = data_recommendations + troi_recommendations
        optimization_plan = self.generate_optimization_plan(all_recommendations)
        
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
        
        # Summary
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
        
        return {
            "stats": stats,
            "data_recommendations": data_recommendations,
            "troi_recommendations": troi_recommendations,
            "optimization_plan": optimization_plan
        }
    
    def get_project_statistics(self):
        """Get basic project statistics."""
        stats = {
            "total_files": 0,
            "total_dirs": 0,
            "scripts_count": 0,
            "docs_count": 0,
            "config_count": 0,
            "backup_count": 0,
            "workflow_count": 0,
            "root_items": 0,
            "max_depth": 0,
            "file_types": {},
            "large_dirs": []
        }
        
        # Count root items
        try:
            root_items = list(self.project_root.iterdir())
            stats["root_items"] = len(root_items)
        except:
            stats["root_items"] = 0
        
        # Walk through project
        for root, dirs, files in os.walk(str(self.project_root)):
            stats["total_dirs"] += len(dirs)
            stats["total_files"] += len(files)
            
            # Calculate depth
            depth = len(Path(root).relative_to(self.project_root).parts)
            stats["max_depth"] = max(stats["max_depth"], depth)
            
            # Categorize files
            for file in files:
                file_path = Path(root) / file
                relative_path = str(file_path.relative_to(self.project_root))
                
                # File type counting
                ext = file_path.suffix
                stats["file_types"][ext] = stats["file_types"].get(ext, 0) + 1
                
                # Category counting
                if "scripts" in relative_path:
                    stats["scripts_count"] += 1
                elif "docs" in relative_path:
                    stats["docs_count"] += 1
                elif "backup" in relative_path.lower() or "backup" in file.lower():
                    stats["backup_count"] += 1
                elif file.endswith(('.json', '.yml', '.yaml', '.env')):
                    stats["config_count"] += 1
                elif "workflow" in relative_path or file.endswith('.json'):
                    stats["workflow_count"] += 1
        
        return stats
    
    def commander_data_analysis(self, stats):
        """Commander Data's technical analysis."""
        recommendations = []
        
        # Directory depth analysis
        if stats["max_depth"] > 4:
            recommendations.append("🔧 TECHNICAL: Directory depth exceeds optimal levels ({} > 4). Consider flattening structure for better maintainability.".format(stats["max_depth"]))
        
        # Script organization
        if stats["scripts_count"] > 50:
            recommendations.append("🔧 TECHNICAL: High script count ({}). Consider grouping scripts by functionality into subdirectories.".format(stats["scripts_count"]))
        
        # Backup organization
        if stats["backup_count"] > 20:
            recommendations.append("🔧 TECHNICAL: Excessive backup files ({}). Implement automated cleanup and archival strategy.".format(stats["backup_count"]))
        
        # Configuration spread
        if stats["config_count"] > 30:
            recommendations.append("🔧 TECHNICAL: High configuration file count ({}). Consolidate into centralized config directory.".format(stats["config_count"]))
        
        # Workflow organization
        if stats["workflow_count"] > 30:
            recommendations.append("🔧 TECHNICAL: High workflow count ({}). Implement workflow categorization and versioning system.".format(stats["workflow_count"]))
        
        return recommendations
    
    def counselor_troi_analysis(self, stats):
        """Counselor Troi's UX analysis."""
        recommendations = []
        
        # Cognitive load analysis
        if stats["root_items"] > 15:
            recommendations.append("🧠 UX: Root directory contains {} items. High cognitive load - consider grouping related items into logical categories.".format(stats["root_items"]))
        
        # File type organization
        if len(stats["file_types"]) > 20:
            recommendations.append("🧠 UX: {} different file types detected. Consider standardizing file formats and reducing variety for better organization.".format(len(stats["file_types"])))
        
        # Documentation balance
        if stats["docs_count"] < stats["scripts_count"] * 0.1:
            recommendations.append("🧠 UX: Documentation ratio low compared to scripts. Increase documentation for better user experience and maintainability.")
        
        # Backup visibility
        if stats["backup_count"] > 0 and stats["backup_count"] > stats["total_files"] * 0.1:
            recommendations.append("🧠 UX: Backup files represent {}% of total files. Consider moving backups to dedicated archive location.".format(int(stats["backup_count"] / stats["total_files"] * 100)))
        
        return recommendations
    
    def generate_optimization_plan(self, recommendations):
        """Generate structured optimization plan."""
        plan = {
            "immediate_actions": [],
            "short_term_improvements": [],
            "long_term_restructuring": []
        }
        
        for rec in recommendations:
            if "exceeds optimal levels" in rec or "Excessive" in rec or "High cognitive load" in rec:
                plan["immediate_actions"].append(rec)
            elif "High" in rec or "ratio low" in rec or "different file types" in rec:
                plan["short_term_improvements"].append(rec)
            else:
                plan["long_term_restructuring"].append(rec)
        
        return plan

if __name__ == "__main__":
    try:
        analyzer = SimpleProjectStructureAnalyzer()
        report = analyzer.analyze_project_structure()
        
        print(f"\n🎉 Project structure analysis complete!")
        print(f"   Analysis team has provided comprehensive recommendations")
        print(f"   Optimization plan generated")
        print(f"   Ready for implementation planning")
            
    except Exception as e:
        print(f"❌ Project structure analysis failed: {e}")
        import traceback
        traceback.print_exc()

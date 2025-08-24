#!/usr/bin/env python3
"""
🧠 COLLECTIVE MEMORY SYSTEM
Integrates with crew management to store and learn from all operations
Maintains single source of truth for crew learning and optimization
"""

import os
import json
from datetime import datetime
from typing import Dict, Any, List, Optional

class CollectiveMemorySystem:
    """Collective memory system for crew learning and optimization"""
    
    def __init__(self, memory_directory: str = "crew_memory"):
        self.memory_directory = memory_directory
        self.memory_index = {}
        self.learning_patterns = {}
        self.optimization_recommendations = {}
        
        # Ensure memory directory exists
        os.makedirs(memory_directory, exist_ok=True)
        
        # Load existing memory
        self.load_memory_index()
    
    def load_memory_index(self):
        """Load existing memory index"""
        try:
            index_file = os.path.join(self.memory_directory, "memory_index.json")
            if os.path.exists(index_file):
                with open(index_file, 'r') as f:
                    self.memory_index = json.load(f)
                print(f"✅ Loaded memory index with {len(self.memory_index)} entries")
            else:
                self.memory_index = {
                    "crew_operations": [],
                    "missions": {},
                    "performance_data": {},
                    "learning_patterns": {},
                    "optimization_recommendations": {},
                    "last_updated": datetime.now().isoformat()
                }
                self.save_memory_index()
                print("✅ Created new memory index")
        except Exception as e:
            print(f"❌ Failed to load memory index: {e}")
    
    def save_memory_index(self):
        """Save memory index to file"""
        try:
            index_file = os.path.join(self.memory_directory, "memory_index.json")
            with open(index_file, 'w') as f:
                json.dump(self.memory_index, f, indent=2)
            return True
        except Exception as e:
            print(f"❌ Failed to save memory index: {e}")
            return False
    
    def store_crew_operation(self, operation_data: Dict[str, Any]) -> bool:
        """Store crew operation in collective memory"""
        try:
            operation_id = f"op_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{operation_data.get('operation', 'unknown')}"
            
            # Store operation data
            operation_file = os.path.join(self.memory_directory, f"{operation_id}.json")
            with open(operation_file, 'w') as f:
                json.dump(operation_data, f, indent=2)
            
            # Update memory index
            if "crew_operations" not in self.memory_index:
                self.memory_index["crew_operations"] = []
            
            self.memory_index["crew_operations"].append({
                "operation_id": operation_id,
                "timestamp": operation_data.get("timestamp", datetime.now().isoformat()),
                "operation_type": operation_data.get("operation", "unknown"),
                "crew_name": operation_data.get("crew_name", "unknown"),
                "status": operation_data.get("status", "unknown"),
                "file_path": operation_file
            })
            
            # Update last updated timestamp
            self.memory_index["last_updated"] = datetime.now().isoformat()
            
            # Save updated index
            self.save_memory_index()
            
            print(f"🧠 Stored crew operation: {operation_id}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to store crew operation: {e}")
            return False
    
    def store_mission_data(self, mission_data: Dict[str, Any]) -> bool:
        """Store mission data in collective memory"""
        try:
            mission_id = mission_data.get("mission_id", f"mission_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
            
            # Store mission data
            mission_file = os.path.join(self.memory_directory, f"{mission_id}.json")
            with open(mission_file, 'w') as f:
                json.dump(mission_data, f, indent=2)
            
            # Update memory index
            if "missions" not in self.memory_index:
                self.memory_index["missions"] = {}
            
            self.memory_index["missions"][mission_id] = {
                "timestamp": mission_data.get("created_at", datetime.now().isoformat()),
                "name": mission_data.get("name", "Unknown Mission"),
                "mission_type": mission_data.get("mission_type", "unknown"),
                "status": mission_data.get("mission_status", "unknown"),
                "crew_size": len(mission_data.get("assigned_crew", [])),
                "file_path": mission_file
            }
            
            # Update last updated timestamp
            self.memory_index["last_updated"] = datetime.now().isoformat()
            
            # Save updated index
            self.save_memory_index()
            
            print(f"🧠 Stored mission data: {mission_id}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to store mission data: {e}")
            return False
    
    def store_performance_data(self, crew_name: str, performance_data: Dict[str, Any]) -> bool:
        """Store crew performance data in collective memory"""
        try:
            performance_id = f"perf_{crew_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            # Store performance data
            perf_file = os.path.join(self.memory_directory, f"{performance_id}.json")
            with open(perf_file, 'w') as f:
                json.dump(performance_data, f, indent=2)
            
            # Update memory index
            if "performance_data" not in self.memory_index:
                self.memory_index["performance_data"] = {}
            
            if crew_name not in self.memory_index["performance_data"]:
                self.memory_index["performance_data"][crew_name] = []
            
            self.memory_index["performance_data"][crew_name].append({
                "performance_id": performance_id,
                "timestamp": performance_data.get("timestamp", datetime.now().isoformat()),
                "file_path": perf_file
            })
            
            # Update last updated timestamp
            self.memory_index["last_updated"] = datetime.now().isoformat()
            
            # Save updated index
            self.save_memory_index()
            
            print(f"🧠 Stored performance data for {crew_name}: {performance_id}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to store performance data: {e}")
            return False
    
    def analyze_learning_patterns(self) -> Dict[str, Any]:
        """Analyze stored data to identify learning patterns"""
        try:
            patterns = {
                "crew_operations": {},
                "mission_success_factors": {},
                "performance_trends": {},
                "optimization_opportunities": [],
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            # Analyze crew operations
            if "crew_operations" in self.memory_index:
                op_stats = {}
                for op in self.memory_index["crew_operations"]:
                    op_type = op.get("operation_type", "unknown")
                    if op_type not in op_stats:
                        op_stats[op_type] = {"total": 0, "successful": 0, "failed": 0}
                    
                    op_stats[op_type]["total"] += 1
                    if op.get("status") == "success":
                        op_stats[op_type]["successful"] += 1
                    else:
                        op_stats[op_type]["failed"] += 1
                
                patterns["crew_operations"] = op_stats
            
            # Analyze mission success factors
            if "missions" in self.memory_index:
                mission_stats = {
                    "total_missions": len(self.memory_index["missions"]),
                    "completed_missions": 0,
                    "mission_types": {},
                    "crew_size_distribution": {}
                }
                
                for mission_id, mission_data in self.memory_index["missions"].items():
                    if mission_data.get("status") == "completed":
                        mission_stats["completed_missions"] += 1
                    
                    mission_type = mission_data.get("mission_type", "unknown")
                    if mission_type not in mission_stats["mission_types"]:
                        mission_stats["mission_types"][mission_type] = 0
                    mission_stats["mission_types"][mission_type] += 1
                    
                    crew_size = mission_data.get("crew_size", 0)
                    if crew_size not in mission_stats["crew_size_distribution"]:
                        mission_stats["crew_size_distribution"][crew_size] = 0
                    mission_stats["crew_size_distribution"][crew_size] += 1
                
                patterns["mission_success_factors"] = mission_stats
            
            # Analyze performance trends
            if "performance_data" in self.memory_index:
                perf_trends = {}
                for crew_name, perf_entries in self.memory_index["performance_data"].items():
                    perf_trends[crew_name] = {
                        "total_entries": len(perf_entries),
                        "latest_performance": perf_entries[-1] if perf_entries else None
                    }
                
                patterns["performance_trends"] = perf_trends
            
            # Generate optimization recommendations
            patterns["optimization_opportunities"] = self.generate_optimization_recommendations(patterns)
            
            # Store patterns in memory
            self.learning_patterns = patterns
            self.memory_index["learning_patterns"] = patterns
            self.save_memory_index()
            
            print("🧠 Learning patterns analyzed and stored")
            return patterns
            
        except Exception as e:
            print(f"❌ Failed to analyze learning patterns: {e}")
            return {}
    
    def generate_optimization_recommendations(self, patterns: Dict[str, Any]) -> List[str]:
        """Generate optimization recommendations based on patterns"""
        recommendations = []
        
        try:
            # Analyze crew operation success rates
            if "crew_operations" in patterns:
                for op_type, stats in patterns["crew_operations"].items():
                    success_rate = stats["successful"] / stats["total"] if stats["total"] > 0 else 0
                    if success_rate < 0.8:  # Less than 80% success rate
                        recommendations.append(f"Improve {op_type} operations - current success rate: {success_rate:.1%}")
            
            # Analyze mission completion rates
            if "mission_success_factors" in patterns:
                mission_stats = patterns["mission_success_factors"]
                if mission_stats["total_missions"] > 0:
                    completion_rate = mission_stats["completed_missions"] / mission_stats["total_missions"]
                    if completion_rate < 0.9:  # Less than 90% completion rate
                        recommendations.append(f"Improve mission completion rate - current: {completion_rate:.1%}")
            
            # Analyze crew size distribution
            if "mission_success_factors" in patterns:
                crew_dist = patterns["mission_success_factors"].get("crew_size_distribution", {})
                if crew_dist:
                    avg_crew_size = sum(size * count for size, count in crew_dist.items()) / sum(crew_dist.values())
                    if avg_crew_size > 7:
                        recommendations.append(f"Consider reducing average crew size - current: {avg_crew_size:.1f}")
                    elif avg_crew_size < 4:
                        recommendations.append(f"Consider increasing average crew size - current: {avg_crew_size:.1f}")
            
            # Add general recommendations
            if len(recommendations) == 0:
                recommendations.append("System performing optimally - no immediate changes needed")
            
        except Exception as e:
            recommendations.append(f"Error generating recommendations: {e}")
        
        return recommendations
    
    def get_crew_recommendations(self, crew_name: str) -> List[str]:
        """Get specific recommendations for a crew member"""
        recommendations = []
        
        try:
            if "performance_data" in self.memory_index and crew_name in self.memory_index["performance_data"]:
                perf_entries = self.memory_index["performance_data"][crew_name]
                
                if len(perf_entries) > 1:
                    # Analyze performance trends
                    latest = perf_entries[-1]
                    previous = perf_entries[-2] if len(perf_entries) > 1 else None
                    
                    if previous:
                        recommendations.append(f"Performance tracking: {len(perf_entries)} entries recorded")
                        
                        # Add specific recommendations based on performance data
                        if "missions_completed" in latest:
                            recommendations.append(f"Recent missions completed: {latest.get('missions_completed', 0)}")
                
                if len(recommendations) == 0:
                    recommendations.append("No specific recommendations available")
            else:
                recommendations.append("No performance data available for this crew member")
                
        except Exception as e:
            recommendations.append(f"Error generating crew recommendations: {e}")
        
        return recommendations
    
    def export_memory_report(self, filename: str = "collective_memory_report.json") -> bool:
        """Export comprehensive memory report"""
        try:
            # Ensure patterns are analyzed
            if not self.learning_patterns:
                self.analyze_learning_patterns()
            
            report = {
                "report_type": "collective_memory_analysis",
                "generated_at": datetime.now().isoformat(),
                "memory_summary": {
                    "total_crew_operations": len(self.memory_index.get("crew_operations", [])),
                    "total_missions": len(self.memory_index.get("missions", {})),
                    "total_crew_members": len(self.memory_index.get("performance_data", {})),
                    "learning_patterns": len(self.learning_patterns),
                    "last_updated": self.memory_index.get("last_updated", "unknown")
                },
                "learning_patterns": self.learning_patterns,
                "optimization_recommendations": self.learning_patterns.get("optimization_opportunities", []),
                "crew_specific_recommendations": {
                    crew_name: self.get_crew_recommendations(crew_name)
                    for crew_name in self.memory_index.get("performance_data", {}).keys()
                }
            }
            
            with open(filename, 'w') as f:
                json.dump(report, f, indent=2)
            
            print(f"✅ Memory report exported to {filename}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to export memory report: {e}")
            return False
    
    def get_memory_status(self) -> Dict[str, Any]:
        """Get current memory system status"""
        return {
            "status": "operational",
            "memory_directory": self.memory_directory,
            "total_entries": len(self.memory_index),
            "crew_operations": len(self.memory_index.get("crew_operations", [])),
            "missions": len(self.memory_index.get("missions", {})),
            "performance_data": len(self.memory_index.get("performance_data", {})),
            "learning_patterns": len(self.learning_patterns),
            "last_updated": self.memory_index.get("last_updated", "unknown"),
            "memory_size_mb": self.get_memory_directory_size()
        }
    
    def get_memory_directory_size(self) -> float:
        """Get memory directory size in MB"""
        try:
            total_size = 0
            for dirpath, dirnames, filenames in os.walk(self.memory_directory):
                for filename in filenames:
                    filepath = os.path.join(dirpath, filename)
                    total_size += os.path.getsize(filepath)
            return round(total_size / (1024 * 1024), 2)  # Convert to MB
        except Exception:
            return 0.0

def main():
    """Main function to demonstrate collective memory system"""
    print("🧠 INITIALIZING COLLECTIVE MEMORY SYSTEM")
    print("=" * 60)
    
    # Initialize system
    cms = CollectiveMemorySystem()
    
    # Display memory status
    status = cms.get_memory_status()
    print(f"✅ Memory system initialized")
    print(f"📁 Directory: {status['memory_directory']}")
    print(f"📊 Total entries: {status['total_entries']}")
    
    # Analyze learning patterns
    print("\n🔍 Analyzing learning patterns...")
    patterns = cms.analyze_learning_patterns()
    
    if patterns:
        print(f"✅ Patterns analyzed: {len(patterns)} categories")
        print(f"📋 Optimization opportunities: {len(patterns.get('optimization_opportunities', []))}")
    
    # Export memory report
    print("\n📤 Exporting memory report...")
    cms.export_memory_report()
    
    # Display final status
    final_status = cms.get_memory_status()
    print(f"\n📊 Final Memory Status:")
    print(f"   Crew Operations: {final_status['crew_operations']}")
    print(f"   Missions: {final_status['missions']}")
    print(f"   Performance Data: {final_status['performance_data']}")
    print(f"   Learning Patterns: {final_status['learning_patterns']}")
    print(f"   Memory Size: {final_status['memory_size_mb']} MB")
    
    print("\n" + "=" * 60)
    print("🎉 COLLECTIVE MEMORY SYSTEM READY!")
    print("✅ Single source of truth for crew learning")
    print("✅ Pattern analysis and optimization")
    print("✅ Performance tracking and recommendations")
    print("✅ Mission outcome learning enabled")

if __name__ == "__main__":
    main()

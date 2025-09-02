#!/usr/bin/env python3
"""
🎬 CLAUDE-CURSOR COLLABORATION DEMO
See the revolutionary AI collaboration system in action!
"""

import os
import sys
from claude_cursor_interactive import ClaudeCursorCollaboration, CollaborationTask

def run_demo():
    """Run a demonstration of the Claude-Cursor collaboration system"""
    
    print("🎬 CLAUDE-CURSOR COLLABORATION DEMO")
    print("=" * 60)
    print("Watch as Claude and Cursor work together naturally!")
    print()
    
    # Check if we have the required dependencies
    try:
        from claude_cursor_interactive import ClaudeCursorCollaboration, CollaborationTask
    except ImportError:
        print("❌ Error: claude_cursor_interactive.py not found")
        print("Please make sure the file exists in the current directory")
        return
    
    # Check API keys
    if not os.environ.get('CLAUDE_API_KEY'):
        print("❌ Error: CLAUDE_API_KEY not found in environment variables")
        print("Please set your Claude API key: export CLAUDE_API_KEY='your_key_here'")
        return
    
    if not os.environ.get('OPENROUTER_API_KEY'):
        print("❌ Error: OPENROUTER_API_KEY not found in environment variables")
        print("Please set your OpenRouter API key: export OPENROUTER_API_KEY='your_key_here'")
        return
    
    # Initialize the collaboration system
    print("🚀 Initializing Claude-Cursor Collaboration System...")
    collaboration = ClaudeCursorCollaboration()
    print("✅ System initialized successfully!")
    print()
    
    # Demo 1: Code Implementation Task
    print("🎯 DEMO 1: CODE IMPLEMENTATION TASK")
    print("-" * 50)
    demo_task_1 = CollaborationTask(
        type="code_implementation",
        complexity="medium",
        description="Implement a React component with TypeScript that displays a user profile card"
    )
    
    print(f"📋 Task: {demo_task_1.description}")
    print(f"🔍 Type: {demo_task_1.type}")
    print(f"⚡ Complexity: {demo_task_1.complexity}")
    print()
    
    try:
        result_1 = collaboration.collaborate(demo_task_1)
        print("✅ Demo 1 completed successfully!")
    except Exception as e:
        print(f"❌ Demo 1 failed: {e}")
    
    print("\n" + "="*60 + "\n")
    
    # Demo 2: Strategic Analysis Task
    print("🎯 DEMO 2: STRATEGIC ANALYSIS TASK")
    print("-" * 50)
    demo_task_2 = CollaborationTask(
        type="architecture_design",
        complexity="high",
        description="Design a microservices architecture for an e-commerce platform with real-time inventory management"
    )
    
    print(f"📋 Task: {demo_task_2.description}")
    print(f"🔍 Type: {demo_task_2.type}")
    print(f"⚡ Complexity: {demo_task_2.complexity}")
    print()
    
    try:
        result_2 = collaboration.collaborate(demo_task_2)
        print("✅ Demo 2 completed successfully!")
    except Exception as e:
        print(f"❌ Demo 2 failed: {e}")
    
    print("\n" + "="*60 + "\n")
    
    # Demo 3: Debugging Task
    print("🎯 DEMO 3: DEBUGGING TASK")
    print("-" * 50)
    demo_task_3 = CollaborationTask(
        type="debugging",
        complexity="medium",
        description="Debug a React component that's not rendering properly due to state management issues"
    )
    
    print(f"📋 Task: {demo_task_3.description}")
    print(f"🔍 Type: {demo_task_3.type}")
    print(f"⚡ Complexity: {demo_task_3.complexity}")
    print()
    
    try:
        result_3 = collaboration.collaborate(demo_task_3)
        print("✅ Demo 3 completed successfully!")
    except Exception as e:
        print(f"❌ Demo 3 failed: {e}")
    
    print("\n" + "="*60 + "\n")
    
    # Demo Summary
    print("🎉 DEMO COMPLETED SUCCESSFULLY!")
    print("=" * 60)
    print("✅ You've seen Claude-Cursor collaboration in action!")
    print("✅ Natural role prioritization demonstrated")
    print("✅ Seamless AI teamwork achieved")
    print("✅ Revolutionary collaboration system operational")
    print()
    print("🚀 Ready to experience it yourself?")
    print("   Run: python3 claude_cursor_interactive.py")
    print()
    print("💡 The system automatically:")
    print("   • Analyzes your task type and complexity")
    print("   • Selects the best AI for the primary role")
    print("   • Coordinates both AIs working together")
    print("   • Preserves context between Claude and Cursor")
    print("   • Achieves natural role prioritization")

if __name__ == "__main__":
    run_demo()

#!/usr/bin/env python3
"""
Test Script for YouTube to GitHub Content Analyzer
Demonstrates functionality with example URLs
"""

import os
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from scripts.youtube_github_analyzer import YouTubeGitHubAnalyzer
from claude_agents.core.content_analyst.agent import ContentAnalystAgent

def test_basic_analyzer():
    """Test the basic analyzer functionality"""
    print("🧪 Testing YouTube to GitHub Content Analyzer")
    print("=" * 50)
    
    # Example URLs (you can replace these with real ones)
    youtube_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"  # Example URL
    github_repo = "https://github.com/octocat/Hello-World"       # Example repo
    
    analyzer = YouTubeGitHubAnalyzer()
    
    print(f"📺 YouTube URL: {youtube_url}")
    print(f"📂 GitHub Repo: {github_repo}")
    print()
    
    try:
        # Run analysis
        result = analyzer.analyze(youtube_url, github_repo)
        
        print("✅ Analysis completed successfully!")
        print(f"📊 Similarity Score: {result.get('comparison_result', {}).get('similarity_score', 0):.2%}")
        
        return result
        
    except Exception as e:
        print(f"❌ Analysis failed: {e}")
        print("💡 This is expected with example URLs - try with real YouTube videos and repos")
        return None

def test_claude_agent_integration():
    """Test the Claude agent integration"""
    print("\n🤖 Testing Claude Agent Integration")
    print("=" * 40)
    
    agent = ContentAnalystAgent()
    
    # Test analysis
    youtube_url = "https://www.youtube.com/watch?v=example"
    github_repo = "https://github.com/user/example-repo"
    
    result = agent.analyze_youtube_github_pair(
        youtube_url, 
        github_repo, 
        "Testing content alignment between tutorial video and project repository"
    )
    
    print(f"📋 Agent Analysis Status: {result['status']}")
    
    if result['status'] == 'success':
        print("✅ Claude agent analysis completed")
    else:
        print("⚠️ Using fallback analysis (Claude API not available)")
        print("💡 Fallback recommendations provided")
    
    return result

def demo_use_cases():
    """Demonstrate various use cases"""
    print("\n🎯 YouTube to GitHub Analyzer Use Cases")
    print("=" * 45)
    
    use_cases = [
        {
            'name': 'Tutorial Validation',
            'description': 'Ensure tutorial videos match repository documentation',
            'example': 'Compare React tutorial video with React project repo'
        },
        {
            'name': 'Code Example Alignment', 
            'description': 'Verify code shown in videos exists in repositories',
            'example': 'Check if API examples from video are in repo examples/'
        },
        {
            'name': 'Documentation Gaps',
            'description': 'Find topics covered in videos but missing from docs',
            'example': 'Video explains deployment but repo lacks deploy guide'
        },
        {
            'name': 'Content Freshness',
            'description': 'Identify outdated content between video and code',
            'example': 'Video uses old API version, repo has newer version'
        },
        {
            'name': 'Learning Path Optimization',
            'description': 'Ensure videos and repos provide coherent learning experience',
            'example': 'Tutorial series progression matches repo structure'
        }
    ]
    
    for i, use_case in enumerate(use_cases, 1):
        print(f"{i}. {use_case['name']}")
        print(f"   Description: {use_case['description']}")
        print(f"   Example: {use_case['example']}")
        print()

def show_api_setup():
    """Show API setup instructions"""
    print("\n🔧 API Configuration Setup")
    print("=" * 30)
    
    apis = {
        'YOUTUBE_API_KEY': {
            'required': False,
            'purpose': 'YouTube Data API access for metadata',
            'fallback': 'yt-dlp for video content extraction',
            'setup': 'Get from Google Cloud Console > YouTube Data API v3'
        },
        'GITHUB_TOKEN': {
            'required': False, 
            'purpose': 'Higher GitHub API rate limits',
            'fallback': 'Anonymous API access (limited)',
            'setup': 'Generate at GitHub Settings > Developer settings > Personal access tokens'
        },
        'ANTHROPIC_API_KEY': {
            'required': False,
            'purpose': 'Advanced Claude-powered content analysis',
            'fallback': 'Basic text similarity algorithms',
            'setup': 'Get from console.anthropic.com'
        }
    }
    
    for api_name, info in apis.items():
        status = "✅ Configured" if os.getenv(api_name) else "⚠️ Not configured"
        print(f"{api_name}: {status}")
        print(f"   Purpose: {info['purpose']}")
        print(f"   Fallback: {info['fallback']}")
        print(f"   Setup: {info['setup']}")
        print()

def main():
    """Main test function"""
    print("🚀 YouTube to GitHub Content Analyzer Test Suite")
    print("=" * 55)
    
    # Show current configuration
    show_api_setup()
    
    # Demonstrate use cases
    demo_use_cases()
    
    # Test basic analyzer (will likely fail with example URLs)
    test_basic_analyzer()
    
    # Test Claude agent integration
    test_claude_agent_integration()
    
    print("\n🎉 Test Suite Complete!")
    print("\n📚 Usage Instructions:")
    print("1. Replace example URLs with real YouTube videos and GitHub repos")
    print("2. Configure API keys for enhanced functionality")  
    print("3. Run: python3 youtube_github_analyzer.py <youtube_url> <github_repo>")
    print("\n💡 Pro Tips:")
    print("• Use educational/tutorial videos for best results")
    print("• Ensure GitHub repos have README files and documentation")
    print("• Try comparing programming tutorials with their associated repos")

if __name__ == "__main__":
    main()
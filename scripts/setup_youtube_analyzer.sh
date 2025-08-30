#!/bin/bash
"""
Setup Script for YouTube to GitHub Content Analyzer
Installs dependencies and configures the environment
"""

echo "🚀 Setting up YouTube to GitHub Content Analyzer"
echo "================================================"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed"
    exit 1
fi

# Install yt-dlp if not present
if ! command -v yt-dlp &> /dev/null; then
    echo "📦 Installing yt-dlp..."
    pip3 install yt-dlp
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r youtube_analyzer_requirements.txt

# Make the analyzer script executable
chmod +x youtube_github_analyzer.py

echo ""
echo "✅ Setup complete!"
echo ""
echo "🔧 Configuration:"
echo "   Set YOUTUBE_API_KEY for YouTube API access (optional - uses yt-dlp fallback)"
echo "   Set GITHUB_TOKEN for higher GitHub API rate limits (optional)" 
echo "   Set ANTHROPIC_API_KEY for advanced text analysis (optional)"
echo ""
echo "📚 Usage Examples:"
echo "   python3 youtube_github_analyzer.py 'https://youtube.com/watch?v=abc123' 'https://github.com/user/repo'"
echo "   python3 youtube_github_analyzer.py 'abc123' 'user/repo'"
echo ""
echo "🎯 The analyzer will:"
echo "   • Extract video transcripts, descriptions, and code snippets"
echo "   • Analyze GitHub repository structure and documentation"
echo "   • Compare content and identify gaps"
echo "   • Provide recommendations for alignment"
echo "   • Generate detailed analysis reports"
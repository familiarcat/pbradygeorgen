# 🎬 YouTube to GitHub Content Analyzer

A comprehensive tool for scraping YouTube video content and comparing it to GitHub repository documentation and code. Perfect for ensuring tutorial videos align with their associated repositories.

## 🎯 **Overview**

This system combines:
- **YouTube Content Extraction**: Video transcripts, descriptions, code snippets
- **GitHub Repository Analysis**: Documentation, code files, project structure  
- **Intelligent Comparison**: Semantic similarity, gap analysis, recommendations
- **Claude Agent Integration**: AI-powered content analysis and insights

## 🏗️ **System Architecture**

```
YouTube to GitHub Analyzer/
├── scripts/
│   ├── youtube_github_analyzer.py      # Main analyzer tool
│   ├── test_youtube_analyzer.py         # Test and demo script
│   ├── setup_youtube_analyzer.sh        # Setup script
│   └── youtube_analyzer_requirements.txt # Dependencies
└── claude_agents/core/content_analyst/  # Claude agent integration
    ├── agent.py                         # Content Analyst Agent
    └── __init__.py                      # Module initialization
```

## 🚀 **Quick Start**

### **1. Setup**
```bash
# Install dependencies
cd scripts
chmod +x setup_youtube_analyzer.sh
./setup_youtube_analyzer.sh

# Or manually install requirements
pip3 install -r youtube_analyzer_requirements.txt
```

### **2. Basic Usage**
```bash
# Analyze a YouTube video against a GitHub repository
python3 youtube_github_analyzer.py \
  "https://www.youtube.com/watch?v=VIDEO_ID" \
  "https://github.com/user/repository"

# Or use shortened format
python3 youtube_github_analyzer.py "VIDEO_ID" "user/repository"
```

### **3. Test the System**
```bash
# Run comprehensive test suite
python3 test_youtube_analyzer.py
```

## 🔧 **Configuration**

### **API Keys (Optional but Recommended)**

Set these environment variables for enhanced functionality:

```bash
# YouTube Data API (optional - uses yt-dlp fallback)
export YOUTUBE_API_KEY="your_youtube_api_key"

# GitHub API (optional - higher rate limits)  
export GITHUB_TOKEN="your_github_token"

# Claude API (optional - advanced analysis)
export ANTHROPIC_API_KEY="your_anthropic_api_key"
```

### **API Setup Instructions**

1. **YouTube API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Enable YouTube Data API v3
   - Create credentials (API key)

2. **GitHub Token**:
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Generate new token with repo scope

3. **Anthropic API Key**:
   - Sign up at [console.anthropic.com](https://console.anthropic.com)
   - Create API key

## 📊 **Features & Capabilities**

### **YouTube Content Extraction**
- ✅ Video metadata (title, description, channel, tags)
- ✅ Automatic transcript extraction
- ✅ Code snippet detection and extraction
- ✅ Fallback methods when APIs unavailable

### **GitHub Repository Analysis**
- ✅ Repository metadata and structure
- ✅ README and documentation files
- ✅ Code file analysis
- ✅ Programming language detection
- ✅ Project topics and descriptions

### **Content Comparison**
- ✅ Semantic similarity analysis
- ✅ Code snippet matching
- ✅ Documentation gap identification
- ✅ Content alignment recommendations
- ✅ Detailed analysis reports

### **Claude Agent Integration**
- ✅ AI-powered content analysis
- ✅ Strategic content recommendations
- ✅ Batch analysis capabilities
- ✅ Content strategy generation

## 🎯 **Use Cases**

### **1. Tutorial Validation**
Ensure tutorial videos match repository documentation:
```bash
python3 youtube_github_analyzer.py \
  "https://youtube.com/watch?v=react-tutorial" \
  "https://github.com/user/react-project"
```

### **2. Code Example Alignment**
Verify code shown in videos exists in repositories:
- Check if API examples from video are in repo `examples/`
- Validate code snippets match current implementation
- Identify outdated or deprecated code examples

### **3. Documentation Gaps**
Find topics covered in videos but missing from documentation:
- Video explains deployment → repo lacks deployment guide
- Tutorial covers testing → no testing documentation
- Advanced features shown → missing from README

### **4. Content Freshness**
Identify outdated content between video and repository:
- Video uses old API version → repo has newer version
- Dependencies mentioned → `requirements.txt` outdated
- Configuration examples → current config different

### **5. Learning Path Optimization**
Ensure videos and repositories provide coherent learning experience:
- Tutorial series progression matches repo structure
- Examples build upon each other logically
- Documentation supports video learning objectives

## 🤖 **Claude Agent Integration**

### **Using the Content Analyst Agent**

```python
from claude_agents.core.content_analyst.agent import ContentAnalystAgent

# Initialize agent
agent = ContentAnalystAgent()

# Analyze single video-repo pair
result = agent.analyze_youtube_github_pair(
    youtube_url="https://youtube.com/watch?v=example",
    github_repo_url="https://github.com/user/repo",
    additional_context="Tutorial series on React development"
)

# Batch analyze multiple channels and repositories
channels = ["https://youtube.com/c/channel1", "https://youtube.com/c/channel2"]
repos = ["https://github.com/org/repo1", "https://github.com/org/repo2"]

batch_result = agent.batch_analyze_channels(channels, repos)

# Generate content strategy
strategy = agent.generate_content_strategy([result, batch_result])
```

## 📈 **Output & Reports**

### **Analysis Results Structure**
```json
{
  "timestamp": "2025-08-29T20:49:57.577866",
  "input": {
    "youtube_url": "https://youtube.com/watch?v=example",
    "github_repo_url": "https://github.com/user/repo"
  },
  "youtube_content": {
    "video_id": "example",
    "title": "Tutorial Title",
    "channel": "Channel Name",
    "description_length": 1500,
    "transcript_length": 8000,
    "code_snippets_count": 12,
    "tags": ["tutorial", "javascript", "react"]
  },
  "github_content": {
    "repo_url": "https://github.com/user/repo",
    "description": "React tutorial project",
    "readme_length": 2500,
    "documentation_files": 5,
    "code_files_count": 15,
    "languages": {"JavaScript": 80, "CSS": 15, "HTML": 5},
    "topics": ["react", "tutorial", "javascript"]
  },
  "comparison_result": {
    "similarity_score": 0.75,
    "content_gaps": [
      "Video mentions 'API authentication' but not documented in repository",
      "Video discusses deployment but repository lacks deployment guide"
    ],
    "code_matches": [
      {
        "youtube_snippet": "const [state, setState] = useState(null)",
        "github_file": "src/App.js",
        "similarity": 0.95,
        "match_type": "code_snippet"
      }
    ],
    "recommendations": [
      "Add API authentication documentation to repository",
      "Create deployment guide covering topics from video",
      "Update README with code examples shown in tutorial"
    ]
  }
}
```

### **Report Files Generated**
- `youtube_github_analysis_TIMESTAMP.json` - Detailed analysis results
- Console output with summary and key insights

## 🔍 **Advanced Usage**

### **Custom Analysis Parameters**
```python
from scripts.youtube_github_analyzer import YouTubeGitHubAnalyzer

# Initialize with custom configuration
analyzer = YouTubeGitHubAnalyzer(
    youtube_api_key="your_key",
    github_token="your_token",
    claude_api_key="your_claude_key"
)

# Perform analysis
result = analyzer.analyze(youtube_url, github_repo_url)
```

### **Content Extraction Only**
```python
from scripts.youtube_github_analyzer import YouTubeContentExtractor, GitHubRepoAnalyzer

# Extract just YouTube content
extractor = YouTubeContentExtractor()
youtube_content = extractor.extract_content("https://youtube.com/watch?v=example")

# Analyze just GitHub repository
analyzer = GitHubRepoAnalyzer()
github_content = analyzer.analyze_repository("https://github.com/user/repo")
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"No such file or directory: 'yt-dlp'"**
   ```bash
   pip3 install yt-dlp
   ```

2. **GitHub API 401 Unauthorized**
   ```bash
   export GITHUB_TOKEN="your_github_token"
   ```

3. **YouTube API quota exceeded**
   - System automatically falls back to yt-dlp
   - No action needed

4. **Claude API not available**
   - System uses fallback analysis
   - Basic text similarity still works

### **Dependencies Issues**
```bash
# Install all requirements
pip3 install -r scripts/youtube_analyzer_requirements.txt

# Or individually
pip3 install requests yt-dlp anthropic python-dotenv
```

## 📚 **Integration Examples**

### **With n8n Workflows**
```python
# Integrate with your n8n workflow system
from integration.n8n_connector.connector import N8NConnector

connector = N8NConnector()

# Trigger content analysis workflow
result = connector.execute_task_with_workflow(
    "Analyze YouTube video vs GitHub repo",
    {
        'youtube_url': 'https://youtube.com/watch?v=example',
        'github_repo': 'https://github.com/user/repo',
        'analysis_type': 'content_alignment'
    }
)
```

### **With Your Existing Systems**
```python
# Import into your analysis pipeline
from scripts.youtube_github_analyzer import YouTubeGitHubAnalyzer

def analyze_content_pipeline(video_urls, repo_urls):
    analyzer = YouTubeGitHubAnalyzer()
    results = []
    
    for video_url in video_urls:
        for repo_url in repo_urls:
            result = analyzer.analyze(video_url, repo_url)
            results.append(result)
    
    return results
```

## 🔮 **Future Enhancements**

### **Planned Features**
- 📹 **Playlist Analysis**: Analyze entire YouTube playlists
- 🔍 **Multi-Repository Comparison**: Compare video to multiple repos
- 📊 **Analytics Dashboard**: Visual analysis results
- 🤖 **Auto-Documentation**: Generate docs from video content
- 📱 **API Endpoint**: REST API for integration

### **Advanced Analysis**
- 🧠 **Machine Learning Models**: Improved similarity detection
- 🎯 **Semantic Search**: Better content matching
- 📈 **Trending Analysis**: Track content evolution over time
- 🔔 **Automated Monitoring**: Continuous content alignment checking

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/youtube-analyzer`
3. Add your enhancements to the analyzer system
4. Test with various YouTube videos and repositories
5. Submit pull request

## 📄 **License**

This project is part of the pbradygeorgen AI system and follows the same licensing terms.

---

**🎬 Start analyzing your YouTube-GitHub content alignment today!**

This tool helps ensure your tutorial videos, documentation, and code repositories work together to create the best possible learning experience for your users.
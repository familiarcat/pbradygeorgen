#!/usr/bin/env python3
"""
YouTube to GitHub Content Comparison Tool
Scrapes YouTube video content and compares it to GitHub repository content
"""

import os
import sys
import json
import requests
import re
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from urllib.parse import urlparse, parse_qs
import subprocess
import tempfile

# Add project root to path for Claude agent integration
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

@dataclass
class YouTubeContent:
    video_id: str
    title: str
    description: str
    transcript: str
    duration: int
    upload_date: str
    channel: str
    tags: List[str]
    code_snippets: List[str]

@dataclass
class GitHubRepoContent:
    repo_url: str
    readme_content: str
    documentation: Dict[str, str]
    code_files: Dict[str, str]
    file_structure: List[str]
    languages: Dict[str, int]
    topics: List[str]
    description: str

@dataclass
class ComparisonResult:
    similarity_score: float
    content_gaps: List[str]
    code_matches: List[Dict[str, Any]]
    recommendations: List[str]
    detailed_analysis: Dict[str, Any]

class YouTubeContentExtractor:
    """Extracts content from YouTube videos"""
    
    def __init__(self, youtube_api_key: str = None):
        self.youtube_api_key = youtube_api_key or os.getenv('YOUTUBE_API_KEY')
        self.base_url = "https://www.googleapis.com/youtube/v3"
    
    def extract_video_id(self, url: str) -> str:
        """Extract video ID from YouTube URL"""
        if 'youtu.be/' in url:
            return url.split('youtu.be/')[1].split('?')[0]
        elif 'youtube.com/watch' in url:
            parsed = urlparse(url)
            return parse_qs(parsed.query).get('v', [None])[0]
        else:
            return url  # Assume it's already a video ID
    
    def get_video_metadata(self, video_id: str) -> Dict[str, Any]:
        """Get video metadata using YouTube API"""
        if not self.youtube_api_key:
            print("⚠️ YouTube API key not configured, using fallback method")
            return self._get_metadata_fallback(video_id)
        
        try:
            url = f"{self.base_url}/videos"
            params = {
                'part': 'snippet,contentDetails,statistics',
                'id': video_id,
                'key': self.youtube_api_key
            }
            
            response = requests.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            if not data.get('items'):
                raise ValueError(f"Video not found: {video_id}")
            
            video = data['items'][0]
            snippet = video['snippet']
            
            return {
                'title': snippet['title'],
                'description': snippet['description'],
                'channel': snippet['channelTitle'],
                'upload_date': snippet['publishedAt'],
                'tags': snippet.get('tags', []),
                'duration': video['contentDetails']['duration']
            }
            
        except Exception as e:
            print(f"❌ YouTube API error: {e}")
            return self._get_metadata_fallback(video_id)
    
    def _get_metadata_fallback(self, video_id: str) -> Dict[str, Any]:
        """Fallback method using yt-dlp for metadata"""
        try:
            cmd = [
                'yt-dlp',
                '--dump-json',
                '--no-download',
                f'https://www.youtube.com/watch?v={video_id}'
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            data = json.loads(result.stdout)
            
            return {
                'title': data.get('title', ''),
                'description': data.get('description', ''),
                'channel': data.get('uploader', ''),
                'upload_date': data.get('upload_date', ''),
                'tags': data.get('tags', []),
                'duration': data.get('duration', 0)
            }
            
        except Exception as e:
            print(f"❌ Fallback metadata extraction failed: {e}")
            return {
                'title': f'Video {video_id}',
                'description': '',
                'channel': 'Unknown',
                'upload_date': '',
                'tags': [],
                'duration': 0
            }
    
    def get_transcript(self, video_id: str) -> str:
        """Extract transcript using yt-dlp"""
        try:
            cmd = [
                'yt-dlp',
                '--write-subs',
                '--write-auto-subs',
                '--sub-lang', 'en',
                '--skip-download',
                '--sub-format', 'vtt',
                f'https://www.youtube.com/watch?v={video_id}'
            ]
            
            with tempfile.TemporaryDirectory() as temp_dir:
                result = subprocess.run(cmd, cwd=temp_dir, capture_output=True, text=True)
                
                # Look for subtitle files
                for filename in os.listdir(temp_dir):
                    if filename.endswith('.vtt'):
                        with open(os.path.join(temp_dir, filename), 'r') as f:
                            vtt_content = f.read()
                            return self._clean_vtt_content(vtt_content)
                
                print("⚠️ No transcript found, using description as fallback")
                return ""
                
        except Exception as e:
            print(f"❌ Transcript extraction failed: {e}")
            return ""
    
    def _clean_vtt_content(self, vtt_content: str) -> str:
        """Clean VTT subtitle content to plain text"""
        lines = vtt_content.split('\n')
        transcript_lines = []
        
        for line in lines:
            # Skip VTT headers and timestamps
            if (line.startswith('WEBVTT') or 
                '-->' in line or 
                line.strip() == '' or
                re.match(r'^\d+$', line.strip())):
                continue
            
            # Remove HTML tags and clean text
            cleaned = re.sub(r'<[^>]+>', '', line)
            cleaned = cleaned.strip()
            
            if cleaned and cleaned not in transcript_lines:
                transcript_lines.append(cleaned)
        
        return ' '.join(transcript_lines)
    
    def extract_code_snippets(self, content: str) -> List[str]:
        """Extract code snippets from video description or transcript"""
        code_patterns = [
            r'```[\s\S]*?```',  # Markdown code blocks
            r'`[^`\n]+`',       # Inline code
            r'(?:^|\n)[ \t]*(?:def|class|function|import|from|if|for|while)[ \t].*',  # Code-like lines
        ]
        
        snippets = []
        for pattern in code_patterns:
            matches = re.findall(pattern, content, re.MULTILINE)
            snippets.extend(matches)
        
        return [snippet.strip() for snippet in snippets if len(snippet.strip()) > 5]
    
    def extract_content(self, youtube_url: str) -> YouTubeContent:
        """Extract all content from a YouTube video"""
        video_id = self.extract_video_id(youtube_url)
        
        print(f"🎥 Extracting content from YouTube video: {video_id}")
        
        # Get metadata
        metadata = self.get_video_metadata(video_id)
        
        # Get transcript
        transcript = self.get_transcript(video_id)
        
        # Extract code snippets from description and transcript
        all_content = f"{metadata['description']}\n{transcript}"
        code_snippets = self.extract_code_snippets(all_content)
        
        return YouTubeContent(
            video_id=video_id,
            title=metadata['title'],
            description=metadata['description'],
            transcript=transcript,
            duration=metadata['duration'],
            upload_date=metadata['upload_date'],
            channel=metadata['channel'],
            tags=metadata['tags'],
            code_snippets=code_snippets
        )

class GitHubRepoAnalyzer:
    """Analyzes GitHub repository content"""
    
    def __init__(self, github_token: str = None):
        self.github_token = github_token or os.getenv('GITHUB_TOKEN') or os.getenv('GITHUB_ACCESS_TOKEN')
        self.headers = {}
        if self.github_token:
            self.headers['Authorization'] = f'token {self.github_token}'
    
    def parse_repo_url(self, repo_url: str) -> Tuple[str, str]:
        """Parse GitHub repository URL to extract owner and repo name"""
        # Handle different URL formats
        if 'github.com' in repo_url:
            parts = repo_url.replace('https://github.com/', '').replace('http://github.com/', '')
            parts = parts.strip('/').split('/')
            return parts[0], parts[1]
        else:
            # Assume format is "owner/repo"
            parts = repo_url.split('/')
            return parts[0], parts[1]
    
    def get_repo_metadata(self, owner: str, repo: str) -> Dict[str, Any]:
        """Get repository metadata from GitHub API"""
        try:
            url = f"https://api.github.com/repos/{owner}/{repo}"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            data = response.json()
            return {
                'description': data.get('description', ''),
                'topics': data.get('topics', []),
                'language': data.get('language', ''),
                'languages_url': data.get('languages_url', ''),
                'default_branch': data.get('default_branch', 'main'),
                'size': data.get('size', 0),
                'created_at': data.get('created_at', ''),
                'updated_at': data.get('updated_at', '')
            }
        except Exception as e:
            print(f"❌ Failed to get repo metadata: {e}")
            return {}
    
    def get_languages(self, languages_url: str) -> Dict[str, int]:
        """Get repository languages"""
        try:
            response = requests.get(languages_url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"❌ Failed to get languages: {e}")
            return {}
    
    def get_file_content(self, owner: str, repo: str, path: str, branch: str = 'main') -> str:
        """Get content of a specific file"""
        try:
            url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}?ref={branch}"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            data = response.json()
            if data.get('encoding') == 'base64':
                import base64
                return base64.b64decode(data['content']).decode('utf-8')
            return data.get('content', '')
            
        except Exception as e:
            print(f"❌ Failed to get file content for {path}: {e}")
            return ""
    
    def get_directory_contents(self, owner: str, repo: str, path: str = '', branch: str = 'main') -> List[Dict[str, Any]]:
        """Get directory contents"""
        try:
            url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}?ref={branch}"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            return response.json() if isinstance(response.json(), list) else [response.json()]
            
        except Exception as e:
            print(f"❌ Failed to get directory contents for {path}: {e}")
            return []
    
    def analyze_repository(self, repo_url: str) -> GitHubRepoContent:
        """Analyze a GitHub repository comprehensively"""
        owner, repo = self.parse_repo_url(repo_url)
        
        print(f"🔍 Analyzing GitHub repository: {owner}/{repo}")
        
        # Get repository metadata
        metadata = self.get_repo_metadata(owner, repo)
        branch = metadata.get('default_branch', 'main')
        
        # Get languages
        languages = {}
        if metadata.get('languages_url'):
            languages = self.get_languages(metadata['languages_url'])
        
        # Get README content
        readme_content = ""
        for readme_name in ['README.md', 'README.rst', 'README.txt', 'readme.md']:
            readme_content = self.get_file_content(owner, repo, readme_name, branch)
            if readme_content:
                break
        
        # Get documentation files
        documentation = {}
        doc_dirs = ['docs', 'documentation', 'wiki']
        for doc_dir in doc_dirs:
            contents = self.get_directory_contents(owner, repo, doc_dir, branch)
            for item in contents:
                if item['type'] == 'file' and item['name'].endswith(('.md', '.rst', '.txt')):
                    doc_content = self.get_file_content(owner, repo, item['path'], branch)
                    documentation[item['name']] = doc_content
        
        # Get key code files
        code_files = {}
        key_files = ['package.json', 'requirements.txt', 'Dockerfile', 'docker-compose.yml', 
                    'main.py', 'index.js', 'app.py', 'server.js']
        
        root_contents = self.get_directory_contents(owner, repo, '', branch)
        for item in root_contents:
            if item['type'] == 'file' and (item['name'] in key_files or 
                                          item['name'].endswith(('.py', '.js', '.ts', '.java', '.cpp', '.c'))):
                if len(code_files) < 20:  # Limit to avoid API rate limits
                    content = self.get_file_content(owner, repo, item['path'], branch)
                    code_files[item['name']] = content
        
        # Build file structure
        file_structure = [item['name'] for item in root_contents]
        
        return GitHubRepoContent(
            repo_url=repo_url,
            readme_content=readme_content,
            documentation=documentation,
            code_files=code_files,
            file_structure=file_structure,
            languages=languages,
            topics=metadata.get('topics', []),
            description=metadata.get('description', '')
        )

class ContentComparator:
    """Compares YouTube content with GitHub repository content"""
    
    def __init__(self, claude_api_key: str = None):
        self.claude_api_key = claude_api_key or os.getenv('CLAUDE_API_KEY') or os.getenv('ANTHROPIC_API_KEY')
    
    def calculate_text_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two texts using simple word overlap"""
        if not text1 or not text2:
            return 0.0
        
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union) if union else 0.0
    
    def find_code_matches(self, youtube_snippets: List[str], github_code: Dict[str, str]) -> List[Dict[str, Any]]:
        """Find matching code snippets between YouTube and GitHub"""
        matches = []
        
        for snippet in youtube_snippets:
            for filename, code_content in github_code.items():
                similarity = self.calculate_text_similarity(snippet, code_content)
                if similarity > 0.3:  # 30% similarity threshold
                    matches.append({
                        'youtube_snippet': snippet[:200] + "..." if len(snippet) > 200 else snippet,
                        'github_file': filename,
                        'similarity': similarity,
                        'match_type': 'code_snippet'
                    })
        
        return sorted(matches, key=lambda x: x['similarity'], reverse=True)
    
    def analyze_content_gaps(self, youtube_content: YouTubeContent, github_content: GitHubRepoContent) -> List[str]:
        """Identify gaps between YouTube content and GitHub repository"""
        gaps = []
        
        # Check if video mentions features not in README
        youtube_text = f"{youtube_content.title} {youtube_content.description} {youtube_content.transcript}"
        readme_text = github_content.readme_content
        
        # Look for technical terms mentioned in video but not in repo
        tech_terms = re.findall(r'\b(?:API|database|authentication|deployment|testing|framework|library)\b', 
                               youtube_text.lower())
        
        for term in set(tech_terms):
            if term not in readme_text.lower() and term not in ' '.join(github_content.documentation.values()).lower():
                gaps.append(f"Video mentions '{term}' but it's not documented in repository")
        
        # Check for missing documentation
        if youtube_content.code_snippets and not github_content.documentation:
            gaps.append("Video contains code examples but repository lacks comprehensive documentation")
        
        if "install" in youtube_text.lower() and "requirements.txt" not in github_content.file_structure and "package.json" not in github_content.file_structure:
            gaps.append("Video discusses installation but repository missing dependency files")
        
        return gaps
    
    def generate_recommendations(self, youtube_content: YouTubeContent, github_content: GitHubRepoContent, 
                               code_matches: List[Dict[str, Any]], gaps: List[str]) -> List[str]:
        """Generate recommendations for improving alignment"""
        recommendations = []
        
        # Code alignment recommendations
        if len(code_matches) < len(youtube_content.code_snippets) * 0.5:
            recommendations.append("Consider updating repository code to match examples shown in video")
        
        # Documentation recommendations
        if gaps:
            recommendations.append("Add documentation sections covering topics mentioned in video")
        
        if youtube_content.code_snippets and not github_content.readme_content:
            recommendations.append("Add a comprehensive README with code examples similar to video")
        
        # Repository improvements
        if "tutorial" in youtube_content.title.lower() and not any("example" in f.lower() for f in github_content.file_structure):
            recommendations.append("Add example files or demo code referenced in tutorial video")
        
        return recommendations
    
    def compare_content(self, youtube_content: YouTubeContent, github_content: GitHubRepoContent) -> ComparisonResult:
        """Perform comprehensive content comparison"""
        print("🔄 Comparing YouTube content with GitHub repository...")
        
        # Calculate overall similarity
        youtube_text = f"{youtube_content.title} {youtube_content.description} {youtube_content.transcript}"
        github_text = f"{github_content.description} {github_content.readme_content} {' '.join(github_content.documentation.values())}"
        
        similarity_score = self.calculate_text_similarity(youtube_text, github_text)
        
        # Find code matches
        code_matches = self.find_code_matches(youtube_content.code_snippets, github_content.code_files)
        
        # Identify gaps
        content_gaps = self.analyze_content_gaps(youtube_content, github_content)
        
        # Generate recommendations
        recommendations = self.generate_recommendations(youtube_content, github_content, code_matches, content_gaps)
        
        # Detailed analysis
        detailed_analysis = {
            'youtube_stats': {
                'title_length': len(youtube_content.title),
                'description_length': len(youtube_content.description),
                'transcript_length': len(youtube_content.transcript),
                'code_snippets_count': len(youtube_content.code_snippets),
                'channel': youtube_content.channel,
                'tags_count': len(youtube_content.tags)
            },
            'github_stats': {
                'readme_length': len(github_content.readme_content),
                'documentation_files': len(github_content.documentation),
                'code_files_count': len(github_content.code_files),
                'file_structure_size': len(github_content.file_structure),
                'languages_count': len(github_content.languages),
                'topics_count': len(github_content.topics)
            },
            'comparison_metrics': {
                'text_similarity': similarity_score,
                'code_matches_count': len(code_matches),
                'content_gaps_count': len(content_gaps),
                'recommendations_count': len(recommendations)
            }
        }
        
        return ComparisonResult(
            similarity_score=similarity_score,
            content_gaps=content_gaps,
            code_matches=code_matches,
            recommendations=recommendations,
            detailed_analysis=detailed_analysis
        )

class YouTubeGitHubAnalyzer:
    """Main analyzer class that orchestrates the comparison process"""
    
    def __init__(self, youtube_api_key: str = None, github_token: str = None, claude_api_key: str = None):
        self.youtube_extractor = YouTubeContentExtractor(youtube_api_key)
        self.github_analyzer = GitHubRepoAnalyzer(github_token)
        self.comparator = ContentComparator(claude_api_key)
    
    def analyze(self, youtube_url: str, github_repo_url: str) -> Dict[str, Any]:
        """Perform complete analysis of YouTube video vs GitHub repository"""
        print("🚀 Starting YouTube to GitHub Content Analysis")
        print("=" * 60)
        
        try:
            # Extract YouTube content
            youtube_content = self.youtube_extractor.extract_content(youtube_url)
            
            # Analyze GitHub repository
            github_content = self.github_analyzer.analyze_repository(github_repo_url)
            
            # Compare content
            comparison_result = self.comparator.compare_content(youtube_content, github_content)
            
            # Prepare final result
            result = {
                'timestamp': datetime.now().isoformat(),
                'input': {
                    'youtube_url': youtube_url,
                    'github_repo_url': github_repo_url
                },
                'youtube_content': {
                    'video_id': youtube_content.video_id,
                    'title': youtube_content.title,
                    'channel': youtube_content.channel,
                    'description_length': len(youtube_content.description),
                    'transcript_length': len(youtube_content.transcript),
                    'code_snippets_count': len(youtube_content.code_snippets),
                    'tags': youtube_content.tags
                },
                'github_content': {
                    'repo_url': github_content.repo_url,
                    'description': github_content.description,
                    'readme_length': len(github_content.readme_content),
                    'documentation_files': len(github_content.documentation),
                    'code_files_count': len(github_content.code_files),
                    'languages': github_content.languages,
                    'topics': github_content.topics
                },
                'comparison_result': {
                    'similarity_score': comparison_result.similarity_score,
                    'content_gaps': comparison_result.content_gaps,
                    'code_matches': comparison_result.code_matches,
                    'recommendations': comparison_result.recommendations,
                    'detailed_analysis': comparison_result.detailed_analysis
                }
            }
            
            self.print_summary(result)
            return result
            
        except Exception as e:
            error_result = {
                'timestamp': datetime.now().isoformat(),
                'error': str(e),
                'input': {
                    'youtube_url': youtube_url,
                    'github_repo_url': github_repo_url
                }
            }
            print(f"❌ Analysis failed: {e}")
            return error_result
    
    def print_summary(self, result: Dict[str, Any]):
        """Print a summary of the analysis results"""
        print("\n📊 Analysis Summary")
        print("=" * 40)
        
        comparison = result['comparison_result']
        
        print(f"📺 YouTube Video: {result['youtube_content']['title']}")
        print(f"📂 GitHub Repo: {result['github_content']['repo_url']}")
        print(f"🎯 Similarity Score: {comparison['similarity_score']:.2%}")
        print(f"🔍 Code Matches Found: {len(comparison['code_matches'])}")
        print(f"⚠️  Content Gaps: {len(comparison['content_gaps'])}")
        
        if comparison['content_gaps']:
            print("\n🚨 Key Content Gaps:")
            for gap in comparison['content_gaps'][:3]:  # Show top 3
                print(f"   • {gap}")
        
        if comparison['recommendations']:
            print("\n💡 Top Recommendations:")
            for rec in comparison['recommendations'][:3]:  # Show top 3
                print(f"   • {rec}")
        
        print(f"\n✅ Analysis complete! Full results available in output.")

def main():
    """Main function for command-line usage"""
    if len(sys.argv) < 3:
        print("Usage: python youtube_github_analyzer.py <youtube_url> <github_repo_url>")
        print("Example: python youtube_github_analyzer.py 'https://youtube.com/watch?v=abc123' 'https://github.com/user/repo'")
        sys.exit(1)
    
    youtube_url = sys.argv[1]
    github_repo_url = sys.argv[2]
    
    # Initialize analyzer
    analyzer = YouTubeGitHubAnalyzer()
    
    # Run analysis
    result = analyzer.analyze(youtube_url, github_repo_url)
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"youtube_github_analysis_{timestamp}.json"
    
    with open(filename, 'w') as f:
        json.dump(result, f, indent=2)
    
    print(f"\n📁 Full results saved to: {filename}")

if __name__ == "__main__":
    main()
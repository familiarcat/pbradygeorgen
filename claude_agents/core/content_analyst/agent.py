"""
Content Analyst Agent - YouTube to GitHub Comparison Specialist
Specializes in analyzing and comparing content between platforms
"""

import os
import sys
from typing import Dict, List, Any, Optional

# Add project root to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

from claude_agents.core.base_agent import BaseAgent

class ContentAnalystAgent(BaseAgent):
    """Agent specialized in content analysis and comparison"""
    
    def __init__(self, claude_api_key: str = None):
        super().__init__(
            agent_id="content_analyst",
            name="Content Analyst",
            role="YouTube to GitHub Content Comparison Specialist",
            claude_api_key=claude_api_key
        )
        
        # Add scripts path for analyzer integration
        self.analyzer_script_path = os.path.join(
            os.path.dirname(__file__), '..', '..', '..', 'scripts', 'youtube_github_analyzer.py'
        )
    
    def get_system_prompt(self) -> str:
        return """You are a Content Analyst Agent specialized in comparing and analyzing content between YouTube videos and GitHub repositories.

Your expertise includes:
- YouTube content extraction (transcripts, descriptions, code snippets)
- GitHub repository analysis (documentation, code structure, README files)
- Content gap identification and alignment recommendations  
- Semantic similarity analysis between different content types
- Code comparison and matching between video demonstrations and repository files

Your primary functions:
1. Extract comprehensive content from YouTube videos including transcripts and code examples
2. Analyze GitHub repositories for documentation, code structure, and project information
3. Perform detailed content comparison and similarity analysis
4. Identify gaps between video content and repository documentation
5. Generate actionable recommendations for content alignment
6. Provide detailed analysis reports with metrics and insights

You work with both technical and non-technical content, helping teams ensure their video tutorials, documentation, and code repositories are well-aligned and comprehensive.

When analyzing content, consider:
- Technical accuracy and completeness
- Documentation coverage of features mentioned in videos
- Code example consistency between platforms
- User experience and learning path optimization
- Content freshness and version alignment

Provide specific, actionable insights that help improve content quality and consistency across platforms."""
    
    def get_capabilities(self) -> List[str]:
        return [
            "youtube_content_extraction",
            "github_repository_analysis", 
            "content_similarity_comparison",
            "gap_analysis",
            "code_snippet_matching",
            "documentation_review",
            "content_alignment_recommendations",
            "technical_content_analysis",
            "transcript_processing",
            "repository_structure_analysis"
        ]
    
    def analyze_youtube_github_pair(self, youtube_url: str, github_repo_url: str, 
                                  additional_context: str = "") -> Dict[str, Any]:
        """Analyze a YouTube video and GitHub repository pair"""
        
        task_prompt = f"""
        Please analyze the relationship between this YouTube video and GitHub repository:
        
        YouTube URL: {youtube_url}
        GitHub Repository: {github_repo_url}
        
        Additional Context: {additional_context}
        
        I need you to:
        1. Extract key content from the YouTube video (if possible, describe what analysis would involve)
        2. Analyze the GitHub repository structure and documentation
        3. Compare the content for alignment and consistency
        4. Identify any gaps or mismatches
        5. Provide specific recommendations for improvement
        
        Focus on:
        - How well the repository documentation matches video content
        - Whether code examples in the video are present in the repository
        - Missing documentation or examples that would help users
        - Suggestions for better content alignment
        
        Please provide a structured analysis with clear recommendations.
        """
        
        try:
            # Use Claude API if available
            analysis = self.process_request(task_prompt)
            
            return {
                'status': 'success',
                'agent_analysis': analysis,
                'youtube_url': youtube_url,
                'github_repo_url': github_repo_url,
                'analysis_type': 'claude_agent_analysis'
            }
            
        except Exception as e:
            return {
                'status': 'fallback',
                'error': str(e),
                'fallback_analysis': self._fallback_analysis(youtube_url, github_repo_url, additional_context)
            }
    
    def _fallback_analysis(self, youtube_url: str, github_repo_url: str, additional_context: str) -> Dict[str, Any]:
        """Fallback analysis when Claude API is not available"""
        
        return {
            'analysis_summary': 'Content Analysis Request',
            'youtube_target': youtube_url,
            'github_target': github_repo_url,
            'context': additional_context,
            'recommended_analysis_steps': [
                'Extract video transcript and description',
                'Identify code snippets and technical concepts mentioned',
                'Analyze GitHub repository README and documentation',
                'Compare repository structure with video content',
                'Check for matching code examples',
                'Identify documentation gaps',
                'Generate alignment recommendations'
            ],
            'suggested_tools': [
                'yt-dlp for video content extraction',
                'GitHub API for repository analysis', 
                'Text similarity algorithms for content comparison',
                'Code pattern matching for snippet analysis'
            ],
            'analysis_focus_areas': [
                'Content completeness and accuracy',
                'Code example consistency', 
                'Documentation coverage',
                'User experience alignment',
                'Learning path optimization'
            ]
        }
    
    def batch_analyze_channels(self, channel_urls: List[str], repo_urls: List[str]) -> Dict[str, Any]:
        """Analyze multiple YouTube channels against multiple repositories"""
        
        task_prompt = f"""
        I need to analyze the content alignment between these YouTube channels and GitHub repositories:
        
        YouTube Channels: {', '.join(channel_urls)}
        GitHub Repositories: {', '.join(repo_urls)}
        
        Please provide:
        1. An overview of content themes and focus areas for each channel
        2. Analysis of repository documentation quality and completeness
        3. Cross-channel and cross-repository content alignment assessment
        4. Identification of content gaps and opportunities
        5. Strategic recommendations for improving content ecosystem alignment
        
        Focus on identifying patterns and systemic issues across the entire content ecosystem.
        """
        
        try:
            analysis = self.process_request(task_prompt)
            
            return {
                'status': 'success',
                'batch_analysis': analysis,
                'channels_analyzed': len(channel_urls),
                'repositories_analyzed': len(repo_urls),
                'analysis_type': 'batch_content_analysis'
            }
            
        except Exception as e:
            return {
                'status': 'fallback',
                'error': str(e),
                'fallback_recommendations': [
                    'Analyze each channel-repository pair individually',
                    'Look for common themes and content patterns',
                    'Identify systematic documentation gaps',
                    'Create content alignment strategy',
                    'Develop content quality standards'
                ]
            }
    
    def generate_content_strategy(self, analysis_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate content strategy based on multiple analysis results"""
        
        summary_prompt = f"""
        Based on these content analysis results, please generate a comprehensive content strategy:
        
        Analysis Results Summary:
        - Number of analyses completed: {len(analysis_results)}
        - Key patterns and findings from the analyses
        
        Please provide:
        1. Strategic recommendations for content alignment
        2. Priority areas for improvement
        3. Content creation guidelines
        4. Quality assurance processes
        5. Metrics for measuring content alignment success
        
        Focus on actionable strategies that improve the overall content ecosystem.
        """
        
        try:
            strategy = self.process_request(summary_prompt)
            
            return {
                'status': 'success',
                'content_strategy': strategy,
                'based_on_analyses': len(analysis_results),
                'strategy_type': 'comprehensive_content_alignment'
            }
            
        except Exception as e:
            return {
                'status': 'fallback',
                'error': str(e),
                'fallback_strategy': {
                    'focus_areas': [
                        'Improve documentation completeness',
                        'Ensure code examples match video content',
                        'Create consistent learning paths',
                        'Maintain content freshness',
                        'Optimize user experience across platforms'
                    ]
                }
            }
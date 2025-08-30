#!/usr/bin/env python3
"""
Simple localhost demo server for YouTube to GitHub Content Analyzer
Demonstrates the analyzer functionality via a web interface
"""

import os
import sys
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import webbrowser

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from scripts.youtube_github_analyzer import YouTubeGitHubAnalyzer

class AnalyzerHandler(BaseHTTPRequestHandler):
    """HTTP request handler for the analyzer demo"""
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/':
            self.serve_home_page()
        elif parsed_path.path == '/analyze':
            self.handle_analyze_request(parsed_path.query)
        elif parsed_path.path == '/test':
            self.run_demo_test()
        else:
            self.send_error(404)
    
    def serve_home_page(self):
        """Serve the main demo page"""
        html = """
<!DOCTYPE html>
<html>
<head>
    <title>YouTube to GitHub Content Analyzer - Demo</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #2196F3; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .form-section { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .example { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 10px 0; }
        input[type="text"] { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #4CAF50; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; margin: 10px 5px; }
        button:hover { background: #45a049; }
        .demo-button { background: #FF9800; }
        .demo-button:hover { background: #f57c00; }
        .results { background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-top: 20px; }
        .status { padding: 10px; border-radius: 4px; margin: 10px 0; }
        .success { background: #d4edda; border-color: #c3e6cb; color: #155724; }
        .warning { background: #fff3cd; border-color: #ffeaa7; color: #856404; }
        .error { background: #f8d7da; border-color: #f5c6cb; color: #721c24; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎬 YouTube to GitHub Content Analyzer</h1>
        <p>Compare YouTube video content with GitHub repository documentation and code</p>
    </div>
    
    <div class="form-section">
        <h2>🔍 Analyze Content</h2>
        <form action="/analyze" method="get">
            <label for="youtube_url"><strong>YouTube URL:</strong></label>
            <input type="text" id="youtube_url" name="youtube_url" 
                   placeholder="https://www.youtube.com/watch?v=VIDEO_ID" required>
            
            <label for="github_repo"><strong>GitHub Repository:</strong></label>
            <input type="text" id="github_repo" name="github_repo" 
                   placeholder="https://github.com/user/repository or user/repository" required>
            
            <button type="submit">🚀 Analyze Content</button>
        </form>
        
        <div class="example">
            <h3>💡 Example Analysis</h3>
            <p><strong>YouTube:</strong> Programming tutorial or coding walkthrough</p>
            <p><strong>GitHub:</strong> Related project repository with documentation</p>
            <button class="demo-button" onclick="runDemo()">🎯 Run Demo Analysis</button>
        </div>
    </div>
    
    <div class="form-section">
        <h2>🎯 Use Cases</h2>
        <ul>
            <li><strong>Tutorial Validation:</strong> Ensure tutorial videos match repository documentation</li>
            <li><strong>Code Example Alignment:</strong> Verify code shown in videos exists in repositories</li>
            <li><strong>Documentation Gaps:</strong> Find topics covered in videos but missing from docs</li>
            <li><strong>Content Freshness:</strong> Identify outdated content between video and code</li>
            <li><strong>Learning Path Optimization:</strong> Ensure coherent learning experience</li>
        </ul>
    </div>
    
    <div class="form-section">
        <h2>⚙️ System Status</h2>
        <div id="system-status">
            <div class="status warning">
                <strong>YouTube API:</strong> Using yt-dlp fallback (works without API key)
            </div>
            <div class="status warning">
                <strong>GitHub API:</strong> Limited access without authentication
            </div>
            <div class="status warning">
                <strong>Claude API:</strong> Using basic text analysis (Claude agent available)
            </div>
        </div>
    </div>
    
    <script>
        function runDemo() {
            window.location.href = '/test';
        }
    </script>
</body>
</html>
        """
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(html.encode())
    
    def handle_analyze_request(self, query_string):
        """Handle analysis request"""
        params = parse_qs(query_string)
        youtube_url = params.get('youtube_url', [''])[0]
        github_repo = params.get('github_repo', [''])[0]
        
        if not youtube_url or not github_repo:
            self.send_error(400, "Missing required parameters")
            return
        
        try:
            # Run analysis
            analyzer = YouTubeGitHubAnalyzer()
            result = analyzer.analyze(youtube_url, github_repo)
            
            # Generate HTML response
            html = self.generate_results_html(result)
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(html.encode())
            
        except Exception as e:
            error_html = f"""
            <html>
            <head><title>Analysis Error</title></head>
            <body>
                <h1>❌ Analysis Error</h1>
                <p><strong>Error:</strong> {str(e)}</p>
                <a href="/">← Back to Home</a>
            </body>
            </html>
            """
            self.send_response(500)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(error_html.encode())
    
    def run_demo_test(self):
        """Run a demonstration analysis"""
        try:
            analyzer = YouTubeGitHubAnalyzer()
            result = analyzer.analyze(
                "https://www.youtube.com/watch?v=kqtD5dpn9C8",  # Python tutorial
                "https://github.com/python/cpython"             # Python repo
            )
            
            html = self.generate_results_html(result, demo=True)
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(html.encode())
            
        except Exception as e:
            error_html = f"""
            <html>
            <head><title>Demo Error</title></head>
            <body>
                <h1>❌ Demo Error</h1>
                <p><strong>Error:</strong> {str(e)}</p>
                <p>This is expected in demo mode due to API limitations.</p>
                <a href="/">← Back to Home</a>
            </body>
            </html>
            """
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(error_html.encode())
    
    def generate_results_html(self, result, demo=False):
        """Generate HTML for analysis results"""
        youtube_content = result.get('youtube_content', {})
        github_content = result.get('github_content', {})
        comparison = result.get('comparison_result', {})
        
        demo_note = """
        <div class="status warning">
            <strong>Demo Mode:</strong> This is a demonstration using example data. 
            Real analysis requires proper API configuration.
        </div>
        """ if demo else ""
        
        return f"""
<!DOCTYPE html>
<html>
<head>
    <title>Analysis Results - YouTube to GitHub Analyzer</title>
    <style>
        body {{ font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; }}
        .header {{ background: #2196F3; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }}
        .section {{ background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }}
        .metric {{ display: inline-block; margin: 10px; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #2196F3; }}
        .similarity-score {{ font-size: 24px; font-weight: bold; color: #2196F3; }}
        .gap {{ background: #fff3cd; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 4px solid #ffc107; }}
        .recommendation {{ background: #d4edda; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 4px solid #28a745; }}
        .status {{ padding: 10px; border-radius: 4px; margin: 10px 0; }}
        .warning {{ background: #fff3cd; border-color: #ffeaa7; color: #856404; }}
        .back-link {{ display: inline-block; margin-top: 20px; padding: 10px 20px; background: #6c757d; color: white; text-decoration: none; border-radius: 4px; }}
        .back-link:hover {{ background: #5a6268; }}
        .json-data {{ background: #f8f9fa; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 12px; max-height: 300px; overflow-y: auto; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Analysis Results</h1>
        <p>YouTube to GitHub Content Comparison Report</p>
    </div>
    
    {demo_note}
    
    <div class="section">
        <h2>🎯 Analysis Summary</h2>
        <div class="metric">
            <strong>📺 Video:</strong> {youtube_content.get('title', 'N/A')}<br>
            <strong>📂 Repository:</strong> {github_content.get('repo_url', 'N/A')}
        </div>
        <div class="metric">
            <div class="similarity-score">{comparison.get('similarity_score', 0):.1%}</div>
            Similarity Score
        </div>
        <div class="metric">
            <strong>{len(comparison.get('code_matches', []))}</strong><br>
            Code Matches
        </div>
        <div class="metric">
            <strong>{len(comparison.get('content_gaps', []))}</strong><br>
            Content Gaps
        </div>
    </div>
    
    <div class="section">
        <h2>📺 YouTube Content</h2>
        <div class="metric">
            <strong>Channel:</strong> {youtube_content.get('channel', 'N/A')}<br>
            <strong>Description:</strong> {youtube_content.get('description_length', 0):,} characters<br>
            <strong>Transcript:</strong> {youtube_content.get('transcript_length', 0):,} characters<br>
            <strong>Tags:</strong> {len(youtube_content.get('tags', []))} tags
        </div>
    </div>
    
    <div class="section">
        <h2>📂 GitHub Repository</h2>
        <div class="metric">
            <strong>Description:</strong> {github_content.get('description', 'N/A') or 'No description'}<br>
            <strong>README:</strong> {github_content.get('readme_length', 0):,} characters<br>
            <strong>Documentation:</strong> {github_content.get('documentation_files', 0)} files<br>
            <strong>Code Files:</strong> {github_content.get('code_files_count', 0)} analyzed
        </div>
    </div>
    
    <div class="section">
        <h2>⚠️ Content Gaps Identified</h2>
        {''.join(f'<div class="gap">• {gap}</div>' for gap in comparison.get('content_gaps', [])) or '<p>No significant content gaps identified.</p>'}
    </div>
    
    <div class="section">
        <h2>💡 Recommendations</h2>
        {''.join(f'<div class="recommendation">• {rec}</div>' for rec in comparison.get('recommendations', [])) or '<p>No specific recommendations at this time.</p>'}
    </div>
    
    <div class="section">
        <h2>📋 Raw Analysis Data</h2>
        <details>
            <summary>Click to view complete analysis results (JSON)</summary>
            <div class="json-data">{json.dumps(result, indent=2)}</div>
        </details>
    </div>
    
    <a href="/" class="back-link">← Back to Analyzer</a>
</body>
</html>
        """
    
    def log_message(self, format, *args):
        """Override to reduce log noise"""
        pass

def start_demo_server(port=8000):
    """Start the demo server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, AnalyzerHandler)
    
    print(f"🚀 YouTube to GitHub Content Analyzer Demo Server")
    print(f"📡 Server running at: http://localhost:{port}")
    print(f"🌐 Opening browser...")
    print(f"🛑 Press Ctrl+C to stop the server")
    print()
    
    # Open browser
    threading.Timer(1.0, lambda: webbrowser.open(f'http://localhost:{port}')).start()
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print(f"\n🛑 Server stopped")
        httpd.shutdown()

if __name__ == "__main__":
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Invalid port number, using default port 8000")
    
    start_demo_server(port)
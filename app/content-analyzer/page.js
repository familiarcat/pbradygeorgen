"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContentAnalyzer;
const react_1 = __importStar(require("react"));
function ContentAnalyzer() {
    const [youtubeUrl, setYoutubeUrl] = (0, react_1.useState)('');
    const [githubRepo, setGithubRepo] = (0, react_1.useState)('');
    const [isAnalyzing, setIsAnalyzing] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const handleAnalyze = async () => {
        if (!youtubeUrl || !githubRepo) {
            setError('Please provide both YouTube URL and GitHub repository');
            return;
        }
        setIsAnalyzing(true);
        setError(null);
        setResult(null);
        try {
            const response = await fetch('/api/analyze-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    youtube_url: youtubeUrl,
                    github_repo: githubRepo,
                }),
            });
            if (!response.ok) {
                throw new Error(`Analysis failed: ${response.statusText}`);
            }
            const data = await response.json();
            setResult(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Analysis failed');
        }
        finally {
            setIsAnalyzing(false);
        }
    };
    const runDemoAnalysis = () => {
        setYoutubeUrl('https://www.youtube.com/watch?v=kqtD5dpn9C8');
        setGithubRepo('https://github.com/python/cpython');
    };
    return (<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎬 YouTube to GitHub Content Analyzer
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Compare YouTube video content with GitHub repository documentation and code
            </p>
          </div>
        </div>

        {/* Analysis Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🔍 Analyze Content</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-2">
                <strong>YouTube URL:</strong>
              </label>
              <input type="text" id="youtube-url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=VIDEO_ID" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={isAnalyzing}/>
            </div>

            <div>
              <label htmlFor="github-repo" className="block text-sm font-medium text-gray-700 mb-2">
                <strong>GitHub Repository:</strong>
              </label>
              <input type="text" id="github-repo" value={githubRepo} onChange={(e) => setGithubRepo(e.target.value)} placeholder="https://github.com/user/repository or user/repository" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={isAnalyzing}/>
            </div>

            <div className="flex gap-4">
              <button onClick={handleAnalyze} disabled={isAnalyzing || !youtubeUrl || !githubRepo} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition duration-300 flex items-center justify-center">
                {isAnalyzing ? (<>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Analyzing...
                  </>) : (<>🚀 Analyze Content</>)}
              </button>

              <button onClick={runDemoAnalysis} disabled={isAnalyzing} className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition duration-300">
                🎯 Load Demo
              </button>
            </div>
          </div>

          {/* Example */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">💡 Example Analysis</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-green-700">YouTube:</strong>
                <p className="text-gray-700">Programming tutorial or coding walkthrough</p>
              </div>
              <div>
                <strong className="text-green-700">GitHub:</strong>
                <p className="text-gray-700">Related project repository with documentation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (<div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Analysis Error</h3>
            <p className="text-red-700">{error}</p>
          </div>)}

        {/* Results */}
        {result && (<div className="space-y-8">
            {/* Summary */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Analysis Summary</h2>
              
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {(result.comparison_result.similarity_score * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Similarity Score</div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {result.comparison_result.code_matches.length}
                  </div>
                  <div className="text-sm text-gray-600">Code Matches</div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {result.comparison_result.content_gaps.length}
                  </div>
                  <div className="text-sm text-gray-600">Content Gaps</div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {result.comparison_result.recommendations.length}
                  </div>
                  <div className="text-sm text-gray-600">Recommendations</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">📺 YouTube Video</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Title:</strong> {result.youtube_content.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Channel:</strong> {result.youtube_content.channel}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Transcript:</strong> {result.youtube_content.transcript_length.toLocaleString()} characters
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">📂 GitHub Repository</h3>
                  <p className="text-sm text-gray-600">
                    <strong>URL:</strong> {result.github_content.repo_url}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>README:</strong> {result.github_content.readme_length.toLocaleString()} characters
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Code Files:</strong> {result.github_content.code_files_count} analyzed
                  </p>
                </div>
              </div>
            </div>

            {/* Content Gaps */}
            {result.comparison_result.content_gaps.length > 0 && (<div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">⚠️ Content Gaps Identified</h2>
                <div className="space-y-3">
                  {result.comparison_result.content_gaps.map((gap, index) => (<div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-gray-700">• {gap}</p>
                    </div>))}
                </div>
              </div>)}

            {/* Recommendations */}
            {result.comparison_result.recommendations.length > 0 && (<div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">💡 Recommendations</h2>
                <div className="space-y-3">
                  {result.comparison_result.recommendations.map((rec, index) => (<div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-gray-700">• {rec}</p>
                    </div>))}
                </div>
              </div>)}
          </div>)}

        {/* Use Cases */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">✅ Tutorial Validation</h3>
              <p className="text-sm text-gray-600">Ensure tutorial videos match repository documentation</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">🔍 Code Example Alignment</h3>
              <p className="text-sm text-gray-600">Verify code shown in videos exists in repositories</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">📋 Documentation Gaps</h3>
              <p className="text-sm text-gray-600">Find topics covered in videos but missing from docs</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">🔄 Content Freshness</h3>
              <p className="text-sm text-gray-600">Identify outdated content between video and code</p>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map
#!/usr/bin/env python3
"""
Architecture Alignment Test
Tests the complete data flow from Claude agents through N8N to frontend
"""

import os
import sys
import json
import requests
from datetime import datetime
from typing import Dict, List, Any

class ArchitectureAlignmentTester:
    """Test the alignment between Claude agents, N8N workflows, and frontend"""
    
    def __init__(self):
        self.n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        self.claude_api_key = os.getenv('CLAUDE_API_KEY')
        self.test_results = {}
        
    def test_n8n_connectivity(self) -> Dict[str, Any]:
        """Test basic N8N connectivity"""
        print("🔗 Testing N8N Base Connectivity...")
        
        try:
            # Test API endpoint
            response = requests.get(
                f"{self.n8n_base_url}/api/v1/workflows",
                headers={"X-N8N-API-KEY": self.n8n_api_key} if self.n8n_api_key else {}
            )
            
            if response.status_code == 200:
                workflows = response.json().get('data', [])
                active_workflows = [w for w in workflows if w.get('active', False)]
                
                return {
                    "status": "connected",
                    "total_workflows": len(workflows),
                    "active_workflows": len(active_workflows),
                    "crew_workflows": [w for w in active_workflows if 'crew' in w.get('name', '').lower()]
                }
            else:
                return {"status": "error", "code": response.status_code, "message": response.text}
                
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def test_crew_webhook_endpoints(self) -> Dict[str, Any]:
        """Test all crew member webhook endpoints"""
        print("🧪 Testing Crew Webhook Endpoints...")
        
        crew_endpoints = [
            "crew-captain-jean-luc-picard",
            "crew-commander-data",
            "crew-lieutenant-worf", 
            "crew-lieutenant-commander-geordi-la-forge",
            "crew-counselor-deanna-troi",
            "crew-lieutenant-uhura",
            "crew-dr-beverly-crusher",
            "crew-quark"
        ]
        
        results = {}
        
        for endpoint in crew_endpoints:
            try:
                response = requests.post(
                    f"{self.n8n_base_url}/webhook/{endpoint}",
                    headers={"Content-Type": "application/json"},
                    json={
                        "test": "architecture_alignment",
                        "crewMemberId": endpoint.replace("crew-", ""),
                        "timestamp": datetime.now().isoformat()
                    },
                    timeout=10
                )
                
                results[endpoint] = {
                    "status_code": response.status_code,
                    "response_time": response.elapsed.total_seconds(),
                    "response_size": len(response.content),
                    "is_operational": response.status_code == 200
                }
                
                # Try to parse response
                try:
                    response_data = response.json()
                    results[endpoint]["response_format"] = "json"
                    results[endpoint]["response_keys"] = list(response_data.keys())
                except:
                    results[endpoint]["response_format"] = "text"
                    results[endpoint]["response_preview"] = response.text[:200]
                    
            except Exception as e:
                results[endpoint] = {
                    "status_code": "error",
                    "error": str(e),
                    "is_operational": False
                }
        
        return results
    
    def test_claude_agent_system(self) -> Dict[str, Any]:
        """Test Claude agent system functionality"""
        print("🤖 Testing Claude Agent System...")
        
        try:
            # Test if we can import and initialize agents
            sys.path.append('claude_agents')
            
            from core.base_agent import BaseAgent
            from core.captain_picard.agent import CaptainPicardAgent
            
            # Test agent initialization
            agent = CaptainPicardAgent(claude_api_key=self.claude_api_key)
            
            # Test agent capabilities
            capabilities = agent.get_capabilities()
            system_prompt = agent.get_system_prompt()
            
            return {
                "status": "operational",
                "base_agent_loaded": True,
                "picard_agent_loaded": True,
                "capabilities_count": len(capabilities),
                "system_prompt_length": len(system_prompt),
                "agent_interface": {
                    "has_analyze_task": hasattr(agent, 'analyze_task'),
                    "has_get_status": hasattr(agent, 'get_status'),
                    "has_memory": hasattr(agent, 'memory')
                }
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "traceback": str(sys.exc_info())
            }
    
    def test_frontend_api_routes(self) -> Dict[str, Any]:
        """Test frontend API route functionality"""
        print("🖥️ Testing Frontend API Routes...")
        
        # Test local development server
        local_url = "http://localhost:3001"
        
        routes_to_test = [
            "/",
            "/observation-lounge",
            "/api/test-n8n/crew-member"
        ]
        
        results = {}
        
        for route in routes_to_test:
            try:
                if route.startswith("/api/"):
                    # Test API route with POST
                    response = requests.post(
                        f"{local_url}{route}",
                        json={"test": "architecture_alignment"},
                        timeout=5
                    )
                else:
                    # Test page route with GET
                    response = requests.get(f"{local_url}{route}", timeout=5)
                
                results[route] = {
                    "status_code": response.status_code,
                    "response_time": response.elapsed.total_seconds(),
                    "is_accessible": response.status_code < 400
                }
                
            except Exception as e:
                results[route] = {
                    "status_code": "error",
                    "error": str(e),
                    "is_accessible": False
                }
        
        return results
    
    def test_data_flow_integration(self) -> Dict[str, Any]:
        """Test complete data flow from frontend to N8N to Claude"""
        print("🔄 Testing Complete Data Flow...")
        
        # Test a working crew endpoint with real data
        test_endpoint = "crew-captain-jean-luc-picard"
        
        try:
            # Simulate frontend request
            frontend_payload = {
                "crewMemberId": "picard",
                "projectBrief": "Architecture alignment test",
                "requestType": "system_analysis",
                "timestamp": datetime.now().isoformat(),
                "source": "architecture_test"
            }
            
            # Send to N8N
            response = requests.post(
                f"{self.n8n_base_url}/webhook/{test_endpoint}",
                headers={"Content-Type": "application/json"},
                json=frontend_payload,
                timeout=15
            )
            
            if response.status_code == 200:
                # Analyze response format
                try:
                    response_data = response.json()
                    return {
                        "status": "success",
                        "endpoint": test_endpoint,
                        "response_format": "json",
                        "response_structure": list(response_data.keys()),
                        "has_crew_info": any(key in str(response_data).lower() for key in ['crew', 'picard', 'analysis']),
                        "response_time": response.elapsed.total_seconds()
                    }
                except:
                    return {
                        "status": "partial_success",
                        "endpoint": test_endpoint,
                        "response_format": "text",
                        "response_preview": response.text[:300],
                        "response_time": response.elapsed.total_seconds()
                    }
            else:
                return {
                    "status": "error",
                    "endpoint": test_endpoint,
                    "status_code": response.status_code,
                    "error": response.text
                }
                
        except Exception as e:
            return {
                "status": "error",
                "endpoint": test_endpoint,
                "error": str(e)
            }
    
    def run_comprehensive_test(self) -> Dict[str, Any]:
        """Run all architecture alignment tests"""
        print("🚀 CLAUDE CODE INTEGRATION - ARCHITECTURE ALIGNMENT TEST")
        print("=" * 70)
        
        start_time = datetime.now()
        
        # Run all tests
        self.test_results = {
            "timestamp": start_time.isoformat(),
            "n8n_connectivity": self.test_n8n_connectivity(),
            "crew_webhooks": self.test_crew_webhook_endpoints(),
            "claude_agents": self.test_claude_agent_system(),
            "frontend_routes": self.test_frontend_api_routes(),
            "data_flow": self.test_data_flow_integration()
        }
        
        # Calculate alignment scores
        self.test_results["alignment_scores"] = self.calculate_alignment_scores()
        
        # Generate recommendations
        self.test_results["recommendations"] = self.generate_recommendations()
        
        end_time = datetime.now()
        self.test_results["test_duration"] = (end_time - start_time).total_seconds()
        
        return self.test_results
    
    def calculate_alignment_scores(self) -> Dict[str, float]:
        """Calculate alignment scores for each component"""
        scores = {}
        
        # N8N Connectivity Score
        n8n_status = self.test_results["n8n_connectivity"]
        if n8n_status.get("status") == "connected":
            scores["n8n_connectivity"] = 10.0
        else:
            scores["n8n_connectivity"] = 0.0
        
        # Crew Webhooks Score
        crew_results = self.test_results["crew_webhooks"]
        operational_count = sum(1 for r in crew_results.values() if r.get("is_operational", False))
        total_count = len(crew_results)
        scores["crew_webhooks"] = (operational_count / total_count) * 10.0
        
        # Claude Agents Score
        claude_status = self.test_results["claude_agents"]
        if claude_status.get("status") == "operational":
            scores["claude_agents"] = 10.0
        else:
            scores["claude_agents"] = 0.0
        
        # Frontend Routes Score
        frontend_results = self.test_results["frontend_routes"]
        accessible_count = sum(1 for r in frontend_results.values() if r.get("is_accessible", False))
        total_routes = len(frontend_results)
        scores["frontend_routes"] = (accessible_count / total_routes) * 10.0
        
        # Data Flow Score
        data_flow = self.test_results["data_flow"]
        if data_flow.get("status") == "success":
            scores["data_flow"] = 10.0
        elif data_flow.get("status") == "partial_success":
            scores["data_flow"] = 6.0
        else:
            scores["data_flow"] = 0.0
        
        # Overall Score
        scores["overall"] = sum(scores.values()) / len(scores)
        
        return scores
    
    def generate_recommendations(self) -> List[str]:
        """Generate specific recommendations based on test results"""
        recommendations = []
        
        # Check N8N connectivity
        if self.test_results["n8n_connectivity"].get("status") != "connected":
            recommendations.append("🔴 CRITICAL: Fix N8N connectivity - check API key and base URL")
        
        # Check crew webhooks
        crew_results = self.test_results["crew_webhooks"]
        missing_endpoints = [ep for ep, result in crew_results.items() if not result.get("is_operational", False)]
        if missing_endpoints:
            recommendations.append(f"🟡 HIGH: Deploy missing N8N workflows: {', '.join(missing_endpoints)}")
        
        # Check Claude agents
        if self.test_results["claude_agents"].get("status") != "operational":
            recommendations.append("🔴 CRITICAL: Fix Claude agent system - check dependencies and API keys")
        
        # Check frontend routes
        frontend_results = self.test_results["frontend_routes"]
        inaccessible_routes = [route for route, result in frontend_results.items() if not result.get("is_accessible", False)]
        if inaccessible_routes:
            recommendations.append(f"🟡 MEDIUM: Fix inaccessible frontend routes: {', '.join(inaccessible_routes)}")
        
        # Check data flow
        data_flow = self.test_results["data_flow"]
        if data_flow.get("status") == "error":
            recommendations.append("🟡 MEDIUM: Fix data flow integration - check N8N webhook responses")
        
        # Add general recommendations
        if len(recommendations) == 0:
            recommendations.append("✅ EXCELLENT: All systems are properly aligned!")
        else:
            recommendations.append("📋 GENERAL: Implement comprehensive error handling and monitoring")
        
        return recommendations
    
    def print_results(self):
        """Print comprehensive test results"""
        print("\n" + "=" * 70)
        print("📊 ARCHITECTURE ALIGNMENT TEST RESULTS")
        print("=" * 70)
        
        # Print alignment scores
        scores = self.test_results["alignment_scores"]
        print(f"\n🎯 ALIGNMENT SCORES:")
        print(f"   N8N Connectivity: {scores['n8n_connectivity']:.1f}/10")
        print(f"   Crew Webhooks: {scores['crew_webhooks']:.1f}/10")
        print(f"   Claude Agents: {scores['claude_agents']:.1f}/10")
        print(f"   Frontend Routes: {scores['frontend_routes']:.1f}/10")
        print(f"   Data Flow: {scores['data_flow']:.1f}/10")
        print(f"   OVERALL: {scores['overall']:.1f}/10")
        
        # Print crew webhook status
        print(f"\n🧪 CREW WEBHOOK STATUS:")
        crew_results = self.test_results["crew_webhooks"]
        for endpoint, result in crew_results.items():
            status_icon = "✅" if result.get("is_operational", False) else "❌"
            print(f"   {status_icon} {endpoint}: {result.get('status_code', 'error')}")
        
        # Print recommendations
        print(f"\n💡 RECOMMENDATIONS:")
        for rec in self.test_results["recommendations"]:
            print(f"   {rec}")
        
        print(f"\n⏱️  Test completed in {self.test_results['test_duration']:.1f} seconds")
        print("=" * 70)

def main():
    """Main test execution"""
    tester = ArchitectureAlignmentTester()
    results = tester.run_comprehensive_test()
    tester.print_results()
    
    # Save results to file
    with open("architecture_alignment_results.json", "w") as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n💾 Results saved to: architecture_alignment_results.json")

if __name__ == "__main__":
    main()

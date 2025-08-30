#!/usr/bin/env python3
"""
N8N CLI Tool - Unified Client-Server Interaction System
=======================================================

This tool provides a unified interface for interacting with n8n workflows
across both local and production environments. It includes:

- Environment management and switching
- Workflow testing and validation
- Crew member endpoint testing
- Comprehensive error handling and reporting
- Local and remote n8n instance management
"""

import json
import requests
import time
import sys
import os
import argparse
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from pathlib import Path
import yaml
import click

# Configuration and Environment Management
@dataclass
class Environment:
    name: str
    n8n_base_url: str
    api_key: Optional[str] = None
    webhook_secret: Optional[str] = None
    timeout: int = 30
    retry_attempts: int = 3
    retry_delay: float = 1.0

class N8NConfig:
    def __init__(self, config_path: str = "config/n8n_cli_config.yaml"):
        self.config_path = Path(config_path)
        self.environments: Dict[str, Environment] = {}
        self.current_env: Optional[str] = None
        self.load_config()
    
    def load_config(self):
        """Load configuration from YAML file"""
        if not self.config_path.exists():
            self.create_default_config()
        
        try:
            with open(self.config_path, 'r') as f:
                config_data = yaml.safe_load(f)
                
            for env_name, env_data in config_data.get('environments', {}).items():
                self.environments[env_name] = Environment(
                    name=env_name,
                    n8n_base_url=env_data['n8n_base_url'],
                    api_key=env_data.get('api_key'),
                    webhook_secret=env_data.get('webhook_secret'),
                    timeout=env_data.get('timeout', 30),
                    retry_attempts=env_data.get('retry_attempts', 3),
                    retry_delay=env_data.get('retry_delay', 1.0)
                )
            
            self.current_env = config_data.get('current_environment', 'local')
            
        except Exception as e:
            print(f"❌ Error loading config: {e}")
            self.create_default_config()
    
    def create_default_config(self):
        """Create default configuration file"""
        default_config = {
            'current_environment': 'local',
            'environments': {
                'local': {
                    'n8n_base_url': 'http://localhost:5678',
                    'timeout': 30,
                    'retry_attempts': 3,
                    'retry_delay': 1.0
                },
                'production': {
                    'n8n_base_url': 'https://n8n.pbradygeorgen.com',
                    'timeout': 60,
                    'retry_attempts': 5,
                    'retry_delay': 2.0
                }
            }
        }
        
        self.config_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.config_path, 'w') as f:
            yaml.dump(default_config, f, default_flow_style=False)
        
        print(f"✅ Created default config at {self.config_path}")
        self.load_config()
    
    def get_current_environment(self) -> Environment:
        """Get current environment configuration"""
        if self.current_env not in self.environments:
            self.current_env = 'local'
        return self.environments[self.current_env]
    
    def switch_environment(self, env_name: str):
        """Switch to specified environment"""
        if env_name not in self.environments:
            print(f"❌ Environment '{env_name}' not found")
            return False
        
        self.current_env = env_name
        
        # Update config file
        try:
            with open(self.config_path, 'r') as f:
                config_data = yaml.safe_load(f)
            
            config_data['current_environment'] = env_name
            
            with open(self.config_path, 'w') as f:
                yaml.dump(config_data, f, default_flow_style=False)
            
            print(f"✅ Switched to environment: {env_name}")
            return True
            
        except Exception as e:
            print(f"❌ Error updating config: {e}")
            return False

class N8NClient:
    def __init__(self, environment: Environment):
        self.env = environment
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'N8N-CLI/1.0',
            'Content-Type': 'application/json'
        })
        
        if environment.api_key:
            self.session.headers['X-N8N-API-Key'] = environment.api_key
    
    def test_connection(self) -> Dict[str, Any]:
        """Test connection to n8n instance"""
        try:
            response = self.session.get(
                f"{self.env.n8n_base_url}/healthz",
                timeout=self.env.timeout
            )
            
            if response.status_code == 200:
                return {
                    'status': 'success',
                    'message': 'Connected successfully',
                    'response_time': response.elapsed.total_seconds(),
                    'status_code': response.status_code
                }
            else:
                return {
                    'status': 'error',
                    'message': f'HTTP {response.status_code}',
                    'status_code': response.status_code
                }
                
        except requests.exceptions.Timeout:
            return {
                'status': 'error',
                'message': 'Connection timeout',
                'status_code': None
            }
        except requests.exceptions.ConnectionError:
            return {
                'status': 'error',
                'message': 'Connection refused',
                'status_code': None
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e),
                'status_code': None
            }
    
    def test_webhook(self, webhook_path: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Test a specific webhook endpoint"""
        webhook_url = f"{self.env.n8n_base_url}/webhook/{webhook_path}"
        
        for attempt in range(self.env.retry_attempts):
            try:
                start_time = time.time()
                response = self.session.post(
                    webhook_url,
                    json=payload,
                    timeout=self.env.timeout
                )
                response_time = time.time() - start_time
                
                result = {
                    'status': 'success' if response.status_code < 400 else 'error',
                    'webhook_url': webhook_url,
                    'status_code': response.status_code,
                    'response_time': response_time,
                    'attempt': attempt + 1,
                    'headers': dict(response.headers)
                }
                
                # Try to parse response
                try:
                    result['response_body'] = response.json()
                except:
                    result['response_body'] = response.text
                
                if response.status_code < 400:
                    return result
                else:
                    print(f"⚠️ Attempt {attempt + 1} failed: HTTP {response.status_code}")
                    
            except requests.exceptions.Timeout:
                print(f"⚠️ Attempt {attempt + 1} timed out")
                result = {
                    'status': 'error',
                    'message': 'Request timeout',
                    'webhook_url': webhook_url,
                    'attempt': attempt + 1
                }
            except Exception as e:
                print(f"⚠️ Attempt {attempt + 1} error: {e}")
                result = {
                    'status': 'error',
                    'message': str(e),
                    'webhook_url': webhook_url,
                    'attempt': attempt + 1
                }
            
            if attempt < self.env.retry_attempts - 1:
                time.sleep(self.env.retry_delay)
        
        return result
    
    def get_workflows(self) -> Dict[str, Any]:
        """Get list of available workflows"""
        try:
            response = self.session.get(
                f"{self.env.n8n_base_url}/api/v1/workflows",
                timeout=self.env.timeout
            )
            
            if response.status_code == 200:
                return {
                    'status': 'success',
                    'workflows': response.json()
                }
            else:
                return {
                    'status': 'error',
                    'message': f'HTTP {response.status_code}',
                    'status_code': response.status_code
                }
                
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }

class TestRunner:
    def __init__(self, client: N8NClient):
        self.client = client
        self.results: List[Dict[str, Any]] = []
    
    def run_crew_member_test(self, crew_member: str, webhook_path: str, task: str) -> Dict[str, Any]:
        """Run test for a specific crew member"""
        payload = {
            'crewMemberId': crew_member,
            'webhookPath': webhook_path,
            'task': task,
            'timestamp': datetime.now().isoformat(),
            'testMode': True,
            'source': 'n8n-cli'
        }
        
        print(f"🧪 Testing {crew_member} with task: {task}")
        result = self.client.test_webhook(webhook_path, payload)
        
        # Add metadata
        result['crew_member'] = crew_member
        result['webhook_path'] = webhook_path
        result['task'] = task
        result['timestamp'] = datetime.now().isoformat()
        
        self.results.append(result)
        return result
    
    def run_automated_test_suite(self, test_scenarios: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Run comprehensive automated test suite"""
        print(f"🤖 Running automated test suite with {len(test_scenarios)} scenarios")
        
        for i, scenario in enumerate(test_scenarios, 1):
            print(f"\n📋 Scenario {i}/{len(test_scenarios)}: {scenario['name']}")
            
            for crew_member in scenario['crew_members']:
                result = self.run_crew_member_test(
                    crew_member['id'],
                    crew_member['webhook_path'],
                    scenario['task']
                )
                
                # Add scenario metadata
                result['scenario'] = scenario['name']
                result['scenario_id'] = scenario['id']
                
                # Display result
                if result['status'] == 'success':
                    print(f"  ✅ {crew_member['name']}: {result['response_time']:.2f}s")
                else:
                    print(f"  ❌ {crew_member['name']}: {result.get('message', 'Unknown error')}")
                
                # Add delay between tests
                if i < len(test_scenarios):
                    time.sleep(1)
        
        return self.results
    
    def generate_report(self) -> str:
        """Generate comprehensive test report"""
        if not self.results:
            return "No test results to report"
        
        total_tests = len(self.results)
        successful_tests = sum(1 for r in self.results if r['status'] == 'success')
        failed_tests = total_tests - successful_tests
        
        report = f"""
📊 N8N Test Report
==================

Environment: {self.client.env.name}
Base URL: {self.client.env.n8n_base_url}
Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Summary:
- Total Tests: {total_tests}
- Successful: {successful_tests}
- Failed: {failed_tests}
- Success Rate: {(successful_tests/total_tests)*100:.1f}%

Detailed Results:
"""
        
        for result in self.results:
            status_icon = "✅" if result['status'] == 'success' else "❌"
            report += f"\n{status_icon} {result.get('crew_member', 'Unknown')}"
            report += f" - {result.get('scenario', 'N/A')}"
            
            if result['status'] == 'success':
                report += f" ({result.get('response_time', 0):.2f}s)"
            else:
                report += f" - {result.get('message', 'Unknown error')}"
        
        return report

# CLI Commands
@click.group()
@click.option('--config', default='config/n8n_cli_config.yaml', help='Configuration file path')
@click.pass_context
def cli(ctx, config):
    """N8N CLI Tool - Unified Client-Server Interaction System"""
    ctx.ensure_object(dict)
    ctx.obj['config'] = N8NConfig(config)
    ctx.obj['client'] = N8NClient(ctx.obj['config'].get_current_environment())

@cli.command()
@click.pass_context
def status(ctx):
    """Show current environment status and test connection"""
    config = ctx.obj['config']
    client = ctx.obj['client']
    
    print(f"🌍 Current Environment: {config.current_env}")
    print(f"🔗 Base URL: {client.env.n8n_base_url}")
    print(f"⏱️ Timeout: {client.env.timeout}s")
    print(f"🔄 Retry Attempts: {client.env.retry_attempts}")
    
    print("\n🔍 Testing connection...")
    connection_result = client.test_connection()
    
    if connection_result['status'] == 'success':
        print(f"✅ Connection successful ({connection_result['response_time']:.2f}s)")
    else:
        print(f"❌ Connection failed: {connection_result['message']}")

@cli.command()
@click.argument('environment')
@click.pass_context
def switch(ctx, environment):
    """Switch to specified environment"""
    config = ctx.obj['config']
    config.switch_environment(environment)

@cli.command()
@click.argument('webhook_path')
@click.option('--task', default='Quick test', help='Task description')
@click.option('--payload', help='Custom JSON payload')
@click.pass_context
def test_webhook(ctx, webhook_path, task, payload):
    """Test a specific webhook endpoint"""
    client = ctx.obj['client']
    
    if payload:
        try:
            test_payload = json.loads(payload)
        except json.JSONDecodeError:
            print("❌ Invalid JSON payload")
            return
    else:
        test_payload = {
            'task': task,
            'timestamp': datetime.now().isoformat(),
            'testMode': True,
            'source': 'n8n-cli'
        }
    
    print(f"🧪 Testing webhook: {webhook_path}")
    result = client.test_webhook(webhook_path, test_payload)
    
    if result['status'] == 'success':
        print(f"✅ Success! Response time: {result['response_time']:.2f}s")
        print(f"   Status: HTTP {result['status_code']}")
    else:
        print(f"❌ Failed: {result.get('message', 'Unknown error')}")
        print(f"   Attempts: {result.get('attempt', 1)}")

@cli.command()
@click.option('--output', default='test-results', help='Output directory for results')
@click.pass_context
def run_suite(ctx, output):
    """Run comprehensive automated test suite"""
    client = ctx.obj['client']
    runner = TestRunner(client)
    
    # Define test scenarios
    test_scenarios = [
        {
            'id': 'strategic_analysis',
            'name': 'Strategic Business Analysis',
            'task': 'Conduct comprehensive strategic analysis of market positioning',
            'crew_members': [
                {'id': 'picard', 'name': 'Captain Picard', 'webhook_path': 'crew-captain-jean-luc-picard'},
                {'id': 'quark', 'name': 'Quark', 'webhook_path': 'crew-quark'}
            ]
        },
        {
            'id': 'tactical_execution',
            'name': 'Tactical Execution Planning',
            'task': 'Develop tactical execution plan for technical implementation',
            'crew_members': [
                {'id': 'riker', 'name': 'Commander Riker', 'webhook_path': 'crew-commander-william-riker'},
                {'id': 'laforge', 'name': 'La Forge', 'webhook_path': 'crew-lieutenant-commander-geordi-la-forge'}
            ]
        },
        {
            'id': 'data_analysis',
            'name': 'Data Analysis & Logic',
            'task': 'Perform comprehensive data analysis and pattern recognition',
            'crew_members': [
                {'id': 'data', 'name': 'Commander Data', 'webhook_path': 'crew-commander-data'},
                {'id': 'crusher', 'name': 'Dr. Crusher', 'webhook_path': 'crew-dr-beverly-crusher'}
            ]
        }
    ]
    
    # Run test suite
    results = runner.run_automated_test_suite(test_scenarios)
    
    # Generate and display report
    report = runner.generate_report()
    print(report)
    
    # Save results
    output_dir = Path(output)
    output_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    results_file = output_dir / f"n8n_test_results_{timestamp}.json"
    
    with open(results_file, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n💾 Results saved to: {results_file}")

@cli.command()
@click.pass_context
def workflows(ctx):
    """List available workflows"""
    client = ctx.obj['client']
    
    print("📋 Fetching workflows...")
    result = client.get_workflows()
    
    if result['status'] == 'success':
        workflows = result['workflows']
        print(f"✅ Found {len(workflows)} workflows:")
        
        for workflow in workflows:
            status = "🟢 Active" if workflow.get('active') else "🔴 Inactive"
            print(f"  {status} - {workflow.get('name', 'Unnamed')} (ID: {workflow.get('id')})")
    else:
        print(f"❌ Failed to fetch workflows: {result['message']}")

@cli.command()
@click.pass_context
def environments(ctx):
    """List available environments"""
    config = ctx.obj['config']
    
    print("🌍 Available Environments:")
    for env_name, env in config.environments.items():
        current = " (current)" if env_name == config.current_env else ""
        print(f"  {env_name}{current}: {env.n8n_base_url}")

if __name__ == '__main__':
    cli()

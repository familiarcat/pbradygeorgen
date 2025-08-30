# 🤖 Unified N8N Testing System

## Overview

The Unified N8N Testing System provides a comprehensive, consistent interface for testing n8n workflows across both local and production environments. This system eliminates the fragmentation between client and server interactions, providing a unified experience for developers, testers, and operations teams.

## 🏗️ Architecture

### Core Components

1. **N8N CLI Tool** (`scripts/n8n-cli.py`)
   - Python-based command-line interface
   - Environment management and switching
   - Automated test suite execution
   - Comprehensive reporting and logging

2. **N8N API Client** (`core/lib/n8n-api-client.ts`)
   - TypeScript/JavaScript client library
   - Unified interface for Next.js applications
   - Environment-aware configuration
   - Retry logic and error handling

3. **Unified Testing UI** (`core/components/UnifiedN8NTesting.tsx`)
   - React component for web-based testing
   - Real-time environment switching
   - Visual test execution and monitoring
   - Comprehensive result display

## 🚀 Getting Started

### Prerequisites

- Python 3.8+ (for CLI tool)
- Node.js 18+ (for API client)
- Access to n8n instances (local and/or production)

### Installation

#### Python CLI Tool

```bash
cd scripts
pip install -r requirements.txt
chmod +x n8n-cli.py
```

#### TypeScript API Client

The API client is automatically available in the Next.js application.

### Configuration

The system automatically creates a default configuration file at `config/n8n_cli_config.yaml`:

```yaml
current_environment: local
environments:
  local:
    n8n_base_url: http://localhost:5678
    timeout: 30
    retry_attempts: 3
    retry_delay: 1.0
  production:
    n8n_base_url: https://n8n.pbradygeorgen.com
    timeout: 60
    retry_attempts: 5
    retry_delay: 2.0
```

## 📖 Usage

### CLI Tool

#### Basic Commands

```bash
# Show current status and test connection
./n8n-cli.py status

# Switch environments
./n8n-cli.py switch production

# Test a specific webhook
./n8n-cli.py test-webhook crew-captain-jean-luc-picard --task "Strategic analysis"

# Run automated test suite
./n8n-cli.py run-suite

# List available workflows
./n8n-cli.py workflows

# Show available environments
./n8n-cli.py environments
```

#### Advanced Usage

```bash
# Custom payload testing
./n8n-cli.py test-webhook crew-commander-data \
  --payload '{"task": "Data analysis", "complexity": "high"}'

# Output results to specific directory
./n8n-cli.py run-suite --output custom-results
```

### API Client (TypeScript/JavaScript)

#### Basic Usage

```typescript
import { n8nClient, n8nTestRunner } from '@/lib/n8n-api-client';

// Test connection
const connectionResult = await n8nClient.testConnection();
console.log('Connection status:', connectionResult.status);

// Test webhook
const testResult = await n8nClient.testWebhook('crew-picard', {
  crewMemberId: 'picard',
  task: 'Strategic analysis',
  testMode: true
});

// Switch environment
n8nClient.switchEnvironment('production');
```

#### Test Runner

```typescript
// Run automated test suite
const scenarios: TestScenario[] = [
  {
    id: 'strategic_analysis',
    name: 'Strategic Business Analysis',
    task: 'Conduct comprehensive strategic analysis',
    expectedOutcome: 'Strategic insights with recommendations',
    complexity: 'High',
    category: 'Strategic Leadership',
    crewMembers: ['picard', 'quark']
  }
];

const suiteResult = await n8nTestRunner.runAutomatedTestSuite(scenarios);
console.log('Test results:', suiteResult.summary);
```

### React Component

```tsx
import { UnifiedN8NTesting } from '@/components/UnifiedN8NTesting';

function TestPage() {
  return (
    <div>
      <h1>N8N Testing Console</h1>
      <UnifiedN8NTesting />
    </div>
  );
}
```

## 🔧 Environment Management

### Environment Types

1. **Local Development**
   - URL: `http://localhost:5678`
   - Timeout: 30 seconds
   - Retry attempts: 3
   - Use case: Development and testing

2. **Production**
   - URL: `https://n8n.pbradygeorgen.com`
   - Timeout: 60 seconds
   - Retry attempts: 5
   - Use case: Production testing and monitoring

### Environment Switching

```typescript
// Switch to production
n8nClient.switchEnvironment('production');

// Get current environment
const currentEnv = n8nClient.getCurrentEnvironment();
console.log('Current URL:', currentEnv.n8nBaseUrl);
```

## 🧪 Testing Scenarios

### Predefined Scenarios

The system includes 6 comprehensive test scenarios:

1. **Strategic Business Analysis** (High Complexity)
   - Crew: Picard, Quark
   - Focus: Market positioning and competitive landscape

2. **Tactical Execution Planning** (Medium Complexity)
   - Crew: Riker, La Forge
   - Focus: Technical implementation planning

3. **Data Analysis & Logic** (High Complexity)
   - Crew: Data, Crusher
   - Focus: Pattern recognition and statistical analysis

4. **Psychological Insights** (Medium Complexity)
   - Crew: Troi, Crusher
   - Focus: Human behavior and decision-making factors

5. **Security & Tactical Analysis** (Medium Complexity)
   - Crew: Worf, O'Brien
   - Focus: Security assessment and tactical planning

6. **Technical Implementation** (High Complexity)
   - Crew: La Forge, O'Brien
   - Focus: System architecture and implementation roadmap

### Custom Scenarios

```typescript
const customScenario: TestScenario = {
  id: 'custom_test',
  name: 'Custom Test Scenario',
  description: 'Custom test description',
  task: 'Custom task description',
  expectedOutcome: 'Expected outcome description',
  complexity: 'Medium',
  category: 'Custom Category',
  crewMembers: ['picard', 'data']
};
```

## 📊 Test Results

### Result Structure

```typescript
interface TestResult {
  id: string;
  crewMemberId: string;
  webhookPath: string;
  task: string;
  status: 'success' | 'error' | 'timeout';
  responseTime?: number;
  statusCode?: number;
  responseBody?: any;
  error?: string;
  timestamp: string;
  environment: string;
  attempts: number;
}
```

### Result Analysis

- **Success Rate**: Percentage of successful tests
- **Response Times**: Performance metrics for each test
- **Error Details**: Comprehensive error information
- **Environment Tracking**: Which environment each test ran in
- **Retry Information**: Number of attempts for failed tests

## 🛠️ Error Handling

### Automatic Retry Logic

- Configurable retry attempts per environment
- Exponential backoff between retries
- Comprehensive error logging
- Graceful fallback mechanisms

### Error Types

1. **Network Errors**: Connection timeouts, refused connections
2. **HTTP Errors**: 4xx and 5xx status codes
3. **Parse Errors**: Invalid JSON responses
4. **Timeout Errors**: Request timeouts

### Error Recovery

```typescript
// Test with custom retry settings
const result = await n8nClient.testWebhook('crew-picard', payload, {
  timeout: 45000,
  retryAttempts: 5,
  retryDelay: 2000
});
```

## 🔍 Monitoring and Debugging

### Connection Testing

```bash
# Test current environment connection
./n8n-cli.py status

# Test specific environment
./n8n-cli.py switch production && ./n8n-cli.py status
```

### Workflow Discovery

```bash
# List all available workflows
./n8n-cli.py workflows
```

### Logging

The system provides comprehensive logging:
- Connection attempts and results
- Test execution details
- Error information and stack traces
- Performance metrics

## 🚀 Deployment

### Local Development

1. Start local n8n instance
2. Run CLI tool: `./n8n-cli.py status`
3. Test webhooks: `./n8n-cli.py test-webhook <webhook-path>`

### Production Testing

1. Switch to production: `./n8n-cli.py switch production`
2. Verify connection: `./n8n-cli.py status`
3. Run test suite: `./n8n-cli.py run-suite`

### CI/CD Integration

```yaml
# Example GitHub Actions workflow
- name: Test N8N Production
  run: |
    cd scripts
    pip install -r requirements.txt
    ./n8n-cli.py switch production
    ./n8n-cli.py run-suite --output test-results
```

## 📈 Performance Optimization

### Timeout Configuration

- **Local**: 30 seconds (faster feedback during development)
- **Production**: 60 seconds (accommodates network latency)

### Retry Strategy

- **Local**: 3 attempts with 1-second delays
- **Production**: 5 attempts with 2-second delays

### Batch Testing

- Sequential execution to avoid overwhelming n8n
- Configurable delays between tests
- Progress tracking and real-time feedback

## 🔒 Security Considerations

### API Key Management

- Environment-specific API keys
- Secure storage in configuration files
- No hardcoded credentials in code

### Webhook Security

- Validation of webhook responses
- Error handling for unauthorized access
- Secure communication over HTTPS (production)

### Data Privacy

- Test data isolation
- No sensitive information in logs
- Configurable data retention

## 🚧 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if n8n instance is running
   - Verify port configuration
   - Check firewall settings

2. **Timeout Errors**
   - Increase timeout values in configuration
   - Check network connectivity
   - Verify n8n instance performance

3. **Authentication Errors**
   - Verify API key configuration
   - Check webhook secret settings
   - Ensure proper permissions

4. **Webhook Not Found**
   - Verify webhook path in n8n
   - Check workflow activation status
   - Validate webhook configuration

### Debug Mode

```bash
# Enable verbose logging
export N8N_DEBUG=true
./n8n-cli.py status
```

## 🔮 Future Enhancements

### Planned Features

1. **Real-time Monitoring**
   - WebSocket connections for live updates
   - Dashboard for test execution monitoring
   - Alert system for failed tests

2. **Advanced Analytics**
   - Historical performance trends
   - Predictive failure analysis
   - Capacity planning insights

3. **Integration Testing**
   - Multi-workflow coordination testing
   - End-to-end scenario validation
   - Cross-environment testing

4. **Performance Testing**
   - Load testing capabilities
   - Stress testing scenarios
   - Performance benchmarking

### Extensibility

The system is designed for easy extension:
- Plugin architecture for custom test types
- API for third-party integrations
- Custom reporting formats
- Integration with monitoring systems

## 📚 API Reference

### N8NClient Methods

- `testConnection()`: Test connection to current environment
- `testWebhook(path, payload, options)`: Test specific webhook
- `getWorkflows()`: Get list of available workflows
- `switchEnvironment(name)`: Switch to different environment
- `getCurrentEnvironment()`: Get current environment info

### N8NTestRunner Methods

- `runCrewMemberTest(id, path, task, payload)`: Run single crew test
- `runAutomatedTestSuite(scenarios)`: Run comprehensive test suite
- `generateReport()`: Generate test results report
- `getResults()`: Get all test results
- `clearResults()`: Clear test results

### CLI Commands

- `status`: Show environment status and test connection
- `switch <env>`: Switch to specified environment
- `test-webhook <path>`: Test specific webhook endpoint
- `run-suite`: Run automated test suite
- `workflows`: List available workflows
- `environments`: List available environments

## 🤝 Contributing

### Development Setup

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Install Node.js dependencies: `npm install`
4. Run tests: `npm test`

### Code Style

- Python: PEP 8 compliance
- TypeScript: ESLint configuration
- React: Component library standards
- Documentation: Markdown with examples

### Testing

- Unit tests for all components
- Integration tests for workflows
- End-to-end testing scenarios
- Performance benchmarking

## 📄 License

This project is part of the AlexAI Crew System and follows the same licensing terms.

---

## 🎯 Quick Start Checklist

- [ ] Install Python dependencies: `pip install -r requirements.txt`
- [ ] Verify n8n instance is running
- [ ] Test connection: `./n8n-cli.py status`
- [ ] Switch to production: `./n8n-cli.py switch production`
- [ ] Run test suite: `./n8n-cli.py run-suite`
- [ ] Review results and logs
- [ ] Integrate with your development workflow

For additional support or questions, refer to the troubleshooting section or create an issue in the repository.

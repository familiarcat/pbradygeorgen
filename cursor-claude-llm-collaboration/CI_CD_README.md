# 🚀 Cursor Extension CI/CD Workflow

This document describes the comprehensive CI/CD workflow for the `cursor-claude-llm-collaboration` extension.

## 📋 Overview

Our CI/CD pipeline provides multiple levels of automation:

1. **Local Development Workflow** - Quick iteration during development
2. **Full CI/CD Pipeline** - Complete build, test, and deployment
3. **GitHub Actions** - Automated CI/CD on push/PR
4. **Environment Management** - Automated setup and configuration

## 🛠️ Available Scripts

### 1. Quick Development Workflow
```bash
./dev-workflow.sh
```
**Purpose:** Rapid iteration during development
**What it does:**
- Compiles TypeScript
- Packages extension
- Installs in Cursor
- Cleans up artifacts
**Use case:** When making small changes and want to test quickly

### 2. Full CI/CD Workflow
```bash
./cicd-workflow.sh
```
**Purpose:** Complete build, test, and deployment cycle
**What it does:**
- Environment validation
- Git status management
- Dependency management
- Code quality checks
- TypeScript compilation
- Extension packaging
- Installation and verification
- Cleanup
**Use case:** Before committing major changes or deploying

### 3. Auto-Fix and Load
```bash
./auto-fix-and-load.sh
```
**Purpose:** Automatically fix common issues and load the extension
**What it does:**
- Cleans corrupted files
- Rebuilds from scratch
- Installs extension
- Monitors for activation
**Use case:** When the extension is broken or not loading

### 4. Conflict Resolution
```bash
./auto-resolve-conflicts.sh
```
**Purpose:** Resolve conflicts with old extensions
**What it does:**
- Uninstalls conflicting extensions
- Ensures correct extension is active
- Provides restart instructions
**Use case:** When multiple versions are installed

### 5. Development Environment Setup
```bash
./setup-dev-env.sh
```
**Purpose:** Set up complete development environment
**What it does:**
- Validates Node.js/npm versions
- Installs dependencies
- Configures git hooks
- Sets up VS Code settings
- Creates .vscodeignore
**Use case:** First-time setup or environment reset

## 🔄 Workflow Stages

### Stage 1: Development
```bash
# Make changes to src/extension.ts
# Test quickly
./dev-workflow.sh
# Restart Cursor to test
```

### Stage 2: Pre-commit
```bash
# Run full CI/CD workflow
./cicd-workflow.sh
# Commit changes
git add .
git commit -m "Your commit message"
```

### Stage 3: Push/Deploy
```bash
# Push to trigger GitHub Actions
git push origin claude-integration-aug30
# GitHub Actions will automatically:
# - Build and test
# - Create release
# - Deploy to N8N (if configured)
```

## 🚀 GitHub Actions

### Triggers
- **Push** to `main`, `claude-integration-aug30`, or `develop`
- **Pull Request** to protected branches
- **Manual** via workflow dispatch

### Jobs
1. **Build and Test**
   - Matrix testing with Node.js 18.x and 20.x
   - Dependency installation
   - TypeScript compilation
   - Extension packaging
   - Artifact upload

2. **Deploy**
   - Automatic release creation
   - Extension asset upload
   - N8N deployment (if configured)

## 🔧 Configuration

### Environment Variables
The extension automatically reads from `~/.zshrc`:
```bash
export N8N_BASE_URL="https://n8n.pbradygeorgen.com"
export OPENROUTER_API_KEY="your_key_here"
export CLAUDE_API_KEY="your_key_here"
export N8N_API_KEY="your_key_here"
```

### GitHub Secrets
For GitHub Actions deployment:
- `N8N_BASE_URL` - N8N instance URL
- `N8N_API_KEY` - N8N API key
- `OPENROUTER_API_KEY` - OpenRouter API key

## 📊 Monitoring and Debugging

### Extension Status
```bash
# Check installed extensions
cursor --list-extensions | grep claude

# Check extension status
cursor --show-versions
```

### Build Verification
```bash
# Verify TypeScript compilation
npm run compile

# Verify packaging
npm run package

# Check generated files
ls -la *.vsix
```

### Common Issues and Solutions

#### Issue: Extension not loading
```bash
./auto-fix-and-load.sh
```

#### Issue: Command conflicts
```bash
./auto-resolve-conflicts.sh
```

#### Issue: Build failures
```bash
# Clean and rebuild
rm -rf out/ node_modules/
npm install
npm run compile
```

## 🎯 Best Practices

### Development
1. **Use `./dev-workflow.sh`** for quick iterations
2. **Test locally** before committing
3. **Use `./cicd-workflow.sh`** before major commits
4. **Keep dependencies updated**

### Deployment
1. **Test on feature branches** before merging
2. **Use semantic versioning** for releases
3. **Monitor GitHub Actions** for build status
4. **Verify extension functionality** after deployment

### Maintenance
1. **Regular dependency updates**
2. **Monitor extension performance**
3. **Update documentation** with changes
4. **Backup configurations** before major updates

## 🔗 Integration Points

### N8N Workflows
- Automatic deployment of LLM collaboration workflows
- Webhook integration for real-time updates
- Configuration management via environment variables

### OpenRouter
- Multi-LLM access (Claude, GPT-4o, Gemini, Llama)
- Cost optimization and model selection
- API key management

### Cursor/VS Code
- Extension marketplace integration
- Command palette integration
- Webview UI for enhanced experience

## 📈 Performance Optimization

### Bundle Size
- Use `.vscodeignore` to exclude unnecessary files
- Consider bundling for production
- Monitor package size trends

### Build Time
- Use `./dev-workflow.sh` for quick iterations
- Parallel testing in GitHub Actions
- Caching dependencies

### Runtime Performance
- Lazy loading of heavy components
- Efficient webview communication
- Minimal memory footprint

## 🚨 Troubleshooting

### Build Issues
```bash
# Check Node.js version
node --version  # Should be 18+

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Extension Issues
```bash
# Check extension logs
cursor --verbose

# Reset extension
cursor --uninstall-extension pbradygeorgen.cursor-claude-llm-collaboration
./auto-fix-and-load.sh
```

### CI/CD Issues
```bash
# Check GitHub Actions logs
# Verify secrets are configured
# Check branch protection rules
# Verify workflow file syntax
```

## 🎉 Success Metrics

### Development Efficiency
- **Build time:** < 30 seconds for dev workflow
- **Deployment time:** < 5 minutes for full CI/CD
- **Error rate:** < 5% build failures

### Extension Quality
- **User satisfaction:** High ratings and positive feedback
- **Performance:** Fast command execution
- **Reliability:** Stable operation across Cursor versions

### Process Efficiency
- **Automation coverage:** > 90% of tasks automated
- **Manual intervention:** < 10% of deployments
- **Rollback capability:** < 5 minutes to previous version

---

**🚀 Happy coding with your enhanced CI/CD workflow!**

























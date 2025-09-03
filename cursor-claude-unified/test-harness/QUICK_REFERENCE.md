# 🚀 Cursor AI Supercharger - Testing Quick Reference

## ⚡ **Run Tests in 3 Commands**

```bash
# 1. Navigate to extension directory
cd cursor-claude-unified

# 2. Make test runner executable
chmod +x test-harness/run-tests.sh

# 3. Run automated test suite
./test-harness/run-tests.sh
```

## 🎯 **What Gets Tested (16 Tests)**

| Category            | Tests                                         | Status |
| ------------------- | --------------------------------------------- | ------ |
| **🔨 Build**         | TypeScript, Dependencies, File Structure      | ✅ 3/3  |
| **📦 Packaging**     | VSIX, Contents, Size                          | ✅ 3/3  |
| **⌨️ Commands**      | Count (14), Naming, Registration              | ✅ 3/3  |
| **⚡ Functionality** | File Context, Cost Dashboard, N8N, LLM Status | ✅ 4/4  |
| **🔗 Integration**   | N8N Connectivity, Crew Coordination, Webhooks | ✅ 3/3  |

## 📊 **Success Criteria**

- **✅ 100% Pass Rate**: Ready for deployment
- **⚠️ 90%+ Pass Rate**: Minor issues to address  
- **❌ <90% Pass Rate**: Fix issues before deployment

## 🚨 **Common Issues & Fixes**

| Issue                    | Fix                                          |
| ------------------------ | -------------------------------------------- |
| `Python 3 not found`     | Install Python 3 from python.org             |
| `Permission denied`      | `chmod +x test-harness/run-tests.sh`         |
| `Wrong directory`        | Ensure you're in `cursor-claude-unified/`    |
| `Dependencies fail`      | Check `package.json` has `@types/vscode`     |
| `Command count mismatch` | Verify exactly 14 commands in `package.json` |

## 📁 **Test Reports**

- **Location**: Extension root directory
- **Format**: `test_report_YYYYMMDD_HHMMSS.json`
- **Contents**: Detailed results, environment info, recommendations

## 🔧 **Before Testing**

1. **Clean workspace**: Remove old builds
2. **Fresh dependencies**: `npm install`
3. **Proper permissions**: Ensure write access

## 🎉 **After Testing**

- **All Pass**: Deploy with confidence! 🚀
- **Some Fail**: Review recommendations and fix issues
- **Save Report**: Keep for CI/CD integration

---

**"Make it so." - Captain Jean-Luc Picard** 🚀

**Testing Status**: ✅ **16/16 Tests PASSED** - Extension ready for deployment!

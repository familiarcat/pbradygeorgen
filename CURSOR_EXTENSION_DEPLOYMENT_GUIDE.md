# 🚀 Cursor Extension Clean Deployment Guide

## **Overview**
This guide provides a step-by-step process to cleanly deploy the Cursor-Claude Unified extension while removing all old versions for a fresh installation.

## **🔄 Deployment Process**

### **Option 1: Automated Clean Deployment (Recommended)**
```bash
# From your main workspace root
./scripts/deploy-cursor-extension.sh
```

### **Option 2: Manual Step-by-Step Deployment**

#### **Step 1: Stop Cursor/VS Code**
```bash
# Kill all Cursor and VS Code processes
pkill -f "Cursor"
pkill -f "Code"
sleep 2
```

#### **Step 2: Remove Old Extension Versions**
```bash
# Clean Cursor extensions
rm -rf ~/.cursor/extensions/*cursor-claude-unified*

# Clean VS Code extensions  
rm -rf ~/.vscode/extensions/*cursor-claude-unified*

# Remove development symlink
rm -rf ~/.vscode/extensions/cursor-claude-unified-dev
```

#### **Step 3: Clean Build Artifacts**
```bash
cd cursor-claude-unified
rm -rf out/
rm -f *.vsix
rm -rf node_modules/
```

#### **Step 4: Fresh Install and Build**
```bash
# Install dependencies
npm install

# Compile extension
npm run compile

# Package extension
npm run package
```

#### **Step 5: Install and Link**
```bash
# Create development symlink
ln -sf "$(pwd)" ~/.vscode/extensions/cursor-claude-unified-dev

# Copy to Cursor extensions
mkdir -p ~/.cursor/extensions
cp *.vsix ~/.cursor/extensions/
```

## **🎯 What the Automated Script Does**

The `deploy-cursor-extension.sh` script automatically:

1. ✅ **Stops Cursor/VS Code processes**
2. ✅ **Removes all old extension versions**
3. ✅ **Cleans build artifacts and node_modules**
4. ✅ **Fresh installs dependencies**
5. ✅ **Compiles the extension**
6. ✅ **Packages into VSIX**
7. ✅ **Creates development symlink**
8. ✅ **Installs in Cursor extensions**
9. ✅ **Verifies installation**
10. ✅ **Provides next steps**

## **🚀 Post-Deployment Steps**

### **1. Restart Cursor/VS Code**
- Close all instances completely
- Restart Cursor/VS Code

### **2. Verify Extension Installation**
- Open Extensions panel (Ctrl+Shift+X)
- Search for "Cursor-Claude Unified Chat"
- Verify it shows as installed

### **3. Test Extension**
- Open Command Palette (Ctrl+Shift+P)
- Type: `Cursor-Claude: Start Unified Chat`
- Verify the extension activates

## **🔄 Development Workflow**

### **After Making Changes:**
```bash
cd cursor-claude-unified

# Quick rebuild
npm run compile

# Watch mode for development
npm run dev

# Package for distribution
npm run package
```

### **To Redeploy After Changes:**
```bash
# From main workspace root
./scripts/deploy-cursor-extension.sh
```

## **📁 Extension Locations**

- **Development Symlink**: `~/.vscode/extensions/cursor-claude-unified-dev`
- **Cursor Extensions**: `~/.cursor/extensions/`
- **VS Code Extensions**: `~/.vscode/extensions/`

## **🧹 Troubleshooting**

### **Extension Not Appearing:**
1. Verify Cursor/VS Code was restarted
2. Check extension directories exist
3. Verify symlink is correct
4. Check for compilation errors

### **Build Failures:**
1. Ensure you're in the right directory
2. Check Node.js version compatibility
3. Clear node_modules and reinstall
4. Verify TypeScript compilation

### **Runtime Errors:**
1. Check browser console for errors
2. Verify all service files compiled
3. Check extension activation events
4. Review extension logs

## **🔧 Manual Commands Reference**

```bash
# Quick rebuild
cd cursor-claude-unified && npm run compile

# Watch mode
cd cursor-claude-unified && npm run dev

# Package extension
cd cursor-claude-unified && npm run package

# Clean everything and redeploy
./scripts/deploy-cursor-extension.sh
```

## **📋 Pre-Deployment Checklist**

- [ ] Cursor/VS Code is closed
- [ ] Old extensions are removed
- [ ] Build artifacts are cleaned
- [ ] Dependencies are fresh installed
- [ ] Extension compiles successfully
- [ ] Extension packages successfully
- [ ] Development symlink is created
- [ ] Extension is copied to Cursor
- [ ] Cursor/VS Code is restarted
- [ ] Extension appears in Extensions panel
- [ ] Extension commands work in Command Palette

## **🎉 Success Indicators**

✅ Extension appears in Extensions panel  
✅ Command Palette shows "Cursor-Claude: Start Unified Chat"  
✅ Extension activates without errors  
✅ No old version conflicts  
✅ Development symlink works  
✅ Build process is clean and fast  

---

**Need Help?** Run the automated deployment script for a clean, error-free installation!

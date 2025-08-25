# Contributing to Federation Crew Cursor Extension

Thank you for your interest in contributing to the Federation Crew Cursor Extension! We welcome contributions from the community and appreciate your help in making this extension even better.

## 🏛️ Federation Values

As contributors to the Federation Crew, we uphold the values of:
- **Exploration** - Discovering new ways to improve the extension
- **Understanding** - Learning from each other and the community
- **Cooperation** - Working together to achieve common goals
- **Excellence** - Striving for the highest quality in our work

## 🚀 Getting Started

### Prerequisites
- [Cursor](https://cursor.sh) or VS Code
- Node.js (v16 or higher)
- npm or yarn
- Git

### Development Setup
```bash
# Fork and clone the repository
git clone https://github.com/yourusername/cursor-federation-crew-extension.git
cd cursor-federation-crew-extension

# Install dependencies
npm install

# Build the extension
npm run compile

# Start watching for changes
npm run watch
```

### Testing Your Changes
1. Press `F5` in Cursor/VS Code to start debugging
2. A new window will open with your extension loaded
3. Test your changes in the new window
4. Use the Developer Tools to debug if needed

## 📋 Contribution Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code style and formatting
- Add JSDoc comments for public functions
- Use meaningful variable and function names
- Keep functions small and focused

### Commit Messages
Use conventional commit format:
```
type(scope): description

feat(crew): add new crew member Spock
fix(activation): resolve auto-activation issue
docs(readme): update installation instructions
```

### Pull Request Process
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Test** thoroughly
5. **Commit** with clear messages
6. **Push** to your fork
7. **Submit** a pull request

## 🎯 Areas for Contribution

### High Priority
- **Bug fixes** - Help resolve issues reported by users
- **Documentation** - Improve README, guides, and examples
- **Testing** - Add unit tests and integration tests
- **Performance** - Optimize extension performance

### Medium Priority
- **New crew members** - Add additional Star Trek characters
- **Enhanced features** - Improve existing functionality
- **UI/UX improvements** - Better user interface and experience
- **Configuration options** - More customization settings

### Low Priority
- **Examples** - Create usage examples and tutorials
- **Translations** - Add support for other languages
- **Themes** - Create different visual themes
- **Integrations** - Connect with other tools and services

## 🏛️ Adding New Crew Members

To add a new crew member:

1. **Choose a character** from Star Trek with a clear role
2. **Define their personality** and expertise
3. **Select appropriate AI models** for their role
4. **Add to the crew members map** in `src/extension.ts`
5. **Update documentation** and examples
6. **Test thoroughly** with various scenarios

Example crew member addition:
```typescript
crew.set('spock', {
    name: 'Commander Spock',
    role: 'Science & Logic Officer',
    model: 'anthropic/claude-3.5-sonnet',
    personality: 'You are Commander Spock, Science Officer of the Enterprise. Your expertise is in scientific analysis, logical reasoning, and Vulcan philosophy. You approach problems with pure logic and scientific method.'
});
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --grep "crew activation"
```

### Test Guidelines
- Write tests for new features
- Ensure existing tests pass
- Test both success and error scenarios
- Mock external API calls
- Test user interactions

## 📝 Documentation

### Documentation Standards
- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Update README for new features
- Maintain changelog entries

### Documentation Structure
```
docs/
├── installation.md
├── usage.md
├── configuration.md
├── development.md
├── troubleshooting.md
└── examples/
    ├── basic-usage.md
    ├── advanced-features.md
    └── troubleshooting.md
```

## 🐛 Reporting Issues

### Before Reporting
1. Check existing issues for duplicates
2. Try the latest version
3. Test in a clean environment
4. Gather relevant information

### Issue Template
```markdown
## Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Cursor Version: [version]
- Extension Version: [version]
- OS: [operating system]
- Node.js Version: [version]

## Additional Information
Screenshots, logs, or other relevant information
```

## 🎖️ Recognition

### Contributors
All contributors will be recognized in:
- README contributors section
- Release notes
- Extension documentation
- Community acknowledgments

### Special Recognition
- **Major contributors** - Significant features or improvements
- **Bug hunters** - Critical bug fixes
- **Documentation heroes** - Comprehensive documentation improvements
- **Community leaders** - Active community engagement

## 🖖 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Use welcoming and inclusive language
- Be collaborative and constructive
- Focus on what is best for the community
- Show empathy towards other community members

### Enforcement
- Unacceptable behavior will not be tolerated
- Violations will be addressed promptly
- Maintainers have the right to remove contributions
- Community members should report violations

## 🚀 Getting Help

### Resources
- [Issues](https://github.com/familiarcat/cursor-federation-crew-extension/issues) - Report bugs and request features
- [Discussions](https://github.com/familiarcat/cursor-federation-crew-extension/discussions) - Ask questions and share ideas
- [Documentation](https://github.com/familiarcat/cursor-federation-crew-extension#readme) - Comprehensive guides and examples

### Community
- Join our community discussions
- Share your experiences and ideas
- Help other contributors
- Celebrate successes together

## 🏛️ Federation Mission

Together, we're building the ultimate Star Trek-inspired development experience. Your contributions help make the Federation Crew available to developers worldwide, bringing the collaborative spirit of Star Trek to modern development workflows.

**Live long and prosper! 🖖**

---

Thank you for contributing to the Federation Crew Cursor Extension!

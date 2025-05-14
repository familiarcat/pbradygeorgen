# AlexAI PDF Workflow Quick Reference

## Command Summary

### Unified PDF Manager
```bash
npm run pdf
```

### PDF Selection
```bash
# Interactive selection
npm run pdf:select

# Set specific PDF as default
npm run pdf:set-default path/to/your/pdf
```

### PDF Extraction
```bash
# Extract from default PDF
npm run pdf:extract:default

# Extract from specific PDF
npm run pdf:extract:custom path/to/your/pdf
```

### Testing
```bash
# Test PDF extraction
npm run test:pdf-extraction

# Test PDF conversion
npm run test:pdf-conversion
```

### Building and Testing
```bash
# Build the application
npm run build

# Start the application
npm run start
```

### Deployment
```bash
# Simulate deployment
npm run deploy:simulate

# Deploy to AWS
npm run deploy:aws
```

### Alex Command
```bash
# Display help
npx alex help

# Open PDF Manager
npx alex pdf

# Select a PDF
npx alex pdf:select

# Extract from PDF
npx alex pdf:extract [path]

# Build the application
npx alex build

# Start the application
npx alex start

# Deploy to AWS
npx alex deploy

# Run tests
npx alex test
```

## Common Workflows

### 1. Select and Test a New PDF
```bash
# Select a PDF
npm run pdf:select
# Choose the PDF from the list

# Test extraction
npm run test:pdf-extraction

# Build and test
npm run build
npm run start
```

### 2. Quick PDF Processing
```bash
# Process a specific PDF
npm run pdf:set-default path/to/your/pdf

# Build and test
npm run build
npm run start
```

### 3. Full Deployment Workflow
```bash
# Select a PDF
npm run pdf:select
# Choose the PDF from the list

# Test extraction
npm run test:pdf-extraction

# Simulate deployment
npm run deploy:simulate

# Deploy to AWS
npm run deploy:aws
```

## File Locations

### PDF Files
- Default PDF: `public/pbradygeorgen_resume.pdf`
- Test PDFs: `public/test-pdfs/`
- Source PDFs: `source-pdfs/`
- Backup PDFs: `public/backup/`

### Extracted Content
- Text content: `public/extracted/resume_content.txt`
- Markdown content: `public/extracted/resume_content.md`
- Improved markdown: `public/extracted/resume_content_improved.md`
- Color theory: `public/extracted/color_theory.json`
- Font theory: `public/extracted/font_theory.json`
- Font CSS: `public/extracted/pdf_fonts.css`
- Font info: `public/extracted/font_info.json`

## Scripts
- PDF Manager: `scripts/pdf-manager.sh`
- PDF Selection: `scripts/select-pdf.sh`
- PDF Extraction: `scripts/extract-pdf-all.sh`
- Text Extraction: `scripts/extract-pdf-text-improved.js`
- Color Extraction: `scripts/extract-pdf-colors.js`
- Font Extraction: `scripts/extract-pdf-fonts.js`
- Markdown Generation: `scripts/generate-improved-markdown.js`
- PDF Testing: `scripts/test-pdf-extraction.sh`
- Deployment: `scripts/deploy-to-aws.sh`
- Deployment Simulation: `scripts/simulate-aws-deploy.sh`
- Alex Command: `scripts/alex.js`

#!/bin/bash
# local-build.sh - A script to help with local builds that might be hanging

# Set a timeout for the build process (in seconds)
TIMEOUT=300

# Print current environment
echo "🔍 Environment Check:"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Check if OPENAI_API_KEY is set
if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️ Warning: OPENAI_API_KEY environment variable is not set"
  echo "Creating a temporary .env.local file with a placeholder API key"
  echo "OPENAI_API_KEY=sk-placeholder-for-local-build" > .env.local
  echo "This will allow the build to proceed, but PDF analysis features will be limited"
fi

# Create necessary directories
mkdir -p public/extracted

# Run the prebuild script with a timeout
echo "🚀 Running prebuild script with ${TIMEOUT}s timeout..."
timeout $TIMEOUT ./amplify-prebuild.sh

# Check if the prebuild script timed out
if [ $? -eq 124 ]; then
  echo "⚠️ Prebuild script timed out after ${TIMEOUT} seconds"
  echo "Creating placeholder files to allow build to continue..."
  
  # Create placeholder files if they don't exist
  if [ ! -f "public/extracted/resume_content.md" ]; then
    echo "# Placeholder Resume Content
    
This is placeholder content created by the local-build.sh script.
The actual content extraction timed out.
    
## Experience
- Placeholder experience
    
## Education
- Placeholder education
    
## Skills
- Placeholder skills" > public/extracted/resume_content.md
    echo "Created placeholder resume_content.md"
  fi
  
  if [ ! -f "public/extracted/resume_content_analyzed.json" ]; then
    echo '{
      "sections": {
        "summary": "Placeholder summary - build script timed out",
        "experience": [],
        "education": [],
        "skills": []
      },
      "structuredContent": {
        "name": "Default Resume",
        "title": "Professional Resume",
        "contact": {},
        "summary": "Placeholder summary - build script timed out",
        "experience": [],
        "education": [],
        "skills": [],
        "certifications": []
      }
    }' > public/extracted/resume_content_analyzed.json
    echo "Created placeholder resume_content_analyzed.json"
  fi
  
  if [ ! -f "public/extracted/color_theme.json" ]; then
    echo '{
      "primary": "#2eb8ac",
      "secondary": "#903399",
      "accent": "#d92635",
      "background": "#f1f4f3",
      "text": "#333333"
    }' > public/extracted/color_theme.json
    echo "Created placeholder color_theme.json"
  fi
  
  if [ ! -f "public/extracted/font_info.json" ]; then
    echo '{
      "title": "Arial",
      "heading": "Arial",
      "body": "Arial",
      "monospace": "Courier New"
    }' > public/extracted/font_info.json
    echo "Created placeholder font_info.json"
  fi
else
  echo "✅ Prebuild script completed successfully"
fi

# Run the Next.js build
echo "🏗️ Running Next.js build..."
next build

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "✅ Build completed successfully"
else
  echo "❌ Build failed"
  exit 1
fi

echo "🎉 All done! You can now run 'npm start' to start the application"

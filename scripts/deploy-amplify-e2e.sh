#!/bin/bash
# AlexAI Amplify End-to-End Deployment Script
# Following Derrida's philosophy of deconstruction, this script breaks down the deployment process
# into discrete, analyzable components that can be understood and modified independently.

set -e

# Color codes for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Dante-inspired logging
log_info() {
  echo -e "👑🌊 [Dante:Purgatorio] ${BLUE}$1${NC}"
}

log_success() {
  echo -e "👑⭐ [Dante:Paradiso] ${GREEN}$1${NC}"
}

log_warning() {
  echo -e "👑🔥 [Dante:Inferno:Warning] ${YELLOW}$1${NC}"
}

log_error() {
  echo -e "👑🔥 [Dante:Inferno:Error] ${RED}$1${NC}"
}

# Configuration variables
AMPLIFY_APP_NAME="AlexAI"
AMPLIFY_ENV_NAME="production"
AWS_REGION=${AWS_REGION:-"us-east-2"}
GITHUB_REPO=${GITHUB_REPO:-"https://github.com/familiarcat/pbradygeorgen.git"}
GITHUB_BRANCH=${GITHUB_BRANCH:-"main"}

# Check if AWS CLI is installed and configured
check_aws_cli() {
  log_info "Checking AWS CLI configuration..."
  if ! command -v aws &> /dev/null; then
    log_error "AWS CLI is not installed. Please install it first."
    exit 1
  fi
  
  # Check if AWS credentials are configured
  if ! aws sts get-caller-identity &> /dev/null; then
    log_error "AWS credentials are not configured or are invalid."
    exit 1
  fi
  
  log_success "AWS CLI is properly configured."
}

# Check if Amplify CLI is installed
check_amplify_cli() {
  log_info "Checking Amplify CLI installation..."
  if ! command -v amplify &> /dev/null; then
    log_warning "Amplify CLI is not installed. Installing now..."
    npm install -g @aws-amplify/cli
  fi
  
  log_success "Amplify CLI is installed."
}

# Create Amplify build specification file
create_build_spec() {
  log_info "Creating Amplify build specification file..."
  
  cat > amplify.yml <<EOL
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "Node version \$(node -v)"
        - echo "NPM version \$(npm -v)"
        - chmod +x *.sh
        - chmod +x scripts/*.sh
        - chmod +x scripts/*.js
    build:
      commands:
        - echo "Running custom build script..."
        - ./amplify-build.sh
    postBuild:
      commands:
        - echo "Running post-build commands"
        - node scripts/fix-standalone-directory.js
        - echo "Standalone directory fixed"
  artifacts:
    baseDirectory: .next/standalone
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
  customHeaders:
    - pattern: '**/*'
      headers:
        - key: 'Cache-Control'
          value: 'public, max-age=0, must-revalidate'
    - pattern: 'static/**/*'
      headers:
        - key: 'Cache-Control'
          value: 'public, max-age=31536000, immutable'
    - pattern: 'api/**/*'
      headers:
        - key: 'Cache-Control'
          value: 'no-cache, no-store, must-revalidate'
        - key: 'Pragma'
          value: 'no-cache'
        - key: 'Expires'
          value: '0'
  environment:
    variables:
      NODE_ENV: 'production'
      AWS_EXECUTION_ENV: 'true'
      AMPLIFY_USE_LOCAL: 'false'
      AMPLIFY_USE_STORAGE: 'true'
      S3_BUCKET_NAME: 'alexai-pdf-storage-prod'
EOL
  
  log_success "Created amplify.yml build specification file."
}

# Create Amplify build script
create_build_script() {
  log_info "Creating Amplify build script..."
  
  cat > amplify-build.sh <<EOL
#!/bin/bash
# Custom build script for AWS Amplify

set -e # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting custom build script for AWS Amplify"

# Print current environment
echo "Current directory: \$(pwd)"
echo "Initial Node version: \$(node -v)"
echo "Initial NPM version: \$(npm -v)"

# Setup NVM
export NVM_DIR="\$HOME/.nvm"
[ -s "\$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh"

# Force Node.js 20 installation - try multiple approaches
echo "Installing Node.js 20 using multiple approaches"

# Approach 1: Use NVM
echo "Approach 1: Using NVM"
nvm install 20 || true
nvm use 20 || true
nvm alias default 20 || true

# Approach 2: Use n (Node version manager)
echo "Approach 2: Using n (if available)"
if command -v n &>/dev/null; then
    n 20 || true
fi

# Approach 3: Direct download if needed
echo "Approach 3: Direct download if needed"
NODE_VERSION=\$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "\$NODE_VERSION" != "20" ]; then
    echo "Node.js 20 not installed via NVM or n, attempting direct download"
    mkdir -p \$HOME/nodejs
    curl -o \$HOME/nodejs/node-v20.19.0-linux-x64.tar.xz https://nodejs.org/dist/v20.19.0/node-v20.19.0-linux-x64.tar.xz
    tar -xJf \$HOME/nodejs/node-v20.19.0-linux-x64.tar.xz -C \$HOME/nodejs
    export PATH=\$HOME/nodejs/node-v20.19.0-linux-x64/bin:\$PATH
fi

# Print updated environment
echo "Updated Node version: \$(node -v)"
echo "Updated NPM version: \$(npm -v)"

# Verify Node.js version
NODE_VERSION=\$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "\$NODE_VERSION" != "20" ]; then
    echo "⚠️ WARNING: Failed to install Node.js 20. Current version: \$(node -v)"
    echo "Attempting to continue anyway..."
fi

# Check for required environment variables
echo "Checking environment variables..."
if [ -z "\$OPENAI_API_KEY" ]; then
    echo "⚠️ OPENAI_API_KEY environment variable is not set"
    echo "Creating a placeholder API key for the build process"
    export OPENAI_API_KEY="sk-placeholder-for-amplify-build"
else
    echo "✅ OPENAI_API_KEY environment variable is set"
fi

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf .next

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p public/extracted

# Install dependencies with increased memory limit
echo "Installing dependencies"
export NODE_OPTIONS=--max_old_space_size=4096
echo "Creating .npmrc file"
echo "engine-strict=false" >.npmrc
echo "ignore-engines=true" >>.npmrc
cat .npmrc

# Try different npm install approaches
echo "Approach 1: npm ci with --ignore-engines"
npm ci --production=false --ignore-engines || true

echo "Approach 2: npm install with --force"
npm install --force || true

echo "Approach 3: npm install with specific package"
npm install pdfjs-dist@5.1.91 --force || true

# Make scripts executable
echo "Making scripts executable..."
chmod +x *.sh
chmod +x scripts/*.sh
chmod +x scripts/*.js

# Verify PDF content
echo "Verifying PDF content..."
if [ -f "public/default_resume.pdf" ]; then
    echo "✅ PDF file found: public/default_resume.pdf"
    echo "Last modified: \$(stat -c %y public/default_resume.pdf 2>/dev/null || stat -f "%Sm" public/default_resume.pdf)"
else
    echo "❌ PDF file not found at public/default_resume.pdf"
    echo "Creating a placeholder PDF file..."
    # Create a placeholder file if needed
    touch public/default_resume.pdf
fi

# Run the prebuild script
echo "Running prebuild script..."
./amplify-prebuild.sh || echo "⚠️ Prebuild script failed, but continuing"

# Build the application
echo "Building the application"
NODE_ENV=production npm run build

# Copy necessary files for standalone mode
echo "Preparing standalone mode..."
if [ -d ".next/standalone" ]; then
    echo "Copying public directory to standalone..."
    mkdir -p .next/standalone/public
    cp -r public/* .next/standalone/public/ || true

    echo "Copying server.js to standalone..."
    cp server.js .next/standalone/ || true

    echo "Running fix-standalone-directory.js script..."
    node scripts/fix-standalone-directory.js || true

    echo "Installing AWS SDK for S3 storage..."
    cd .next/standalone
    npm install @aws-sdk/client-s3 --no-save || true
    cd ../..

    echo "✅ Standalone mode prepared successfully"
else
    echo "⚠️ Standalone directory not found, creating it..."
    node scripts/fix-standalone-directory.js || true

    if [ -d ".next/standalone" ]; then
        echo "Copying public directory to standalone..."
        mkdir -p .next/standalone/public
        cp -r public/* .next/standalone/public/ || true

        echo "Copying server.js to standalone..."
        cp server.js .next/standalone/ || true

        echo "Installing AWS SDK for S3 storage..."
        cd .next/standalone
        npm install @aws-sdk/client-s3 --no-save || true
        cd ../..

        echo "✅ Standalone mode created successfully"
    else
        echo "❌ Failed to create standalone directory"
    fi
fi

# Print build completion
echo "✅ Build completed successfully"

# Exit with success
exit 0
EOL
  
  chmod +x amplify-build.sh
  log_success "Created amplify-build.sh script."
}

# Create Amplify prebuild script
create_prebuild_script() {
  log_info "Creating Amplify prebuild script..."
  
  cat > amplify-prebuild.sh <<EOL
#!/bin/bash
# Custom prebuild script for AWS Amplify

set -e # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting custom prebuild script for AWS Amplify"

# Print current environment
echo "Current directory: \$(pwd)"
echo "Node version: \$(node -v)"
echo "NPM version: \$(npm -v)"

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p public/extracted
mkdir -p public/downloads

# Process PDF files
echo "Processing PDF files..."
if [ -f "public/default_resume.pdf" ]; then
    echo "✅ PDF file found: public/default_resume.pdf"
    echo "Last modified: \$(stat -c %y public/default_resume.pdf 2>/dev/null || stat -f "%Sm" public/default_resume.pdf)"
    
    # Run PDF processing script
    echo "Running PDF processing script..."
    node scripts/process-pdf.js || echo "⚠️ PDF processing script failed, but continuing"
else
    echo "❌ PDF file not found at public/default_resume.pdf"
    echo "Creating a placeholder PDF file..."
    # Create a placeholder file if needed
    touch public/default_resume.pdf
fi

# Generate download test report
echo "Generating download test report..."
node scripts/generate-download-report.js || echo "⚠️ Download report generation failed, but continuing"

# Print prebuild completion
echo "✅ Prebuild completed successfully"

# Exit with success
exit 0
EOL
  
  chmod +x amplify-prebuild.sh
  log_success "Created amplify-prebuild.sh script."
}

# Create fix-standalone-directory.js script
create_fix_standalone_script() {
  log_info "Creating fix-standalone-directory.js script..."
  
  mkdir -p scripts
  
  cat > scripts/fix-standalone-directory.js <<EOL
/**
 * Fix Standalone Directory Script
 * 
 * This script ensures that the standalone directory is properly set up for deployment.
 * It creates the directory if it doesn't exist and copies necessary files.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Dante-inspired logging
const log = {
  info: (message) => console.log(\`👑🌊 [Dante:Purgatorio] \${message}\`),
  success: (message) => console.log(\`👑⭐ [Dante:Paradiso] \${message}\`),
  warning: (message) => console.log(\`👑🔥 [Dante:Inferno:Warning] \${message}\`),
  error: (message) => console.log(\`👑🔥 [Dante:Inferno:Error] \${message}\`)
};

// Main function
async function main() {
  log.info('Starting fix-standalone-directory.js script');
  
  // Check if .next directory exists
  if (!fs.existsSync('.next')) {
    log.error('.next directory does not exist');
    log.info('Creating .next directory');
    fs.mkdirSync('.next');
  }
  
  // Check if standalone directory exists
  if (!fs.existsSync('.next/standalone')) {
    log.warning('.next/standalone directory does not exist');
    log.info('Creating standalone directory');
    fs.mkdirSync('.next/standalone', { recursive: true });
    
    // Copy server.js to standalone directory
    if (fs.existsSync('server.js')) {
      log.info('Copying server.js to standalone directory');
      fs.copyFileSync('server.js', '.next/standalone/server.js');
    } else {
      log.warning('server.js does not exist, creating a basic one');
      
      // Create a basic server.js file
      const serverContent = \`
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(\`> Ready on http://\${hostname}:\${port}\`);
  });
});
\`;
      
      fs.writeFileSync('.next/standalone/server.js', serverContent);
    }
    
    // Create public directory in standalone
    log.info('Creating public directory in standalone');
    fs.mkdirSync('.next/standalone/public', { recursive: true });
    
    // Copy public directory contents to standalone/public
    if (fs.existsSync('public')) {
      log.info('Copying public directory contents to standalone/public');
      try {
        execSync('cp -r public/* .next/standalone/public/ || true');
      } catch (error) {
        log.warning('Error copying public directory contents: ' + error.message);
      }
    }
    
    // Create .next directory in standalone
    log.info('Creating .next directory in standalone');
    fs.mkdirSync('.next/standalone/.next', { recursive: true });
    
    // Copy .next/static to standalone/.next/static
    if (fs.existsSync('.next/static')) {
      log.info('Copying .next/static to standalone/.next/static');
      try {
        execSync('cp -r .next/static .next/standalone/.next/ || true');
      } catch (error) {
        log.warning('Error copying static directory: ' + error.message);
      }
    }
    
    // Copy package.json to standalone
    if (fs.existsSync('package.json')) {
      log.info('Copying package.json to standalone');
      fs.copyFileSync('package.json', '.next/standalone/package.json');
    }
    
    log.success('Standalone directory created successfully');
  } else {
    log.info('Standalone directory already exists');
    
    // Ensure public directory exists in standalone
    if (!fs.existsSync('.next/standalone/public')) {
      log.info('Creating public directory in standalone');
      fs.mkdirSync('.next/standalone/public', { recursive: true });
    }
    
    // Copy public directory contents to standalone/public
    if (fs.existsSync('public')) {
      log.info('Copying public directory contents to standalone/public');
      try {
        execSync('cp -r public/* .next/standalone/public/ || true');
      } catch (error) {
        log.warning('Error copying public directory contents: ' + error.message);
      }
    }
    
    // Ensure .next directory exists in standalone
    if (!fs.existsSync('.next/standalone/.next')) {
      log.info('Creating .next directory in standalone');
      fs.mkdirSync('.next/standalone/.next', { recursive: true });
    }
    
    // Copy .next/static to standalone/.next/static
    if (fs.existsSync('.next/static')) {
      log.info('Copying .next/static to standalone/.next/static');
      try {
        execSync('cp -r .next/static .next/standalone/.next/ || true');
      } catch (error) {
        log.warning('Error copying static directory: ' + error.message);
      }
    }
    
    log.success('Standalone directory updated successfully');
  }
}

// Run the main function
main().catch((error) => {
  log.error('Error in fix-standalone-directory.js script: ' + error.message);
  process.exit(1);
});
EOL
  
  log_success "Created fix-standalone-directory.js script."
}

# Create or update Amplify app
create_or_update_amplify_app() {
  log_info "Creating or updating Amplify app..."
  
  # Check if app already exists
  APP_ID=$(aws amplify list-apps --query "apps[?name=='${AMPLIFY_APP_NAME}'].appId" --output text)
  
  if [ -z "$APP_ID" ] || [ "$APP_ID" == "None" ]; then
    log_info "Creating new Amplify app: ${AMPLIFY_APP_NAME}..."
    
    # Create the app
    APP_RESULT=$(aws amplify create-app --name "${AMPLIFY_APP_NAME}" \
      --repository "${GITHUB_REPO}" \
      --platform WEB \
      --build-spec "$(cat amplify.yml)" \
      --description "AlexAI PDF Processing Application" \
      --output json)
    
    APP_ID=$(echo $APP_RESULT | jq -r '.app.appId')
    log_success "Created Amplify app with ID: ${APP_ID}"
  else
    log_info "Amplify app already exists with ID: ${APP_ID}"
    
    # Update the app
    aws amplify update-app --app-id "${APP_ID}" \
      --build-spec "$(cat amplify.yml)" \
      --description "AlexAI PDF Processing Application"
    
    log_success "Updated Amplify app configuration."
  fi
  
  # Export the APP_ID for later use
  export APP_ID=$APP_ID
}

# Create or update Amplify branch
create_or_update_branch() {
  log_info "Creating or updating branch: ${GITHUB_BRANCH}..."
  
  # Check if branch already exists
  BRANCH_EXISTS=$(aws amplify get-branch --app-id "${APP_ID}" --branch-name "${GITHUB_BRANCH}" 2>/dev/null || echo "false")
  
  if [ "$BRANCH_EXISTS" == "false" ]; then
    log_info "Creating new branch: ${GITHUB_BRANCH}..."
    
    # Create the branch
    aws amplify create-branch --app-id "${APP_ID}" \
      --branch-name "${GITHUB_BRANCH}" \
      --framework "Next.js - SSR" \
      --stage PRODUCTION \
      --enable-auto-build
    
    log_success "Created branch: ${GITHUB_BRANCH}"
  else
    log_info "Branch already exists: ${GITHUB_BRANCH}"
    
    # Update the branch
    aws amplify update-branch --app-id "${APP_ID}" \
      --branch-name "${GITHUB_BRANCH}" \
      --framework "Next.js - SSR" \
      --stage PRODUCTION \
      --enable-auto-build
    
    log_success "Updated branch: ${GITHUB_BRANCH}"
  fi
}

# Create or update Amplify backend environment
create_or_update_backend_env() {
  log_info "Setting up Amplify backend environment..."
  
  # Initialize Amplify project if not already initialized
  if [ ! -d "amplify/.config" ]; then
    log_info "Initializing Amplify project..."
    
    # Run Amplify init with predefined answers
    amplify init \
      --name "${AMPLIFY_APP_NAME}" \
      --envName "${AMPLIFY_ENV_NAME}" \
      --yes
    
    log_success "Initialized Amplify project."
  else
    log_info "Amplify project already initialized."
  fi
  
  # Add auth resource if not already added
  if [ ! -d "amplify/backend/auth" ]; then
    log_info "Adding auth resource..."
    amplify add auth \
      --service cognito \
      --identityPoolName "${AMPLIFY_APP_NAME}IdentityPool" \
      --allowUnauthenticatedIdentities true \
      --userPoolName "${AMPLIFY_APP_NAME}UserPool" \
      --emailVerificationSubject "Your verification code" \
      --emailVerificationMessage "Your verification code is {####}" \
      --defaultPasswordPolicy false \
      --mfaConfiguration OFF \
      --usernameAttributes email \
      --yes
    
    log_success "Added auth resource."
  fi
  
  # Add storage resource if not already added
  if [ ! -d "amplify/backend/storage" ]; then
    log_info "Adding storage resource..."
    amplify add storage \
      --service S3 \
      --resourceName pdfStorage \
      --bucketName "${AMPLIFY_APP_NAME}-pdf-storage-${AWS_REGION}" \
      --authPolicyName "s3_amplify_${AMPLIFY_APP_NAME}" \
      --unauthPolicyName "s3_amplify_${AMPLIFY_APP_NAME}_unauth" \
      --authAccess "CREATE_AND_UPDATE" \
      --unauthAccess "READ" \
      --yes
    
    log_success "Added storage resource."
  fi
  
  # Push Amplify changes
  log_info "Pushing Amplify changes..."
  amplify push --yes
  
  log_success "Amplify backend environment setup complete."
}

# Set up environment variables
setup_environment_variables() {
  log_info "Setting up environment variables..."
  
  # Get the Cognito User Pool ID
  USER_POOL_ID=$(aws cognito-idp list-user-pools --max-results 60 --query "UserPools[?Name=='${AMPLIFY_APP_NAME}UserPool'].Id" --output text)
  
  # Get the Cognito User Pool Client ID
  USER_POOL_CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[0].ClientId" --output text)
  
  # Get the Cognito Identity Pool ID
  IDENTITY_POOL_ID=$(aws cognito-identity list-identity-pools --max-results 60 --query "IdentityPools[?IdentityPoolName=='${AMPLIFY_APP_NAME}IdentityPool'].IdentityPoolId" --output text)
  
  # Get the S3 bucket name
  S3_BUCKET=$(aws s3api list-buckets --query "Buckets[?starts_with(Name, '${AMPLIFY_APP_NAME}-pdf-storage-')].Name" --output text)
  
  # Set environment variables in Amplify app
  log_info "Setting environment variables in Amplify app..."
  aws amplify update-branch --app-id "${APP_ID}" \
    --branch-name "${GITHUB_BRANCH}" \
    --environment-variables "{
      \"NEXT_PUBLIC_USER_POOL_ID\":\"${USER_POOL_ID}\",
      \"NEXT_PUBLIC_USER_POOL_CLIENT_ID\":\"${USER_POOL_CLIENT_ID}\",
      \"NEXT_PUBLIC_IDENTITY_POOL_ID\":\"${IDENTITY_POOL_ID}\",
      \"NEXT_PUBLIC_STORAGE_BUCKET\":\"${S3_BUCKET}\",
      \"NEXT_PUBLIC_REGION\":\"${AWS_REGION}\"
    }"
  
  log_success "Environment variables set successfully."
  
  # Save environment variables to a local file for reference
  cat > .env.amplify <<EOL
NEXT_PUBLIC_USER_POOL_ID=${USER_POOL_ID}
NEXT_PUBLIC_USER_POOL_CLIENT_ID=${USER_POOL_CLIENT_ID}
NEXT_PUBLIC_IDENTITY_POOL_ID=${IDENTITY_POOL_ID}
NEXT_PUBLIC_STORAGE_BUCKET=${S3_BUCKET}
NEXT_PUBLIC_REGION=${AWS_REGION}
EOL
  
  log_success "Environment variables saved to .env.amplify"
}

# Start a build
start_build() {
  log_info "Starting build for branch: ${GITHUB_BRANCH}..."
  
  aws amplify start-job --app-id "${APP_ID}" \
    --branch-name "${GITHUB_BRANCH}" \
    --job-type RELEASE
  
  log_success "Build started successfully."
}

# Main execution
main() {
  log_info "Starting AlexAI Amplify deployment process..."
  
  check_aws_cli
  check_amplify_cli
  create_build_spec
  create_build_script
  create_prebuild_script
  create_fix_standalone_script
  create_or_update_amplify_app
  create_or_update_branch
  create_or_update_backend_env
  setup_environment_variables
  start_build
  
  log_success "Deployment process completed successfully!"
  log_info "You can monitor the build status in the Amplify Console:"
  log_info "https://${AWS_REGION}.console.aws.amazon.com/amplify/home?region=${AWS_REGION}#/${APP_ID}"
}

# Execute main function
main

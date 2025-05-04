/**
 * Amplify Deployment Status Checker
 * 
 * This script checks the status of an Amplify deployment without requiring AWS credentials.
 * It uses the GitHub API to check for deployment status.
 * 
 * Following Dante's philosophy of guiding through different stages with clear logging.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Dante-inspired logging
const log = {
  info: (message) => console.log(`👑🌊 [Dante:Purgatorio] ${message}`),
  success: (message) => console.log(`👑⭐ [Dante:Paradiso] ${message}`),
  warning: (message) => console.log(`👑🔥 [Dante:Inferno:Warning] ${message}`),
  error: (message) => console.log(`👑🔥 [Dante:Inferno:Error] ${message}`)
};

// Configuration
const config = {
  owner: 'familiarcat',
  repo: 'pbradygeorgen',
  branch: 'fix-download-test',
  amplifyAppId: 'd25hjzqcr0podj'
};

/**
 * Get the current Git branch
 */
function getCurrentBranch() {
  try {
    // Try to get the branch from Git
    const gitHeadPath = path.join(process.cwd(), '.git', 'HEAD');
    if (fs.existsSync(gitHeadPath)) {
      const headContent = fs.readFileSync(gitHeadPath, 'utf8').trim();
      const match = headContent.match(/ref: refs\/heads\/(.+)$/);
      if (match) {
        return match[1];
      }
    }
    
    // Fall back to the default branch
    return config.branch;
  } catch (error) {
    log.warning(`Could not determine current branch: ${error.message}`);
    return config.branch;
  }
}

/**
 * Make an HTTP request
 */
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            resolve(data);
          }
        } else {
          reject(new Error(`Request failed with status code ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

/**
 * Check the deployment status using the GitHub API
 */
async function checkDeploymentStatus() {
  const branch = getCurrentBranch();
  log.info(`Checking deployment status for branch: ${branch}`);
  
  try {
    // Get the latest commit
    const commitsOptions = {
      hostname: 'api.github.com',
      path: `/repos/${config.owner}/${config.repo}/commits?sha=${branch}&per_page=1`,
      method: 'GET',
      headers: {
        'User-Agent': 'Amplify-Deployment-Checker',
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    
    const commits = await makeRequest(commitsOptions);
    if (!commits || !commits.length) {
      log.error(`No commits found for branch: ${branch}`);
      return;
    }
    
    const latestCommit = commits[0];
    log.info(`Latest commit: ${latestCommit.sha.substring(0, 7)} - ${latestCommit.commit.message}`);
    
    // Get the status checks for the commit
    const statusOptions = {
      hostname: 'api.github.com',
      path: `/repos/${config.owner}/${config.repo}/commits/${latestCommit.sha}/status`,
      method: 'GET',
      headers: {
        'User-Agent': 'Amplify-Deployment-Checker',
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    
    const status = await makeRequest(statusOptions);
    
    // Check if there are any Amplify-related statuses
    const amplifyStatuses = status.statuses.filter(s => 
      s.context.includes('Amplify') || 
      s.context.includes('aws.amazon.com') ||
      s.target_url.includes('amplifyapp.com')
    );
    
    if (amplifyStatuses.length === 0) {
      log.warning('No Amplify deployment statuses found.');
      log.info('You can check the deployment status manually at:');
      log.info(`https://us-east-1.console.aws.amazon.com/amplify/home?region=us-east-1#/${config.amplifyAppId}/fix-download-test/1`);
      return;
    }
    
    // Display the deployment statuses
    log.info('Deployment statuses:');
    amplifyStatuses.forEach(s => {
      const statusEmoji = s.state === 'success' ? '✅' : 
                         s.state === 'pending' ? '⏳' : 
                         s.state === 'failure' ? '❌' : '❓';
      
      log.info(`${statusEmoji} ${s.context}: ${s.description}`);
      if (s.target_url) {
        log.info(`   URL: ${s.target_url}`);
      }
    });
    
    // Overall status
    const overallState = status.state;
    if (overallState === 'success') {
      log.success('All checks have passed! Deployment is successful.');
    } else if (overallState === 'pending') {
      log.info('Deployment is still in progress...');
    } else if (overallState === 'failure') {
      log.error('Deployment has failed.');
    } else {
      log.warning(`Deployment status: ${overallState}`);
    }
    
    // Provide the Amplify console URL
    log.info('You can check the deployment details at:');
    log.info(`https://us-east-1.console.aws.amazon.com/amplify/home?region=us-east-1#/${config.amplifyAppId}/${branch}/1`);
    
  } catch (error) {
    log.error(`Failed to check deployment status: ${error.message}`);
    log.info('You can check the deployment status manually at:');
    log.info(`https://us-east-1.console.aws.amazon.com/amplify/home?region=us-east-1#/${config.amplifyAppId}/${branch}/1`);
  }
}

// Main function
async function main() {
  try {
    await checkDeploymentStatus();
  } catch (error) {
    log.error(`An error occurred: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main();

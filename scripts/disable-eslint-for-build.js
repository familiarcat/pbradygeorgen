/**
 * Disable ESLint for Build Process
 *
 * This script temporarily disables ESLint during the build process by creating
 * a .eslintrc.json.bak backup and replacing the original with a simplified version
 * that disables all rules. After the build, the original file can be restored.
 *
 * Usage:
 * - To disable ESLint: node scripts/disable-eslint-for-build.js disable
 * - To restore ESLint: node scripts/disable-eslint-for-build.js restore
 */

const fs = require('fs');
const path = require('path');

// Dante-inspired logging
const log = {
  info: (message) => console.log(`👑🌊 [Dante:Purgatorio] ${message}`),
  success: (message) => console.log(`👑⭐ [Dante:Paradiso] ${message}`),
  warning: (message) => console.log(`👑🔥 [Dante:Inferno:Warning] ${message}`),
  error: (message) => console.log(`👑🔥 [Dante:Inferno:Error] ${message}`)
};

// File paths
const eslintConfigPath = path.join(process.cwd(), '.eslintrc.json');
const eslintBackupPath = path.join(process.cwd(), '.eslintrc.json.bak');

// Simplified ESLint config that disables all rules
const simplifiedConfig = {
  "root": true,
  "extends": [],
  "rules": {},
  "ignorePatterns": ["**/*"]
};

/**
 * Disable ESLint by backing up the current config and replacing it with a simplified version
 */
function disableESLint() {
  try {
    // Check if the ESLint config exists
    if (!fs.existsSync(eslintConfigPath)) {
      log.error('ESLint config file not found.');
      process.exit(1);
    }

    // Check if a backup already exists
    if (fs.existsSync(eslintBackupPath)) {
      log.warning('ESLint backup already exists. Skipping backup creation.');
    } else {
      // Create a backup of the current ESLint config
      fs.copyFileSync(eslintConfigPath, eslintBackupPath);
      log.success('ESLint config backed up successfully.');
    }

    // Replace the ESLint config with the simplified version
    fs.writeFileSync(eslintConfigPath, JSON.stringify(simplifiedConfig, null, 2));
    log.success('ESLint disabled for build process.');
  } catch (error) {
    log.error(`Failed to disable ESLint: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Restore the original ESLint config from the backup
 */
function restoreESLint() {
  try {
    // Check if the backup exists
    if (!fs.existsSync(eslintBackupPath)) {
      log.error('ESLint backup file not found. Cannot restore.');

      // Create a default ESLint config if backup doesn't exist
      const defaultConfig = {
        "root": true,
        "parser": "@typescript-eslint/parser",
        "parserOptions": {
          "ecmaVersion": 2020,
          "sourceType": "module",
          "ecmaFeatures": {
            "jsx": true
          },
          "project": "./tsconfig.json"
        },
        "env": {
          "browser": true,
          "node": true,
          "es6": true
        },
        "extends": [
          "next/core-web-vitals",
          "plugin:@typescript-eslint/recommended"
        ],
        "plugins": [
          "@typescript-eslint",
          "react",
          "react-hooks"
        ],
        "settings": {
          "react": {
            "version": "detect"
          }
        },
        "rules": {
          "@typescript-eslint/no-explicit-any": "off",
          "@typescript-eslint/ban-types": "off",
          "@typescript-eslint/ban-ts-comment": "off",
          "@typescript-eslint/no-unused-vars": "off",
          "@typescript-eslint/no-unused-expressions": "off",
          "@typescript-eslint/no-require-imports": "off",
          "@typescript-eslint/no-this-alias": "off",
          "react-hooks/rules-of-hooks": "error",
          "react-hooks/exhaustive-deps": "off",
          "react/prop-types": "off",
          "react/react-in-jsx-scope": "off",
          "react/no-unescaped-entities": "off",
          "@typescript-eslint/prefer-as-const": "off",
          "prefer-const": "warn"
        },
        "overrides": [
          {
            "files": ["**/*.ts", "**/*.tsx"],
            "rules": {
              "@typescript-eslint/no-explicit-any": "off",
              "@typescript-eslint/explicit-module-boundary-types": "off",
              "@typescript-eslint/no-unused-expressions": "off",
              "@typescript-eslint/no-require-imports": "off",
              "@typescript-eslint/no-unused-vars": "off",
              "@typescript-eslint/no-this-alias": "off"
            }
          },
          {
            "files": ["**/PDF*.ts", "**/pdf*.ts", "**/utils/*.ts", "**/api/**/*.ts", "**/scripts/**/*.js"],
            "rules": {
              "@typescript-eslint/no-explicit-any": "off",
              "@typescript-eslint/no-require-imports": "off",
              "@typescript-eslint/no-unused-vars": "off"
            }
          },
          {
            "files": ["**/*.js"],
            "rules": {
              "@typescript-eslint/no-require-imports": "off",
              "@typescript-eslint/no-unused-vars": "off",
              "@typescript-eslint/no-unused-expressions": "off"
            }
          }
        ],
        "ignorePatterns": [
          ".next/",
          "out/",
          "build/",
          "dist/",
          "node_modules/",
          ".cache/",
          ".eslintcache",
          "public/extracted/",
          "public/downloads/",
          "packages/",
          "scripts/archive/",
          ".amplify/",
          "amplify/",
          "coverage/",
          "**/*.min.js",
          "**/*.bundle.js"
        ]
      };

      fs.writeFileSync(eslintConfigPath, JSON.stringify(defaultConfig, null, 2));
      log.warning('Created default ESLint config since backup was not found.');
      return;
    }

    // Restore the original ESLint config
    fs.copyFileSync(eslintBackupPath, eslintConfigPath);

    // Remove the backup file
    fs.unlinkSync(eslintBackupPath);

    log.success('ESLint config restored successfully.');
  } catch (error) {
    log.error(`Failed to restore ESLint: ${error.message}`);
    process.exit(1);
  }
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'disable') {
    log.info('Disabling ESLint for build process...');
    disableESLint();
  } else if (command === 'restore') {
    log.info('Restoring ESLint configuration...');
    restoreESLint();
  } else {
    log.error('Invalid command. Use "disable" or "restore".');
    process.exit(1);
  }
}

// Run the main function
main();

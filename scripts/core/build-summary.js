/**
 * Build Summary
 * 
 * This module provides a hierarchical visualization of the build process
 * with a folder-like structure to help visualize the build process.
 */

const { createLogger } = require('./logger');
const logger = createLogger('summary');

// Store tasks in a hierarchical structure
const tasks = {
  build: {
    name: 'Build Process',
    emoji: '🏗️',
    completed: false,
    tasks: {
      pdf: {
        name: 'PDF Processing',
        emoji: '📄',
        completed: false,
        tasks: {
          text: {
            name: 'Text Extraction',
            emoji: '📝',
            completed: false
          },
          colors: {
            name: 'Color Extraction',
            emoji: '🎨',
            completed: false
          },
          fonts: {
            name: 'Font Extraction',
            emoji: '🔤',
            completed: false
          },
          userInfo: {
            name: 'User Info Extraction',
            emoji: '👤',
            completed: false
          },
          markdown: {
            name: 'Markdown Generation',
            emoji: '📊',
            completed: false
          }
        }
      },
      enhanced: {
        name: 'Enhanced Extraction',
        emoji: '🔎',
        completed: false,
        tasks: {
          enhancedColors: {
            name: 'Enhanced Colors',
            emoji: '🎭',
            completed: false
          },
          enhancedFonts: {
            name: 'Enhanced Fonts',
            emoji: '📝',
            completed: false
          },
          unifiedTheme: {
            name: 'Unified Theme',
            emoji: '🧩',
            completed: false
          },
          documentation: {
            name: 'Documentation',
            emoji: '📚',
            completed: false
          }
        }
      },
      introduction: {
        name: 'Introduction Generation',
        emoji: '📋',
        completed: false
      }
    }
  }
};

// Track the current task path
let currentTaskPath = [];

/**
 * Mark a task as started
 * 
 * @param {string} taskPath - Path to the task (e.g., 'build.pdf.text')
 */
function startTask(taskPath) {
  currentTaskPath = taskPath.split('.');
}

/**
 * Mark a task as completed
 * 
 * @param {string} taskPath - Path to the task (e.g., 'build.pdf.text')
 */
function completeTask(taskPath) {
  const path = taskPath.split('.');
  let current = tasks;
  
  for (const segment of path) {
    if (!current[segment]) {
      return;
    }
    current = current[segment];
  }
  
  current.completed = true;
}

/**
 * Check if all subtasks of a task are completed
 * 
 * @param {Object} task - The task to check
 * @returns {boolean} - Whether all subtasks are completed
 */
function areAllSubtasksCompleted(task) {
  if (!task.tasks) {
    return true;
  }
  
  return Object.values(task.tasks).every(subtask => subtask.completed);
}

/**
 * Recursively update parent task completion status
 * 
 * @param {string} taskPath - Path to the task (e.g., 'build.pdf')
 */
function updateParentTaskStatus(taskPath) {
  const path = taskPath.split('.');
  
  if (path.length <= 1) {
    return;
  }
  
  const parentPath = path.slice(0, -1).join('.');
  let parent = tasks;
  
  for (const segment of path.slice(0, -1)) {
    if (!parent[segment]) {
      return;
    }
    parent = parent[segment];
  }
  
  parent.completed = areAllSubtasksCompleted(parent);
  
  if (path.length > 2) {
    updateParentTaskStatus(parentPath);
  }
}

/**
 * Generate a tree-like visualization of the build process
 * 
 * @returns {string} - The tree visualization
 */
function generateTreeVisualization() {
  let output = '\n📦 Build Process Summary:\n';
  
  function renderTask(task, path = [], indent = '') {
    const isLast = path.length === 0 || path[path.length - 1] === Object.keys(getParentByPath(path.slice(0, -1)).tasks).pop();
    const prefix = indent + (isLast ? '└── ' : '├── ');
    const nextIndent = indent + (isLast ? '    ' : '│   ');
    
    const statusEmoji = task.completed ? '✅' : '⏳';
    output += `${prefix}${task.emoji} ${task.name} ${statusEmoji}\n`;
    
    if (task.tasks) {
      const taskKeys = Object.keys(task.tasks);
      for (let i = 0; i < taskKeys.length; i++) {
        const key = taskKeys[i];
        renderTask(task.tasks[key], [...path, key], nextIndent);
      }
    }
  }
  
  function getParentByPath(path) {
    let current = tasks;
    for (const segment of path) {
      current = current[segment];
    }
    return current;
  }
  
  renderTask(tasks.build, ['build']);
  
  return output;
}

/**
 * Display the build summary
 */
function displayBuildSummary() {
  const visualization = generateTreeVisualization();
  console.log(visualization);
}

module.exports = {
  startTask,
  completeTask,
  updateParentTaskStatus,
  displayBuildSummary
};

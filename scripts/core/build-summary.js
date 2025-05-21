/**
 * Build Summary
 *
 * This module provides a real-time hierarchical visualization of the build process
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
    active: false,
    tasks: {
      pdf: {
        name: 'PDF Processing',
        emoji: '📄',
        completed: false,
        active: false,
        tasks: {
          text: {
            name: 'Text Extraction',
            emoji: '📝',
            completed: false,
            active: false
          },
          colors: {
            name: 'Color Extraction',
            emoji: '🎨',
            completed: false,
            active: false
          },
          fonts: {
            name: 'Font Extraction',
            emoji: '🔤',
            completed: false,
            active: false
          },
          userInfo: {
            name: 'User Info Extraction',
            emoji: '👤',
            completed: false,
            active: false
          },
          markdown: {
            name: 'Markdown Generation',
            emoji: '📊',
            completed: false,
            active: false
          }
        }
      },
      enhanced: {
        name: 'Enhanced Extraction',
        emoji: '🔎',
        completed: false,
        active: false,
        tasks: {
          enhancedColors: {
            name: 'Enhanced Colors',
            emoji: '🎭',
            completed: false,
            active: false
          },
          enhancedFonts: {
            name: 'Enhanced Fonts',
            emoji: '📝',
            completed: false,
            active: false
          },
          unifiedTheme: {
            name: 'Unified Theme',
            emoji: '🧩',
            completed: false,
            active: false
          },
          documentation: {
            name: 'Documentation',
            emoji: '📚',
            completed: false,
            active: false
          }
        }
      },
      introduction: {
        name: 'Introduction Generation',
        emoji: '📋',
        completed: false,
        active: false
      }
    }
  }
};

// For terminal control
const terminalControl = {
  clearLine: '\x1b[2K',
  moveCursorUp: (lines) => `\x1b[${lines}A`,
  moveCursorToStart: '\r',
  hideCursor: '\x1b[?25l',
  showCursor: '\x1b[?25h'
};

// Track the current visualization height for updating the display
let currentVisualizationHeight = 0;
let isFirstVisualization = true;

// Track active tasks
let activeTasks = new Set();

/**
 * Mark a task as started
 *
 * @param {string} taskPath - Path to the task (e.g., 'build.pdf.text')
 */
function startTask(taskPath) {
  const path = taskPath.split('.');
  let current = tasks;

  for (const segment of path) {
    if (!current[segment]) {
      return;
    }
    current = current[segment];
    current.active = true;
  }

  activeTasks.add(taskPath);
  updateVisualization();
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
  current.active = false;

  // Update parent task status
  updateParentTaskStatus(taskPath);

  // Remove from active tasks
  activeTasks.delete(taskPath);

  // Update the visualization
  updateVisualization();
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

  if (parent && parent.tasks) {
    parent.completed = areAllSubtasksCompleted(parent);

    if (path.length > 2) {
      updateParentTaskStatus(parentPath);
    }
  }
}

/**
 * Count the number of lines in the visualization
 *
 * @param {Object} task - The task to count lines for
 * @param {boolean} isRoot - Whether this is the root task
 * @returns {number} - The number of lines
 */
function countVisualizationLines(task = tasks.build, isRoot = true) {
  let count = isRoot ? 2 : 1; // Root adds the header line

  if (task.tasks) {
    count += Object.values(task.tasks).reduce((sum, subtask) => {
      return sum + countVisualizationLines(subtask, false);
    }, 0);
  }

  return count;
}

/**
 * Generate a tree-like visualization of the build process
 *
 * @returns {string} - The tree visualization
 */
function generateTreeVisualization() {
  let output = '\n📦 Build Process Summary:\n';

  function renderTask(task, path = [], indent = '') {
    let isLast = true;

    if (path.length > 0) {
      const parent = getParentByPath(path.slice(0, -1));
      if (parent && parent.tasks) {
        const keys = Object.keys(parent.tasks);
        isLast = path[path.length - 1] === keys[keys.length - 1];
      }
    }

    const prefix = indent + (isLast ? '└── ' : '├── ');
    const nextIndent = indent + (isLast ? '    ' : '│   ');

    let statusEmoji;
    if (task.completed) {
      statusEmoji = '✅';
    } else if (task.active) {
      statusEmoji = '🔄';
    } else {
      statusEmoji = '⏳';
    }

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
      if (!current[segment]) {
        return current;
      }
      current = current[segment];
    }
    return current;
  }

  renderTask(tasks.build, ['build']);

  return output;
}

/**
 * Update the visualization in the terminal
 */
function updateVisualization() {
  // Generate the new visualization
  const visualization = generateTreeVisualization();

  // Count the number of lines in the visualization
  const newVisualizationHeight = countVisualizationLines();

  // Clear the previous visualization if not the first time
  if (!isFirstVisualization) {
    process.stdout.write(terminalControl.moveCursorUp(currentVisualizationHeight));
    for (let i = 0; i < currentVisualizationHeight; i++) {
      process.stdout.write(terminalControl.clearLine + terminalControl.moveCursorToStart);
      if (i < currentVisualizationHeight - 1) {
        process.stdout.write('\n');
      }
    }
  } else {
    isFirstVisualization = false;
  }

  // Update the current visualization height
  currentVisualizationHeight = newVisualizationHeight;

  // Display the new visualization
  process.stdout.write(visualization);
}

/**
 * Display the build summary
 */
function displayBuildSummary() {
  // For the final display, we'll just generate a new visualization
  // without clearing the previous one
  const visualization = generateTreeVisualization();
  console.log(visualization);
}

/**
 * Reset the build summary for a new build
 */
function resetBuildSummary() {
  // Reset all tasks to their initial state
  function resetTask(task) {
    task.completed = false;
    task.active = false;

    if (task.tasks) {
      Object.values(task.tasks).forEach(resetTask);
    }
  }

  resetTask(tasks.build);
  activeTasks.clear();
  isFirstVisualization = true;
  currentVisualizationHeight = 0;
}

module.exports = {
  startTask,
  completeTask,
  updateParentTaskStatus,
  displayBuildSummary,
  resetBuildSummary
};

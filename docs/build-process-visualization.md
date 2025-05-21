# Build Process Visualization

## Overview

The build process visualization system provides a real-time, hierarchical view of the AlexAI build process. It displays the current status of each task and subtask in a folder-like structure, making it easy to understand the relationships between tasks and track the progress of the build.

## Philosophy

The visualization system embodies several philosophical principles:

- **Dante's Methodical Organization**: The hierarchical structure reflects Dante's methodical approach to organization, with each task and subtask clearly delineated.
- **Derrida's Deconstruction**: The visualization deconstructs the build process into its component parts, revealing the underlying structure.
- **Kantian Clarity**: The clear, logical organization of tasks reflects Kantian principles of rational order.
- **Josef Müller-Brockmann's Grid Design**: The visualization uses a consistent, grid-like structure to present information in a clean, organized manner.

## Features

- **Real-time Updates**: The visualization updates in real-time as tasks are started and completed.
- **Hierarchical Structure**: Tasks and subtasks are displayed in a hierarchical, folder-like structure.
- **Status Indicators**: Each task displays its current status with an emoji:
  - 🔄 Active tasks (currently running)
  - ✅ Completed tasks
  - ⏳ Pending tasks
- **Task Emojis**: Each task type has its own emoji for easy identification:
  - 🏗️ Build Process
  - 📄 PDF Processing
  - 📝 Text Extraction
  - 🎨 Color Extraction
  - 🔤 Font Extraction
  - 👤 User Info Extraction
  - 📊 Markdown Generation
  - 🔎 Enhanced Extraction
  - 🎭 Enhanced Colors
  - 📝 Enhanced Fonts
  - 🧩 Unified Theme
  - 📚 Documentation
  - 📋 Introduction Generation

## Implementation

The build process visualization is implemented in the `scripts/core/build-summary.js` module. It uses ANSI escape codes to update the terminal display in place, creating a dynamic, updating visualization.

### Task Structure

Tasks are organized in a hierarchical structure:

```javascript
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
          // More subtasks...
        }
      },
      // More tasks...
    }
  }
};
```

### Terminal Control

The visualization uses ANSI escape codes to control the terminal display:

```javascript
const terminalControl = {
  clearLine: '\x1b[2K',
  moveCursorUp: (lines) => `\x1b[${lines}A`,
  moveCursorToStart: '\r',
  hideCursor: '\x1b[?25l',
  showCursor: '\x1b[?25h'
};
```

### Updating the Visualization

The visualization is updated whenever a task is started or completed:

```javascript
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
```

## Usage

To use the build process visualization in your own scripts:

1. Import the build-summary module:

```javascript
const buildSummary = require('../core/build-summary');
```

2. Reset the build summary at the start of your build process:

```javascript
buildSummary.resetBuildSummary();
```

3. Start the build process:

```javascript
buildSummary.startTask('build');
```

4. Start and complete tasks and subtasks as needed:

```javascript
buildSummary.startTask('build.pdf');
// Perform PDF processing...
buildSummary.startTask('build.pdf.text');
// Extract text...
buildSummary.completeTask('build.pdf.text');
// More tasks...
buildSummary.completeTask('build.pdf');
```

5. Complete the build process:

```javascript
buildSummary.completeTask('build');
```

## Example Output

```
📦 Build Process Summary:
└── 🏗️ Build Process 🔄
    ├── 📄 PDF Processing 🔄
    │   ├── 📝 Text Extraction ✅
    │   ├── 🎨 Color Extraction 🔄
    │   ├── 🔤 Font Extraction ⏳
    │   ├── 👤 User Info Extraction ⏳
    │   ├── 📊 Markdown Generation ⏳
    ├── 🔎 Enhanced Extraction ⏳
    │   ├── 🎭 Enhanced Colors ⏳
    │   ├── 📝 Enhanced Fonts ⏳
    │   ├── 🧩 Unified Theme ⏳
    │   ├── 📚 Documentation ⏳
    └── 📋 Introduction Generation ⏳
```

## Future Improvements

- **Color Coding**: Add color to the visualization to make it even easier to distinguish between different task states.
- **Progress Indicators**: Add progress indicators for long-running tasks.
- **Timing Information**: Display timing information for each task.
- **Interactive Controls**: Add interactive controls to expand/collapse sections of the visualization.
- **Web Interface**: Create a web interface for the visualization that can be viewed in a browser.

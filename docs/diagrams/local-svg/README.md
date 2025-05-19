# Local SVG Diagrams

This directory contains locally generated SVG versions of all Mermaid diagrams in the AlexAI documentation. These SVG files can be viewed in any web browser, allowing you to pan and zoom for better readability.

## Viewing the Diagrams

To view all diagrams in a single interactive page:

1. Open the `index.html` file in this directory in any web browser
2. Click on a diagram name in the list to view it
3. Use the zoom controls to adjust the size of the diagram

You can also open any individual SVG file directly in your browser.

## Generating the Diagrams

These SVG diagrams are generated from the Mermaid code in the documentation. To regenerate them:

```bash
# Install Mermaid CLI globally (required only once)
npm install -g @mermaid-js/mermaid-cli

# Generate local SVG diagrams
npm run docs:local-svg
```

This will:
1. Extract all Mermaid diagrams from the documentation
2. Generate SVG files for each diagram
3. Create an interactive HTML viewer for easy viewing

## Features of the Viewer

The HTML viewer (`index.html`) provides several features:

- List of all available diagrams
- Zoom controls for adjusting the size of diagrams
- Source information for each diagram
- Responsive design that works on any device

## Diagram Sources

The SVG diagrams are generated from the following documentation files:

- `docs/application-architecture.md`
- `docs/script-structure.md`
- `docs/pdf-workflow/README.md`

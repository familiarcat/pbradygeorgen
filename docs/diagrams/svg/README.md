# AlexAI SVG Diagrams

This directory contains SVG versions of all Mermaid diagrams in the AlexAI documentation. These SVG files can be viewed in any web browser or image viewer, allowing you to pan and zoom for better readability.

## Viewing the Diagrams

There are several ways to view these diagrams:

1. **Using the HTML Index**: Open the `index.html` file in this directory to view all diagrams in a single page.
2. **Directly in a Browser**: Open any SVG file directly in your web browser.
3. **Using an Image Viewer**: Open any SVG file in an image viewer that supports SVG.

## Generating SVG Diagrams

These SVG diagrams are generated from the Mermaid code in the documentation. To regenerate them:

```bash
# Install Mermaid CLI globally (required only once)
npm install -g @mermaid-js/mermaid-cli

# Generate SVG diagrams
npm run docs:svg
```

This will:
1. Extract all Mermaid diagrams from the documentation
2. Generate SVG files for each diagram
3. Create an HTML index file for easy viewing

## Diagram Sources

The SVG diagrams are generated from the following documentation files:

- `docs/application-architecture.md`
- `docs/script-structure.md`
- `docs/pdf-workflow/README.md`

## File Naming Convention

The SVG files follow this naming convention:

`[source]_diagram_[index].svg`

Where:
- `[source]` is the name of the source file (without extension)
- `[index]` is the sequential number of the diagram in the source file

For example, `application-architecture_diagram_1.svg` is the first diagram from the `application-architecture.md` file.

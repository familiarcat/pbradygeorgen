# AlexAI Diagrams

This directory contains tools and resources for viewing diagrams in the AlexAI application.

## Local SVG Diagrams

The `local-svg` directory contains locally generated SVG versions of all Mermaid diagrams in the documentation. These SVG files can be viewed in any web browser, allowing you to pan and zoom for better readability.

To generate and view these diagrams:

```bash
# Install Mermaid CLI (one-time setup)
npm install -g @mermaid-js/mermaid-cli

# Generate local SVG diagrams
npm run docs:local-svg

# Open the viewer in your browser
open docs/diagrams/local-svg/index.html  # On macOS
# or
start docs/diagrams/local-svg/index.html  # On Windows
```

The interactive viewer allows you to:
- Select any diagram from a list
- Zoom in and out to see details
- View the source of each diagram

## Interactive Documentation Viewer

For the best experience, use our Interactive Documentation Viewer (`viewer.html` in this directory) which provides:

- Rendered Mermaid diagrams directly in the documentation
- Buttons to copy Mermaid code to clipboard with one click
- Buttons to open diagrams directly in the Mermaid Live Editor
- Easy navigation between documentation files
- Dark theme option for better readability

To use the viewer:
1. Open the file `docs/diagrams/viewer.html` in your browser
2. Or if you're using VSCode, right-click on the file and select "Open with Live Server" if you have the Live Server extension installed

The viewer works with all documentation files containing Mermaid diagrams.

## Mermaid Diagram Opener

If you're having issues with opening large or complex diagrams in the Mermaid Live Editor, use our dedicated Mermaid Diagram Opener (`mermaid-opener.html` in this directory):

1. Open the file `docs/diagrams/mermaid-opener.html` in your browser
2. Copy the Mermaid code from the documentation
3. Paste it into the textarea
4. Click "Open in Mermaid Live Editor"

This tool uses a form submission approach instead of URL encoding, which works better for large diagrams.

## Available Diagrams

### SVG Diagrams

All diagrams are available as SVG files in the `svg` directory. You can view them all at once by opening `svg/index.html` in your browser.

### Application Architecture

- Application Structure Overview - Shows the overall structure of the application
- Component Relationships - Shows the relationships between different components

### Script Structure

- Script Structure Overview - Shows the organization of scripts in the application
- PDF Processing Flow - Shows the flow of data through the PDF processing pipeline

### PDF Workflow

- PDF Workflow Diagram - Shows the workflow for PDF processing and content generation

## How to Use These Diagrams

1. **Viewing**: Open the SVG files in any web browser or image viewer. Open the PDF files in any PDF reader.
2. **Sharing**: These files can be easily shared with team members or included in presentations.
3. **Printing**: The PDF files are optimized for printing.

## How to Update These Diagrams

If you need to update these diagrams:

1. Find the corresponding Mermaid code in the documentation files:
   - Application Architecture: [docs/application-architecture.md](../application-architecture.md)
   - Script Structure: [docs/script-structure.md](../script-structure.md)
   - PDF Workflow: [docs/pdf-workflow/README.md](../pdf-workflow/README.md)

2. Copy the Mermaid code from the documentation file.

3. Visit the [Mermaid Live Editor](https://mermaid.live/).

4. Paste the code and make your changes.

5. Export the updated diagram as SVG and PDF.

6. Replace the existing files in this directory with the updated ones.

## Generating Diagrams from Mermaid Code

To generate diagrams from Mermaid code:

1. Copy the Mermaid code from the documentation file.

2. Visit the [Mermaid Live Editor](https://mermaid.live/).

3. Paste the code into the editor.

4. Use the "Export" button to download the diagram as SVG or PDF.

5. Place the downloaded files in this directory.

## Using the Diagram Generator Script

AlexAI includes a script for automatically generating all diagrams:

```bash
# Install Mermaid CLI globally (required only once)
npm install -g @mermaid-js/mermaid-cli

# Generate all diagrams
npm run docs:diagrams
```

This script will:
1. Extract all Mermaid diagrams from the documentation files
2. Generate SVG and PDF versions of each diagram
3. Save them in this directory

## Using Mermaid CLI Directly

You can also use the Mermaid CLI directly:

```bash
# Install Mermaid CLI globally
npm install -g @mermaid-js/mermaid-cli

# Generate SVG from a Mermaid file
mmdc -i input.mmd -o output.svg

# Generate PDF from a Mermaid file
mmdc -i input.mmd -o output.pdf
```

## Using Browser Extensions

Several browser extensions can render Mermaid diagrams directly in GitHub or other markdown viewers:

- [Markdown Diagrams](https://chrome.google.com/webstore/detail/markdown-diagrams/pmoglnmodacnbbofbgcagndelmgaclel) for Chrome
- [GitHub + Mermaid](https://chrome.google.com/webstore/detail/github-%20-mermaid/goiiopgdnkogdbjmncgedmgpoajilohe) for Chrome
- [Mermaid Diagrams](https://addons.mozilla.org/en-US/firefox/addon/mermaid-diagrams/) for Firefox

These extensions allow you to view the diagrams directly in the documentation without having to export them.

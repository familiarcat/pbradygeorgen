/**
 * Mermaid Helper
 * 
 * This script provides utilities for working with Mermaid diagrams in documentation.
 * It adds buttons to copy Mermaid code to clipboard and open diagrams in the Mermaid Live Editor.
 * 
 * Usage:
 * 1. Include this script in your markdown viewer
 * 2. It will automatically add buttons next to each Mermaid code block
 */

(function() {
  // Function to encode text for URL
  function encodeForUrl(text) {
    return encodeURIComponent(text).replace(/'/g, '%27').replace(/"/g, '%22');
  }

  // Function to copy text to clipboard
  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    
    const selected = document.getSelection().rangeCount > 0 
      ? document.getSelection().getRangeAt(0) 
      : false;
    
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
    
    return true;
  }

  // Function to create button
  function createButton(text, onClick, className) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className || 'mermaid-button';
    button.addEventListener('click', onClick);
    button.style.marginRight = '10px';
    button.style.padding = '5px 10px';
    button.style.border = '1px solid #ccc';
    button.style.borderRadius = '4px';
    button.style.backgroundColor = '#f8f8f8';
    button.style.cursor = 'pointer';
    return button;
  }

  // Function to add buttons to Mermaid code blocks
  function addButtonsToMermaidBlocks() {
    // Find all pre elements containing Mermaid code
    const preElements = document.querySelectorAll('pre');
    
    preElements.forEach(pre => {
      // Check if this is a Mermaid code block
      const codeElement = pre.querySelector('code.language-mermaid');
      if (!codeElement) return;
      
      // Get the Mermaid code
      const mermaidCode = codeElement.textContent;
      
      // Create button container
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'mermaid-buttons';
      buttonContainer.style.marginBottom = '10px';
      
      // Create copy button
      const copyButton = createButton('Copy to Clipboard', () => {
        if (copyToClipboard(mermaidCode)) {
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = 'Copy to Clipboard';
          }, 2000);
        }
      });
      
      // Create open in editor button
      const editorUrl = `https://mermaid.live/edit#pako:${encodeForUrl(mermaidCode)}`;
      const openButton = createButton('Open in Mermaid Live Editor', () => {
        window.open(editorUrl, '_blank');
      });
      
      // Add buttons to container
      buttonContainer.appendChild(copyButton);
      buttonContainer.appendChild(openButton);
      
      // Insert button container before the pre element
      pre.parentNode.insertBefore(buttonContainer, pre);
    });
  }

  // Run when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addButtonsToMermaidBlocks);
  } else {
    addButtonsToMermaidBlocks();
  }
})();

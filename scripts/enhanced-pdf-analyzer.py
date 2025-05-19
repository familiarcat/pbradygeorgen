#!/usr/bin/env python3
"""
Enhanced PDF Analyzer

This script uses PyMuPDF to extract comprehensive information from PDF files,
including fonts, colors, and style hierarchies. It outputs the data in a structured
JSON format that can be used by the AlexAI application.

Usage:
    python enhanced-pdf-analyzer.py <pdf_file> [output_dir]

Requirements:
    - PyMuPDF (pip install pymupdf)
"""

import os
import sys
import json
import argparse
from collections import defaultdict
import fitz  # PyMuPDF

def rgb_to_hex(r, g, b):
    """Convert RGB values to hex color code."""
    # Ensure values are in the correct range
    r = max(0, min(1, r))
    g = max(0, min(1, g))
    b = max(0, min(1, b))
    return f"#{int(r*255):02x}{int(g*255):02x}{int(b*255):02x}"

def normalize_color(color_str):
    """Normalize unusual color formats to standard hex."""
    # Handle unusual hex formats like "#32cd32cd32cd"
    if color_str.startswith('#') and len(color_str) > 7:
        # Take the first 6 characters after # for RGB
        return f"#{color_str[1:7]}"
    return color_str

def is_light_color(hex_color):
    """Determine if a color is light or dark."""
    # Remove # if present
    hex_color = hex_color.lstrip('#')

    # Convert to RGB
    r = int(hex_color[0:2], 16) / 255.0
    g = int(hex_color[2:4], 16) / 255.0
    b = int(hex_color[4:6], 16) / 255.0

    # Calculate luminance (perceived brightness)
    # Using the formula: 0.299*R + 0.587*G + 0.114*B
    luminance = 0.299 * r + 0.587 * g + 0.114 * b

    # Return True if light, False if dark
    return luminance > 0.5

def get_contrast_color(hex_color):
    """Get a contrasting color for text on the given background color."""
    return "#000000" if is_light_color(hex_color) else "#FFFFFF"

def extract_font_info(doc):
    """Extract detailed font information from the PDF."""
    font_info = {}
    font_stats = defaultdict(int)
    font_usage = defaultdict(lambda: defaultdict(int))

    print("Extracting font information...")

    for page_num, page in enumerate(doc):
        # Get font info for this page
        fonts = page.get_fonts(full=True)

        # Get text blocks to analyze font usage
        blocks = page.get_text("dict", flags=11)["blocks"]

        for font in fonts:
            font_name = font[3]
            font_type = font[1]
            is_bold = "bold" in font_name.lower() or "heavy" in font_name.lower()
            is_italic = "italic" in font_name.lower() or "oblique" in font_name.lower()
            is_serif = not ("sans" in font_name.lower())

            if font_name not in font_info:
                font_info[font_name] = {
                    "name": font_name,
                    "type": font_type,
                    "is_bold": is_bold,
                    "is_italic": is_italic,
                    "is_serif": is_serif,
                    "pages": [page_num],
                    "usage": "unknown"
                }
            else:
                if page_num not in font_info[font_name]["pages"]:
                    font_info[font_name]["pages"].append(page_num)

        # Analyze font usage in text blocks
        for block in blocks:
            for line in block["lines"]:
                for span in line["spans"]:
                    span_font = span["font"]
                    font_stats[span_font] += 1

                    # Categorize usage based on size and flags
                    if span["size"] > 14:
                        font_usage[span_font]["heading"] += 1
                    elif span["flags"] & 4:  # Bold flag
                        font_usage[span_font]["heading"] += 1
                    else:
                        font_usage[span_font]["body"] += 1

    # Determine font usage based on statistics
    for font_name in font_info:
        if font_name in font_stats:
            # Determine primary usage based on collected stats
            usages = font_usage[font_name]
            if usages["heading"] > usages["body"]:
                font_info[font_name]["usage"] = "heading"
            else:
                font_info[font_name]["usage"] = "body"

    # Identify the most common fonts for different purposes
    heading_fonts = [f for f in font_info.values() if f["usage"] == "heading"]
    body_fonts = [f for f in font_info.values() if f["usage"] == "body"]

    # Create font theory
    font_theory = {
        "heading": heading_fonts[0]["name"] if heading_fonts else "Arial, sans-serif",
        "body": body_fonts[0]["name"] if body_fonts else "Georgia, serif",
        "mono": "Courier New, monospace",
        "button": heading_fonts[0]["name"] if heading_fonts else "Arial, sans-serif",
        "allFonts": list(font_info.keys()),
        "fontDetails": font_info
    }

    return font_theory

def extract_color_info(doc):
    """
    Extract color information from the PDF using Derrida's deconstruction philosophy.

    Derrida's approach involves breaking down traditional structures to reveal hidden meanings.
    In color theory, we deconstruct the PDF's colors to find the underlying color relationships
    and create a harmonious palette that respects contrast and legibility.
    """
    color_info = {
        "text_colors": [],
        "background_colors": [],
        "accent_colors": [],
        "all_colors": []
    }

    color_stats = defaultdict(int)
    normalized_colors = {}

    print("Extracting color information using Derrida's deconstruction approach...")

    for page in doc:
        # Extract text with color information
        blocks = page.get_text("dict", flags=11)["blocks"]

        for block in blocks:
            for line in block["lines"]:
                for span in line["spans"]:
                    # Get color as hex
                    color_val = span["color"]
                    r, g, b = fitz.sRGB_to_rgb(color_val)
                    hex_color = rgb_to_hex(r, g, b)

                    # Normalize the color to standard hex format
                    normalized_hex = normalize_color(hex_color)
                    normalized_colors[hex_color] = normalized_hex

                    # Count color occurrences
                    color_stats[normalized_hex] += len(span["text"])

                    if normalized_hex not in color_info["all_colors"]:
                        color_info["all_colors"].append(normalized_hex)

                        # Categorize colors using Derrida's deconstruction of traditional color roles
                        luminance = 0.299 * r + 0.587 * g + 0.114 * b

                        if luminance < 0.3:  # Dark colors are likely text
                            if normalized_hex not in color_info["text_colors"]:
                                color_info["text_colors"].append(normalized_hex)
                        elif luminance > 0.8:  # Light colors are likely background
                            if normalized_hex not in color_info["background_colors"]:
                                color_info["background_colors"].append(normalized_hex)
                        else:  # Other colors are likely accents
                            if normalized_hex not in color_info["accent_colors"]:
                                color_info["accent_colors"].append(normalized_hex)

    # Sort colors by usage
    sorted_colors = sorted(color_stats.items(), key=lambda x: x[1], reverse=True)

    # Find the most common colors for each category
    most_common_text = next((color for color in sorted_colors if color[0] in color_info["text_colors"]), ("#000000", 0))
    most_common_bg = next((color for color in sorted_colors if color[0] in color_info["background_colors"]), ("#FFFFFF", 0))

    # If no background colors were found, use white
    if not color_info["background_colors"]:
        color_info["background_colors"].append("#FFFFFF")

    # If no text colors were found, use black
    if not color_info["text_colors"]:
        color_info["text_colors"].append("#000000")

    # If no accent colors were found, create one based on the text color
    if not color_info["accent_colors"]:
        # Use a complementary color to the text color
        text_color = color_info["text_colors"][0].lstrip('#')
        r = int(text_color[0:2], 16)
        g = int(text_color[2:4], 16)
        b = int(text_color[4:6], 16)

        # Create a complementary color
        accent_color = f"#{(255-r):02x}{(255-g):02x}{(255-b):02x}"
        color_info["accent_colors"].append(accent_color)

    # Select background color
    background_color = color_info["background_colors"][0]

    # Select text color that contrasts with the background
    text_color = get_contrast_color(background_color)

    # Select accent color that stands out from both text and background
    accent_options = [c for c in color_info["accent_colors"] if c != text_color and c != background_color]
    accent_color = accent_options[0] if accent_options else "#3366CC"

    # Ensure accent color has good contrast with background
    if not is_light_color(background_color) == is_light_color(accent_color):
        # If they have similar luminance, adjust the accent color
        accent_color = "#3366CC" if is_light_color(background_color) else "#FF9900"

    # Create color theory using Derrida's deconstruction of traditional color roles
    color_theory = {
        "primary": most_common_text[0],
        "text": text_color,
        "background": background_color,
        "accent": accent_color,
        "secondary": color_info["accent_colors"][1] if len(color_info["accent_colors"]) > 1 else "#6699FF",
        "border": "#CCCCCC",
        "textOnAccent": get_contrast_color(accent_color),
        "allColors": color_info["all_colors"],
        "colorStats": {k: v for k, v in sorted_colors}
    }

    return color_theory

def extract_style_hierarchy(doc):
    """Extract style hierarchy information from the PDF."""
    style_info = {
        "headings": [],
        "paragraphs": [],
        "lists": [],
        "tables": []
    }

    print("Extracting style hierarchy...")

    for page in doc:
        # Get text blocks
        blocks = page.get_text("dict", flags=11)["blocks"]

        for block in blocks:
            # Analyze block structure
            block_text = ""
            block_fonts = set()
            block_sizes = set()

            for line in block["lines"]:
                for span in line["spans"]:
                    block_text += span["text"]
                    block_fonts.add(span["font"])
                    block_sizes.add(span["size"])

            # Classify block based on characteristics
            if len(block_text) < 100 and max(block_sizes) > 12:
                # Likely a heading
                style_info["headings"].append({
                    "text": block_text,
                    "fonts": list(block_fonts),
                    "sizes": list(block_sizes)
                })
            elif len(block["lines"]) > 3:
                # Likely a paragraph
                style_info["paragraphs"].append({
                    "text_sample": block_text[:100] + "..." if len(block_text) > 100 else block_text,
                    "fonts": list(block_fonts),
                    "sizes": list(block_sizes)
                })

    return style_info

def analyze_pdf(pdf_path, output_dir=None):
    """Analyze PDF and extract comprehensive information."""
    if not output_dir:
        output_dir = os.path.join(os.path.dirname(pdf_path), "extracted")

    os.makedirs(output_dir, exist_ok=True)

    print(f"Analyzing PDF: {pdf_path}")
    print(f"Output directory: {output_dir}")

    try:
        # Open the PDF
        doc = fitz.open(pdf_path)

        # Extract information
        font_theory = extract_font_info(doc)
        color_theory = extract_color_info(doc)
        style_hierarchy = extract_style_hierarchy(doc)

        # Create comprehensive output
        pdf_analysis = {
            "filename": os.path.basename(pdf_path),
            "page_count": len(doc),
            "font_theory": font_theory,
            "color_theory": color_theory,
            "style_hierarchy": style_hierarchy
        }

        # Save output files
        with open(os.path.join(output_dir, "enhanced_font_theory.json"), "w") as f:
            json.dump(font_theory, f, indent=2)

        with open(os.path.join(output_dir, "enhanced_color_theory.json"), "w") as f:
            json.dump(color_theory, f, indent=2)

        with open(os.path.join(output_dir, "enhanced_style_hierarchy.json"), "w") as f:
            json.dump(style_hierarchy, f, indent=2)

        with open(os.path.join(output_dir, "pdf_analysis.json"), "w") as f:
            json.dump(pdf_analysis, f, indent=2)

        print("Analysis complete. Files saved to output directory.")
        return True

    except Exception as e:
        print(f"Error analyzing PDF: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Enhanced PDF Analyzer")
    parser.add_argument("pdf_file", help="Path to the PDF file to analyze")
    parser.add_argument("output_dir", nargs="?", help="Output directory for analysis files")

    args = parser.parse_args()

    if not os.path.exists(args.pdf_file):
        print(f"Error: PDF file not found: {args.pdf_file}")
        return 1

    success = analyze_pdf(args.pdf_file, args.output_dir)
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())

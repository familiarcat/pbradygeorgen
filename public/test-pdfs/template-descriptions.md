# PDF Template Descriptions

This file contains descriptions of the test PDF templates in this directory.

## Template 1: Modern Two-Column

**Filename:** template1.pdf (example)

**Description:**
- Modern two-column layout
- Left sidebar with contact info and skills
- Right main section with experience and education
- Uses sans-serif fonts throughout
- Contains bullet points for skills and achievements

**Expected Challenges:**
- Text extraction might mix content from both columns
- Sidebar content might be extracted before or after main content
- Bullet points might not be properly preserved

## Template 2: Traditional Single-Column

**Filename:** template2.pdf (example)

**Description:**
- Traditional single-column layout
- Contact information at the top
- Chronological listing of experience and education
- Uses serif fonts for headings and sans-serif for body text
- Contains minimal formatting

**Expected Challenges:**
- Section headers might not be clearly distinguished
- Date ranges might be mixed with position titles

## Template 3: Creative Graphic-Heavy

**Filename:** template3.pdf (example)

**Description:**
- Creative layout with graphic elements
- Uses color blocks and icons
- Multiple columns with varying widths
- Contains charts or graphs for skills
- Uses decorative fonts for headings

**Expected Challenges:**
- Text embedded in graphics might not be extracted
- Complex layout might result in scrambled text order
- Decorative fonts might not be properly identified
- Charts and graphs will likely be lost in extraction

# AlexAI PDF Workflow Example

This document provides a complete walkthrough of the PDF selection and processing workflow in AlexAI, using a specific example from the project.

## Example: Processing a High-Contrast Resume

In this example, we'll process the `high-contrast.pdf` file from the test PDFs, extract its content and styling, build the application, and test it locally.

### Step 1: Open the PDF Manager

First, let's open the PDF Manager to get an overview of the available options:

```bash
npm run pdf
```

This will display the main menu:

```
=== AlexAI PDF Manager ===

Welcome to the AlexAI PDF Manager. This tool helps you manage PDF files in the application.
Please select an option:

1. Select a PDF file
2. Extract content from the current PDF
3. Test PDF extraction
4. Build and test locally
5. Simulate deployment to AWS
6. Deploy to AWS
7. Exit

Current default PDF: public/pbradygeorgen_resume.pdf
```

### Step 2: Select the High-Contrast PDF

Let's select option 1 to choose a PDF file:

```
Enter your choice (1-7): 1
```

This will display a list of available PDFs:

```
[OPTION] Selecting a PDF file

Found 21 PDF files:

1. public/backup/pbradygeorgen_resume_20250513_151319.pdf
2. public/backup/pbradygeorgen_resume_20250513_152812.pdf
3. public/backup/pbradygeorgen_resume_20250513_153213.pdf
4. public/backup/pbradygeorgen_resume_20250513_185014.pdf
5. public/default_resume.pdf
6. public/pbradygeorgen_resume.pdf
7. public/resume_redesign.pdf
8. public/summary-preview.pdf
9. public/test-pdfs/color/gradient.pdf
10. public/test-pdfs/color/high-contrast.pdf
11. public/test-pdfs/color/monochromatic.pdf
12. public/test-pdfs/layout/infographic.pdf
13. public/test-pdfs/layout/multi-column.pdf
14. public/test-pdfs/layout/single-column.pdf
15. public/test-pdfs/special/image-heavy.pdf
16. public/test-pdfs/special/special-chars.pdf
17. public/test-pdfs/special/table-based.pdf
18. public/test-pdfs/typography/mixed-typography.pdf
19. public/test-pdfs/typography/sans-serif.pdf
20. public/test-pdfs/typography/serif.pdf
21. source-pdfs/high-contrast.pdf

Please select a PDF file by entering its number (1-21):
```

Let's select option 10 for the high-contrast PDF:

```
Please select a PDF file by entering its number (1-21): 10
```

The system will set this PDF as the default and process it:

```
[SELECTED] You selected: public/test-pdfs/color/high-contrast.pdf
[RUN] Setting the selected PDF as the default
$ ./scripts/set-default-pdf.sh "public/test-pdfs/color/high-contrast.pdf"
[BACKUP] Backing up current default PDF to public/backup/pbradygeorgen_resume_20250513_190523.pdf
[COPY] Setting new PDF as default: public/test-pdfs/color/high-contrast.pdf -> public/pbradygeorgen_resume.pdf
[PROCESS] Processing the new default PDF
[INFO] Using provided PDF: public/pbradygeorgen_resume.pdf
[PROCESS] Starting PDF extraction process for public/pbradygeorgen_resume.pdf
[TEXT] Extracting text from PDF...
...
[SUCCESS] Text extraction completed successfully
[COLOR] Extracting colors from PDF...
...
[SUCCESS] Color extraction completed successfully
[FONT] Extracting fonts from PDF...
...
[SUCCESS] Font extraction completed successfully
[MARKDOWN] Generating improved markdown...
...
[SUCCESS] Improved markdown generated successfully
[COMPLETE] PDF extraction process completed successfully
[INFO] Extracted files are available in public/extracted/
...
[SUCCESS] New default PDF set and processed successfully
[NEXT] You can now run 'npm run dev' to test the application with the new PDF
[SUCCESS] Command completed successfully
```

### Step 3: Test the PDF Extraction

Now, let's test the PDF extraction to make sure everything worked correctly. From the main menu, select option 3:

```
Enter your choice (1-7): 3
```

This will run the PDF extraction test:

```
[OPTION] Testing PDF extraction
[RUN] Testing PDF extraction
$ npm run test:pdf-extraction

=== PDF Extraction Test ===

[INFO] This test will verify the PDF extraction process
[STEP 1] Checking if the default PDF exists
[CHECK] ✓ pbradygeorgen_resume.pdf exists
[STEP 2] Running PDF extraction process
...
[STEP 3] Verifying extracted files
[CHECK] ✓ resume_content.txt exists
[CHECK] ✓ resume_content.md exists
[CHECK] ✓ color_theory.json exists
[CHECK] ✓ font_theory.json exists
[STEP 4] Checking content of extracted files
...
[STEP 5] Testing individual extraction scripts
...
[STEP 6] Verifying extraction results
...
[SUCCESS] PDF extraction test completed successfully
[INFO] All extraction scripts are working correctly
[SUCCESS] Command completed successfully
```

### Step 4: Examine the Extracted Content

Let's look at the extracted content to see what was generated. First, let's check the color theory:

```bash
cat public/extracted/color_theory.json
```

Output:
```json
{
  "primary": "#000000",
  "secondary": "#ffffff",
  "accent": "#cccccc",
  "background": "#ffffff",
  "text": "#000000",
  "textSecondary": "#333333",
  "border": "#dddddd",
  "success": "#28a745",
  "warning": "#ffc107",
  "error": "#dc3545",
  "info": "#17a2b8",
  "allColors": []
}
```

Next, let's check the font theory:

```bash
cat public/extracted/font_theory.json
```

Output:
```json
{
  "heading": "Arial, sans-serif",
  "body": "Helvetica, Arial, sans-serif",
  "mono": "monospace",
  "allFonts": []
}
```

Finally, let's check the beginning of the extracted markdown:

```bash
head -n 20 public/extracted/resume_content.md
```

Output:
```markdown
# I strive to continuously drive innovation by blending 

cutting-edge technology with creative design and Agile 

best practices, focused on delivering enterprise-grade 

solutions and digital transformations that empower 

teams and organizations.

P. Brady Georgen


## AREA EXPERTISE


## EXTENDED EXPERIENCE


## ABOUT ME

4350 A De Tonty St, 

St. Louis, MO
```

### Step 5: Build and Test Locally

Now, let's build the application with the extracted content and styling. From the main menu, select option 4:

```
Enter your choice (1-7): 4
```

This will build the application:

```
[OPTION] Building and testing locally
[RUN] Building the application
$ npm run build

> next@0.1.0 prebuild
> ./amplify-prebuild.sh

Initial Node version: v20.19.1
Initial NPM version: 10.8.2
engine-strict=false
ignore-engines=true
PDF file found: public/pbradygeorgen_resume.pdf
Last modified: May 13 19:05:23 2025
Running PDF extraction process...
[PREBUILD] Starting PDF extraction before build
...
[SUCCESS] Command completed successfully

Do you want to start the application? (y/n)
```

Let's start the application by entering `y`:

```
Do you want to start the application? (y/n)
> y
[ACTION] Starting the application
[INFO] The application will be available at http://localhost:3000
[INFO] Press Ctrl+C to stop the application and return to the menu
```

The application will start, and you can access it at http://localhost:3000 to see the high-contrast styling applied.

### Step 6: Simulate Deployment to AWS

To simulate deployment to AWS, press Ctrl+C to stop the application and return to the menu, then select option 5:

```
Enter your choice (1-7): 5
```

This will simulate the deployment process:

```
[OPTION] Simulating deployment to AWS
[RUN] Simulating deployment to AWS
$ npm run deploy:simulate

=== AWS Amplify Deployment Simulation ===

[INFO] This script will simulate the AWS Amplify deployment process
[STEP 1] Running tests
...
[STEP 2] Building the application
...
[STEP 3] Simulating AWS Amplify build process
...
[STEP 4] Simulating AWS Amplify deployment
[STEP 5] Opening the simulated deployment in a browser
[SUCCESS] Deployment simulation completed successfully
[INFO] In a real deployment, the application would now be available at your AWS Amplify URL
[INFO] You can clean up the simulation files by running: rm -rf amplify-build-simulation
[SUCCESS] Command completed successfully
```

A browser window will open showing a simulation of the deployed application.

### Step 7: Exit the PDF Manager

To exit the PDF Manager, select option 7:

```
Enter your choice (1-7): 7
```

This will exit the PDF Manager:

```
[OPTION] Exiting the PDF Manager
[GOODBYE] Thank you for using the AlexAI PDF Manager
```

## Alternative: Using the Command Line

Instead of using the interactive PDF Manager, you can also use the command line to perform the same workflow:

```bash
# Step 1: Select the high-contrast PDF
npx alex pdf:select
# Choose option 10 for high-contrast.pdf

# Step 2: Test the extraction
npx alex test

# Step 3: Build and test locally
npx alex build
npx alex start

# Step 4: Simulate deployment
npx alex deploy
```

Or using npm scripts:

```bash
# Step 1: Select the high-contrast PDF
npm run pdf:select
# Choose option 10 for high-contrast.pdf

# Step 2: Test the extraction
npm run test:pdf-extraction

# Step 3: Build and test locally
npm run build
npm run start

# Step 4: Simulate deployment
npm run deploy:simulate
```

## Conclusion

This example demonstrates the complete PDF workflow in AlexAI, from selecting a PDF to deploying the application. The workflow is designed to be intuitive and methodical, following the philosophical frameworks of Salinger, Dante, Hesse, and Derrida.

By following this workflow, you can easily test different PDFs, extract their content and styling, and see how they look in the application. This makes it easy to experiment with different designs and content without having to manually update the application.

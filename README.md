# PDF-Only Viewer

This is a simple Next.js application that ONLY displays a PDF file. No navigation, no UI elements, just the PDF.

## Features

- Displays a PDF file in full-screen mode
- No UI elements or navigation
- Optimized for AWS Amplify deployment

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the PDF viewer.

## Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Deployment with AWS Amplify

This project includes an `amplify.yml` file for easy deployment with AWS Amplify. Simply connect your repository to Amplify and it will automatically build and deploy the application.

## PDF URL

The PDF URL is hardcoded in `src/app/page.tsx`. Update this URL to point to your PDF file:

```typescript
const pdfUrl = 'https://pbradygeorgen.com/resume.pdf';
```

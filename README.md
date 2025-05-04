This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

### Local Development

```bash
# Install dependencies
npm install

# Set up Git hooks (automatically run after npm install)
npm run setup

# Run development server
npm run dev

# Build for production
npm run build

# Serve production build locally
npm start
```

### Git Hooks

This project uses Git hooks to ensure code quality:

- **Pre-commit**: Runs TypeScript type checking, ESLint, and PDF reference management before each commit
- **Setup**: Run `npm run setup` to install the Git hooks manually

If you encounter issues with Git hooks, make sure the scripts in the `scripts` directory are executable:

```bash
chmod +x scripts/*.sh
```

## PDF Management

### Changing the Source PDF

The application uses a source PDF file as the record of truth for generating content. To change the source PDF:

```bash
# List available source PDFs
node scripts/update-source-pdf.js list

# Update the source PDF with a new file
node scripts/update-source-pdf.js update <path-to-pdf>
```

The update process will:

1. Create a backup of the current PDFs
2. Copy the new PDF to the public directory
3. Process the PDF with OpenAI to extract content
4. Update the build configuration
5. Sync the PDFs with S3 (if AWS credentials are configured)

### PDF Processing Flow

The PDF processing flow is as follows:

1. Source PDF is placed in the `source-pdfs` directory
2. During the build process, the latest source PDF is used
3. The PDF is processed with OpenAI to extract content
4. The extracted content is saved to the `public/extracted` directory
5. The content is used to generate the download options
6. The PDFs are synced with S3 for AWS Amplify deployment

## AWS Amplify Deployment

This project is configured for deployment on AWS Amplify. For detailed instructions, see [AMPLIFY.md](./AMPLIFY.md).

```bash
# Simulate Amplify build process locally
npm run build
npm run start

# Deploy to Amplify (requires AWS credentials)
./scripts/deploy-to-amplify.sh
```

The deployment process will:

1. Build the static site with the latest source PDF
2. Process the PDF with OpenAI to extract content
3. Sync the PDFs and extracted content with S3
4. Deploy the application to AWS Amplify
5. Make the content available through the Amplify URL

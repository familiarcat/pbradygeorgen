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

### AWS Amplify Deployment

This project is configured for deployment on AWS Amplify. For detailed instructions, see [AMPLIFY.md](./AMPLIFY.md).

```bash
# Simulate Amplify build process locally
npm run amplify:build

# Serve the built files locally
npm run amplify:serve

# Deploy to Amplify (requires AWS credentials)
./deploy.sh pdf-next.js
```

The deployment process will:

1. Build the static site
2. Push to the specified branch
3. Trigger Amplify's CI/CD pipeline
4. Deploy to your custom domain

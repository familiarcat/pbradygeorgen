/**
 * Express.js Example for Dante Logger
 * 
 * This example demonstrates how to use Dante Logger in an Express.js application.
 */

const express = require('express');
const { DanteExpressLogger } = require('dante-logger/express');

// Create Express app
const app = express();

// Configure Dante Logger for Express
const danteLogger = DanteExpressLogger({
  logRequests: true,
  logResponses: true,
  logErrors: true,
  loggerConfig: {
    formatting: {
      includeTimestamp: true,
      includeEmoji: true,
      colorize: true
    }
  },
  // Skip logging for health check endpoint
  skip: (req) => req.url === '/health'
});

// Apply Dante Logger middleware
app.use(danteLogger);

// Parse JSON body
app.use(express.json());

// Sample routes
app.get('/', (req, res) => {
  res.send('Welcome to the Dante Logger Express Example');
});

// Fast endpoint
app.get('/fast', (req, res) => {
  res.json({ message: 'This is a fast endpoint' });
});

// Slow endpoint
app.get('/slow', (req, res) => {
  setTimeout(() => {
    res.json({ message: 'This is a slow endpoint' });
  }, 1000);
});

// Error endpoint
app.get('/error', (req, res, next) => {
  try {
    throw new Error('Deliberate error for testing');
  } catch (error) {
    next(error);
  }
});

// Validation error endpoint
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ 
      error: 'Name and email are required' 
    });
  }
  
  if (!email.includes('@')) {
    return res.status(400).json({ 
      error: 'Invalid email format' 
    });
  }
  
  res.status(201).json({ 
    id: 123, 
    name, 
    email 
  });
});

// Health check endpoint (logging skipped)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ 
    error: err.message || 'Internal Server Error' 
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Try the following endpoints:');
  console.log('- GET /');
  console.log('- GET /fast');
  console.log('- GET /slow');
  console.log('- GET /error');
  console.log('- POST /users (with JSON body)');
  console.log('- GET /health (logging skipped)');
});

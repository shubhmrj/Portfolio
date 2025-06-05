const { exec } = require('child_process');
const serverless = require('serverless-http');
const express = require('express');
const path = require('path');

// Create Express app
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Proxy all requests to Flask app
app.all('*', (req, res) => {
  // This is a simplified example - in production, you'd want to properly
  // handle the Flask application as a serverless function
  res.sendFile(path.join(__dirname, '../templates/index.html'));
});

// Export the serverless handler
module.exports.handler = serverless(app);

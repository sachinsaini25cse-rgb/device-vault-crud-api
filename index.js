/**
 * ============================================================================
 * Main Entry Point: index.js
 * Project: DeviceVault — University Lab Equipment & Hardware Loan Tracker
 * 
 * Stack:
 * - Runtime: Node.js
 * - Web Framework: Express.js
 * - Database ODM: Mongoose with MongoDB Atlas
 * - Frontend: Static HTML & CSS served from /public
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import Route Handlers
const deviceRoutes = require('./routes/device.route');
const bookRoutes = require('./routes/book.route');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ============================================================================
// Core Middleware
// ============================================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// API Route Mounting
// ============================================================================
// Primary endpoint for the DeviceVault project
app.use('/api/devices', deviceRoutes);

// Alias endpoint for university evaluation compatibility
app.use('/api/books', bookRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    project: 'DeviceVault — University Lab Equipment Tracker',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected / Connecting',
    timestamp: new Date().toISOString()
  });
});

// Fallback route to serve index.html for any root requests
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================================================
// MongoDB Connection & Server Initialization
// ============================================================================
const startServer = async () => {
  console.log('----------------------------------------------------');
  console.log('⚡ Initializing DeviceVault University Server...');
  console.log('----------------------------------------------------');

  if (!MONGO_URI || MONGO_URI.includes('<YOUR_CLUSTER_NAME>')) {
    console.warn('⚠️  WARNING: MONGO_URI in .env is not yet configured with your actual MongoDB Atlas cluster!');
    console.warn('👉 Please update .env with your full MongoDB Atlas connection string.');
    console.warn('👉 Example: MONGO_URI=mongodb+srv://sachinsaini25cse_db_user:NwIgg9OV39NjBSwI@cluster0.abcde.mongodb.net/devicevault?retryWrites=true&w=majority');
  }

  try {
    if (MONGO_URI && !MONGO_URI.includes('<YOUR_CLUSTER_NAME>')) {
      console.log('⏳ Connecting to MongoDB Atlas...');
      await mongoose.connect(MONGO_URI);
      console.log('✅ Successfully connected to MongoDB Atlas database!');
    } else {
      console.log('ℹ️  Server starting in offline database mode until .env connection string is provided.');
    }
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.warn('⚠️  Server will continue running so frontend and docs remain accessible.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running smoothly on http://localhost:${PORT}`);
    console.log(`🌐 Live Dashboard: http://localhost:${PORT}`);
    console.log(`📡 Devices API:    http://localhost:${PORT}/api/devices`);
    console.log(`📡 Books Alias:   http://localhost:${PORT}/api/books`);
    console.log(`🩺 Health Status:  http://localhost:${PORT}/health`);
    console.log('----------------------------------------------------');
  });
};

startServer();

module.exports = app;

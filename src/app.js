require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import routes
const authRoutes = require('./routes/auth.routes');
const bankAccountRoutes = require('./routes/bank-account.routes');
const transferRoutes = require('./routes/transfer.routes');
const webhookRoutes = require('./routes/webhook.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Money Transfer API' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/bank-accounts', bankAccountRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/webhooks', webhookRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app; 
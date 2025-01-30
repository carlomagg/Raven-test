const express = require('express');
const TransferController = require('../controllers/transfer.controller');
const auth = require('../middleware/auth.middleware');
const { body, query } = require('express-validator');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Initiate transfer
router.post('/', [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('bank_code')
    .notEmpty()
    .withMessage('Bank code is required'),
  body('account_number')
    .notEmpty()
    .withMessage('Account number is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
], TransferController.initiateTransfer);

// Get transactions history
router.get('/history', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('type')
    .optional()
    .isIn(['deposit', 'transfer'])
    .withMessage('Type must be either deposit or transfer')
], TransferController.getTransactions);

module.exports = router; 
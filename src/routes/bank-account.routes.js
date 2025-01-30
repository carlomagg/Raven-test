const express = require('express');
const BankAccountController = require('../controllers/bank-account.controller');
const auth = require('../middleware/auth.middleware');
const { body } = require('express-validator');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Generate bank account
router.post('/generate', BankAccountController.generateAccount);

// Get list of banks
router.get('/banks', BankAccountController.getBanks);

// Verify bank account
router.post('/verify', [
  body('account_number').notEmpty().withMessage('Account number is required'),
  body('bank_code').notEmpty().withMessage('Bank code is required')
], BankAccountController.verifyBankAccount);

module.exports = router; 
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const RavenService = require('../services/raven.service');
const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');

class TransferController {
  static async initiateTransfer(req, res) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          errors: errors.array()
        });
      }

      const { amount, bank_code, account_number, description } = req.body;
      const user = req.user;

      // Check if user has sufficient balance
      if (user.balance < amount) {
        return res.status(400).json({
          status: 'error',
          message: 'Insufficient balance'
        });
      }

      // Verify recipient account
      const accountData = await RavenService.verifyBankAccount(account_number, bank_code);

      // Generate unique reference
      const reference = uuidv4();

      // Create transaction record
      const transaction = await Transaction.create({
        user_id: user.id,
        type: 'transfer',
        amount,
        reference,
        description,
        recipient_account_number: account_number,
        recipient_bank_code: bank_code,
        recipient_name: accountData.account_name,
        status: 'pending'
      });

      // Initiate transfer via Raven API
      const transferResult = await RavenService.initiateTransfer({
        amount,
        bank_code,
        account_number,
        description,
        reference
      });

      // Deduct amount from user's balance
      await User.updateBalance(user.id, -amount);

      res.json({
        status: 'success',
        data: {
          transaction,
          transfer: transferResult
        }
      });
    } catch (error) {
      console.error('Transfer error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to initiate transfer'
      });
    }
  }

  static async getTransactions(req, res) {
    try {
      const { page = 1, limit = 10, type } = req.query;
      const userId = req.user.id;

      let transactions;
      if (type === 'deposit') {
        transactions = await Transaction.getUserDeposits(userId, page, limit);
      } else if (type === 'transfer') {
        transactions = await Transaction.getUserTransfers(userId, page, limit);
      } else {
        transactions = await Transaction.getUserTransactions(userId, null, page, limit);
      }

      res.json({
        status: 'success',
        data: transactions
      });
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch transactions'
      });
    }
  }
}

module.exports = TransferController; 
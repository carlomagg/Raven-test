const RavenService = require('../services/raven.service');
const User = require('../models/user.model');

class BankAccountController {
  static async generateAccount(req, res) {
    try {
      const user = req.user;

      // Check if user already has a bank account
      if (user.bank_account_number) {
        return res.status(400).json({
          status: 'error',
          message: 'User already has a bank account'
        });
      }

      // Generate bank account using Raven API
      const accountData = await RavenService.generateBankAccount({
        first_name: user.first_name,
        last_name: user.last_name,
        bvn: req.body.bvn // Optional
      });

      // Update user with new bank account number
      await User.updateBankAccount(user.id, accountData.account_number);

      res.json({
        status: 'success',
        data: {
          account_number: accountData.account_number,
          account_name: accountData.account_name,
          bank_name: accountData.bank_name
        }
      });
    } catch (error) {
      console.error('Bank account generation error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to generate bank account'
      });
    }
  }

  static async getBanks(req, res) {
    try {
      const banks = await RavenService.getBanks();
      res.json({
        status: 'success',
        data: banks
      });
    } catch (error) {
      console.error('Get banks error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch banks'
      });
    }
  }

  static async verifyBankAccount(req, res) {
    try {
      const { account_number, bank_code } = req.body;
      const accountData = await RavenService.verifyBankAccount(account_number, bank_code);
      
      res.json({
        status: 'success',
        data: accountData
      });
    } catch (error) {
      console.error('Bank account verification error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to verify bank account'
      });
    }
  }
}

module.exports = BankAccountController; 
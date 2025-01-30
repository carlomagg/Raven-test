const crypto = require('crypto');
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

class WebhookController {
  static async handleTransferWebhook(req, res) {
    try {
      // Verify webhook signature
      const signature = req.headers['x-raven-signature'];
      if (!WebhookController.verifySignature(signature, req.body)) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid webhook signature'
        });
      }

      const { event, data } = req.body;

      // Handle different webhook events
      switch (event) {
        case 'transfer.success':
          await WebhookController.handleTransferSuccess(data);
          break;
        case 'transfer.failed':
          await WebhookController.handleTransferFailed(data);
          break;
        default:
          console.log(`Unhandled webhook event: ${event}`);
      }

      // Always return 200 to acknowledge receipt
      res.status(200).json({ status: 'success' });
    } catch (error) {
      console.error('Webhook processing error:', error);
      // Still return 200 to prevent retries
      res.status(200).json({ status: 'success' });
    }
  }

  static async handleTransferSuccess(data) {
    const { reference, amount, account_number } = data;

    // Find user by account number
    const user = await User.findByBankAccount(account_number);
    if (!user) {
      throw new Error('User not found for account number: ' + account_number);
    }

    // Update user's balance
    await User.updateBalance(user.id, amount);

    // Update transaction status
    await Transaction.updateByReference(reference, {
      status: 'completed',
      metadata: data
    });
  }

  static async handleTransferFailed(data) {
    const { reference } = data;

    // Update transaction status
    await Transaction.updateByReference(reference, {
      status: 'failed',
      metadata: data
    });
  }

  static verifySignature(signature, payload) {
    if (!signature) return false;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}

module.exports = WebhookController; 
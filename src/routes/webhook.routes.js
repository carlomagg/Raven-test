const express = require('express');
const WebhookController = require('../controllers/webhook.controller');

const router = express.Router();

router.post('/raven', WebhookController.handleTransferWebhook);

module.exports = router; 
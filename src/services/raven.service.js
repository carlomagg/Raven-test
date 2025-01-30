const axios = require('axios');

class RavenService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.RAVEN_API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RAVEN_SECRET_KEY}`
      }
    });
  }

  async generateBankAccount(userData) {
    try {
      const response = await this.api.post('/virtual-bank-account', {
        account_name: `${userData.first_name} ${userData.last_name}`,
        bvn: userData.bvn // Optional, depending on Raven's requirements
      });

      return response.data;
    } catch (error) {
      console.error('Raven API Error:', error.response?.data || error.message);
      throw new Error('Failed to generate bank account');
    }
  }

  async initiateTransfer(transferData) {
    try {
      const response = await this.api.post('/transfers', {
        amount: transferData.amount,
        bank_code: transferData.bank_code,
        account_number: transferData.account_number,
        narration: transferData.description || 'Transfer',
        reference: transferData.reference
      });

      return response.data;
    } catch (error) {
      console.error('Raven API Error:', error.response?.data || error.message);
      throw new Error('Failed to initiate transfer');
    }
  }

  async getBanks() {
    try {
      const response = await this.api.get('/banks');
      return response.data;
    } catch (error) {
      console.error('Raven API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch banks');
    }
  }

  async verifyBankAccount(accountNumber, bankCode) {
    try {
      const response = await this.api.get(`/banks/resolve?account_number=${accountNumber}&bank_code=${bankCode}`);
      return response.data;
    } catch (error) {
      console.error('Raven API Error:', error.response?.data || error.message);
      throw new Error('Failed to verify bank account');
    }
  }
}

module.exports = new RavenService(); 
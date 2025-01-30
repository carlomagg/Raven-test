const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { password, ...otherData } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [userId] = await db('users').insert({
      ...otherData,
      password: hashedPassword
    });

    return this.findById(userId);
  }

  static async findById(id) {
    return db('users')
      .where({ id })
      .first();
  }

  static async findByEmail(email) {
    return db('users')
      .where({ email })
      .first();
  }

  static async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async updateBankAccount(userId, bankAccountNumber) {
    return db('users')
      .where({ id: userId })
      .update({ bank_account_number: bankAccountNumber });
  }

  static async updateBalance(userId, amount) {
    return db('users')
      .where({ id: userId })
      .increment('balance', amount);
  }
}

module.exports = User; 
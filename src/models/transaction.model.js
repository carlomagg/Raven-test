const db = require('../config/database');

class Transaction {
  static async create(transactionData) {
    const [id] = await db('transactions').insert(transactionData);
    return this.findById(id);
  }

  static async findById(id) {
    return db('transactions')
      .where({ id })
      .first();
  }

  static async findByReference(reference) {
    return db('transactions')
      .where({ reference })
      .first();
  }

  static async updateByReference(reference, updateData) {
    return db('transactions')
      .where({ reference })
      .update(updateData);
  }

  static async getUserTransactions(userId, type = null, page = 1, limit = 10) {
    const query = db('transactions')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');

    if (type) {
      query.where({ type });
    }

    const offset = (page - 1) * limit;
    const [count] = await db('transactions')
      .where({ user_id: userId })
      .count('* as total');

    const transactions = await query
      .limit(limit)
      .offset(offset);

    return {
      data: transactions,
      pagination: {
        total: count.total,
        page,
        limit,
        pages: Math.ceil(count.total / limit)
      }
    };
  }

  static async getUserDeposits(userId, page = 1, limit = 10) {
    return this.getUserTransactions(userId, 'deposit', page, limit);
  }

  static async getUserTransfers(userId, page = 1, limit = 10) {
    return this.getUserTransactions(userId, 'transfer', page, limit);
  }
}

module.exports = Transaction; 
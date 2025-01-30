exports.up = function(knex) {
  return knex.schema.createTable('transactions', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('type').notNullable().checkIn(['deposit', 'transfer', 'withdrawal']);
    table.decimal('amount', 15, 2).notNullable();
    table.string('reference').notNullable().unique();
    table.string('description');
    table.string('recipient_account_number');
    table.string('recipient_bank_code');
    table.string('recipient_name');
    table.string('status').defaultTo('pending').checkIn(['pending', 'completed', 'failed']);
    table.json('metadata');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
}; 
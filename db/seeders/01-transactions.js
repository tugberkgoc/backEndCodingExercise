'use strict'

module.exports = {
  up: async queryInterface => {
    const transactions = require('./data/transactions_bigger.json')

    transactions.forEach(transaction => {
      transaction.brandId = transaction.id
      delete transaction.id
      transaction.transactionDate = new Date(transaction.transactionDate * 1000)
      transaction.costPerCredit = parseFloat(
        transaction.costPerCredit.replace(/\$|,/g, '')
      )
      transaction.discount = parseFloat(
        transaction.discount.replace(/%|,/g, '')
      )
    })

    await queryInterface.bulkInsert('transactions', transactions)

    await queryInterface.sequelize.query(
      `ALTER SEQUENCE "transactions_id_seq" RESTART WITH ${transactions.length +
        1};`
    )
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('transactions', null, {})

    await queryInterface.sequelize.query(
      'ALTER SEQUENCE "transactions_id_seq" RESTART WITH 1;'
    )
  }
}

'use strict'

module.exports = {
  up: async queryInterface => {
    const brands = [
      { id: 'brand1' },
      { id: 'brand2' },
      { id: 'brand3' },
      { id: 'brand4' }
    ]

    const transactions = require('./data/transactions_bigger.json')

    transactions.forEach(transaction => {
      const brand = brands.filter(brand => brand.id === transaction.id)[0]

      if (
        brand.startDate &&
        brand.startDate > new Date(transaction.transactionDate * 1000)
      ) {
        brand.startDate = new Date(transaction.transactionDate * 1000)
      } else {
        brand.startDate = new Date(transaction.transactionDate * 1000)
      }
    })

    await queryInterface.bulkInsert('brands', brands)
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('brands', null, {})
  }
}

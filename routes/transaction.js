const transactionController = require('../controllers/transactionController')

module.exports = async function (fastify) {
  // const preValidation = [fastify.authenticate]

  fastify.get('/transactions', transactionController.getTransactions)
  fastify.get(
    '/transactions/report',
    transactionController.getTransactionsReport
  )
}

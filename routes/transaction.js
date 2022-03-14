const transactionController = require('../controllers/transactionController')

module.exports = async function (fastify) {
  fastify.get(
    '/transactions/report',
    transactionController.getTransactionsReport
  )
  fastify.get('/transactions/credits', transactionController.getNumberOfCredits)
  fastify.get(
    '/transactions/airdrop',
    transactionController.giveFreeCreditsToBrand
  )
  fastify.get('/transactions', transactionController.getTransactions)
}

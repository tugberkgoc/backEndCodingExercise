const { Sequelize, Op, db, getOrderQuery } = require('./baseController') // ApiError
const { transactionTypes } = require('../data/enums')
const { mergeArrays } = require('../utils/commonUtils')

// #region transaction

exports.getTransactions = async (req, res) => {
  const query = getTransactionQuery(req.query)
  const transactions = await db.transaction.findAndCountAll(query)
  res.send(transactions)
}

exports.getTransactionsReport = async (req, res) => {
  const { startDate, endDate } = req.query

  const transactionDate = {}
  if (startDate || endDate) {
    transactionDate.transactionDate = {}
    if (startDate) {
      transactionDate.transactionDate[Op.gte] = startDate
    }
    if (endDate) {
      transactionDate.transactionDate[Op.lte] = endDate
    }
  }

  const spentTransactions = await db.transaction.findAll({
    where: { transactionType: transactionTypes.SPEND, ...transactionDate },
    attributes: [
      'brandId',
      [
        Sequelize.literal(
          'SUM("amountOfCredits" * "costPerCredit" * ((100.00 - "discount") / 100))::numeric(18,2)'
        ),
        'totalSpentPrice'
      ]
    ],
    group: ['brandId'],
    raw: true
  })

  const boughtTransactions = await db.transaction.findAll({
    where: { transactionType: transactionTypes.BUY, ...transactionDate },
    attributes: [
      'brandId',
      [
        Sequelize.literal(
          'SUM("amountOfCredits" * "costPerCredit" * ((100.00 - "discount") / 100))::numeric(18,2)'
        ),
        'totalBoughtPrice'
      ]
    ],
    group: ['brandId'],
    raw: true
  })

  const expiredTransactions = await db.transaction.findAll({
    where: { transactionType: transactionTypes.EXPIRE, ...transactionDate },
    attributes: [
      'brandId',
      [
        Sequelize.literal(
          'SUM("amountOfCredits" * "costPerCredit" * ((100.00 - "discount") / 100))::numeric(18,2)'
        ),
        'totalExpiredPrice'
      ]
    ],
    group: ['brandId'],
    raw: true
  })

  const transactions = mergeArrays([
    spentTransactions,
    boughtTransactions,
    expiredTransactions
  ])

  res.send(transactions)
}

const getTransactionQuery = params => {
  const {
    brandId,
    stripeCustomerId,
    stripeChargeId,
    date,
    action,
    sort,
    order,
    limit,
    offset
  } = params

  const transactionQuery = {}

  if (brandId) {
    transactionQuery.brandId = brandId
  }
  if (stripeCustomerId) {
    transactionQuery.stripeCustomerId = stripeCustomerId
  }
  if (stripeChargeId) {
    transactionQuery.stripeChargeId = stripeChargeId
  }
  if (date) {
    transactionQuery.transactionDate = {}
    transactionQuery.transactionDate[Op.lte] = new Date(date * 1000)
  }
  if (action) {
    // && transactionTypes.hasOwnProperty(action)
    transactionQuery.transactionType = action
  }

  const query = {
    where: transactionQuery,
    include: [],
    order: getOrderQuery(sort, order)
  }

  if (limit && offset) {
    query.limit = limit
    query.offset = offset
    query.distinct = true
  }

  return query
}

// #endregion

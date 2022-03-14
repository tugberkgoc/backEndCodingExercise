const { Op, db, getOrderQuery } = require('./baseController') // ApiError
// const { transactionTypes } = require('../data/enums')

// #region transaction

exports.getTransactions = async (req, res) => {
  const query = getTransactionQuery(req.query)
  const transactions = await db.transaction.findAndCountAll(query)
  res.send(transactions)
}

exports.getTransactionsReport = async (req, res) => {
  // const { id } = req.params
  const transactions = await db.transaction.findAll({
    group: ['transaction.brandId']
  })
  res.send(transactions)
}

const getTransactionQuery = params => {
  const {
    brandId,
    stripeCustomerId,
    stripeChargeId,
    startDate,
    endDate,
    transactionType,
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
  if (startDate || endDate) {
    transactionQuery.transactionDateYear = {}
    if (startDate) {
      transactionQuery.transactionDateYear[Op.gte] = startDate
    }
    if (endDate) {
      transactionQuery.transactionDateYear[Op.lte] = endDate
    }
  }
  if (transactionType) {
    // && transactionTypes.hasOwnProperty(transactionType)
    transactionQuery.transactionType = transactionType
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

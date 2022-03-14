const { Sequelize, Op, db, getOrderQuery } = require('./baseController')
const { transactionTypes } = require('../data/enums')
const { diffInMonths } = require('../utils/commonUtils')

// #region transaction

exports.getTransactionsReport = async (req, res) => {
  const { startDate, endDate } = req.query

  const whereQuery = {}
  if (startDate || endDate) {
    whereQuery.transactionDate = {}
    if (startDate) {
      whereQuery.transactionDate[Op.gte] = startDate
    }
    if (endDate) {
      whereQuery.transactionDate[Op.lte] = endDate
    }
  }

  const transactions = await db.transaction.findAll({
    where: whereQuery,
    attributes: [
      'brandId',
      [
        Sequelize.literal(
          `SUM(CASE WHEN "transactionType" = '${transactionTypes.SPEND}' THEN "amountOfCredits" * "costPerCredit" * ((100.00 - "discount") / 100) ELSE 0 END)::numeric(18,2)`
        ),
        'totalSpentPrice'
      ],
      [
        Sequelize.literal(
          `SUM(CASE WHEN "transactionType" = '${transactionTypes.BUY}' THEN "amountOfCredits" * "costPerCredit" * ((100.00 - "discount") / 100) ELSE 0 END)::numeric(18,2)`
        ),
        'totalBoughtPrice'
      ],
      [
        Sequelize.literal(
          `SUM(CASE WHEN "transactionType" = '${transactionTypes.EXPIRE}' THEN "amountOfCredits" * "costPerCredit" * ((100.00 - "discount") / 100) ELSE 0 END)::numeric(18,2)`
        ),
        'totalExpiredPrice'
      ]
    ],
    group: ['brandId']
  })

  res.send(transactions)
}

exports.getNumberOfCredits = async (req, res) => {
  const { date, brandId } = req.query

  const whereQuery = {}

  if (date) {
    whereQuery.transactionDate = {}
    whereQuery.transactionDate[Op.lte] = date
  }
  if (brandId) {
    whereQuery.brandId = brandId
  }

  const transactions = await db.transaction.findAll({
    where: whereQuery,
    attributes: [
      'transactionType',
      [Sequelize.literal('SUM("amountOfCredits")::integer'), 'numberOfCredits']
    ],
    group: ['transactionType'],
    raw: true
  })

  let numberOfCredits = 0

  transactions.forEach(transaction => {
    if (
      [transactionTypes.BUY, transactionTypes.REFUND].includes(
        transaction.transactionType
      )
    ) {
      numberOfCredits += transaction.numberOfCredits
    } else {
      numberOfCredits -= transaction.numberOfCredits
    }
  })

  res.send({ numberOfCredits })
}

exports.giveFreeCreditsToBrand = async (req, res) => {
  const brands = await db.brand.findAll()

  const transactions = []
  const today = new Date()

  brands.forEach(brand => {
    let numberOfMonth = 0
    if (brand.airdropFreeCreditIssuedDate) {
      numberOfMonth = diffInMonths(today, brand.airdropFreeCreditIssuedDate)
    } else {
      numberOfMonth = diffInMonths(today, brand.startDate)
      brand.airdropFreeCreditIssuedDate = today
    }

    if (numberOfMonth > 0) {
      const transaction = {
        brandId: brand.id,
        stripeCustomerId: null,
        stripeChargeId: null,
        transactionDate: today,
        transactionType: transactionTypes.AIRDROP,
        amountOfCredits: numberOfMonth,
        costPerCredit: 100.0,
        discount: 0.0
      }

      transactions.push(transaction)
    }
  })

  await db.sequelize.transaction(async transaction => {
    for (const brand of brands) {
      await brand.save()
    }

    await db.transaction.bulkCreate(transactions, { transaction })
  })

  res.send(transactions)
}

exports.getTransactions = async (req, res) => {
  const query = getTransactionQuery(req.query)
  const transactions = await db.transaction.findAndCountAll(query)
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
    transactionQuery.transactionDate[Op.lte] = date
  }
  if (action) {
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

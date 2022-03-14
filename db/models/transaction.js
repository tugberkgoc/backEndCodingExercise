const { transactionTypes } = require('../../data/enums')

module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define(
    'transaction',
    {
      brandId: {
        type: DataTypes.STRING(6),
        allowNull: false
      },
      stripeCustomerId: {
        type: DataTypes.STRING
      },
      stripeChargeId: {
        type: DataTypes.STRING
      },
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      transactionType: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      amountOfCredits: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      costPerCredit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false
      },
      discount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false
      },
      totalPrice: {
        type: DataTypes.VIRTUAL,
        get () {
          return this.transactionType === transactionTypes.EXPIRE
            ? this.amountOfCredits * this.costPerCredit
            : this.amountOfCredits *
                this.costPerCredit *
                ((100.0 - this.discount) / 100)
        }
      }
    },
    {
      paranoid: true,
      timestamps: false
    }
  )

  transaction.associate = function (models) {
    transaction.belongsTo(models.brand, {
      foreignKey: 'brandId'
    })
  }

  return transaction
}

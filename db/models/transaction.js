module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define(
    'transaction',
    {
      brandId: {
        type: DataTypes.STRING(6),
        allowNull: false
      },
      stripeCustomerId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      stripeChargeId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      transactionDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      transactionDateYear: {
        type: DataTypes.VIRTUAL,
        get () {
          return new Date(this.startDate).getUTCFullYear()
        }
      },
      transactionDateMonth: {
        type: DataTypes.VIRTUAL,
        get () {
          return new Date(this.startDate).getMonth() + 1
        }
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
      }
    },
    {
      paranoid: true,
      timestamps: false
    }
  )

  transaction.associate = function (models) {}

  return transaction
}

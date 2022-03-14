module.exports = (sequelize, DataTypes) => {
  const brand = sequelize.define(
    'brand',
    {
      id: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        allowNull: false
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      airdropFreeCreditIssuedDate: {
        type: DataTypes.DATE
      }
    },
    {
      paranoid: true,
      timestamps: false
    }
  )

  brand.associate = function (models) {}

  return brand
}

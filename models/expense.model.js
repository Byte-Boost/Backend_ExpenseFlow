module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define("Expense", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("value", "quantity"),
      allowNull: false,
    },
    quantityType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    attachmentRef: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refundId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Expense.associate = function (models) {
    Expense.belongsTo(models.Refund, {
      foreignKey: "refundId",
      onDelete: "CASCADE",
    }),
      Expense.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
  };
  return Expense;
};

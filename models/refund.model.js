module.exports = (sequelize, DataTypes) => {
  const Refund = sequelize.define("Refund", {
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
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("new", "in-process", "approved", "rejected"),
      defaultValue: "new",
      allowNull: false,
    },
  });

  Refund.associate = function(models) {
    Refund.hasMany(models.Expense, {
      foreignKey: 'refundId',
    }),
    Refund.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    }),
    Refund.belongsTo(models.Project, {
      foreignKey: 'projectId',
      onDelete: 'CASCADE'
    })
  };
  
  return Refund;
};

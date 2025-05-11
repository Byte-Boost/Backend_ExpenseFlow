module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
      validate: {
        isEmail: true, 
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  });

  User.associate = function(models) {
    User.hasMany(models.Expense, {
      foreignKey: 'userId',
    }),
    User.hasMany(models.Refund, {
      foreignKey: 'userId',
    }),
    User.belongsToMany(models.Project, {
      through: 'UserProjects',
    });
  };

  return User;
};

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define("Project", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    });

    Project.associate = function(models) {
        Project.hasMany(models.Expense, {
            foreignKey: 'projectId',
        }),
        Project.belongsToMany(models.User, {
            through: 'UserProjects',
        });
    };

    return Project;
};

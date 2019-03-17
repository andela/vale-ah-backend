module.exports = (sequelize, DataTypes) => {
  const RecipeRating = sequelize.define(
    'RecipeRating',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    { freezeTableName: true }
  );
  RecipeRating.associate = models => {
    // associations can be defined here
    const { User, Recipe } = models;
    RecipeRating.belongsTo(User, {
      foreignKey: 'userId',
      target: 'id',
      onDelete: 'CASCADE'
    });

    RecipeRating.belongsTo(Recipe, {
      foreignKey: 'recipeId',
      target: 'id',
      onDelete: 'CASCADE'
    });
  };
  return RecipeRating;
};

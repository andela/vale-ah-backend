module.exports = (sequelize, DataTypes) => {
  const RecipeReaction = sequelize.define(
    'RecipeReaction',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isLike: {
        type: DataTypes.BOOLEAN
      }
    },
    {}
  );
  RecipeReaction.associate = models => {
    // associations can be defined here
    const { User, Recipe } = models;
    RecipeReaction.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    RecipeReaction.belongsTo(Recipe, {
      foreignKey: 'recipeId',
      onDelete: 'CASCADE'
    });
  };
  return RecipeReaction;
};

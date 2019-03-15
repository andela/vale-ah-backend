module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define(
    'Recipe',
    {
      title: {
        type: DataTypes.STRING,
        notNull: true,
        validate: {
          max: 50
        }
      },
      slug: DataTypes.STRING,
      ingredients: DataTypes.ARRAY(DataTypes.STRING),
      steps: DataTypes.JSONB,
      cookingTime: DataTypes.INTEGER,
      preparationTime: DataTypes.INTEGER,
      videoList: DataTypes.ARRAY(DataTypes.STRING)
    },
    {}
  );
  Recipe.associate = models => {
    Recipe.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Recipe;
};

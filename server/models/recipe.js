import { slugifyTitle } from '../utils/helpers';

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
  Recipe.afterCreate(async recipe => {
    const updatedRecipe = await recipe.update(
      { slug: `${recipe.slug}-${recipe.id}` },
      { returning: true }
    );
    Object.assign(recipe, updatedRecipe);
  });

  Recipe.beforeUpdate(async recipe => {
    if (recipe.changed('title')) {
      recipe.slug = await `${slugifyTitle(recipe.title)}-${recipe.id}`;
    }
  });
  Recipe.associate = models => {
    Recipe.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Recipe;
};

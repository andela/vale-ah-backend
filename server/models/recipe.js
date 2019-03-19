import { randomHex, slugifyTitle } from '../utils/helpers';

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

  Recipe.beforeCreate(recipe => {
    recipe.slug = `${slugifyTitle(recipe.title)}-${randomHex().substr(0, 8)}`;
  });

  Recipe.beforeUpdate(recipe => {
    if (recipe.changed('title')) {
      recipe.slug = `${slugifyTitle(recipe.title)}-${randomHex().substr(0, 8)}`;
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

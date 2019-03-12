module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define(
    'Recipe',
    {
      title: DataTypes.STRING,
      slug: DataTypes.STRING,
      ingredients: DataTypes.ARRAY(DataTypes.STRING),
      steps: DataTypes.JSONB,
      cookingTime: DataTypes.INTEGER,
      preparationTime: DataTypes.INTEGER,
      tagList: DataTypes.ARRAY(DataTypes.STRING),
      videoList: DataTypes.STRING
    },
    {}
  );
  Recipe.associate = () => {
    // associations can be defined here
  };
  return Recipe;
};

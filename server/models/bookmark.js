module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define(
    'Bookmark',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  return Bookmark;
};

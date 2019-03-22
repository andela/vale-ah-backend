module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      body: DataTypes.TEXT
    },
    {}
  );
  Comment.associate = models => {
    Comment.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      onDelete: 'SET NULL'
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'SET NULL',
      as: 'author'
    });
  };
  return Comment;
};

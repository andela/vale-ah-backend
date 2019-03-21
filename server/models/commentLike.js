module.exports = (sequelize, DataTypes) => {
  const CommentLike = sequelize.define(
    'CommentLike',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  CommentLike.associate = models => {
    const { User, Comment } = models;

    CommentLike.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    CommentLike.belongsTo(Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
  };
  return CommentLike;
};

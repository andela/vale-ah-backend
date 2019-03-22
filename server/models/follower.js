export default (sequelize, DataTypes) => {
  const Follower = sequelize.define(
    'Follower',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      }
    },
    {}
  );

  Follower.associate = models => {
    Follower.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Follower;
};

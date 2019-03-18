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
  return Follower;
};

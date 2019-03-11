module.exports = (sequelize, DataTypes) => {
  const Follower = sequelize.define(
    'Follower',
    {
      followerId: DataTypes.INTEGER,
      followingId: DataTypes.INTEGER
    },
    {}
  );
  Follower.associate = () => {
    // associations can be defined here
  };
  return Follower;
};

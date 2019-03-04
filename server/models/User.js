

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    bio: DataTypes.STRING,
    image: DataTypes.STRING,
    favorites: DataTypes.STRING,
    following: DataTypes.STRING,
    hash: DataTypes.STRING
  });
  User.associate = (models) => {
    // associations can be defined here
  };
  return User;
};

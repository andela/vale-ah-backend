import { hashPassword } from '../utils/helpers';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          len: {
            args: [3, 20],
            msg: '"username" length must be between 3 and 20 characters long'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: { msg: '"email" must be a valid email' } }
      },
      hash: { type: DataTypes.STRING, allowNull: false },
      bio: DataTypes.TEXT,
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      image: {
        type: DataTypes.STRING,
        validate: { isUrl: { msg: '"image" must be a valid URL' } }
      }
    },
    {}
  );
  User.beforeValidate(user => {
    user.hash = hashPassword(user.hash);
  });
  User.associate = () => {
    // associations can be defined here
  };
  return User;
};

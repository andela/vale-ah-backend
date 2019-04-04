import { hashPassword } from '../utils/helpers';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
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
      hash: { type: DataTypes.STRING, allowNull: true },
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
  User.beforeCreate(user => {
    if (user.changed('hash')) {
      user.hash = hashPassword(user.get('hash'));
    }
  });

  User.beforeUpdate(user => {
    if (user.changed('hash')) {
      user.hash = hashPassword(user.get('hash'));
    }
  });

  User.associate = models => {
    User.hasMany(models.Recipe, {
      foreignKey: 'userId',
      as: 'recipe'
    });

    User.belongsToMany(models.User, {
      through: models.Follower,
      foreignKey: 'userId',
      as: 'followers'
    });

    User.belongsToMany(User, {
      through: models.Follower,
      foreignKey: 'followerId',
      as: 'following'
    });

    User.hasMany(models.Follower, {
      foreignKey: 'userId'
    });

    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'comments'
    });
  };
  return User;
};

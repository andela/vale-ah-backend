import debug from 'debug';
import { hashPassword, generateToken, generateVerificationLink } from '../utils/helpers';
import mailer from '../utils/mailer';

const mailLogger = debug('vale-ah::mailLogger');


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

  User.associate = () => {
    // associations can be defined here
  };

  User.afterCreate(({ id, email }) => {
    const token = generateToken(id);
    mailer.sendVerificationMail(email, generateVerificationLink(token)).then(() => {
      mailLogger(`Email sent to ${email}`);
    });
  });
  return User;
};

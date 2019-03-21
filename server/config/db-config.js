import env from './env-config';

const { DATABASE_URL } = env;

module.exports = {
  development: {
    env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    operatorsAliases: false,
    url: DATABASE_URL
  },
  test: {
    env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    operatorsAliases: false,
    url: DATABASE_URL
  },
  production: {
    env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    operatorsAliases: false,
    url: DATABASE_URL,
    logging: false
  }
};

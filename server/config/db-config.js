module.exports = {
  development: {
    env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    operatorsAliases: false
  },
  test: {
    env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    operatorsAliases: false
  },
  production: {
    env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    operatorsAliases: false,
    logging: false
  }
};

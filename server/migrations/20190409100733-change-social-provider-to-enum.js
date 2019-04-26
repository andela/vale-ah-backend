module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize
      .query('drop type if exists "enum_Users_socialProvider" cascade')
      .then(() =>
        queryInterface.addColumn('Users', 'socialProvider', {
          type: Sequelize.ENUM(['facebook', 'google', 'twitter'])
        })
      ),
  down: queryInterface => queryInterface.removeColumn('Users', 'socialProvider')
};

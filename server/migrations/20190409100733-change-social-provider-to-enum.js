module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.changeColumn('Users', 'socialProvider', {
      type: Sequelize.ENUM(['facebook', 'google', 'twitter'])
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.changeColumn('Users', 'socialProvider', {
      type: Sequelize.STRING
    })
};

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Recipes', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }),
  down: queryInterface => queryInterface.removeColumn('Recipes', 'userId')
};

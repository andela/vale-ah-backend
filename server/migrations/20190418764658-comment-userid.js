module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Comments', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }),
  down: queryInterface => queryInterface.removeColumn('Comments', 'userId')
};

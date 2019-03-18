module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Recipes', 'tags', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    }),
  down: queryInterface => queryInterface.removeColumn('Recipes', 'tags')
};

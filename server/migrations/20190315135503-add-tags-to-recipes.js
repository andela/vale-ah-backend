module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Recipes', 'tags', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('Recipes', 'tags');
  }
};

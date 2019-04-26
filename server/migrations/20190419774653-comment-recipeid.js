module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Comments', 'recipeId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Recipes',
        key: 'id'
      }
    }),
  down: queryInterface => queryInterface.removeColumn('Comments', 'recipeId')
};

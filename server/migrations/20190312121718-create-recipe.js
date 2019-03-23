module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Recipes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      slug: {
        type: Sequelize.STRING
      },
      ingredients: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      steps: {
        type: Sequelize.JSONB
      },
      cookingTime: {
        type: Sequelize.INTEGER
      },
      preparationTime: {
        type: Sequelize.INTEGER
      },
      videoList: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: queryInterface => queryInterface.dropTable('Recipes')
};

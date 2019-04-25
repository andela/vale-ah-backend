module.exports = {
  up: queryInterface =>
    queryInterface.renameColumn('Followers', 'followingId', 'userId'),

  down: queryInterface =>
    queryInterface.renameColumn('Followers', 'userId', 'followingId')
};

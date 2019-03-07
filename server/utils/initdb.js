import db from '../models';

db.sequelize.sync().then(() => {
  db.sequelize.close();
});

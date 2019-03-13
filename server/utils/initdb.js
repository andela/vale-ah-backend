import db from '../models';
import env from '../config/env-config';

const syncOptions = env.NODE_ENV === 'test' ? { force: true } : {};

db.sequelize.sync(syncOptions).then(() => {
  db.sequelize.close();
});

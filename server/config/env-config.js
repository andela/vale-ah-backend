import dotenv from 'dotenv';

dotenv.config();
const { env } = process;
const {
  DATABASE_URL,
  NODE_ENV,
  PORT,
  SECRET,
  SENDGRID_KEY,
  ADMIN_EMAIL,
  SITE_NAME,
  HEROKU_APP_NAME
} = env;

export default {
  DATABASE_URL,
  NODE_ENV,
  PORT,
  SECRET,
  SENDGRID_KEY,
  ADMIN_EMAIL,
  SITE_NAME,
  HEROKU_APP_NAME
};

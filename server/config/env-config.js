import dotenv from 'dotenv';

dotenv.config();
const { env } = process;
const {
  DATABASE_URL,
  NODE_ENV,
  PORT,
} = env;

export default {
  DATABASE_URL,
  NODE_ENV,
  PORT,
};

import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import debug from 'debug';
import passport from 'passport';
import session from 'express-session';
import env from './config/env-config';
import routes from './routes/index';

const app = express();
const logger = debug('vale-ah::server: ');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use(
  session({
    secret: 'authorshaven',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

routes(app);

app.listen(env.PORT, () => {
  logger(`Listening on port ${env.PORT}`);
});

export default app;

import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import debug from 'debug';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
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

app.use(routes);

const server = app.listen(process.env.PORT || 3000, () => {
  logger(`Listening on port ${server.address().port}`);
});

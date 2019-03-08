import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import debug from 'debug';
import passport from 'passport';
import session from 'express-session';
import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import env from './config/env-config';
import routes from './routes/index';
// import storage from './config/cloudinary';

const app = express();
const logger = debug('vale-ah::server: ');

// app.use(multer({ storage }).single('image'));
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary,
  allowedFormats: [
    'jpg',
    'svg',
    'png',
    'jpeg',
    'gif',
    'avi',
    'flv',
    'mpeg',
    '3gp',
    'mp4',
    'webm'
  ],
  params: {
    resource_type: 'auto',
    folder: 'iReporter/media'
  }
});

app.use(multer({ storage }).single('image'));

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

import { Router } from 'express';
import db from '../models';

const router = new Router();

const { User } = db;

const decodeVerificationToken = (req, res, next) => {
  const { token } = req.params;
  req.decodedId = decodeToken(token);
  next();
};

router.get('/api/verify/:token', decodeVerificationToken, ({ decodedId }, res) => {
  User.findById(decodedId).then((user) => {
    User.update({ verified: true }, { where: { id: decodedId } }).then(updateResponse => console.log(updateResponse));
  });
});

export default router;


User.afterCreate((instance) => {
  const token = tokenGen({ id: instance.id });
  const verificationLink = generateVerificationLink(token);
  mailer.sendVerificationMail(instance.email, verificationLink);
});
const generateVerificationLink = token => `${HOST_URL}/api/verify/${token}`;

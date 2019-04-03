import { Router } from 'express';
import passport from 'passport';
import debug from 'debug';

const router = new Router();

const logger = debug('vale-ah::socialAuth: ');

router.get(
  '/login/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
router.get(
  '/facebook/callback',
  passport.authenticate('facebook'),
  (req, res) => {
    logger(req.user);
    res.redirect('/');
  }
);

router.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  logger(req.user);
  res.redirect('/');
});

export default router;

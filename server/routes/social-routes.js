import { Router } from 'express';
import passport from 'passport';
import authUser from '../controllers/social-controller';

const router = new Router();

router.get(
  '/login/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
router.get('/facebook/callback', passport.authenticate('facebook'), authUser);

router.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback', passport.authenticate('google'), authUser);

router.get(
  '/login/twitter',
  passport.authenticate('twitter', {
    scope: ['include_email=true', 'include_entities=false']
  })
);
router.get('/twitter/callback', passport.authenticate('twitter'), authUser);

export default router;

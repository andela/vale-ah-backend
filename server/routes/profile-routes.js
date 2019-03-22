import { Router } from 'express';
import User from '../middlewares/users-middleware';
import profileController from '../controllers/profile-controller';
import followcontroller from '../controllers/follow-controller';

const router = new Router();
router.get('/', User.validUser, profileController.getAll);
router.get('/:username', User.validUser, profileController.getProfile);
router.post('/:username/follow', User.validUser, followcontroller.followUser);
router.delete(
  '/:username/follow',
  User.validUser,
  followcontroller.unfollowUser
);
export default router;

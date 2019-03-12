import { Router } from 'express';
import User from '../middlewares/index';
import controller from '../controllers/follow-controller';

const router = new Router();
router.post('/:username/follow', User.validUser, controller.followUser);
router.get('/followers', User.validUser, controller.fetchFollowers);
router.get('/following', User.validUser, controller.fetchFollowing);
router.delete('/:username/follow', User.validUser, controller.unfollowUser);

export default router;

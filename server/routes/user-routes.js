import { Router } from 'express';
import User from '../middlewares/users-middleware';
import userController from '../controllers/user-controller';
import followController from '../controllers/follow-controller';

const router = new Router();

router.put('/', User.validUser, userController.updateUser);
router.get('/', User.validUser, userController.getProfile);
router.get('/followers', User.validUser, followController.fetchFollowers);
router.get('/following', User.validUser, followController.fetchFollowing);

export default router;

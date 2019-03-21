import { Router } from 'express';
import User from '../middlewares/users-middleware';
import userController from '../controllers/user-controller';
import followController from '../controllers/follow-controller';
import bookmark from '../controllers/bookmark-controller';

const router = new Router();

router.put('/password', User.validUser, userController.updatePassword);
router.put('/', User.validUser, userController.updateUser);
router.get('/', User.validUser, userController.getProfile);
router.get('/followers', User.validUser, followController.fetchFollowers);
router.get('/following', User.validUser, followController.fetchFollowing);
router.post('/:slug/bookmark', User.validUser, bookmark.createBookmark);

export default router;

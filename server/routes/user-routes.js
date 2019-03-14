import { Router } from 'express';
import User from '../middleware/users-middleware';
import controller from '../controllers/user-controller';

const router = new Router();

router.put('/', User.validUser, controller.updateUser);
router.get('/', User.validUser, controller.getProfile);
router.put('/password', User.validUser, controller.updatePassword);

export default router;

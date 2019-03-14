import { Router } from 'express';
import User from '../middleware/users-middleware';
import controller from '../controllers/profile-controller';

const router = new Router();
router.get('/', User.validUser, controller.getAll);
router.get('/:username', User.validUser, controller.getProfile);

export default router;

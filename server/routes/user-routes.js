import { Router } from 'express';
import User from '../middlewares/index';
import UsersController from '../controllers/user-controller';

const router = new Router();

router.put('/', User.verifyToken, UsersController.updateUser);
router.get('/', User.verifyToken, UsersController.getProfile);
export default router;

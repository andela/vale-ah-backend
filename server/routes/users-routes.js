import { Router } from 'express';
import UsersMiddleware from '../middlewares/users-middleware';
import UsersController from '../controllers/users-controller';

const router = new Router();

router.post('/', UsersMiddleware.validateRegister, UsersController.register);

export default router;

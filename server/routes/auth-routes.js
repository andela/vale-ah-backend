import { Router } from 'express';
import controller from '../controllers/auth-controller';

const router = new Router();

router.post('/', controller.register);
router.post('/login', controller.login);

export default router;

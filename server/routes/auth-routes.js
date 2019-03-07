import { Router } from 'express';
import controller from '../controllers/auth-controller';

const router = new Router();

router.post('/', controller.register);

export default router;

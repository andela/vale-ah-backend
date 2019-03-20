import { Router } from 'express';
import controller from '../controllers/auth-controller';

const router = new Router();

router.post('/', controller.register);
router.post('/login', controller.login);
router.get('/verify', controller.verifyEmail);
router.post('/reset-password/email', controller.sendResetEmail);
router.post('/reset-password', controller.changePassword);

export default router;

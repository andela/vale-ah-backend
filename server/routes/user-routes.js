import { Router } from 'express';
// import multer from 'multer';
import User from '../middlewares/index';
import userController from '../controllers/user-controller';

const router = new Router();

// const upload = multer({ dest: 'public/uploads/' });

router.post('/', User.verifyToken, userController.updateUser);

export default router;

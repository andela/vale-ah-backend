import { Router } from 'express';
// import multer from 'multer';
import User from '../middlewares/index';
// import userController from '../controllers/user-controller';
import UsersController from '../controllers/user-controller';

const router = new Router();

// const upload = multer({ dest: 'public/uploads/' });

router.put('/', User.verifyToken, UsersController.updateUser);
router.get('/', User.verifyToken, UsersController.getProfile);
export default router;

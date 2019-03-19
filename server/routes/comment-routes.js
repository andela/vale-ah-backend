import { Router } from 'express';
import CommentController from '../controllers/comment-controller';
import User from '../middleware/users-middleware';

const router = Router();

router.post('/comments', User.validUser, CommentController.create);
export default router;

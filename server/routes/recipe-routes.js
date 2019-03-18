import { Router } from 'express';
import RecipeController from '../controllers/recipe-controller';
import User from '../middleware/users-middleware';

const router = Router();

router.post('/', User.validUser, RecipeController.create);

export default router;

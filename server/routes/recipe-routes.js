import { Router } from 'express';
import RecipeController from '../controllers/recipe-controller';
import User from '../middlewares/index';

const router = Router();

router.post('/', User.validUser, RecipeController.create);

export default router;

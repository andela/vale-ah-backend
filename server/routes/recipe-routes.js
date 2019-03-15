import { Router } from 'express';
import RecipeController from '../controllers/recipe-controller';
import User from '../middleware/users-middleware';

const router = Router();

router.post('/', User.validUser, RecipeController.create);
router.put('/:slug', User.validUser, RecipeController.updateRecipe);
router.delete('/:slug', User.validUser, RecipeController.deleteRecipe);

export default router;

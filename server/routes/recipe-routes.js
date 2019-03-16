import { Router } from 'express';
import controller from '../controllers/recipe-controller';
import User from '../middlewares/users-middleware';

const router = Router();

router.post('/', User.validUser, controller.create);
router.get('/', controller.getRecipes);
router.get('/:slug:', controller.getRecipeBySlug);
router.put('/:slug', User.validUser, controller.updateRecipe);
router.delete('/:slug', User.validUser, controller.deleteRecipe);

export default router;

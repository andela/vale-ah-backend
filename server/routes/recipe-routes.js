import { Router } from 'express';
import controller from '../controllers/recipe-controller';
import UsersMiddleware from '../middlewares/users-middleware';
import { loadRecipe, isRecipeOwner } from '../middlewares/recipe-middleware';

const router = Router();

router.post('/', UsersMiddleware.validUser, controller.create);
router.put(
  '/:slug/tags',
  UsersMiddleware.validUser,
  loadRecipe,
  isRecipeOwner,
  controller.tag
);

export default router;

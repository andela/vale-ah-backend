import { Router } from 'express';
import controller from '../controllers/recipe-controller';
import User from '../middlewares/users-middleware';
import RecipeReactionController from '../controllers/recipe-reaction-controller';
import CommentController from '../controllers/comment-controller';

const router = Router();

router.post('/', User.validUser, controller.create);
router.get('/', controller.getRecipes);
router.get('/:slug', controller.getRecipeBySlug);
router.post('/:slug/comments', User.validUser, CommentController.create);
router.get('/:slug/comments', CommentController.getAllComments);
router.put('/:slug', User.validUser, controller.updateRecipe);
router.delete('/:slug', User.validUser, controller.deleteRecipe);

// Recipe Rating
router.post('/:slug/rating', User.validUser, RecipeReactionController.rating);

export default router;

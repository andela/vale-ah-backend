import { Router } from 'express';
import User from '../middlewares/users-middleware';
import CommentController from '../controllers/comment-controller';
import RecipeReactionController from '../controllers/recipe-reaction-controller';
import controller from '../controllers/recipe-controller';

const router = Router();

router.post('/', User.validUser, controller.create);
router.get('/', controller.getRecipes);
router.get('/:slug', controller.getRecipeBySlug);
router.post('/:slug/comments', User.validUser, CommentController.create);
router.get('/:slug/comments', CommentController.getAllComments);
router.put('/:slug', User.validUser, controller.updateRecipe);
router.delete('/:slug', User.validUser, controller.deleteRecipe);

// Recipe clap
router.post('/:slug/like', User.validUser, RecipeReactionController.likeRecipe);
router.post(
  '/:slug/dislike',
  User.validUser,
  RecipeReactionController.dislikeRecipe
);
router.get(
  '/:slug/dislike',
  User.validUser,
  RecipeReactionController.fetchAllRecipeDislike
);
router.get(
  '/:slug/like',
  User.validUser,
  RecipeReactionController.fetchAllRecipeLike
);

export default router;

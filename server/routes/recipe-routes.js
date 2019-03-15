import { Router } from 'express';
import controller from '../controllers/recipe-controller';
import UsersMiddleware from '../middlewares';

const router = Router();

router.post('/', UsersMiddleware.validUser, controller.create);
router.post('/:slug/tags', UsersMiddleware.validUser, controller.tagRecipe);

export default router;

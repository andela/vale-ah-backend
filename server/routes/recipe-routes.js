import { Router } from 'express';
import RecipeController from '../controllers/recipe-controller';

const router = Router();

router.post('/', RecipeController.create);

export default router;

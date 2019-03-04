import { Router } from 'express';
import { serve, setup } from 'swagger-ui-express';
import apiSpec from '../../swagger.json';

const router = Router();


router.use('/api-docs', serve, setup(apiSpec));

router.get('/api', (req, res) => res.status(200).json({
  status: 200,
  message: 'Welcome to Author Haven'
}));

router.all('/*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'This is an invalid route. Please see proper documentation'
  });
});

export default router;

import { serve, setup } from 'swagger-ui-express';
import apiSpec from '../../swagger.json';
import authRoutes from './auth-routes';
import { errorResponse } from '../utils/helpers';

const router = app => {
  app.use('/api-docs', serve, setup(apiSpec));
  app.use('/api/users', authRoutes);
  app.use('*', (req, res) =>
    errorResponse(res, 'The requested resource was not found', 404)
  );
};


export default router;

import { serve, setup } from 'swagger-ui-express';
import apiSpec from '../../swagger.json';
import usersRoutes from './users-routes';
import { errorResponse } from '../utils/helpers';


const router = (app) => {
  app.use('/api-docs', serve, setup(apiSpec));
  app.use('/api/users', usersRoutes);
  app.use('*', (req, res) => errorResponse(res, 'The requested resource was not found', 404));
};

export default router;

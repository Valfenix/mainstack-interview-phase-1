import { Express } from 'express';
import products from '../routes/products.route';

export const bindUserRoutes = (app: Express): void => {
  app.use('/api/products', products);
};

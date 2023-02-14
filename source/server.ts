import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fileUpload from 'express-fileupload';
import ResponseHandler from './util/response-handler';
import Logger from './util/logger';
import { Namespaces } from './constants/namespace.constant';
import { IProductsDocument } from './interfaces/products.interface';

export interface ExpressRequest extends Request {
  product?: IProductsDocument;
}

export const createApp = (name = 'Mainstack', bindRoutes: (app: Express) => void): Express => {
  const app = express();
  const logger = new Logger('general', Namespaces.SERVER);

  app.use(cors());

  /** Log the request */
  app.use((req: Request, res: Response, next: NextFunction) => {
    /** Log the req */
    logger.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
      /** Log the res */
      logger.info(
        `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
      );
    });

    next();
  });

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(express.json({ limit: '5mb' }));
  app.use(fileUpload());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(__dirname));
  app.disable('x-powered-by');

  bindRoutes(app);

  app.get('/', async (req: Request, res: Response) => {
    res.json({
      message: `Welcome to ${name}`,
      success: true,
    });
  });

  /**
   *
   * 404 - Not Found Error Handler
   *
   */
  app.use((req, res: Response) => {
    logger.error(`Requested route not found | PATH: [${req.url}]`);
    return ResponseHandler.sendErrorResponse({
      res,
      code: 404,
      error: 'Requested route not found',
    });
  });

  return app;
};

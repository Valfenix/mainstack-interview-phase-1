import { createApp } from '../server';
import { validateEnv } from '../config/env.config';
import { USER_PORT } from '../config/env.config';
import { bindUserRoutes } from '../util/useRoutes';
import Logger from '../util/logger';
import { initDatabase } from '../util/mongo';
import { Namespaces } from '../constants/namespace.constant';

const logger = new Logger('general', Namespaces.USER_SERVER);

const name = 'Mainstack E-commerce ';

const init = () => createApp(name, bindUserRoutes);

(async () => {
  validateEnv();

  initDatabase();

  init().listen(process.env.PORT || USER_PORT, () => {
    logger.info(`E-commerce Server started successfully on ${USER_PORT}`);
  });
})();

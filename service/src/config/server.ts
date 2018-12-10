import * as path from 'path';
import { Application, static as st } from 'express';
import * as morgan from 'morgan';
import logger from '../components/logger';
import { IAPIConfig } from '../types';

export function configureServer(app: Application, apiConfig: IAPIConfig) {
  app.use(
    morgan('tiny', {
      stream: {
        write: (message: string) => {
          // remove extra new line
          logger.info('[API]', message.replace('\n', ''));
        }
      }
    })
  );
  // client app
  app.use('/', st(path.resolve('public')));
  // auto-generated docs
  app.use(
    `/api/${apiConfig.version}/${apiConfig.endpoints.docs}`,
    (req, res) => {
      res.sendFile(path.resolve('redoc-static.html'));
    }
  );
}

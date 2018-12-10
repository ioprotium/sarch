import * as express from 'express';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as firebase from 'firebase-admin';
import * as bodyParser from 'body-parser';
import * as config from 'config';
import { AccountsRouter } from './api';
import { checkUserAuth } from './business/auth';
import logger from './components/logger';
import { IAPIConfig, IFirebaseConfig } from './types';
import { getAccountsRepository } from './data/factory';

import { configureServer } from './config/server';

class App {
  public app: express.Application;
  private apiConfig: IAPIConfig;
  private readonly TAG = '[App]';
  private firebaseConfig: IFirebaseConfig;
  private firebaseApp: firebase.app.App;
  private accountRouter: AccountsRouter;

  constructor() {
    logger.info(
      this.TAG,
      `Initializing App. Node Env: "${process.env.NODE_ENV}"`
    );
    this.apiConfig = config.get<IAPIConfig>('api');
    this.firebaseConfig = config.get<IFirebaseConfig>('firebase');
    this.initializeFirebase();

    this.app = express();
    this.accountRouter = new AccountsRouter(
      getAccountsRepository(this.firebaseApp)
    );
    this.configExpress();
  }

  private initializeFirebase() {
    try {
      const firebaseConfig = config.get<IFirebaseConfig>('firebase');
      this.firebaseApp = firebase.initializeApp({
        credential: firebase.credential.cert({
          clientEmail: firebaseConfig.clientEmail,
          projectId: firebaseConfig.projectId,
          privateKey: firebaseConfig.privateKey
        }),
        databaseURL: firebaseConfig.baseUrl
      });
      logger.info(this.TAG, 'Firebase App initialized');
    } catch (error) {
      error.message = 'Error initializing Firebase App: ' + error.message;
      logger.error(this.TAG, error.message);
      throw error;
    }
  }

  private configExpress(): void {
    this.app.all('/*', function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header(
        'Access-Control-Allow-Headers',
        'Content-type,Accept,X-Access-Token,X-Key'
      );
      if (req.method == 'OPTIONS') {
        res.status(200).end();
      } else {
        next();
      }
    });
    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    configureServer(this.app, this.apiConfig);
    this.app.use('/api/', checkUserAuth(this.firebaseApp.auth()));
    this.app.use(
      '/api/',
      new rateLimit({
        windowMs: 5 * 60 * 1000,
        max: 100
      })
    );

    this.app.use(
      `/api/${this.apiConfig.version}/${this.apiConfig.endpoints.accounts}`,
      this.accountRouter.routes
    );
  }
}

export default new App().app;

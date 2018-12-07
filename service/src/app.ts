import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as appConfig from 'config';
import { AccountsRouter } from './api';
import { IAPIConfig } from './types';
import { getAccountsRepository } from './middleware/setup';

class App {
  public app: express.Application;
  public config = appConfig;

  private accountRouter: AccountsRouter;

  constructor() {
    this.app = express();
    this.accountRouter = new AccountsRouter(getAccountsRepository());
    this.configExpress();
  }

  private configExpress(): void {
    const apiConfig = this.config.get<IAPIConfig>('api');
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(
      `/api/${apiConfig.version}/${apiConfig.endpoints.accounts}`,
      this.accountRouter.routes
    );
  }
}

export default new App().app;

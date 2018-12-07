import { Router } from 'express';
import AccountsController from './Accounts.controller';
import { validateAccount } from './Accounts.validators';
import { IAccountsRepository } from 'data';

export class AccountsRouter {
  private controller: AccountsController;
  public routes: Router;

  constructor(dbAdapter: IAccountsRepository) {
    this.controller = new AccountsController(dbAdapter);
    this.routes = Router();
    this.routes
      .route('/')
      .get(this.controller.listAccounts.bind(this.controller))
      .post(
        validateAccount,
        this.controller.createAccount.bind(this.controller)
      );

    this.routes
      .route('/:accountId')
      .get(this.controller.getAccountById.bind(this.controller))
      .put(validateAccount, this.controller.updateAccount.bind(this.controller))
      .delete(this.controller.deleteAccountById.bind(this.controller));
  }
}

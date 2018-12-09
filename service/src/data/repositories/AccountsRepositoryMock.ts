import { find } from 'lodash';
import { AccountModel } from '../../api';
import IAccountsRepository from './IAccountsRepository';

export default class AccountsRepositoryMock implements IAccountsRepository {
  private readonly db: AccountModel[] = [];
  updateAccount(account: AccountModel): Promise<AccountModel> {
    const saved = find(this.db, { id: account.id });
    if (!saved) {
      throw {
        status: 404,
        message: 'Account not found'
      };
    }

    saved.email = account.email;
    return Promise.resolve(saved);
  }

  async addAccount(account: AccountModel): Promise<AccountModel> {
    const exists = await this.getAccountByEmail(account.email);
    if (exists) {
      throw {
        status: 409,
        message: 'Account already exists'
      };
    }

    this.db.push(account);
    return Promise.resolve(account);
  }
  getAccounts(): Promise<AccountModel[]> {
    return Promise.resolve(this.db);
  }
  getAccountByEmail(email: string): Promise<AccountModel> {
    const account = find(this.db, { email });
    return Promise.resolve(account);
  }
  getAccountById(id: string): Promise<AccountModel> {
    const account = find(this.db, { id });
    if (!account) {
      throw {
        status: 404,
        message: 'Account not found'
      };
    }
    return Promise.resolve(account);
  }
  deleteAccountById(id: string): Promise<void> {
    const index = this.db.findIndex(a => a.id === id);
    this.db.splice(index, 1);
    return Promise.resolve();
  }
}

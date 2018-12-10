import * as config from 'config';
import { database } from 'firebase-admin';
import { v1 } from 'uuid';
import { find } from 'lodash';
import logger from '../../components/logger';
import IAccountsRepository from './IAccountsRepository';
import { IAPIEndPoints } from '../../types';
import { AccountModel } from '../../api/';

class AccountsFirebaseDBRepository implements IAccountsRepository {
  private readonly TAG = '[Firebase DB] ';
  private endpoints: IAPIEndPoints;
  private db: database.Database;
  // private accountsRef: admin.database.Reference

  constructor(fireDB: database.Database) {
    this.endpoints = config.get<IAPIEndPoints>('api.endpoints');
    this.db = fireDB;
  }

  public async getAccounts(): Promise<AccountModel[]> {
    try {
      const accountsRef = this.db.ref(this.endpoints.accounts);
      const snap = await accountsRef.once('value');
      let result: AccountModel[] = [];
      snap.forEach(s => {
        result.push({ id: s.key, email: s.val().email });
      });

      return result;
    } catch (error) {
      logger.error(this.TAG, error.message);
      error.status = 500;
      throw error;
    }
  }

  public async getAccountByEmail(email: string): Promise<AccountModel> {
    try {
      const all = await this.getAccounts();
      const account = find<AccountModel>(all, { email });
      return account;
    } catch (error) {
      logger.error(this.TAG, error.message);
      error.status = 500;
      throw error;
    }
  }

  public async getAccountById(id: string): Promise<AccountModel> {
    const ref = this.db.ref(`${this.endpoints.accounts}/${id}`);
    const account = await ref.once('value');
    if (!account.val()) {
      throw {
        message: `Account with id "${id}" does not exist.`,
        status: 404
      };
    }

    return { id: account.key, email: account.val() };
  }

  public async addAccount(account: AccountModel): Promise<AccountModel> {
    const checkAccount = await this.getAccountByEmail(account.email);
    if (checkAccount) {
      throw {
        message: `Account with email "${account.email}" already exists.`,
        status: 409
      };
    }

    // we could generate id with ref.push()
    account.id = v1();
    return await this._saveAccount(account);
  }

  public async updateAccount(account: AccountModel): Promise<AccountModel> {
    const savedAccount = await this.getAccountById(account.id);
    savedAccount.email = account.email;
    return await this._saveAccount(savedAccount, true);
  }

  public async deleteAccountById(id: string): Promise<void> {
    try {
      const ref = this.db.ref(`${this.endpoints.accounts}/${id}`);
      await ref.remove();
    } catch (error) {
      logger.error(this.TAG, `Deleting account ${id}: ${error.message}`);
      error.status = 500;
      throw error;
    }
  }

  private async _saveAccount(
    account: AccountModel,
    update: boolean = false
  ): Promise<AccountModel> {
    try {
      const ref = this.db.ref(`${this.endpoints.accounts}/${account.id}`);

      if (update) {
        await ref.update({ email: account.email });
      } else {
        await ref.set({ email: account.email });
      }
      return account;
    } catch (error) {
      logger.error(this.TAG, error.message);
      error.status = 500;
      throw error;
    }
  }
}

export default AccountsFirebaseDBRepository;

import * as admin from 'firebase-admin';
import * as config from 'config';
import { v1 } from 'uuid';
import { find } from 'lodash';
import IAccountsRepository from './IAccountsRepository';
import { IFirebaseConfig, IAPIEndPoints } from 'types';
import AccountModel from 'api/accounts/Accounts.model';

class AccountsFirebaseDBRepository implements IAccountsRepository {
  private static instance: any;
  private firebase: admin.app.App;
  private endpoints: IAPIEndPoints;
  // private accountsRef: admin.database.Reference

  constructor() {
    this.endpoints = config.get<IAPIEndPoints>('api.endpoints');
  }

  public static get Instance(): AccountsFirebaseDBRepository {
    if (!this.instance) {
      this.instance = new AccountsFirebaseDBRepository();
    }

    return this.instance;
  }

  public connect(): void {
    try {
      const firebaseConfig = config.get<IFirebaseConfig>('firebase');
      this.firebase = admin.initializeApp({
        credential: admin.credential.cert({
          clientEmail: firebaseConfig.clientEmail,
          projectId: firebaseConfig.projectId,
          privateKey: firebaseConfig.privateKey
        }),
        databaseURL: firebaseConfig.baseUrl
      });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  public async getAccounts(): Promise<AccountModel[]> {
    try {
      const accountsRef = this.firebase
        .database()
        .ref(this.endpoints.accounts)
        .orderByKey();
      const snap = await accountsRef.once('value');
      const result: AccountModel[] = [];

      this.getAccountByEmail('asa');
      snap.forEach(s => {
        result.push({ id: s.key, email: s.val().email });
      });
      return result;
    } catch (error) {
      console.log(error);
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
      console.log(error);
      error.status = 500;
      throw error;
    }
  }

  public async getAccountById(id: string): Promise<AccountModel> {
    const ref = this.firebase
      .database()
      .ref(`${this.endpoints.accounts}/${id}`);
    const account = await ref.once('value');
    if (!account.val()) {
      throw {
        message: `Account with id "${id}" does not exist.`,
        status: 404
      };
    }

    return { id: account.key, email: account.val() };
  }

  public async saveAccount(account: AccountModel): Promise<AccountModel> {
    const checkAccount = await this.getAccountByEmail(account.email);
    if (checkAccount) {
      throw {
        message: `Account with email "${account.email}" already exists.`,
        status: 409
      };
    }

    // we can get an auto generated id with ref.push()
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
      const ref = this.firebase
        .database()
        .ref(`${this.endpoints.accounts}/${id}`);
      await ref.remove();
    } catch (error) {
      console.log('delete', error);
      error.status = 500;
      throw error;
    }
  }

  private async _saveAccount(
    account: AccountModel,
    update: boolean = false
  ): Promise<AccountModel> {
    try {
      const ref = this.firebase
        .database()
        .ref(`${this.endpoints.accounts}/${account.id}`);

      if (update) {
        await ref.update({ email: account.email });
      } else {
        await ref.set({ email: account.email });
      }
      return account;
    } catch (error) {
      console.log('_save', error);
      error.status = 500;
      throw error;
    }
  }
}

let Repository = AccountsFirebaseDBRepository.Instance;
Repository.connect();

export default Repository;

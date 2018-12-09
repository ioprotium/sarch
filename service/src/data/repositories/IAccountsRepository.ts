import AccountModel from 'api/accounts/model';

export default interface IAccountsRepository {
  updateAccount(account: AccountModel): Promise<AccountModel>;
  addAccount(account: AccountModel): Promise<AccountModel>;
  getAccounts(): Promise<AccountModel[]>;
  getAccountByEmail(email: string): Promise<AccountModel>;
  getAccountById(id: string): Promise<AccountModel>;
  deleteAccountById(id: string): Promise<void>;
}

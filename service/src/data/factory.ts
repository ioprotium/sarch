import { app } from 'firebase-admin';
import AccountsRepositoryMock from './repositories/AccountsRepositoryMock';
import { IAccountsRepository, AccountsFirebaseDBRepository } from './index';

export function getAccountsRepository(
  firebaseApp: app.App
): IAccountsRepository {
  if (process.env.NODE_ENV === 'test') {
    return new AccountsRepositoryMock();
  }
  return new AccountsFirebaseDBRepository(firebaseApp.database());
}

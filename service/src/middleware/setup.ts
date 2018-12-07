import { IAccountsRepository, AccountsFirebaseDBRepository } from '../data';

export function getAccountsRepository(): IAccountsRepository {
  return AccountsFirebaseDBRepository;
}

import { Request, Response } from 'express';
import { IAccountsRepository } from '../../data/';
import AccountModel from './Accounts.model';

export default class AccountsController {
  private dbAdapter: IAccountsRepository;

  constructor(dbAdapter: IAccountsRepository) {
    this.dbAdapter = dbAdapter;
  }

  public async listAccounts(req: Request, res: Response) {
    try {
      const accounts = await this.dbAdapter.getAccounts();
      res.status(200).json(accounts);
    } catch (error) {
      res.status(error.status || 500).send(error.message);
    }
  }

  public async createAccount(req: Request, res: Response) {
    try {
      const account = req.body as AccountModel;
      const newAccount = await this.dbAdapter.saveAccount(account);
      res.status(201).json(newAccount);
    } catch (error) {
      res.status(error.status || 500).send(error.message);
    }
  }

  public async updateAccount(req: Request, res: Response) {
    try {
      const account = req.body as AccountModel;
      account.id = req.params.accountId;
      const updated = await this.dbAdapter.updateAccount(account);
      res.status(200).json(updated);
    } catch (error) {
      res.status(error.status || 500).send(error.message);
    }
  }

  public async getAccountById(req: Request, res: Response) {
    try {
      const account = await this.dbAdapter.getAccountById(req.params.accountId);
      res.status(200).json(account);
    } catch (error) {
      res.status(error.status || 500).send(error.message);
    }
  }

  public async deleteAccountById(req: Request, res: Response) {
    try {
      await this.dbAdapter.deleteAccountById(req.params.accountId);
      res.status(204).send();
    } catch (error) {
      res.status(error.status || 500).send(error.message);
    }
  }
}

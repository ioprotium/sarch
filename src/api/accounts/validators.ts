import { Request, Response } from 'express';
import AccountModel from './model';

const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const emailMaxLength = 254;

export function validateAccount(req: Request, res: Response, next: any) {
  const account = req.body as AccountModel;
  if (!account.email) {
    res.status(400).send('Bad Request: email is empty or null.');
  } else if (account.email.length > emailMaxLength) {
    res.status(400).send('Bad Request: email is too long.');
  } else if (!emailRegex.test(account.email.toLowerCase())) {
    res
      .status(400)
      .send(
        `Bad Request: email "${account.email}" is not a valid email address.`
      );
  } else {
    next();
  }
}

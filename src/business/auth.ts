import { Response, Request } from 'express';
import { auth } from 'firebase-admin';
import { IAPIConfig } from '../types';

export function checkUserAuth(fireAuth: auth.Auth, apiConfig: IAPIConfig) {
  return async function handler(req: Request, res: Response, next: Function) {
    // the base url is '/api
    if (
      req.url === `/${apiConfig.version}/${apiConfig.endpoints.accounts}` ||
      process.env.NODE_ENV === 'dev' ||
      process.env.NODE_ENV === 'test'
    ) {
      next();
      return;
    }

    const token = req.header('X-Access-Token');
    if (!token) {
      res.status(401).send('Unauthorized');
      return;
    }

    try {
      const decoded = await fireAuth.verifyIdToken(token);
      const now = new Date().getTime() / 1000;
      if (now > decoded.exp) {
        res.status(401).send('Unauthorized: Token expired');
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

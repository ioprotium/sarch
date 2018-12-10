import { Response, Request } from 'express';
import { auth } from 'firebase-admin';

export function checkUserAuth(fireAuth: auth.Auth) {
  return async function handler(req: Request, res: Response, next: Function) {
    if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
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

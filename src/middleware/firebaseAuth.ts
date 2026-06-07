import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';

export interface AuthRequest extends Request {
  uid?: string;
}

export const verifyFirebaseToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    req.uid = 'dev-test-user';
    next();
    return;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication token is missing.' });
    return;
  }

  const idToken = authHeader.slice('Bearer '.length);

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.uid = decoded.uid;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

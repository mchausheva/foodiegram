import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; guest?: boolean; role?: 'user' | 'admin' };
    (req as any).userId = decoded.id;
    (req as any).userGuest = decoded.guest === true;
    (req as any).userRole = decoded.role || 'user';
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (_req: Request, res: Response, next: NextFunction) => {
  const reqAny = _req as any;
  if (reqAny.userGuest) return res.status(403).json({ message: 'Guests cannot perform this action' });
  if (reqAny.userRole !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

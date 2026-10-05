import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { getDb } from '../db';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  preferredLanguage: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

interface JwtPayload {
  userId: string;
  email: string;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication token is required to access this resource',
        },
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch (err: any) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired session token. Please sign in again.',
        },
      });
      return;
    }

    const db = await getDb();
    const result = await db.query(
      'SELECT id, email, full_name, preferred_language FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User account no longer exists',
        },
      });
      return;
    }

    const user = result.rows[0];
    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      preferredLanguage: user.preferred_language,
    };

    next();
  } catch (error) {
    next(error);
  }
}

import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import prisma from '../config/prisma';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ status: 'error', message: 'សូមចូលគណនីជាមុនសិន (No authentication token provided)' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Verify user is still active in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ status: 'error', message: 'គណនីរបស់អ្នកត្រូវបានផ្អាក ឬមិនត្រឹមត្រូវ' });
      return;
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Token ផុតកំណត់ ឬមិនត្រឹមត្រូវ (Invalid token)' });
  }
};

// Optional authentication for public routes (e.g. check if bookmarked by logged in user)
export const optionalAuthenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      req.user = decoded;
    }
  } catch {
    // Ignore invalid token on optional auth
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({
      status: 'error',
      message: 'សិទ្ធិត្រូវបានបដិសេធ៖ មុខងារនេះសម្រាប់តែ Administrator ប៉ុណ្ណោះ',
    });
    return;
  }
  next();
};

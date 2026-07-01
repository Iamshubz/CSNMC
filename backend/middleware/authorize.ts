import { Request, Response, NextFunction } from 'express';

export const requireRole = (role: string) => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.sendStatus(401);
    if (user.role !== role) return res.sendStatus(403);
    next();
  };
};

export const requireAnyRole = (roles: string[]) => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.sendStatus(401);
    if (!roles.includes(user.role)) return res.sendStatus(403);
    next();
  };
};

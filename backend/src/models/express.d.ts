import { Response } from 'express';
import { AuthUser } from './types.js';

// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      startTime?: number;
    }
  }
}

export {};

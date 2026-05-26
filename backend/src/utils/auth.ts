import jwt, { Secret } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { config } from '../config/index.js';
import { JwtPayload, AuthUser } from '../models/types.js';

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return bcryptjs.hash(password, 10);
};

// Compare password
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcryptjs.compare(password, hash);
};

// Generate JWT token
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload as any, config.jwt.secret as any, {
    expiresIn: config.jwt.expiresIn,
  } as any);
};

// Generate refresh token
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId } as any, config.jwt.refreshSecret as any, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as any);
};

// Verify JWT token
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  } catch {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as { userId: string };
  } catch {
    return null;
  }
};

// Extract token from bearer string
export const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
};

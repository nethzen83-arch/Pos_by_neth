import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';
import { verifyToken, extractToken } from '../utils/auth.js';
import { ERROR_MESSAGES } from '../constants/index.js';

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        statusCode: 401,
      });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        statusCode: 401,
      });
    }

    req.user = {
      id: payload.userId,
      username: payload.email,
      email: payload.email,
      role: payload.role,
      branchId: payload.branchId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: ERROR_MESSAGES.UNAUTHORIZED,
      statusCode: 401,
    });
  }
};

/**
 * Authorization Middleware
 * Checks if user has required role
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
        statusCode: 401,
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
        statusCode: 403,
      });
    }

    next();
  };
};

/**
 * Error Handling Middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message,
    error: config.nodeEnv === 'development' ? err.stack : undefined,
    statusCode,
  });
};

/**
 * 404 Handler Middleware
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: ERROR_MESSAGES.NOT_FOUND,
    statusCode: 404,
  });
};

/**
 * Request Logging Middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  req.startTime = startTime;

  const originalSend = res.send;

  res.send = function (data: any) {
    const duration = Date.now() - startTime;
    console.log({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id,
    });

    return originalSend.call(this, data);
  };

  next();
};

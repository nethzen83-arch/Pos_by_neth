import { Request, Response } from 'express';
import AuthService from '../services/AuthService.js';
import { successResponse, errorResponse, asyncHandler } from '../utils/response.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/index.js';

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(
        successResponse(SUCCESS_MESSAGES.REGISTRATION_SUCCESS, result, 201),
      );
    } catch (error: any) {
      res.status(400).json(
        errorResponse(error.message || ERROR_MESSAGES.VALIDATION_ERROR, error, 400),
      );
    }
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json(successResponse(SUCCESS_MESSAGES.LOGIN_SUCCESS, result));
    } catch (error: any) {
      res.status(401).json(
        errorResponse(error.message || ERROR_MESSAGES.INVALID_CREDENTIALS, error, 401),
      );
    }
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    try {
      if (req.user) {
        await AuthService.logout(req.user.id);
      }
      res.status(200).json(successResponse(SUCCESS_MESSAGES.LOGOUT_SUCCESS));
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error, 400));
    }
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json(
          errorResponse('Refresh token is required', null, 400),
        );
      }

      const result = await AuthService.refreshAccessToken(refreshToken);
      res.status(200).json(successResponse('Token refreshed successfully', result));
    } catch (error: any) {
      res.status(401).json(
        errorResponse(error.message || 'Invalid refresh token', error, 401),
      );
    }
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json(
          errorResponse(ERROR_MESSAGES.UNAUTHORIZED, null, 401),
        );
      }

      const { oldPassword, newPassword } = req.body;
      await AuthService.changePassword(req.user.id, oldPassword, newPassword);

      res.status(200).json(
        successResponse('Password changed successfully'),
      );
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error, 400));
    }
  });

  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json(
        errorResponse(ERROR_MESSAGES.UNAUTHORIZED, null, 401),
      );
    }

    res.status(200).json(
      successResponse('User retrieved successfully', req.user),
    );
  });
}

export default new AuthController();

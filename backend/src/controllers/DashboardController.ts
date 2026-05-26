import { Request, Response } from 'express';
import DashboardService from '../services/DashboardService.js';
import { successResponse, errorResponse, asyncHandler } from '../utils/response.js';

export class DashboardController {
  getSummary = asyncHandler(async (req: Request, res: Response) => {
    try {
      const branchId = req.user?.branchId;
      const data = await DashboardService.getSummary(branchId);
      res.status(200).json(successResponse('Dashboard summary retrieved successfully', data));
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message || 'Unable to load dashboard summary', error, 400));
    }
  });
}

export default new DashboardController();

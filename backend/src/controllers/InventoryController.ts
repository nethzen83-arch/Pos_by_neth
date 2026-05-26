import { Request, Response } from 'express';
import InventoryService from '../services/InventoryService.js';
import { successResponse, errorResponse, asyncHandler, paginatedResponse } from '../utils/response.js';
import { ERROR_MESSAGES } from '../constants/index.js';
import { parseQueryParams } from '../utils/helpers.js';

export class InventoryController {
  getInventory = asyncHandler(async (req: Request, res: Response) => {
    try {
      const params = parseQueryParams(req.query);
      const branchId = req.user?.branchId || (req.query.branchId as string);

      const result = await InventoryService.getInventory(
        params.page,
        params.pageSize,
        branchId,
        req.query.warehouseId as string,
        params.search,
      );

      res.status(200).json(
        successResponse(
          'Inventory retrieved successfully',
          paginatedResponse(
            result.data,
            result.page,
            result.pageSize,
            result.total,
          ),
        ),
      );
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error, 400));
    }
  });

  getProductStock = asyncHandler(async (req: Request, res: Response) => {
    try {
      if (!req.user?.branchId) {
        return res.status(400).json(
          errorResponse('Branch is required', null, 400),
        );
      }

      const stock = await InventoryService.getProductStock(
        req.params.productId,
        req.user.branchId,
      );

      res.status(200).json(
        successResponse('Product stock retrieved successfully', stock),
      );
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error, 400));
    }
  });

  recordMovement = asyncHandler(async (req: Request, res: Response) => {
    try {
      const movement = await InventoryService.recordStockMovement(req.body);
      res.status(201).json(
        successResponse('Stock movement recorded successfully', movement, 201),
      );
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error, 400));
    }
  });

  adjustStock = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { quantity, reason } = req.body;

      if (quantity === undefined) {
        return res.status(400).json(
          errorResponse('Quantity is required', null, 400),
        );
      }

      const movement = await InventoryService.adjustStock(
        req.params.id,
        quantity,
        reason,
      );

      res.status(200).json(
        successResponse('Stock adjusted successfully', movement),
      );
    } catch (error: any) {
      const statusCode = error.message === ERROR_MESSAGES.NOT_FOUND ? 404 : 400;
      res.status(statusCode).json(errorResponse(error.message, error, statusCode));
    }
  });

  getLowStock = asyncHandler(async (req: Request, res: Response) => {
    try {
      const branchId = req.user?.branchId || (req.query.branchId as string);
      const items = await InventoryService.getLowStockItems(branchId);

      res.status(200).json(
        successResponse('Low stock items retrieved successfully', items),
      );
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error, 400));
    }
  });

  getExpiryAlerts = asyncHandler(async (req: Request, res: Response) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const alerts = await InventoryService.getExpiryAlerts(days);

      res.status(200).json(
        successResponse('Expiry alerts retrieved successfully', alerts),
      );
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error, 400));
    }
  });
}

export default new InventoryController();

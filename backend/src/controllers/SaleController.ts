import { Request, Response } from 'express';
import SaleService from '../services/SaleService.js';
import { successResponse, errorResponse, asyncHandler, paginatedResponse } from '../utils/response.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/index.js';
import { parseQueryParams } from '../utils/helpers.js';

export class SaleController {
  create = asyncHandler(async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.branchId) {
        return res.status(400).json(
          errorResponse('Branch is required', null, 400),
        );
      }

      const sale = await SaleService.createSale(
        req.body,
        req.user.id,
        req.user.branchId,
      );

      res.status(201).json(
        successResponse(SUCCESS_MESSAGES.SALE_CREATED, sale, 201),
      );
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error, 400));
    }
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    try {
      const params = parseQueryParams(req.query);
      const branchId = req.user?.branchId || (req.query.branchId as string);

      const result = await SaleService.getSales(
        params.page,
        params.pageSize,
        branchId,
        req.query.status as string,
        params.search,
      );

      res.status(200).json(
        successResponse(
          'Sales retrieved successfully',
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

  getById = asyncHandler(async (req: Request, res: Response) => {
    try {
      const sale = await SaleService.getSale(req.params.id);
      res.status(200).json(
        successResponse('Sale retrieved successfully', sale),
      );
    } catch (error: any) {
      const statusCode = error.message === ERROR_MESSAGES.NOT_FOUND ? 404 : 400;
      res.status(statusCode).json(errorResponse(error.message, error, statusCode));
    }
  });

  recordPayment = asyncHandler(async (req: Request, res: Response) => {
    try {
      const payment = await SaleService.recordPayment(req.params.id, req.body);
      res.status(200).json(
        successResponse(SUCCESS_MESSAGES.PAYMENT_RECEIVED, payment),
      );
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error, 400));
    }
  });

  getReport = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;
      const branchId = req.user?.branchId;

      if (!startDate || !endDate) {
        return res.status(400).json(
          errorResponse('startDate and endDate are required', null, 400),
        );
      }

      const report = await SaleService.getSalesReport(
        new Date(startDate as string),
        new Date(endDate as string),
        branchId,
      );

      res.status(200).json(
        successResponse('Sales report retrieved successfully', report),
      );
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error, 400));
    }
  });
}

export default new SaleController();

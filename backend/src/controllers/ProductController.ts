import { Request, Response } from 'express';
import ProductService from '../services/ProductService.js';
import { successResponse, errorResponse, asyncHandler, paginatedResponse } from '../utils/response.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/index.js';
import { parseQueryParams } from '../utils/helpers.js';

export class ProductController {
  create = asyncHandler(async (req: Request, res: Response) => {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(
        successResponse(SUCCESS_MESSAGES.PRODUCT_CREATED, product, 201),
      );
    } catch (error: any) {
      res.status(400).json(
        errorResponse(error.message || ERROR_MESSAGES.VALIDATION_ERROR, error, 400),
      );
    }
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    try {
      const params = parseQueryParams(req.query);
      const result = await ProductService.getProducts(
        params.page,
        params.pageSize,
        params.search,
        req.query.categoryId as string,
      );

      res.status(200).json(
        successResponse(
          'Products retrieved successfully',
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
      const product = await ProductService.getProductById(req.params.id);
      res.status(200).json(
        successResponse('Product retrieved successfully', product),
      );
    } catch (error: any) {
      const statusCode = error.message === ERROR_MESSAGES.NOT_FOUND ? 404 : 400;
      res.status(statusCode).json(errorResponse(error.message, error, statusCode));
    }
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      res.status(200).json(
        successResponse(SUCCESS_MESSAGES.PRODUCT_UPDATED, product),
      );
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error, 400));
    }
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.status(200).json(
        successResponse(SUCCESS_MESSAGES.PRODUCT_DELETED),
      );
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error, 400));
    }
  });

  createCategory = asyncHandler(async (req: Request, res: Response) => {
    try {
      const category = await ProductService.createCategory(req.body);
      res.status(201).json(
        successResponse('Category created successfully', category, 201),
      );
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error, 400));
    }
  });

  getCategories = asyncHandler(async (req: Request, res: Response) => {
    try {
      const categories = await ProductService.getCategories();
      res.status(200).json(
        successResponse('Categories retrieved successfully', categories),
      );
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error, 400));
    }
  });
}

export default new ProductController();

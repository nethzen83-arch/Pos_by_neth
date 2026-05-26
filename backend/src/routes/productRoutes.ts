import { Router } from 'express';
import ProductController from '../controllers/ProductController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, createProductSchema } from '../validators/index.js';

const router = Router();

/**
 * @route   POST /products
 * @desc    Create a new product
 * @access  Private (Admin, Manager)
 */
router.post(
  '/',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
  validate(createProductSchema),
  ProductController.create,
);

/**
 * @route   GET /products
 * @desc    Get all products
 * @access  Private
 */
router.get('/', authenticate, ProductController.getAll);

/**
 * @route   GET /products/:id
 * @desc    Get product by ID
 * @access  Private
 */
router.get('/:id', authenticate, ProductController.getById);

/**
 * @route   PUT /products/:id
 * @desc    Update product
 * @access  Private (Admin, Manager)
 */
router.put(
  '/:id',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
  ProductController.update,
);

/**
 * @route   DELETE /products/:id
 * @desc    Delete product
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN'),
  ProductController.delete,
);

/**
 * @route   POST /products/categories
 * @desc    Create product category
 * @access  Private (Admin, Manager)
 */
router.post(
  '/categories',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'),
  ProductController.createCategory,
);

/**
 * @route   GET /products/categories
 * @desc    Get all product categories
 * @access  Private
 */
router.get('/categories', authenticate, ProductController.getCategories);

export default router;

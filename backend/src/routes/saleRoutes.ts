import { Router } from 'express';
import SaleController from '../controllers/SaleController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, createSaleSchema } from '../validators/index.js';

const router = Router();

/**
 * @route   POST /sales
 * @desc    Create a new sale
 * @access  Private (Cashier, Manager, Admin)
 */
router.post(
  '/',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CASHIER'),
  validate(createSaleSchema),
  SaleController.create,
);

/**
 * @route   GET /sales
 * @desc    Get all sales
 * @access  Private
 */
router.get('/', authenticate, SaleController.getAll);

/**
 * @route   GET /sales/:id
 * @desc    Get sale by ID
 * @access  Private
 */
router.get('/:id', authenticate, SaleController.getById);

/**
 * @route   POST /sales/:id/payments
 * @desc    Record payment for sale
 * @access  Private (Cashier, Manager, Admin)
 */
router.post(
  '/:id/payments',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CASHIER'),
  SaleController.recordPayment,
);

/**
 * @route   GET /sales/report/summary
 * @desc    Get sales report
 * @access  Private (Manager, Admin, Accountant)
 */
router.get(
  '/report/summary',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTANT'),
  SaleController.getReport,
);

export default router;

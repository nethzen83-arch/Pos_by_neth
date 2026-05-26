import { Router } from 'express';
import InventoryController from '../controllers/InventoryController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

/**
 * @route   GET /inventory
 * @desc    Get inventory items
 * @access  Private
 */
router.get('/', authenticate, InventoryController.getInventory);

/**
 * @route   GET /inventory/product/:productId
 * @desc    Get stock for a product
 * @access  Private
 */
router.get('/product/:productId', authenticate, InventoryController.getProductStock);

/**
 * @route   POST /inventory/movements
 * @desc    Record stock movement
 * @access  Private (Manager, Warehouse Staff)
 */
router.post(
  '/movements',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'WAREHOUSE_STAFF'),
  InventoryController.recordMovement,
);

/**
 * @route   POST /inventory/:id/adjust
 * @desc    Adjust stock
 * @access  Private (Manager, Warehouse Staff)
 */
router.post(
  '/:id/adjust',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'WAREHOUSE_STAFF'),
  InventoryController.adjustStock,
);

/**
 * @route   GET /inventory/alerts/low-stock
 * @desc    Get low stock items
 * @access  Private (Manager, Admin)
 */
router.get(
  '/alerts/low-stock',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'WAREHOUSE_STAFF'),
  InventoryController.getLowStock,
);

/**
 * @route   GET /inventory/alerts/expiry
 * @desc    Get expiry alerts
 * @access  Private (Manager, Admin)
 */
router.get(
  '/alerts/expiry',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'WAREHOUSE_STAFF'),
  InventoryController.getExpiryAlerts,
);

export default router;

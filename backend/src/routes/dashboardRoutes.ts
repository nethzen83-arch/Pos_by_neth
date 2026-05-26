import { Router } from 'express';
import DashboardController from '../controllers/DashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * @route   GET /dashboard/summary
 * @desc    Get dashboard summary metrics
 * @access  Private
 */
router.get('/summary', authenticate, DashboardController.getSummary);

export default router;

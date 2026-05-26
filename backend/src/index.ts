import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { config } from './config/index.js';
import {
  apiLimiter,
  corsConfig,
  validateRequestBody,
} from './middleware/validators.js';
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
} from './middleware/auth.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app: Express = express();

// ============ MIDDLEWARE ============

// Security
app.use(helmet());
app.use(cors(corsConfig));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use(morgan('combined'));
app.use(requestLogger);

// Validation
app.use(validateRequestBody);

// Rate limiting
app.use('/api/', apiLimiter);

// ============ ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ============ ERROR HANDLING ============

// 404 Handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============ SERVER START ============

const PORT = config.port;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`
        ╔═══════════════════════════════════════╗
        ║   NETH ERP SYSTEM - Backend Server   ║
        ║                                       ║
        ║   Server running on port ${PORT}     ║
        ║   Environment: ${config.nodeEnv}     ║
        ╚═══════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

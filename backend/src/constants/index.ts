// Constants - User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CASHIER: 'CASHIER',
  ACCOUNTANT: 'ACCOUNTANT',
  WAREHOUSE_STAFF: 'WAREHOUSE_STAFF',
} as const;

// Constants - User Status
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

// Constants - Invoice Status
export const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  ISSUED: 'ISSUED',
  PAID: 'PAID',
  PARTIAL: 'PARTIAL',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
} as const;

// Constants - Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CARD: 'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  QR_CODE: 'QR_CODE',
  CHEQUE: 'CHEQUE',
  GIFT_CARD: 'GIFT_CARD',
} as const;

// Constants - Stock Movement Types
export const STOCK_MOVEMENT_TYPES = {
  IN: 'IN',
  OUT: 'OUT',
  ADJUSTMENT: 'ADJUSTMENT',
  TRANSFER: 'TRANSFER',
  RETURN: 'RETURN',
} as const;

// Constants - Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
} as const;

// Constants - Permission Matrix
export const PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    'view_dashboard',
    'manage_users',
    'manage_products',
    'manage_inventory',
    'manage_sales',
    'manage_purchases',
    'manage_customers',
    'manage_suppliers',
    'view_accounting',
    'view_reports',
  ],
  MANAGER: [
    'view_dashboard',
    'manage_products',
    'manage_inventory',
    'manage_sales',
    'manage_purchases',
    'manage_customers',
    'view_reports',
  ],
  CASHIER: [
    'view_dashboard',
    'manage_sales',
    'view_products',
    'view_inventory',
  ],
  ACCOUNTANT: [
    'view_dashboard',
    'view_sales',
    'view_purchases',
    'manage_accounting',
    'view_reports',
  ],
  WAREHOUSE_STAFF: [
    'view_products',
    'manage_inventory',
    'view_stock_transfers',
  ],
} as const;

// Constants - Notification Types
export const NOTIFICATION_TYPES = {
  LOW_STOCK: 'LOW_STOCK',
  PAYMENT_DUE: 'PAYMENT_DUE',
  INVOICE_OVERDUE: 'INVOICE_OVERDUE',
  EXPIRY_ALERT: 'EXPIRY_ALERT',
  SYSTEM_ALERT: 'SYSTEM_ALERT',
} as const;

// Constants - Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTRATION_SUCCESS: 'Registration successful',
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  SALE_CREATED: 'Sale created successfully',
  SALE_UPDATED: 'Sale updated successfully',
  PAYMENT_RECEIVED: 'Payment received successfully',
} as const;

// Constants - Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'Resource not found',
  DUPLICATE_ENTRY: 'This record already exists',
  VALIDATION_ERROR: 'Validation failed',
  SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database operation failed',
} as const;

export default {
  USER_ROLES,
  USER_STATUS,
  INVOICE_STATUS,
  PAYMENT_METHODS,
  STOCK_MOVEMENT_TYPES,
  ORDER_STATUS,
  PERMISSIONS,
  NOTIFICATION_TYPES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
};

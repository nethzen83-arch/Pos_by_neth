export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar?: string;
    branchId?: string;
}
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'CASHIER' | 'ACCOUNTANT' | 'WAREHOUSE_STAFF';
export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
}
export interface LoginPayload {
    email: string;
    password: string;
}
export interface RegisterPayload extends LoginPayload {
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
}
export interface Product {
    id: string;
    sku: string;
    barcode?: string;
    name: string;
    description?: string;
    costPrice: number;
    sellingPrice: number;
    tax: number;
    categoryId: string;
    brandId?: string;
    unitId: string;
    active: boolean;
}
export interface Sale {
    id: string;
    invoiceNumber: string;
    customerId?: string;
    status: 'DRAFT' | 'ISSUED' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED';
    subTotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    createdAt: string;
    updatedAt: string;
}
export interface SaleItem {
    id: string;
    saleId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxAmount: number;
    lineTotal: number;
}
export interface DashboardMetrics {
    totalSales: number;
    totalProfit: number;
    todaySales: number;
    monthlyRevenue: number;
    pendingPayments: number;
    lowStockCount: number;
}
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    statusCode: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    pageSize: number;
    total: number;
    pages: number;
}
//# sourceMappingURL=index.d.ts.map
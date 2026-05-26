// Helper utilities

export const generateInvoiceNumber = async (prefix: string): Promise<string> => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}-${new Date().getFullYear()}-${random}`;
};

export const calculateLineTotal = (
  quantity: number,
  unitPrice: number,
  discount: number = 0,
  discountPercent: number = 0,
): number => {
  const subtotal = quantity * unitPrice;
  let finalDiscount = discount;

  if (discountPercent > 0) {
    finalDiscount = (subtotal * discountPercent) / 100;
  }

  return subtotal - finalDiscount;
};

export const calculateProfitMargin = (costPrice: number, sellingPrice: number): number => {
  if (costPrice === 0) return 0;
  return ((sellingPrice - costPrice) / costPrice) * 100;
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const parseQueryParams = (query: any) => {
  return {
    page: Math.max(1, parseInt(query.page || '1', 10)),
    pageSize: Math.min(Math.max(1, parseInt(query.pageSize || '10', 10)), 100),
    search: query.search || undefined,
    sortBy: query.sortBy || 'createdAt',
    sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
  };
};

export const generateCode = (prefix: string, length: number = 6): string => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}${code}`;
};

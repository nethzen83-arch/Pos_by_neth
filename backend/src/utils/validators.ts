// Validation helpers

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9\-\+\s\(\)]{7,}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string): boolean => {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateSKU = (sku: string): boolean => {
  // SKU format: uppercase alphanumeric, 3-20 characters
  const skuRegex = /^[A-Z0-9]{3,20}$/;
  return skuRegex.test(sku);
};

export const validateBarcode = (barcode: string): boolean => {
  // Barcode: numeric, 8-18 digits
  const barcodeRegex = /^[0-9]{8,18}$/;
  return barcodeRegex.test(barcode);
};

export const validatePaginationParams = (page?: number, pageSize?: number) => {
  const validPage = Math.max(1, page || 1);
  const validPageSize = Math.min(Math.max(1, pageSize || 10), 100);
  return { page: validPage, pageSize: validPageSize };
};

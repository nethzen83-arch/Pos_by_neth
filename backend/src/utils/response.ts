// Utility functions for API responses

export const successResponse = (message: string, data?: any, statusCode = 200) => ({
  success: true,
  message,
  data,
  statusCode,
});

export const errorResponse = (message: string, error?: any, statusCode = 400) => ({
  success: false,
  message,
  error: error?.message || error,
  statusCode,
});

export const paginatedResponse = (
  data: any[],
  page: number,
  pageSize: number,
  total: number,
) => ({
  data,
  page,
  pageSize,
  total,
  pages: Math.ceil(total / pageSize),
});

export const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

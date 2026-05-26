import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const auth = this.getAuthFromStorage();
        if (auth?.token) {
          config.headers.Authorization = `Bearer ${auth.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          const auth = this.getAuthFromStorage();
          if (auth?.refreshToken) {
            try {
              const response = await this.post('/auth/refresh', {
                refreshToken: auth.refreshToken,
              });
              const newAuth = {
                token: response.data.token,
                refreshToken: auth.refreshToken,
              };
              localStorage.setItem('auth', JSON.stringify(newAuth));
              return this.client(error.config);
            } catch {
              localStorage.removeItem('auth');
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      },
    );
  }

  private getAuthFromStorage() {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth) : null;
  }

  async get<T = any>(url: string, config = {}) {
    return this.client.get<T>(url, config);
  }

  async post<T = any>(url: string, data?: any, config = {}) {
    return this.client.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config = {}) {
    return this.client.put<T>(url, data, config);
  }

  async delete<T = any>(url: string, config = {}) {
    return this.client.delete<T>(url, config);
  }

  async patch<T = any>(url: string, data?: any, config = {}) {
    return this.client.patch<T>(url, data, config);
  }
}

export const apiClient = new ApiClient();

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (data: any) =>
    apiClient.post('/auth/register', data),
  logout: () =>
    apiClient.post('/auth/logout'),
  getCurrentUser: () =>
    apiClient.get('/auth/me'),
  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post('/auth/change-password', { oldPassword, newPassword }),
};

// Product API
export const productApi = {
  getAll: (page = 1, pageSize = 10, search?: string, categoryId?: string) =>
    apiClient.get('/products', {
      params: { page, pageSize, search, categoryId },
    }),
  getById: (id: string) =>
    apiClient.get(`/products/${id}`),
  create: (data: any) =>
    apiClient.post('/products', data),
  update: (id: string, data: any) =>
    apiClient.put(`/products/${id}`, data),
  delete: (id: string) =>
    apiClient.delete(`/products/${id}`),
  getCategories: () =>
    apiClient.get('/products/categories'),
  createCategory: (data: any) =>
    apiClient.post('/products/categories', data),
};

// Sale API
export const saleApi = {
  create: (data: any) =>
    apiClient.post('/sales', data),
  getAll: (page = 1, pageSize = 10, status?: string, search?: string) =>
    apiClient.get('/sales', { params: { page, pageSize, status, search } }),
  getById: (id: string) =>
    apiClient.get(`/sales/${id}`),
  recordPayment: (saleId: string, data: any) =>
    apiClient.post(`/sales/${saleId}/payments`, data),
  getReport: (startDate: string, endDate: string) =>
    apiClient.get('/sales/report/summary', { params: { startDate, endDate } }),
};

// Inventory API
export const inventoryApi = {
  getAll: (page = 1, pageSize = 10, search?: string) =>
    apiClient.get('/inventory', { params: { page, pageSize, search } }),
  getProductStock: (productId: string) =>
    apiClient.get(`/inventory/product/${productId}`),
  recordMovement: (data: any) =>
    apiClient.post('/inventory/movements', data),
  adjustStock: (id: string, data: any) =>
    apiClient.post(`/inventory/${id}/adjust`, data),
  getLowStock: () =>
    apiClient.get('/inventory/alerts/low-stock'),
  getExpiryAlerts: (days = 30) =>
    apiClient.get('/inventory/alerts/expiry', { params: { days } }),
};

export const dashboardApi = {
  getSummary: () => apiClient.get('/dashboard/summary'),
};

export default apiClient;

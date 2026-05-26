import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
class ApiClient {
    constructor() {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Request interceptor to add auth token
        this.client.interceptors.request.use((config) => {
            const auth = this.getAuthFromStorage();
            if (auth?.token) {
                config.headers.Authorization = `Bearer ${auth.token}`;
            }
            return config;
        }, (error) => Promise.reject(error));
        // Response interceptor to handle errors
        this.client.interceptors.response.use((response) => response, async (error) => {
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
                    }
                    catch {
                        localStorage.removeItem('auth');
                        window.location.href = '/login';
                    }
                }
            }
            return Promise.reject(error);
        });
    }
    getAuthFromStorage() {
        const auth = localStorage.getItem('auth');
        return auth ? JSON.parse(auth) : null;
    }
    async get(url, config = {}) {
        return this.client.get(url, config);
    }
    async post(url, data, config = {}) {
        return this.client.post(url, data, config);
    }
    async put(url, data, config = {}) {
        return this.client.put(url, data, config);
    }
    async delete(url, config = {}) {
        return this.client.delete(url, config);
    }
    async patch(url, data, config = {}) {
        return this.client.patch(url, data, config);
    }
}
export const apiClient = new ApiClient();
// Auth API
export const authApi = {
    login: (email, password) => apiClient.post('/auth/login', { email, password }),
    register: (data) => apiClient.post('/auth/register', data),
    logout: () => apiClient.post('/auth/logout'),
    getCurrentUser: () => apiClient.get('/auth/me'),
    changePassword: (oldPassword, newPassword) => apiClient.post('/auth/change-password', { oldPassword, newPassword }),
};
// Product API
export const productApi = {
    getAll: (page = 1, pageSize = 10, search, categoryId) => apiClient.get('/products', {
        params: { page, pageSize, search, categoryId },
    }),
    getById: (id) => apiClient.get(`/products/${id}`),
    create: (data) => apiClient.post('/products', data),
    update: (id, data) => apiClient.put(`/products/${id}`, data),
    delete: (id) => apiClient.delete(`/products/${id}`),
    getCategories: () => apiClient.get('/products/categories'),
    createCategory: (data) => apiClient.post('/products/categories', data),
};
// Sale API
export const saleApi = {
    create: (data) => apiClient.post('/sales', data),
    getAll: (page = 1, pageSize = 10, status, search) => apiClient.get('/sales', { params: { page, pageSize, status, search } }),
    getById: (id) => apiClient.get(`/sales/${id}`),
    recordPayment: (saleId, data) => apiClient.post(`/sales/${saleId}/payments`, data),
    getReport: (startDate, endDate) => apiClient.get('/sales/report/summary', { params: { startDate, endDate } }),
};
// Inventory API
export const inventoryApi = {
    getAll: (page = 1, pageSize = 10, search) => apiClient.get('/inventory', { params: { page, pageSize, search } }),
    getProductStock: (productId) => apiClient.get(`/inventory/product/${productId}`),
    recordMovement: (data) => apiClient.post('/inventory/movements', data),
    adjustStock: (id, data) => apiClient.post(`/inventory/${id}/adjust`, data),
    getLowStock: () => apiClient.get('/inventory/alerts/low-stock'),
    getExpiryAlerts: (days = 30) => apiClient.get('/inventory/alerts/expiry', { params: { days } }),
};
export const dashboardApi = {
    getSummary: () => apiClient.get('/dashboard/summary'),
};
export default apiClient;
//# sourceMappingURL=api.js.map
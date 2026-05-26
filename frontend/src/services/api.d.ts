declare class ApiClient {
    private client;
    constructor();
    private getAuthFromStorage;
    get<T = any>(url: string, config?: {}): Promise<import("axios").AxiosResponse<T, any, {}>>;
    post<T = any>(url: string, data?: any, config?: {}): Promise<import("axios").AxiosResponse<T, any, {}>>;
    put<T = any>(url: string, data?: any, config?: {}): Promise<import("axios").AxiosResponse<T, any, {}>>;
    delete<T = any>(url: string, config?: {}): Promise<import("axios").AxiosResponse<T, any, {}>>;
    patch<T = any>(url: string, data?: any, config?: {}): Promise<import("axios").AxiosResponse<T, any, {}>>;
}
export declare const apiClient: ApiClient;
export declare const authApi: {
    login: (email: string, password: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    register: (data: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    logout: () => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getCurrentUser: () => Promise<import("axios").AxiosResponse<any, any, {}>>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
};
export declare const productApi: {
    getAll: (page?: number, pageSize?: number, search?: string, categoryId?: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getById: (id: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    create: (data: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    update: (id: string, data: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    delete: (id: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getCategories: () => Promise<import("axios").AxiosResponse<any, any, {}>>;
    createCategory: (data: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
};
export declare const saleApi: {
    create: (data: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getAll: (page?: number, pageSize?: number, status?: string, search?: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getById: (id: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    recordPayment: (saleId: string, data: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getReport: (startDate: string, endDate: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
};
export declare const inventoryApi: {
    getAll: (page?: number, pageSize?: number, search?: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getProductStock: (productId: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    recordMovement: (data: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    adjustStock: (id: string, data: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getLowStock: () => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getExpiryAlerts: (days?: number) => Promise<import("axios").AxiosResponse<any, any, {}>>;
};
export declare const dashboardApi: {
    getSummary: () => Promise<import("axios").AxiosResponse<any, any, {}>>;
};
export default apiClient;
//# sourceMappingURL=api.d.ts.map
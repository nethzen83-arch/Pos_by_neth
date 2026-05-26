import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography, CircularProgress } from '@mui/material';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
import { ShoppingCart, TrendingUp, Inventory2, ErrorOutline } from '@mui/icons-material';
import { dashboardApi } from '../services/api';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];
const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => (_jsx(Card, { className: "card", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Typography, { color: "textSecondary", gutterBottom: true, children: label }), _jsx(Typography, { variant: "h5", className: "font-bold", children: typeof value === 'number' ? `$${value.toFixed(2)}` : value })] }), _jsx(Icon, { className: `text-${color}-500 text-4xl` })] }) }) }));
export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const loadSummary = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await dashboardApi.getSummary();
                setSummary(response.data.data);
            }
            catch (err) {
                setError(err.response?.data?.message || 'Failed to load dashboard summary');
            }
            finally {
                setLoading(false);
            }
        };
        loadSummary();
    }, []);
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-full py-24", children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsx("div", { className: "p-6 bg-white rounded-lg shadow", children: _jsx(Typography, { variant: "h6", className: "font-bold text-red-600", children: error }) }));
    }
    const salesTrendData = summary?.topProducts?.map((product) => ({
        name: product.name,
        quantity: product.quantity,
    })) || [];
    const categoryData = summary?.categoryDistribution || [];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Dashboard" }), _jsx("p", { className: "text-gray-600", children: "Live business metrics and inventory insights" })] }), _jsxs(Grid, { container: true, spacing: 3, className: "mb-6", children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(StatCard, { icon: ShoppingCart, label: "Total Revenue", value: summary.totalRevenue || 0, color: "blue" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(StatCard, { icon: TrendingUp, label: "Total Profit", value: summary.totalProfit || 0, color: "green" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(StatCard, { icon: Inventory2, label: "Today's Sales", value: summary.todaySales || 0, color: "yellow" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(StatCard, { icon: ErrorOutline, label: "Low Stock", value: summary.lowStockCount || 0, color: "red" }) })] }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsx(Card, { className: "card", children: _jsxs(CardContent, { className: "p-6", children: [_jsx(Typography, { variant: "h6", className: "font-bold mb-4", children: "Top Selling Products" }), _jsx(ResponsiveContainer, { width: "100%", height: 320, children: _jsxs(BarChart, { data: salesTrendData, margin: { left: -20, right: 20 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "quantity", fill: "#0088FE" })] }) })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { className: "card", children: _jsxs(CardContent, { className: "p-6", children: [_jsx(Typography, { variant: "h6", className: "font-bold mb-4", children: "Inventory Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 320, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: categoryData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 90, innerRadius: 45, paddingAngle: 2, children: categoryData.map((_, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) })] }) }) })] }), _jsx(Grid, { container: true, spacing: 3, children: _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { className: "card", children: _jsxs(CardContent, { className: "p-6", children: [_jsx(Typography, { variant: "h6", className: "font-bold mb-4", children: "Invoice Summary" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Issued" }), _jsx("strong", { children: summary.invoiceStatusCounts?.ISSUED || 0 })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Paid" }), _jsx("strong", { children: summary.invoiceStatusCounts?.PAID || 0 })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Partial" }), _jsx("strong", { children: summary.invoiceStatusCounts?.PARTIAL || 0 })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Overdue" }), _jsx("strong", { children: summary.invoiceStatusCounts?.OVERDUE || 0 })] })] })] }) }) }) })] }));
}
//# sourceMappingURL=Dashboard.js.map
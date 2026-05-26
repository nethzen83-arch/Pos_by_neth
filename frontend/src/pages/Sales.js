import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, CircularProgress, } from '@mui/material';
import { Add as AddIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { saleApi, productApi } from '../services/api';
const initialItem = {
    productId: '',
    quantity: 1,
    unitPrice: 0,
    taxPercent: 0,
    discount: 0,
    batch: '',
    expiryDate: '',
};
export default function Sales() {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [saleNote, setSaleNote] = useState('');
    const [selectedItem, setSelectedItem] = useState(initialItem);
    const [customerName, setCustomerName] = useState('');
    const filteredSales = useMemo(() => {
        const lowerSearch = search.trim().toLowerCase();
        return sales.filter((sale) => {
            return (!lowerSearch ||
                sale.invoiceNumber?.toLowerCase().includes(lowerSearch) ||
                sale.customer?.name?.toLowerCase().includes(lowerSearch));
        });
    }, [sales, search]);
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [salesResponse, productsResponse] = await Promise.all([
                    saleApi.getAll(1, 100),
                    productApi.getAll(1, 100),
                ]);
                setSales(salesResponse.data.data || []);
                setProducts(productsResponse.data.data || []);
            }
            catch (error) {
                console.error('Failed to load sales data', error);
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    const openNewSaleDialog = () => {
        setSaleNote('');
        setSelectedItem(initialItem);
        setCustomerName('');
        setDialogOpen(true);
    };
    const handleItemChange = (field, value) => {
        setSelectedItem((prev) => ({ ...prev, [field]: value }));
    };
    const handleProductSelect = (productId) => {
        const product = products.find((item) => item.id === productId);
        if (product) {
            setSelectedItem((prev) => ({
                ...prev,
                productId,
                unitPrice: product.sellingPrice || 0,
            }));
        }
    };
    const handleCreateSale = async () => {
        if (!selectedItem.productId)
            return;
        try {
            const payload = {
                customerId: customerName ? undefined : undefined,
                customerName: customerName || undefined,
                items: [selectedItem],
                notes: saleNote,
            };
            await saleApi.create(payload);
            const response = await saleApi.getAll(1, 100);
            setSales(response.data.data || []);
            setDialogOpen(false);
        }
        catch (error) {
            console.error('Failed to create sale', error);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Sales" }), _jsx("p", { className: "text-gray-600", children: "Process invoices and monitor transactions" })] }), _jsx(Button, { variant: "contained", color: "primary", startIcon: _jsx(AddIcon, {}), onClick: openNewSaleDialog, children: "New Sale" })] }), _jsx(Card, { className: "card", children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6", children: [_jsx(TextField, { label: "Search invoice", variant: "outlined", fullWidth: true, value: search, onChange: (event) => setSearch(event.target.value) }), _jsx(TextField, { label: "Customer", variant: "outlined", fullWidth: true, disabled: true, value: "" }), _jsx(TextField, { label: "Status", variant: "outlined", fullWidth: true, disabled: true, value: "" }), _jsx(Button, { variant: "contained", color: "primary", onClick: () => setSearch(search), children: "Filter" })] }), loading ? (_jsx("div", { className: "flex justify-center py-16", children: _jsx(CircularProgress, {}) })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Invoice #" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Customer" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Total" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Date" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Actions" })] }) }), _jsx("tbody", { children: filteredSales.map((sale) => (_jsxs("tr", { className: "border-b hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: sale.invoiceNumber }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: sale.customer?.name || 'Walk-in' }), _jsxs("td", { className: "px-6 py-4 text-sm text-gray-900", children: ["$", sale.totalAmount?.toFixed(2)] }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold", children: sale.status }) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: new Date(sale.createdAt).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsx(Button, { size: "small", variant: "outlined", startIcon: _jsx(VisibilityIcon, {}), children: "View" }) })] }, sale.id))) })] }) }))] }) }), _jsxs(Dialog, { open: dialogOpen, onClose: () => setDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: "New Sale" }), _jsx(DialogContent, { children: _jsxs("div", { className: "space-y-4 pt-2", children: [_jsx(TextField, { label: "Customer Name", variant: "outlined", fullWidth: true, value: customerName, onChange: (event) => setCustomerName(event.target.value) }), _jsxs(TextField, { label: "Product", variant: "outlined", fullWidth: true, select: true, value: selectedItem.productId, onChange: (event) => handleProductSelect(event.target.value), children: [_jsx(MenuItem, { value: "", children: "Select a product" }), products.map((product) => (_jsxs(MenuItem, { value: product.id, children: [product.name, " \u00B7 ", product.sku] }, product.id)))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(TextField, { label: "Quantity", type: "number", variant: "outlined", fullWidth: true, value: selectedItem.quantity, onChange: (event) => handleItemChange('quantity', Number(event.target.value)) }), _jsx(TextField, { label: "Unit Price", type: "number", variant: "outlined", fullWidth: true, value: selectedItem.unitPrice, onChange: (event) => handleItemChange('unitPrice', Number(event.target.value)) }), _jsx(TextField, { label: "Tax %", type: "number", variant: "outlined", fullWidth: true, value: selectedItem.taxPercent, onChange: (event) => handleItemChange('taxPercent', Number(event.target.value)) })] }), _jsx(TextField, { label: "Discount", type: "number", variant: "outlined", fullWidth: true, value: selectedItem.discount, onChange: (event) => handleItemChange('discount', Number(event.target.value)) }), _jsx(TextField, { label: "Notes", variant: "outlined", fullWidth: true, multiline: true, rows: 3, value: saleNote, onChange: (event) => setSaleNote(event.target.value) })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setDialogOpen(false), color: "inherit", children: "Cancel" }), _jsx(Button, { onClick: handleCreateSale, variant: "contained", color: "primary", children: "Create Sale" })] })] })] }));
}
//# sourceMappingURL=Sales.js.map
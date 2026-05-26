import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Typography, CircularProgress, } from '@mui/material';
import { Refresh as RefreshIcon, Edit as EditIcon } from '@mui/icons-material';
import { inventoryApi } from '../services/api';
export default function Inventory() {
    const [inventory, setInventory] = useState([]);
    const [search, setSearch] = useState('');
    const [warehouseFilter, setWarehouseFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [adjustopen, setAdjustOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [adjustQuantity, setAdjustQuantity] = useState(0);
    const [adjustReason, setAdjustReason] = useState('');
    useEffect(() => {
        const loadInventory = async () => {
            setLoading(true);
            try {
                const response = await inventoryApi.getAll(1, 100, search);
                setInventory(response.data.data || []);
            }
            catch (error) {
                console.error('Failed to load inventory', error);
            }
            finally {
                setLoading(false);
            }
        };
        loadInventory();
    }, [search]);
    const filteredInventory = useMemo(() => {
        const lowerSearch = search.trim().toLowerCase();
        return inventory.filter((item) => {
            const matchesSearch = !lowerSearch ||
                item.product?.name?.toLowerCase().includes(lowerSearch) ||
                item.product?.sku?.toLowerCase().includes(lowerSearch);
            const matchesWarehouse = !warehouseFilter || item.warehouse?.id === warehouseFilter;
            return matchesSearch && matchesWarehouse;
        });
    }, [inventory, search, warehouseFilter]);
    const openAdjustDialog = (item) => {
        setSelectedItem(item);
        setAdjustQuantity(item.quantity);
        setAdjustReason('Stock correction');
        setAdjustOpen(true);
    };
    const handleAdjustStock = async () => {
        if (!selectedItem)
            return;
        try {
            await inventoryApi.adjustStock(selectedItem.id, {
                quantity: adjustQuantity,
                reason: adjustReason,
            });
            const response = await inventoryApi.getAll(1, 100, search);
            setInventory(response.data.data || []);
            setAdjustOpen(false);
        }
        catch (error) {
            console.error('Failed to adjust stock', error);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Inventory" }), _jsx("p", { className: "text-gray-600", children: "Manage stock levels and warehouse items" })] }), _jsx(Button, { variant: "contained", color: "primary", startIcon: _jsx(RefreshIcon, {}), onClick: () => setSearch(''), children: "Refresh" })] }), _jsx(Card, { className: "card", children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6", children: [_jsx(TextField, { label: "Search product", variant: "outlined", fullWidth: true, value: search, onChange: (event) => setSearch(event.target.value) }), _jsx(TextField, { label: "Warehouse", variant: "outlined", fullWidth: true, value: warehouseFilter, onChange: (event) => setWarehouseFilter(event.target.value) }), _jsxs(TextField, { label: "Stock Status", variant: "outlined", fullWidth: true, select: true, value: warehouseFilter, onChange: (event) => setWarehouseFilter(event.target.value), children: [_jsx(MenuItem, { value: "", children: "All Statuses" }), _jsx(MenuItem, { value: "low", children: "Low Stock" }), _jsx(MenuItem, { value: "ok", children: "In Stock" })] }), _jsx(Button, { variant: "contained", color: "primary", onClick: () => setSearch(search), children: "Filter" })] }), loading ? (_jsx("div", { className: "flex justify-center py-16", children: _jsx(CircularProgress, {}) })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "SKU" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Product" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Quantity" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Available" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Min Stock" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Warehouse" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Actions" })] }) }), _jsx("tbody", { children: filteredInventory.map((item) => {
                                            const status = item.availableQty <= item.minStock ? 'Low' : 'OK';
                                            return (_jsxs("tr", { className: "border-b hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: item.product?.sku }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: item.product?.name }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: item.quantity }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: item.availableQty }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: item.minStock }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: item.warehouse?.name || 'N/A' }), _jsxs("td", { className: "px-6 py-4 text-sm space-x-2", children: [_jsx(Button, { size: "small", variant: "outlined", startIcon: _jsx(EditIcon, {}), onClick: () => openAdjustDialog(item), children: "Adjust" }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-semibold ${status === 'Low' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`, children: status })] })] }, item.id));
                                        }) })] }) }))] }) }), _jsxs(Dialog, { open: adjustopen, onClose: () => setAdjustOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: "Adjust Inventory" }), _jsx(DialogContent, { children: _jsxs("div", { className: "space-y-4 pt-2", children: [_jsx(Typography, { variant: "subtitle1", className: "font-semibold", children: selectedItem?.product?.name }), _jsx(TextField, { label: "Quantity", type: "number", fullWidth: true, value: adjustQuantity, onChange: (event) => setAdjustQuantity(Number(event.target.value)) }), _jsx(TextField, { label: "Reason", fullWidth: true, value: adjustReason, onChange: (event) => setAdjustReason(event.target.value) })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setAdjustOpen(false), color: "inherit", children: "Cancel" }), _jsx(Button, { onClick: handleAdjustStock, variant: "contained", color: "primary", children: "Save" })] })] })] }));
}
//# sourceMappingURL=Inventory.js.map
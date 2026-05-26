import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Grid, CircularProgress, } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { productApi } from '../services/api';
const emptyProductForm = {
    sku: '',
    barcode: '',
    name: '',
    description: '',
    categoryId: '',
    brandId: '',
    unitId: '',
    costPrice: 0,
    sellingPrice: 0,
    tax: 0,
};
export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formValues, setFormValues] = useState(emptyProductForm);
    const [editingProductId, setEditingProductId] = useState(null);
    const filteredProducts = useMemo(() => {
        const lowerSearch = search.trim().toLowerCase();
        return products.filter((product) => {
            const matchesSearch = !lowerSearch ||
                product.name.toLowerCase().includes(lowerSearch) ||
                product.sku?.toLowerCase().includes(lowerSearch) ||
                product.barcode?.toLowerCase().includes(lowerSearch);
            const matchesCategory = !selectedCategory || product.category?.id === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, search, selectedCategory]);
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const [productsResponse, categoriesResponse] = await Promise.all([
                    productApi.getAll(1, 100),
                    productApi.getCategories(),
                ]);
                setProducts(productsResponse.data.data || []);
                setCategories(categoriesResponse.data.data || []);
            }
            catch (error) {
                console.error('Failed to load products', error);
            }
            finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);
    const openCreateDialog = () => {
        setSelectedCategory('');
        setEditingProductId(null);
        setFormValues(emptyProductForm);
        setDialogOpen(true);
    };
    const openEditDialog = (product) => {
        setEditingProductId(product.id);
        setFormValues({
            sku: product.sku || '',
            barcode: product.barcode || '',
            name: product.name || '',
            description: product.description || '',
            categoryId: product.category?.id || '',
            brandId: product.brand?.id || '',
            unitId: product.unit?.id || '',
            costPrice: product.costPrice || 0,
            sellingPrice: product.sellingPrice || 0,
            tax: product.tax || 0,
        });
        setDialogOpen(true);
    };
    const handleDialogSave = async () => {
        try {
            if (editingProductId) {
                await productApi.update(editingProductId, formValues);
            }
            else {
                await productApi.create(formValues);
            }
            const response = await productApi.getAll(1, 100);
            setProducts(response.data.data || []);
            setDialogOpen(false);
        }
        catch (error) {
            console.error('Failed to save product', error);
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?'))
            return;
        try {
            await productApi.delete(id);
            setProducts((prev) => prev.filter((product) => product.id !== id));
        }
        catch (error) {
            console.error('Failed to delete product', error);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Products" }), _jsx("p", { className: "text-gray-600", children: "Manage your product catalog and pricing" })] }), _jsx(Button, { variant: "contained", color: "primary", startIcon: _jsx(AddIcon, {}), onClick: openCreateDialog, children: "Add Product" })] }), _jsx(Card, { className: "card", children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6", children: [_jsx(TextField, { label: "Search products", variant: "outlined", fullWidth: true, value: search, onChange: (event) => setSearch(event.target.value) }), _jsxs(TextField, { label: "Category", variant: "outlined", fullWidth: true, select: true, value: selectedCategory, onChange: (event) => setSelectedCategory(event.target.value), children: [_jsx(MenuItem, { value: "", children: "All Categories" }), categories.map((category) => (_jsx(MenuItem, { value: category.id, children: category.name }, category.id)))] })] }), loading ? (_jsx("div", { className: "flex justify-center py-16", children: _jsx(CircularProgress, {}) })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "SKU" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Name" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Category" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Cost Price" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Selling Price" }), _jsx("th", { className: "px-6 py-3 text-sm font-semibold text-gray-900", children: "Actions" })] }) }), _jsx("tbody", { children: filteredProducts.map((product) => (_jsxs("tr", { className: "border-b hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: product.sku }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: product.name }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: product.category?.name || 'N/A' }), _jsxs("td", { className: "px-6 py-4 text-sm text-gray-900", children: ["$", product.costPrice?.toFixed(2)] }), _jsxs("td", { className: "px-6 py-4 text-sm text-gray-900", children: ["$", product.sellingPrice?.toFixed(2)] }), _jsxs("td", { className: "px-6 py-4 text-sm space-x-2", children: [_jsx(Button, { size: "small", variant: "outlined", startIcon: _jsx(EditIcon, {}), onClick: () => openEditDialog(product), children: "Edit" }), _jsx(Button, { size: "small", variant: "outlined", color: "error", startIcon: _jsx(DeleteIcon, {}), onClick: () => handleDelete(product.id), children: "Delete" })] })] }, product.id))) })] }) }))] }) }), _jsxs(Dialog, { open: dialogOpen, onClose: () => setDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: editingProductId ? 'Edit Product' : 'Add Product' }), _jsx(DialogContent, { children: _jsxs(Grid, { container: true, spacing: 2, className: "pt-2", children: [_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { label: "Name", variant: "outlined", fullWidth: true, value: formValues.name, onChange: (event) => setFormValues({ ...formValues, name: event.target.value }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { label: "SKU", variant: "outlined", fullWidth: true, value: formValues.sku, onChange: (event) => setFormValues({ ...formValues, sku: event.target.value }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { label: "Barcode", variant: "outlined", fullWidth: true, value: formValues.barcode, onChange: (event) => setFormValues({ ...formValues, barcode: event.target.value }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { label: "Category", variant: "outlined", fullWidth: true, select: true, value: formValues.categoryId, onChange: (event) => setFormValues({ ...formValues, categoryId: event.target.value }), children: categories.map((category) => (_jsx(MenuItem, { value: category.id, children: category.name }, category.id))) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { label: "Unit ID", variant: "outlined", fullWidth: true, value: formValues.unitId, onChange: (event) => setFormValues({ ...formValues, unitId: event.target.value }), helperText: "Use the unit ID from your inventory master data" }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { label: "Brand ID", variant: "outlined", fullWidth: true, value: formValues.brandId, onChange: (event) => setFormValues({ ...formValues, brandId: event.target.value }), helperText: "Optional brand reference" }) }), _jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(TextField, { label: "Cost Price", variant: "outlined", fullWidth: true, type: "number", value: formValues.costPrice, onChange: (event) => setFormValues({ ...formValues, costPrice: Number(event.target.value) }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(TextField, { label: "Selling Price", variant: "outlined", fullWidth: true, type: "number", value: formValues.sellingPrice, onChange: (event) => setFormValues({ ...formValues, sellingPrice: Number(event.target.value) }) }) }), _jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(TextField, { label: "Tax %", variant: "outlined", fullWidth: true, type: "number", value: formValues.tax, onChange: (event) => setFormValues({ ...formValues, tax: Number(event.target.value) }) }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { label: "Description", variant: "outlined", fullWidth: true, multiline: true, rows: 3, value: formValues.description, onChange: (event) => setFormValues({ ...formValues, description: event.target.value }) }) })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setDialogOpen(false), color: "inherit", children: "Cancel" }), _jsx(Button, { onClick: handleDialogSave, variant: "contained", color: "primary", children: "Save" })] })] })] }));
}
//# sourceMappingURL=Products.js.map
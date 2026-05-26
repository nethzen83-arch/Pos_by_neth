import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Grid,
  CircularProgress,
} from '@mui/material';
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
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState<any>(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !lowerSearch ||
        product.name.toLowerCase().includes(lowerSearch) ||
        product.sku?.toLowerCase().includes(lowerSearch) ||
        product.barcode?.toLowerCase().includes(lowerSearch);

      const matchesCategory =
        !selectedCategory || product.category?.id === selectedCategory;

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
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
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

  const openEditDialog = (product: any) => {
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
      } else {
        await productApi.create(formValues);
      }
      const response = await productApi.getAll(1, 100);
      setProducts(response.data.data || []);
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to save product', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productApi.delete(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog and pricing</p>
        </div>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openCreateDialog}>
          Add Product
        </Button>
      </div>

      <Card className="card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <TextField
              label="Search products"
              variant="outlined"
              fullWidth
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <TextField
              label="Category"
              variant="outlined"
              fullWidth
              select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <CircularProgress />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">SKU</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Cost Price</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Selling Price</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{product.sku}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${product.costPrice?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${product.sellingPrice?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEditDialog(product)}>
                          Edit
                        </Button>
                        <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(product.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProductId ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className="pt-2">
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={formValues.name}
                onChange={(event) => setFormValues({ ...formValues, name: event.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="SKU"
                variant="outlined"
                fullWidth
                value={formValues.sku}
                onChange={(event) => setFormValues({ ...formValues, sku: event.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Barcode"
                variant="outlined"
                fullWidth
                value={formValues.barcode}
                onChange={(event) => setFormValues({ ...formValues, barcode: event.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                variant="outlined"
                fullWidth
                select
                value={formValues.categoryId}
                onChange={(event) => setFormValues({ ...formValues, categoryId: event.target.value })}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Unit ID"
                variant="outlined"
                fullWidth
                value={formValues.unitId}
                onChange={(event) => setFormValues({ ...formValues, unitId: event.target.value })}
                helperText="Use the unit ID from your inventory master data"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Brand ID"
                variant="outlined"
                fullWidth
                value={formValues.brandId}
                onChange={(event) => setFormValues({ ...formValues, brandId: event.target.value })}
                helperText="Optional brand reference"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Cost Price"
                variant="outlined"
                fullWidth
                type="number"
                value={formValues.costPrice}
                onChange={(event) => setFormValues({ ...formValues, costPrice: Number(event.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Selling Price"
                variant="outlined"
                fullWidth
                type="number"
                value={formValues.sellingPrice}
                onChange={(event) => setFormValues({ ...formValues, sellingPrice: Number(event.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Tax %"
                variant="outlined"
                fullWidth
                type="number"
                value={formValues.tax}
                onChange={(event) => setFormValues({ ...formValues, tax: Number(event.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={formValues.description}
                onChange={(event) => setFormValues({ ...formValues, description: event.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDialogSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

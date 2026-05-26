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
  CircularProgress,
} from '@mui/material';
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
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saleNote, setSaleNote] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(initialItem);
  const [customerName, setCustomerName] = useState('');

  const filteredSales = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return sales.filter((sale) => {
      return (
        !lowerSearch ||
        sale.invoiceNumber?.toLowerCase().includes(lowerSearch) ||
        sale.customer?.name?.toLowerCase().includes(lowerSearch)
      );
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
      } catch (error) {
        console.error('Failed to load sales data', error);
      } finally {
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

  const handleItemChange = (field: string, value: any) => {
    setSelectedItem((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleProductSelect = (productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (product) {
      setSelectedItem((prev: any) => ({
        ...prev,
        productId,
        unitPrice: product.sellingPrice || 0,
      }));
    }
  };

  const handleCreateSale = async () => {
    if (!selectedItem.productId) return;
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
    } catch (error) {
      console.error('Failed to create sale', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-600">Process invoices and monitor transactions</p>
        </div>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={openNewSaleDialog}>
          New Sale
        </Button>
      </div>

      <Card className="card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <TextField
              label="Search invoice"
              variant="outlined"
              fullWidth
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <TextField label="Customer" variant="outlined" fullWidth disabled value="" />
            <TextField label="Status" variant="outlined" fullWidth disabled value="" />
            <Button variant="contained" color="primary" onClick={() => setSearch(search)}>
              Filter
            </Button>
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
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Invoice #</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Customer</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Total</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{sale.invoiceNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{sale.customer?.name || 'Walk-in'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${sale.totalAmount?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(sale.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <Button size="small" variant="outlined" startIcon={<VisibilityIcon />}>
                          View
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
        <DialogTitle>New Sale</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-2">
            <TextField
              label="Customer Name"
              variant="outlined"
              fullWidth
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
            />
            <TextField
              label="Product"
              variant="outlined"
              fullWidth
              select
              value={selectedItem.productId}
              onChange={(event) => handleProductSelect(event.target.value)}
            >
              <MenuItem value="">Select a product</MenuItem>
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name} · {product.sku}
                </MenuItem>
              ))}
            </TextField>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Quantity"
                type="number"
                variant="outlined"
                fullWidth
                value={selectedItem.quantity}
                onChange={(event) => handleItemChange('quantity', Number(event.target.value))}
              />
              <TextField
                label="Unit Price"
                type="number"
                variant="outlined"
                fullWidth
                value={selectedItem.unitPrice}
                onChange={(event) => handleItemChange('unitPrice', Number(event.target.value))}
              />
              <TextField
                label="Tax %"
                type="number"
                variant="outlined"
                fullWidth
                value={selectedItem.taxPercent}
                onChange={(event) => handleItemChange('taxPercent', Number(event.target.value))}
              />
            </div>
            <TextField
              label="Discount"
              type="number"
              variant="outlined"
              fullWidth
              value={selectedItem.discount}
              onChange={(event) => handleItemChange('discount', Number(event.target.value))}
            />
            <TextField
              label="Notes"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={saleNote}
              onChange={(event) => setSaleNote(event.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleCreateSale} variant="contained" color="primary">
            Create Sale
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

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
  Typography,
  CircularProgress,
} from '@mui/material';
import { Refresh as RefreshIcon, Edit as EditIcon } from '@mui/icons-material';
import { inventoryApi } from '../services/api';

export default function Inventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [adjustopen, setAdjustOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [adjustQuantity, setAdjustQuantity] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');

  useEffect(() => {
    const loadInventory = async () => {
      setLoading(true);
      try {
        const response = await inventoryApi.getAll(1, 100, search);
        setInventory(response.data.data || []);
      } catch (error) {
        console.error('Failed to load inventory', error);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, [search]);

  const filteredInventory = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return inventory.filter((item) => {
      const matchesSearch =
        !lowerSearch ||
        item.product?.name?.toLowerCase().includes(lowerSearch) ||
        item.product?.sku?.toLowerCase().includes(lowerSearch);

      const matchesWarehouse =
        !warehouseFilter || item.warehouse?.id === warehouseFilter;

      return matchesSearch && matchesWarehouse;
    });
  }, [inventory, search, warehouseFilter]);

  const openAdjustDialog = (item: any) => {
    setSelectedItem(item);
    setAdjustQuantity(item.quantity);
    setAdjustReason('Stock correction');
    setAdjustOpen(true);
  };

  const handleAdjustStock = async () => {
    if (!selectedItem) return;
    try {
      await inventoryApi.adjustStock(selectedItem.id, {
        quantity: adjustQuantity,
        reason: adjustReason,
      });
      const response = await inventoryApi.getAll(1, 100, search);
      setInventory(response.data.data || []);
      setAdjustOpen(false);
    } catch (error) {
      console.error('Failed to adjust stock', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600">Manage stock levels and warehouse items</p>
        </div>
        <Button variant="contained" color="primary" startIcon={<RefreshIcon />} onClick={() => setSearch('')}>
          Refresh
        </Button>
      </div>

      <Card className="card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <TextField
              label="Search product"
              variant="outlined"
              fullWidth
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <TextField
              label="Warehouse"
              variant="outlined"
              fullWidth
              value={warehouseFilter}
              onChange={(event) => setWarehouseFilter(event.target.value)}
            />
            <TextField
              label="Stock Status"
              variant="outlined"
              fullWidth
              select
              value={warehouseFilter}
              onChange={(event) => setWarehouseFilter(event.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="low">Low Stock</MenuItem>
              <MenuItem value="ok">In Stock</MenuItem>
            </TextField>
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
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">SKU</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Product</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Quantity</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Available</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Min Stock</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Warehouse</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => {
                    const status = item.availableQty <= item.minStock ? 'Low' : 'OK';
                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{item.product?.sku}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.product?.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.availableQty}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.minStock}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.warehouse?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openAdjustDialog(item)}>
                            Adjust
                          </Button>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status === 'Low' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={adjustopen} onClose={() => setAdjustOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adjust Inventory</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-2">
            <Typography variant="subtitle1" className="font-semibold">
              {selectedItem?.product?.name}
            </Typography>
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={adjustQuantity}
              onChange={(event) => setAdjustQuantity(Number(event.target.value))}
            />
            <TextField
              label="Reason"
              fullWidth
              value={adjustReason}
              onChange={(event) => setAdjustReason(event.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleAdjustStock} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

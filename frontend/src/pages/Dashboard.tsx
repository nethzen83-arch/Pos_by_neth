import { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography, CircularProgress } from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ShoppingCart, TrendingUp, Inventory2, ErrorOutline } from '@mui/icons-material';
import { dashboardApi } from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

const StatCard = ({ icon: Icon, label, value, color = 'blue' }: any) => (
  <Card className="card">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography color="textSecondary" gutterBottom>
            {label}
          </Typography>
          <Typography variant="h5" className="font-bold">
            {typeof value === 'number' ? `$${value.toFixed(2)}` : value}
          </Typography>
        </div>
        <Icon className={`text-${color}-500 text-4xl`} />
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await dashboardApi.getSummary();
        setSummary(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard summary');
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-24">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <Typography variant="h6" className="font-bold text-red-600">
          {error}
        </Typography>
      </div>
    );
  }

  const salesTrendData = summary?.topProducts?.map((product: any) => ({
    name: product.name,
    quantity: product.quantity,
  })) || [];

  const categoryData = summary?.categoryDistribution || [];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Live business metrics and inventory insights</p>
      </div>

      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={ShoppingCart} label="Total Revenue" value={summary.totalRevenue || 0} color="blue" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={TrendingUp} label="Total Profit" value={summary.totalProfit || 0} color="green" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={Inventory2} label="Today's Sales" value={summary.todaySales || 0} color="yellow" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={ErrorOutline} label="Low Stock" value={summary.lowStockCount || 0} color="red" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card className="card">
            <CardContent className="p-6">
              <Typography variant="h6" className="font-bold mb-4">
                Top Selling Products
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={salesTrendData} margin={{ left: -20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="card">
            <CardContent className="p-6">
              <Typography variant="h6" className="font-bold mb-4">
                Inventory Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={45} paddingAngle={2}>
                    {categoryData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card className="card">
            <CardContent className="p-6">
              <Typography variant="h6" className="font-bold mb-4">
                Invoice Summary
              </Typography>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Issued</span>
                  <strong>{summary.invoiceStatusCounts?.ISSUED || 0}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Paid</span>
                  <strong>{summary.invoiceStatusCounts?.PAID || 0}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Partial</span>
                  <strong>{summary.invoiceStatusCounts?.PARTIAL || 0}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Overdue</span>
                  <strong>{summary.invoiceStatusCounts?.OVERDUE || 0}</strong>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

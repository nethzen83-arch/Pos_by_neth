import prisma from '../config/database.js';

export class DashboardService {
  async getSummary(branchId?: string) {
    const salesWhere: any = {
      status: { in: ['ISSUED', 'PAID', 'PARTIAL'] },
    };
    if (branchId) salesWhere.branchId = branchId;

    const [sales, inventory] = await Promise.all([
      prisma.sale.findMany({
        where: salesWhere,
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      }),
      prisma.inventory.findMany({
        where: branchId ? { branchId } : {},
        include: {
          product: true,
          warehouse: true,
        },
      }),
    ]);

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);
    const totalPaid = sales.reduce((sum: number, sale: any) => sum + sale.paidAmount, 0);
    const totalPending = Math.max(totalRevenue - totalPaid, 0);
    const totalProfit = sales.reduce((sum: number, sale: any) => {
      return (
        sum +
        sale.items.reduce((itemSum: number, item: any) => {
          const costPrice = item.product.costPrice || 0;
          return itemSum + (item.unitPrice - costPrice) * item.quantity;
        }, 0)
      );
    }, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySales = sales
      .filter((sale: any) => sale.createdAt >= today && sale.createdAt < tomorrow)
      .reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);

    const lowStockCount = inventory.filter((item: any) => item.availableQty <= item.minStock).length;

    const productDistribution = inventory.reduce((acc: Record<string, number>, item: any) => {
      const categoryName = item.product.category?.name || 'Uncategorized';
      acc[categoryName] = (acc[categoryName] || 0) + item.quantity;
      return acc;
    }, {});

    const categoryDistribution = Object.entries(productDistribution).map(([name, value]) => ({
      name,
      value,
    }));

    const topSellingProducts = sales
      .flatMap((sale: any) => sale.items)
      .reduce((acc: Record<string, { name: string; quantity: number }>, item: any) => {
        const key = item.productId;
        const productName = item.product.name;
        if (!acc[key]) {
          acc[key] = { name: productName, quantity: 0 };
        }
        acc[key].quantity += item.quantity;
        return acc;
      }, {});

    const topProducts = Object.values(topSellingProducts as Record<string, { name: string; quantity: number }>)
      .sort((a: { name: string; quantity: number }, b: { name: string; quantity: number }) => b.quantity - a.quantity)
      .slice(0, 5);

    const invoiceStatusCounts = {
      ISSUED: sales.filter((sale: any) => sale.status === 'ISSUED').length,
      PAID: sales.filter((sale: any) => sale.status === 'PAID').length,
      PARTIAL: sales.filter((sale: any) => sale.status === 'PARTIAL').length,
      OVERDUE: sales.filter((sale: any) => sale.status === 'OVERDUE').length,
    };

    return {
      totalSales,
      totalRevenue,
      totalPaid,
      totalPending,
      totalProfit,
      todaySales,
      lowStockCount,
      categoryDistribution,
      topProducts,
      invoiceStatusCounts,
    };
  }
}

export default new DashboardService();

import prisma from '../config/database.js';

export class ReportService {
  async getSalesReport(startDate: Date, endDate: Date, branchId?: string) {
    const where: any = {
      createdAt: { gte: startDate, lte: endDate },
      status: { in: ['ISSUED', 'PAID', 'PARTIAL'] },
    };

    if (branchId) where.branchId = branchId;

    const sales = await prisma.sale.findMany({
      where,
      include: {
        items: true,
        payments: true,
      },
    });

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum: number, s: any) => sum + s.totalAmount, 0);
    const totalPaid = sales.reduce((sum: number, s: any) => sum + s.paidAmount, 0);
    const totalProfit = sales.reduce((sum: number, s: any) => {
      return (
        sum +
        s.items.reduce((itemSum: number, item: any) => {
          const profit = (item.unitPrice - 5) * item.quantity; // Simplified
          return itemSum + profit;
        }, 0)
      );
    }, 0);

    return {
      period: { startDate, endDate },
      totalSales,
      totalRevenue,
      totalPaid,
      totalDue: totalRevenue - totalPaid,
      totalProfit,
      averageTransaction: totalRevenue / totalSales || 0,
      profitMargin: ((totalProfit / totalRevenue) * 100).toFixed(2),
    };
  }

  async getInventoryReport(branchId?: string) {
    const where: any = {};
    if (branchId) where.branchId = branchId;

    const items = await prisma.inventory.findMany({
      where,
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    const totalItems = items.length;
    const totalValue = items.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.product.sellingPrice;
    }, 0);

    const lowStock = items.filter((i: any) => i.availableQty <= i.minStock).length;
    const overstocked = items.filter((i: any) => i.quantity > i.maxStock).length;

    return {
      totalItems,
      totalValue,
      lowStock,
      overstocked,
      items,
    };
  }

  async getCustomerReport(branchId?: string) {
    const customers = await prisma.customer.findMany({
      include: {
        sales: {
          include: {
            payments: true,
          },
        },
        group: true,
      },
    });

    const totalCustomers = customers.length;
    const totalDebt = customers.reduce((sum: number, c: any) => sum + c.currentDebt, 0);

    const topCustomers = customers
      .sort(
        (a: any, b: any) =>
          b.sales.reduce((sum: number, s: any) => sum + s.totalAmount, 0) -
          a.sales.reduce((sum: number, s: any) => sum + s.totalAmount, 0),
      )
      .slice(0, 10);

    return {
      totalCustomers,
      totalDebt,
      topCustomers,
      byGroup: customers.reduce(
        (acc: Record<string, number>, c: any) => {
          const groupName = c.group?.name || 'No Group';
          acc[groupName] = (acc[groupName] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  async getProfitLossReport(startDate: Date, endDate: Date) {
    const where = { createdAt: { gte: startDate, lte: endDate } };

    const [sales, purchases] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: { items: true },
      }),
      prisma.purchase.findMany({
        where,
        include: { items: true },
      }),
    ]);

    const revenue = sales.reduce((sum: number, s: any) => sum + s.totalAmount, 0);
    const cost = purchases.reduce((sum: number, p: any) => sum + p.totalAmount, 0);
    const profit = revenue - cost;

    return {
      period: { startDate, endDate },
      revenue,
      cost,
      profit,
      profitMargin: ((profit / revenue) * 100).toFixed(2),
    };
  }
}

export default new ReportService();

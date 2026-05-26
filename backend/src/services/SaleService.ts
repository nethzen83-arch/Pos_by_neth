import prisma from '../config/database.js';
import { generateInvoiceNumber, calculateLineTotal } from '../utils/helpers.js';
import { ERROR_MESSAGES } from '../constants/index.js';

export class SaleService {
  async createSale(data: any, userId: string, branchId: string) {
    const invoiceNumber = await generateInvoiceNumber('SALE');

    // Validate items
    if (!data.items || data.items.length === 0) {
      throw new Error('Sale must have at least one item');
    }

    // Calculate totals
    let subTotal = 0;
    let taxAmount = 0;

    const items = data.items.map((item: any) => {
      const lineTotal = calculateLineTotal(
        item.quantity,
        item.unitPrice,
        item.discount || 0,
        item.discountPercent || 0,
      );
      subTotal += lineTotal;

      const itemTax = (lineTotal * (item.taxPercent || 0)) / 100;
      taxAmount += itemTax;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        discountPercent: item.discountPercent || 0,
        taxAmount: itemTax,
        lineTotal,
        batch: item.batch,
        expiryDate: item.expiryDate,
      };
    });

    const discountAmount = data.discountAmount || 0;
    const totalAmount = subTotal + taxAmount - discountAmount;

    // Create sale
    const sale = await prisma.sale.create({
      data: {
        invoiceNumber,
        branchId,
        customerId: data.customerId,
        status: 'ISSUED',
        saleType: data.saleType || 'REGULAR',
        subTotal,
        taxAmount,
        discountAmount,
        totalAmount,
        dueAmount: totalAmount,
        items: {
          create: items,
        },
        notes: data.notes,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });

    // Update inventory
    for (const item of data.items) {
      await this.updateInventoryForSale(item.productId, item.quantity, branchId);
    }

    return sale;
  }

  async recordPayment(saleId: string, data: any) {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: { payments: true },
    });

    if (!sale) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND);
    }

    const totalPaid = sale.paidAmount + data.amount;

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        referenceNumber: `PAY-${Date.now()}`,
        saleId,
        customerId: sale.customerId || '',
        method: data.method,
        amount: data.amount,
        status: 'COMPLETED',
        transactionId: data.transactionId,
        notes: data.notes,
      },
    });

    // Update sale status
    let newStatus = 'PARTIAL';
    if (totalPaid >= sale.totalAmount) {
      newStatus = 'PAID';
    }

    await prisma.sale.update({
      where: { id: saleId },
      data: {
        paidAmount: totalPaid,
        dueAmount: sale.totalAmount - totalPaid,
        status: newStatus as any,
      },
    });

    return payment;
  }

  async getSale(id: string) {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                unit: true,
              },
            },
          },
        },
        customer: true,
        payments: true,
        branch: true,
      },
    });

    if (!sale) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND);
    }

    return sale;
  }

  async getSales(
    page = 1,
    pageSize = 10,
    branchId?: string,
    status?: string,
    search?: string,
  ) {
    const skip = (page - 1) * pageSize;
    const where: any = {};

    if (branchId) where.branchId = branchId;
    if (status) where.status = status;

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          items: true,
          customer: true,
          payments: true,
          branch: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sale.count({ where }),
    ]);

    return {
      data: sales,
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize),
    };
  }

  async getSalesReport(startDate: Date, endDate: Date, branchId?: string) {
    const where: any = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
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
    const totalRevenue = sales.reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);
    const totalPaid = sales.reduce((sum: number, sale: any) => sum + sale.paidAmount, 0);
    const totalPending = totalRevenue - totalPaid;

    return {
      totalSales,
      totalRevenue,
      totalPaid,
      totalPending,
      averageTransaction: totalRevenue / totalSales,
      salesByStatus: {
        paid: sales.filter((s: any) => s.status === 'PAID').length,
        partial: sales.filter((s: any) => s.status === 'PARTIAL').length,
        pending: sales.filter((s: any) => s.status === 'ISSUED').length,
      },
    };
  }

  private async updateInventoryForSale(
    productId: string,
    quantity: number,
    branchId: string,
  ) {
    const inventory = await prisma.inventory.findFirst({
      where: {
        productId,
        branchId,
      },
    });

    if (inventory) {
      const newQuantity = inventory.quantity - quantity;

      await prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          quantity: newQuantity,
          availableQty: Math.max(0, newQuantity - inventory.reservedQty),
        },
      });

      // Record stock movement
      await prisma.stockMovement.create({
        data: {
          inventoryId: inventory.id,
          type: 'OUT',
          quantity,
          reason: 'SALE',
        },
      });
    }
  }
}

export default new SaleService();

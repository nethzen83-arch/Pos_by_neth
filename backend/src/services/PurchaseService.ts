import prisma from '../config/database.js';
import { ERROR_MESSAGES } from '../constants/index.js';

export class PurchaseService {
  async createPurchase(data: any, branchId: string) {
    const poNumber = `PO-${Date.now()}`;

    if (!data.items || data.items.length === 0) {
      throw new Error('Purchase must have at least one item');
    }

    let subTotal = 0;
    let taxAmount = 0;

    const items = data.items.map((item: any) => {
      const lineTotal = item.quantity * item.unitPrice - (item.discount || 0);
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
      };
    });

    const discountAmount = data.discountAmount || 0;
    const totalAmount = subTotal + taxAmount - discountAmount;

    const purchase = await prisma.purchase.create({
      data: {
        poNumber,
        branchId,
        supplierId: data.supplierId,
        status: 'PENDING',
        subTotal,
        taxAmount,
        discountAmount,
        totalAmount,
        dueAmount: totalAmount,
        items: {
          create: items,
        },
        notes: data.notes,
        expectedDate: data.expectedDate,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        supplier: true,
      },
    });

    return purchase;
  }

  async getPurchases(page = 1, pageSize = 10, status?: string) {
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (status) where.status = status;

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          items: true,
          supplier: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.purchase.count({ where }),
    ]);

    return {
      data: purchases,
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize),
    };
  }

  async getPurchaseById(id: string) {
    const purchase = await prisma.purchase.findUnique({
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
        supplier: true,
        payments: true,
        branch: true,
      },
    });

    if (!purchase) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND);
    }

    return purchase;
  }

  async receivePurchaseItems(purchaseId: string, items: any[]) {
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: { items: true },
    });

    if (!purchase) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND);
    }

    for (const item of items) {
      const purchaseItem = purchase.items.find((pi: any) => pi.id === item.id);
      if (!purchaseItem) continue;

      // Update received quantity
      await prisma.purchaseItem.update({
        where: { id: item.id },
        data: { receivedQty: item.receivedQty },
      });

      // Update inventory
      await this.updateInventoryFromPurchase(
        purchaseItem.productId,
        item.receivedQty,
        purchase.branchId,
      );
    }

    return this.getPurchaseById(purchaseId);
  }

  private async updateInventoryFromPurchase(
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
      const newQuantity = inventory.quantity + quantity;

      await prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          quantity: newQuantity,
          availableQty: newQuantity - inventory.reservedQty,
        },
      });

      await prisma.stockMovement.create({
        data: {
          inventoryId: inventory.id,
          type: 'IN',
          quantity,
          reason: 'PURCHASE',
        },
      });
    }
  }
}

export default new PurchaseService();

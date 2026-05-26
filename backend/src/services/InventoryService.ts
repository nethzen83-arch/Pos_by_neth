import prisma from '../config/database.js';
import { ERROR_MESSAGES } from '../constants/index.js';

export class InventoryService {
  async getInventory(
    page = 1,
    pageSize = 10,
    branchId?: string,
    warehouseId?: string,
    search?: string,
  ) {
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (branchId) where.branchId = branchId;
    if (warehouseId) where.warehouseId = warehouseId;

    if (search) {
      where.product = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const [items, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          product: {
            include: {
              category: true,
              unit: true,
            },
          },
          branch: true,
          warehouse: true,
          variant: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.inventory.count({ where }),
    ]);

    return {
      data: items,
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize),
    };
  }

  async getProductStock(productId: string, branchId: string) {
    return prisma.inventory.findMany({
      where: {
        productId,
        branchId,
      },
      include: {
        warehouse: true,
        variant: true,
      },
    });
  }

  async recordStockMovement(data: any) {
    // Get current inventory
    const inventory = await prisma.inventory.findUnique({
      where: { id: data.inventoryId },
    });

    if (!inventory) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND);
    }

    // Calculate new quantity
    let newQuantity = inventory.quantity;
    if (data.type === 'IN' || data.type === 'RETURN') {
      newQuantity += data.quantity;
    } else if (data.type === 'OUT' || data.type === 'TRANSFER') {
      newQuantity -= data.quantity;
    }

    // Record movement
    const movement = await prisma.stockMovement.create({
      data: {
        inventoryId: data.inventoryId,
        type: data.type,
        quantity: data.quantity,
        reason: data.reason,
        reference: data.reference,
      },
    });

    // Update inventory
    await prisma.inventory.update({
      where: { id: data.inventoryId },
      data: {
        quantity: newQuantity,
        availableQty: newQuantity - inventory.reservedQty,
        updatedAt: new Date(),
      },
    });

    return movement;
  }

  async adjustStock(inventoryId: string, quantity: number, reason: string) {
    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!inventory) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND);
    }

    const difference = quantity - inventory.quantity;
    if (difference === 0) {
      return inventory;
    }

    const movementType = difference > 0 ? 'IN' : 'OUT';
    const movementQuantity = Math.abs(difference);

    await prisma.stockMovement.create({
      data: {
        inventoryId,
        type: movementType,
        quantity: movementQuantity,
        reason,
      },
    });

    return prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        quantity,
        availableQty: Math.max(0, quantity - inventory.reservedQty),
        updatedAt: new Date(),
      },
    });
  }

  async getLowStockItems(branchId?: string) {
    const where: any = {};
    if (branchId) where.branchId = branchId;

    const allItems = await prisma.inventory.findMany({
      where,
      include: {
        product: {
          include: {
            category: true,
          },
        },
        warehouse: true,
      },
      orderBy: { availableQty: 'asc' },
    });

    return allItems.filter((item: any) => item.availableQty <= item.minStock);
  }

  async getExpiryAlerts(days = 30) {
    const alertDate = new Date();
    alertDate.setDate(alertDate.getDate() + days);

    return prisma.inventory.findMany({
      where: {
        expiryDate: {
          lte: alertDate,
          gte: new Date(),
        },
        quantity: {
          gt: 0,
        },
      },
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: { expiryDate: 'asc' },
    });
  }
}

export default new InventoryService();

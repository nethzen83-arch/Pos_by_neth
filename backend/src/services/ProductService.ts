import prisma from '../config/database.js';
import { ERROR_MESSAGES } from '../constants/index.js';

export class ProductService {
  async createProduct(data: any) {
    // Check if SKU exists
    const existing = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existing) {
      throw new Error('Product with this SKU already exists');
    }

    const product = await prisma.product.create({
      data: {
        sku: data.sku,
        barcode: data.barcode,
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        brandId: data.brandId,
        costPrice: data.costPrice,
        sellingPrice: data.sellingPrice,
        profitMargin: data.sellingPrice - data.costPrice,
        tax: data.tax || 0,
        unitId: data.unitId,
        imageUrl: data.imageUrl,
      },
      include: {
        category: true,
        brand: true,
        unit: true,
      },
    });

    return product;
  }

  async getProducts(
    page = 1,
    pageSize = 10,
    search?: string,
    categoryId?: string,
  ) {
    const skip = (page - 1) * pageSize;

    const where: any = { active: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          category: true,
          brand: true,
          unit: true,
          variants: true,
          prices: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize),
    };
  }

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        unit: true,
        variants: true,
        prices: true,
        inventories: {
          include: {
            warehouse: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND);
    }

    return product;
  }

  async updateProduct(id: string, data: any) {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        costPrice: data.costPrice,
        sellingPrice: data.sellingPrice,
        profitMargin: data.sellingPrice - data.costPrice,
        tax: data.tax,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        brandId: data.brandId,
        unitId: data.unitId,
      },
      include: {
        category: true,
        brand: true,
        unit: true,
      },
    });

    return product;
  }

  async deleteProduct(id: string) {
    await prisma.product.update({
      where: { id },
      data: { active: false },
    });
  }

  async createCategory(data: any) {
    const category = await prisma.productCategory.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description,
        parentId: data.parentId,
      },
    });

    return category;
  }

  async getCategories() {
    return prisma.productCategory.findMany({
      include: {
        subCategories: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}

export default new ProductService();

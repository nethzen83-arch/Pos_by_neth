import prisma from '../config/database.js';
import { ERROR_MESSAGES } from '../constants/index.js';

export class CustomerService {
  async createCustomer(data: any) {
    const existing = await prisma.customer.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new Error('Customer with this code already exists');
    }

    const customer = await prisma.customer.create({
      data: {
        code: data.code,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        type: data.type || 'RETAIL',
        taxId: data.taxId,
        creditLimit: data.creditLimit || 0,
        groupId: data.groupId,
      },
      include: {
        group: true,
      },
    });

    return customer;
  }

  async getCustomers(page = 1, pageSize = 10, search?: string) {
    const skip = (page - 1) * pageSize;

    const where: any = { active: true };

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          group: true,
          sales: {
            select: { totalAmount: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      data: customers,
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize),
    };
  }

  async getCustomerById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        group: true,
        sales: {
          include: {
            payments: true,
          },
        },
      },
    });

    if (!customer) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND);
    }

    return customer;
  }

  async updateCustomer(id: string, data: any) {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        creditLimit: data.creditLimit,
      },
    });

    return customer;
  }

  async getCustomerDebt(customerId: string) {
    const sales = await prisma.sale.findMany({
      where: {
        customerId,
        status: { in: ['ISSUED', 'PARTIAL', 'OVERDUE'] },
      },
      include: {
        payments: true,
      },
    });

    const totalDebt = sales.reduce((sum: number, sale: any) => sum + sale.dueAmount, 0);

    return {
      customerId,
      totalDebt,
      sales: sales.length,
      overdue: sales.filter((s: any) => s.status === 'OVERDUE').length,
    };
  }
}

export default new CustomerService();

// Prisma seed file for seeding initial data
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
    console.log('Seeding database...');
    // Create branches
    const branch1 = await prisma.branch.create({
        data: {
            code: 'BRANCH001',
            name: 'Main Branch',
            address: '123 Main St',
            city: 'Phnom Penh',
            state: 'Phnom Penh',
            zipCode: '12000',
            country: 'Cambodia',
            phoneNumber: '023123456',
            email: 'main@nethsys.com',
        },
    });
    console.log('✓ Branch created:', branch1.code);
    // Create warehouse
    const warehouse1 = await prisma.warehouse.create({
        data: {
            code: 'WH001',
            name: 'Main Warehouse',
            address: '456 Warehouse Ave',
            capacity: 10000,
            usedCapacity: 0,
        },
    });
    console.log('✓ Warehouse created:', warehouse1.code);
    // Create units
    const unitPcs = await prisma.unit.create({
        data: {
            code: 'PCS',
            name: 'Piece',
            symbol: 'pcs',
        },
    });
    const unitBox = await prisma.unit.create({
        data: {
            code: 'BOX',
            name: 'Box',
            symbol: 'box',
        },
    });
    console.log('✓ Units created');
    // Create categories
    const catCosmetics = await prisma.productCategory.create({
        data: {
            code: 'COSMETICS',
            name: 'Cosmetics',
            description: 'Cosmetic and beauty products',
        },
    });
    const catFood = await prisma.productCategory.create({
        data: {
            code: 'FOOD',
            name: 'Food & Beverages',
            description: 'Food and beverage items',
        },
    });
    console.log('✓ Categories created');
    // Create brands
    const brandLocal = await prisma.brand.create({
        data: {
            code: 'LOCAL',
            name: 'Local Brand',
            description: 'Local Cambodian products',
        },
    });
    console.log('✓ Brands created');
    // Create products
    const product1 = await prisma.product.create({
        data: {
            sku: 'PROD001001',
            barcode: '1234567890123',
            name: 'Face Cream',
            description: 'Premium moisturizing face cream',
            categoryId: catCosmetics.id,
            brandId: brandLocal.id,
            costPrice: 5,
            sellingPrice: 15,
            profitMargin: 10,
            tax: 0,
            unitId: unitPcs.id,
        },
    });
    const product2 = await prisma.product.create({
        data: {
            sku: 'PROD002001',
            barcode: '1234567890124',
            name: 'Coffee',
            description: 'Premium arabica coffee',
            categoryId: catFood.id,
            brandId: brandLocal.id,
            costPrice: 3,
            sellingPrice: 8,
            profitMargin: 5,
            tax: 5,
            unitId: unitBox.id,
        },
    });
    console.log('✓ Products created');
    // Create users
    const passwordHash = await bcryptjs.hash('password123', 10);
    const adminUser = await prisma.user.create({
        data: {
            username: 'admin',
            email: 'admin@nethsys.com',
            passwordHash,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            status: 'ACTIVE',
            branchId: branch1.id,
        },
    });
    const cashierUser = await prisma.user.create({
        data: {
            username: 'cashier',
            email: 'cashier@nethsys.com',
            passwordHash,
            firstName: 'Cashier',
            lastName: 'User',
            role: 'CASHIER',
            status: 'ACTIVE',
            branchId: branch1.id,
        },
    });
    console.log('✓ Users created');
    // Create customer groups
    const groupRetail = await prisma.customerGroup.create({
        data: {
            code: 'RETAIL',
            name: 'Retail Customers',
            discountPercent: 0,
        },
    });
    const groupWholesale = await prisma.customerGroup.create({
        data: {
            code: 'WHOLESALE',
            name: 'Wholesale Customers',
            discountPercent: 10,
        },
    });
    console.log('✓ Customer groups created');
    // Create customers
    const customer1 = await prisma.customer.create({
        data: {
            code: 'CUST001',
            name: 'John Doe',
            email: 'john@example.com',
            phoneNumber: '0123456789',
            address: '123 Main St',
            city: 'Phnom Penh',
            type: 'RETAIL',
            groupId: groupRetail.id,
            creditLimit: 0,
        },
    });
    console.log('✓ Customers created');
    // Create suppliers
    const supplier1 = await prisma.supplier.create({
        data: {
            code: 'SUP001',
            name: 'ABC Wholesale',
            email: 'abc@supplier.com',
            phoneNumber: '0987654321',
            address: '456 Supplier Ave',
            city: 'Phnom Penh',
            creditLimit: 5000,
        },
    });
    console.log('✓ Suppliers created');
    // Create bank account
    const bankAccount = await prisma.bankAccount.create({
        data: {
            code: 'BANK001',
            accountName: 'Main Account',
            accountNumber: '1234567890',
            bankName: 'ABC Bank',
            branchId: branch1.id,
            balance: 10000,
            currency: 'USD',
        },
    });
    console.log('✓ Bank account created');
    // Create inventory items
    const inventory1 = await prisma.inventory.create({
        data: {
            productId: product1.id,
            branchId: branch1.id,
            warehouseId: warehouse1.id,
            quantity: 100,
            reservedQty: 0,
            availableQty: 100,
            minStock: 10,
            maxStock: 500,
        },
    });
    const inventory2 = await prisma.inventory.create({
        data: {
            productId: product2.id,
            branchId: branch1.id,
            warehouseId: warehouse1.id,
            quantity: 50,
            reservedQty: 0,
            availableQty: 50,
            minStock: 5,
            maxStock: 200,
        },
    });
    console.log('✓ Inventory items created');
    console.log(`
    ╔═══════════════════════════════════════╗
    ║     Database Seeding Complete        ║
    ║                                       ║
    ║   Test Login Credentials:            ║
    ║   Email: admin@nethsys.com           ║
    ║   Password: password123              ║
    ║                                       ║
    ║   OR                                  ║
    ║   Email: cashier@nethsys.com         ║
    ║   Password: password123              ║
    ╚═══════════════════════════════════════╝
  `);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
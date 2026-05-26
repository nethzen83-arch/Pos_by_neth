# Neth ERP System - Development Guide

## Getting Started with Development

### Development Environment Setup

#### Windows Setup
```bash
# Install Node.js (LTS)
# From https://nodejs.org/

# Install Docker Desktop
# From https://www.docker.com/products/docker-desktop

# Install PostgreSQL (optional for local dev)
# From https://www.postgresql.org/download/windows/

# Clone the project
git clone <repository-url>
cd neth-erp-system

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

#### macOS Setup
```bash
# Using Homebrew
brew install node@20
brew install docker
brew install postgresql@16

# Clone and install
git clone <repository-url>
cd neth-erp-system
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

#### Linux Setup
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm postgresql docker.io

# Clone and install
git clone <repository-url>
cd neth-erp-system
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

---

## Development Workflow

### 1. Backend Development

#### Database Setup
```bash
cd backend

# Create .env file
cp .env.example .env

# Update DATABASE_URL for local PostgreSQL
# DATABASE_URL="postgresql://username:password@localhost:5432/neth_erp_db"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database
npm run prisma:seed

# (Optional) Open Prisma Studio
npx prisma studio
```

#### Running Backend
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

#### API Testing
```bash
# Using curl
curl -X GET http://localhost:3000/api/health

# Using Postman
# Import postman-collection.json (create one in postman/)

# Using Thunder Client in VS Code
# Create requests in .thunder/
```

### 2. Frontend Development

#### Running Frontend
```bash
cd frontend

# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview build locally
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check
```

#### Hot Module Replacement (HMR)
- Automatically enabled in development
- Component changes reflect instantly
- State is preserved (when possible)

### 3. Database Development

#### Common Commands
```bash
# Connect to PostgreSQL
psql postgresql://username:password@localhost:5432/neth_erp_db

# List all tables
\dt

# Describe table
\d table_name

# Query data
SELECT * FROM "User";

# Exit
\q
```

#### Prisma Commands
```bash
# Create new migration
npx prisma migrate dev --name add_new_field

# Apply pending migrations
npx prisma migrate deploy

# Reset database (CAUTION: deletes all data)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# Format schema.prisma
npx prisma format

# Lint schema.prisma
npx prisma validate
```

---

## Code Standards

### TypeScript Guidelines

#### Type Definitions
```typescript
// ✅ Good: Use interfaces for objects
interface User {
  id: string;
  email: string;
  firstName: string;
}

// ✅ Good: Use types for unions
type UserRole = 'ADMIN' | 'CASHIER' | 'MANAGER';

// ❌ Avoid: Using 'any'
let data: any; // Don't do this

// ✅ Good: Use proper typing
let data: unknown;
```

#### Function Typing
```typescript
// ✅ Good
async function fetchProducts(page: number): Promise<Product[]> {
  // ...
}

// ❌ Avoid
async function fetchProducts(page) {
  // ...
}
```

### Naming Conventions

#### Files
```
src/
├── services/ProductService.ts     # PascalCase + Service suffix
├── controllers/ProductController.ts
├── utils/formatters.ts             # camelCase
├── constants/index.ts              # camelCase
├── types/index.ts                  # camelCase
└── middleware/authMiddleware.ts    # camelCase + Middleware suffix
```

#### Variables & Functions
```typescript
// ✅ Good
const isActive = true;
const userId = "123";
function getUserById(id: string) {}

// ❌ Avoid
const is_active = true;
const USERID = "123";
function get_user_by_id(id: string) {}
```

#### Constants
```typescript
// ✅ Good
const DEFAULT_PAGE_SIZE = 10;
const ERROR_MESSAGES = {
  INVALID_EMAIL: "Invalid email",
  NOT_FOUND: "Resource not found",
};

// ❌ Avoid
const defaultPageSize = 10;
const errorMessages = { INVALID_EMAIL: "Invalid email" };
```

### React Component Guidelines

#### Component Structure
```typescript
// ✅ Good: Functional component with hooks
import React, { useState, useEffect } from 'react';

interface ComponentProps {
  title: string;
  onClose?: () => void;
}

const MyComponent: React.FC<ComponentProps> = ({ title, onClose }) => {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    // Setup
  }, []);

  return (
    <div className="component">
      <h1>{title}</h1>
    </div>
  );
};

export default MyComponent;
```

#### Hooks Usage
```typescript
// ✅ Good: Custom hooks for logic reuse
export const useFetch = (url: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Fetch logic
  }, [url]);
  
  return { data, loading };
};

// ✅ Good: Using Redux hooks
const { user } = useAuth();
const { selectedProduct } = useAppSelector((state) => state.product);
```

### Backend Code Structure

#### Service Layer
```typescript
// ✅ Good: Business logic in services
class ProductService {
  async getProduct(id: string): Promise<Product> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  }
}
```

#### Controller Layer
```typescript
// ✅ Good: Controllers handle HTTP
async function getProduct(req: Request, res: Response) {
  try {
    const product = await ProductService.getProduct(req.params.id);
    res.json(success(product, 'Product retrieved'));
  } catch (error) {
    res.status(404).json(error(error.message));
  }
}
```

---

## Git Workflow

### Branch Naming
```
feature/add-customer-management      # New feature
bugfix/fix-inventory-calculation     # Bug fix
hotfix/critical-security-issue       # Urgent fix
refactor/improve-api-performance     # Refactoring
docs/update-api-documentation        # Documentation
```

### Commit Messages
```bash
# ✅ Good commit messages
git commit -m "feat: add customer loyalty points system"
git commit -m "fix: resolve inventory stock calculation error"
git commit -m "docs: update API documentation for sales"

# ❌ Avoid
git commit -m "updates"
git commit -m "changes"
git commit -m "fix bugs"
```

### Push & Pull Request
```bash
# Create feature branch
git checkout -b feature/add-reports

# Make changes and commit
git add .
git commit -m "feat: add sales report generation"

# Push to remote
git push origin feature/add-reports

# Create Pull Request on GitHub
# - Add description
# - Link related issues
# - Request reviewers
# - Wait for approval
# - Merge to develop
```

---

## Testing

### Backend Testing

#### Unit Tests
```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

#### Test Example
```typescript
describe('ProductService', () => {
  it('should get product by id', async () => {
    const product = await ProductService.getProduct('123');
    expect(product).toBeDefined();
    expect(product.id).toBe('123');
  });
});
```

### Frontend Testing
```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### E2E Testing
```bash
# Run Cypress
npm run cypress

# Open Cypress Studio
npm run cypress:open
```

---

## Debugging

### Backend Debugging

#### Using VS Code Debugger
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/dist/index.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

#### Using Console Logs
```typescript
// Add debug output
console.log('Product data:', product);
console.error('Error creating sale:', error);
```

#### Prisma Debugging
```typescript
// Enable query logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Frontend Debugging

#### Redux DevTools
- Install Redux DevTools browser extension
- Opens Redux state time-traveling debugger
- View action history and state changes

#### React DevTools
- Install React Developer Tools extension
- Inspect component tree
- View component props and state

#### Console Logging
```typescript
console.log('Fetching products:', { page, limit });
console.error('API Error:', error.response);
```

---

## Performance Optimization

### Backend

#### Database Optimization
```typescript
// ✅ Use select to fetch only needed fields
const product = await prisma.product.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    price: true,
  },
});

// ✅ Use include strategically
const sale = await prisma.sale.findUnique({
  where: { id },
  include: {
    items: true,
    customer: true,
  },
});
```

#### Query Optimization
```typescript
// ✅ Batch queries
const [products, count] = await Promise.all([
  prisma.product.findMany(),
  prisma.product.count(),
]);

// ✅ Use pagination
const products = await prisma.product.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
});
```

### Frontend

#### Component Optimization
```typescript
// ✅ Memoize expensive components
const ProductList = React.memo(({ products }) => {
  return products.map(p => <ProductItem key={p.id} product={p} />);
});

// ✅ Use useCallback for event handlers
const handleClick = useCallback(() => {
  // handler logic
}, [dependency]);
```

#### Bundle Optimization
```typescript
// ✅ Code splitting with React.lazy
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// ✅ Dynamic imports
const { Chart } = await import('recharts');
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Code review completed
- [ ] Environment variables updated
- [ ] Database migrations tested
- [ ] Security audit completed

### Deployment
- [ ] Database backed up
- [ ] Migrations applied
- [ ] Environment variables set
- [ ] Services started
- [ ] Health checks passed
- [ ] Monitoring enabled

### Post-Deployment
- [ ] Smoke tests passed
- [ ] Logs checked for errors
- [ ] Performance metrics normal
- [ ] User feedback monitored

---

## Resources & References

### Documentation
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tools & Extensions
- VS Code
- Thunder Client (API testing)
- Postman (API testing)
- Redux DevTools
- React DevTools
- Prettier (code formatter)
- ESLint (code linter)

### Learning Resources
- [Egghead.io Courses](https://egghead.io/)
- [Udemy Courses](https://www.udemy.com/)
- [CSS-Tricks](https://css-tricks.com/)
- [Dev.to](https://dev.to/)
- [Stack Overflow](https://stackoverflow.com/)

---

## Troubleshooting Development Issues

### Common Issues & Solutions

#### Issue: "Cannot find module"
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "Port already in use"
```bash
# Solution: Kill process using port
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

#### Issue: "Database connection refused"
```bash
# Solution: Check PostgreSQL is running
# Restart Docker
docker-compose restart neth_erp_db
```

#### Issue: "Hot reload not working"
```bash
# Solution: Restart dev server
npm run dev  # Kill with Ctrl+C and restart
```

---

## Getting Help

1. **Check Documentation**: Review relevant .md files
2. **Search Issues**: Look for similar problems on GitHub
3. **Check Logs**: Review application/server logs
4. **Ask Community**: Post on Stack Overflow, GitHub Discussions
5. **Contact Support**: Email support@nethsys.com

---

**Happy Developing! 🚀**

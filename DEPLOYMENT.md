# Neth ERP System - Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 14+ (for local development)
- Git

## Quick Start with Docker

### 1. Clone and Setup

```bash
cd neth-erp-system
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Update Environment Variables

Edit `backend/.env`:
```
DATABASE_URL=postgresql://erp_user:erp_password_secure@db:5432/neth_erp_db
JWT_SECRET=change-this-to-a-secure-random-string
CORS_ORIGIN=http://localhost:3001
```

### 3. Start Services

```bash
docker-compose up -d
```

### 4. Initialize Database

```bash
docker exec neth_erp_backend npx prisma migrate deploy
docker exec neth_erp_backend npm run prisma:seed
```

### 5. Access Application

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api
- API Health: http://localhost:3000/api/health

**Demo Credentials:**
- Email: admin@nethsys.com
- Password: password123

## Local Development Setup

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Update DATABASE_URL in .env to your local PostgreSQL
# Run migrations
npx prisma migrate deploy
npm run prisma:seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env

# Start development server
npm run dev
```

## Project Structure

```
neth-erp-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/      # Route controllers
│   │   ├── services/         # Business logic
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   ├── validators/       # Input validation
│   │   ├── utils/            # Utility functions
│   │   ├── constants/        # Constants
│   │   └── index.ts          # Entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Seed data
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── layouts/          # Layout components
│   │   ├── store/            # Redux store
│   │   ├── services/         # API services
│   │   ├── hooks/            # Custom hooks
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utilities
│   │   ├── styles/           # Global styles
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── docker-compose.yml        # Docker orchestration
└── README.md                 # Documentation
```

## Database Schema

The system uses PostgreSQL with Prisma ORM. Key entities:

- **Users**: System users with role-based access
- **Products**: Product catalog with categories and variants
- **Inventory**: Stock management per branch/warehouse
- **Sales**: Sales invoices and transactions
- **Purchases**: Purchase orders and supplier transactions
- **Customers**: Customer profiles and groups
- **Suppliers**: Supplier management
- **Accounting**: Financial transactions and journals

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories` - List categories

### Sales
- `GET /api/sales` - List sales
- `POST /api/sales` - Create sale
- `GET /api/sales/:id` - Get sale details
- `POST /api/sales/:id/payments` - Record payment
- `GET /api/sales/report/summary` - Get sales report

### Inventory
- `GET /api/inventory` - List inventory
- `POST /api/inventory/movements` - Record stock movement
- `POST /api/inventory/:id/adjust` - Adjust stock
- `GET /api/inventory/alerts/low-stock` - Low stock alerts
- `GET /api/inventory/alerts/expiry` - Expiry alerts

## Production Deployment

### Using Docker Swarm

```bash
docker swarm init
docker stack deploy -c docker-compose.yml neth-erp
```

### Using Kubernetes

```bash
kubectl create namespace neth-erp
kubectl apply -f k8s/backend-deployment.yaml -n neth-erp
kubectl apply -f k8s/frontend-deployment.yaml -n neth-erp
kubectl apply -f k8s/postgres-statefulset.yaml -n neth-erp
```

### Environment Variables for Production

Set these before deployment:
- `JWT_SECRET` - Long random string for JWT signing
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV=production`
- `CORS_ORIGIN` - Allowed frontend origins

## Backup & Recovery

### Database Backup

```bash
docker exec neth_erp_db pg_dump -U erp_user neth_erp_db > backup.sql
```

### Database Restore

```bash
docker exec -i neth_erp_db psql -U erp_user neth_erp_db < backup.sql
```

## Monitoring & Logging

The application uses:
- Morgan for HTTP request logging
- Prisma Query logging
- Activity logs for user actions
- Audit logs for data changes

View logs:
```bash
docker logs -f neth_erp_backend
docker logs -f neth_erp_frontend
```

## Security Checklist

- [ ] Change default JWT secrets
- [ ] Change default database password
- [ ] Enable HTTPS/SSL in production
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Enable 2FA for admin accounts
- [ ] Configure rate limiting
- [ ] Set up monitoring alerts
- [ ] Regular security audits

## Troubleshooting

### Backend won't start
```bash
docker logs neth_erp_backend
docker exec neth_erp_backend npx prisma migrate resolve --rolled-back
```

### Database connection error
```bash
docker exec neth_erp_db psql -U erp_user -c "SELECT 1;"
```

### Port already in use
```bash
# Change ports in docker-compose.yml or kill existing process
lsof -i :3000  # Find process on port 3000
kill -9 <PID>  # Kill process
```

## Support & Documentation

- Issues: GitHub Issues
- Email: support@nethsys.com
- Documentation: /docs folder

## License

MIT License - See LICENSE file

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

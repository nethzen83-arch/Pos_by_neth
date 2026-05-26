# Neth ERP System - Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Docker & Docker Compose installed
- Git
- 4GB RAM available

### Step 1: Clone and Navigate
```bash
cd neth-erp-system
```

### Step 2: Setup Environment Files
```bash
# Copy environment examples
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# (Optional) Edit backend/.env if needed
```

### Step 3: Start with Docker
```bash
# Start all services
docker-compose up -d

# Wait 30 seconds for database to initialize
sleep 30

# Run database migrations
docker exec neth_erp_backend npx prisma migrate deploy

# Seed database with demo data
docker exec neth_erp_backend npm run prisma:seed
```

### Step 4: Access the Application
```
Frontend: http://localhost:3001
Backend:  http://localhost:3000/api
API Docs: http://localhost:3000/api/health
```

### Step 5: Login
```
Email:    admin@nethsys.com
Password: password123
```

---

## Local Development Setup (Without Docker)

### Backend Setup
```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Update DATABASE_URL in .env
# DATABASE_URL=postgresql://user:password@localhost:5432/neth_erp_db

# 4. Run database setup
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed

# 5. Start development server
npm run dev

# Server runs on http://localhost:3000
```

### Frontend Setup (In new terminal)
```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Start development server
npm run dev

# Application runs on http://localhost:3001
```

---

## First Steps After Login

### 1. Dashboard
- View sales metrics
- Check inventory alerts
- Monitor key KPIs

### 2. Create a Sale
- Go to Sales menu
- Click "New Sale"
- Add products to cart
- Enter customer details
- Process payment
- Print receipt

### 3. Manage Inventory
- Go to Inventory
- View stock levels
- Adjust quantities if needed
- Check low stock alerts

### 4. Add Products
- Go to Products
- Click "Add Product"
- Fill in details (SKU, name, price)
- Set category and unit
- Save

### 5. Generate Reports
- Go to desired module
- Select date range
- Click Export (PDF/Excel)

---

## Docker Commands Reference

### View Logs
```bash
# Backend logs
docker logs -f neth_erp_backend

# Frontend logs
docker logs -f neth_erp_frontend

# Database logs
docker logs -f neth_erp_db

# All services
docker-compose logs -f
```

### Stop Services
```bash
# Stop all services
docker-compose stop

# Stop specific service
docker-compose stop neth_erp_backend
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart neth_erp_backend
```

### Reset Database
```bash
# Stop services
docker-compose down

# Remove volume (DELETE DATA)
docker volume rm neth-erp_postgres_data

# Restart
docker-compose up -d
```

### Access Database
```bash
# PostgreSQL CLI
docker exec -it neth_erp_db psql -U erp_user -d neth_erp_db

# Inside psql:
# \dt                 - List tables
# SELECT * FROM "User"; - Query users
# \q                  - Quit
```

---

## Common Tasks

### Change Default Password
```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "password123",
    "newPassword": "NewSecurePassword123!"
  }'
```

### Create New User
```bash
# Via API
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "First",
    "lastName": "Last"
  }'
```

### Generate Report
1. Navigate to Sales/Inventory/Customers
2. Select date range
3. Click "Filter" or "Export"
4. Choose format (PDF, Excel, CSV)

### Backup Database
```bash
# Backup
docker exec neth_erp_db pg_dump -U erp_user neth_erp_db > backup.sql

# Restore
cat backup.sql | docker exec -i neth_erp_db psql -U erp_user neth_erp_db
```

---

## Troubleshooting

### Services Won't Start
```bash
# Check if ports are in use
lsof -i :3000  # Check port 3000
lsof -i :3001  # Check port 3001
lsof -i :5432  # Check port 5432

# Kill process on port
kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
docker logs neth_erp_db

# Restart database
docker-compose restart neth_erp_db
```

### Frontend Not Loading
```bash
# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# Check frontend logs
docker logs neth_erp_frontend
```

### Can't Login
```bash
# Check backend is running
curl http://localhost:3000/api/health

# Check database has seed data
docker exec neth_erp_db psql -U erp_user neth_erp_db -c "SELECT * FROM \"User\";"
```

---

## Development Tips

### Enable Hot Reload
- Backend: Already enabled with `npm run dev` (tsx watch)
- Frontend: Already enabled with `npm run dev` (Vite)

### Debug Backend
```bash
# Add console.log statements or use debugger
node --inspect dist/index.js

# Open Chrome: chrome://inspect
```

### Debug Frontend
- Open Browser DevTools: F12
- Go to Console tab
- Redux DevTools extension recommended

### Database Inspection
```bash
# Prisma Studio (visual database explorer)
docker exec neth_erp_backend npx prisma studio
# Opens on http://localhost:5555
```

---

## Performance Optimization

### Clear Docker Cache
```bash
docker system prune -a
```

### Optimize Database
```bash
# Inside PostgreSQL
docker exec neth_erp_db psql -U erp_user neth_erp_db
> VACUUM;
> ANALYZE;
```

### Restart Everything Clean
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d
docker exec neth_erp_backend npm run prisma:seed
```

---

## Next Steps

1. **Configure Email**: Update `backend/.env` with SMTP settings
2. **Setup Backup**: Schedule regular database backups
3. **Enable 2FA**: Configure two-factor authentication
4. **Setup Monitoring**: Add Prometheus/Grafana
5. **Customize Branding**: Update company name and colors

---

## Getting Help

- **Logs**: Check `docker logs <container_name>`
- **Documentation**: Read [README.md](README.md), [ARCHITECTURE.md](ARCHITECTURE.md)
- **API Docs**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Issues**: GitHub Issues

---

## Production Deployment

When ready to deploy:
1. Review [DEPLOYMENT.md](DEPLOYMENT.md)
2. Update environment variables
3. Configure HTTPS/SSL
4. Setup backup strategy
5. Configure monitoring
6. Load test before going live

---

**Happy selling! 🎉**

For more information, see README.md and ARCHITECTURE.md

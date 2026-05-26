# Neth ERP API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "0123456789"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CASHIER"
  }
}
```

---

### Login
Authenticate and get JWT tokens.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "admin@nethsys.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "admin@nethsys.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Refresh Token
Get a new access token using refresh token.

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new_access_token",
    "user": { ...user data... }
  }
}
```

---

### Logout
Logout user and invalidate refresh tokens.

**Endpoint:** `POST /auth/logout`

**Authentication:** Required (Bearer Token)

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Product Endpoints

### Get All Products
Retrieve paginated list of products.

**Endpoint:** `GET /products`

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `pageSize` (number): Items per page (default: 10, max: 100)
- `search` (string): Search by name, SKU, or barcode
- `categoryId` (string): Filter by category

**Example:**
```
GET /products?page=1&pageSize=20&search=cream&categoryId=cat123
```

**Response (200):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "data": [
      {
        "id": "prod_id",
        "sku": "PROD001001",
        "barcode": "1234567890123",
        "name": "Face Cream",
        "description": "Premium moisturizing cream",
        "costPrice": 5.00,
        "sellingPrice": 15.00,
        "tax": 0,
        "category": { "id": "cat_id", "name": "Cosmetics" },
        "unit": { "id": "unit_id", "name": "Piece" }
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

### Create Product
Create a new product.

**Endpoint:** `POST /products`

**Authentication:** Required (Admin, Manager)

**Request Body:**
```json
{
  "sku": "PROD002001",
  "barcode": "1234567890124",
  "name": "Coffee",
  "description": "Premium arabica coffee",
  "categoryId": "cat_food_id",
  "brandId": "brand_id",
  "costPrice": 3.00,
  "sellingPrice": 8.00,
  "tax": 5,
  "unitId": "unit_box_id"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { ...product data... }
}
```

---

### Get Product by ID
Retrieve specific product details.

**Endpoint:** `GET /products/:id`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": "prod_id",
    "sku": "PROD001001",
    "name": "Face Cream",
    ...complete product data...,
    "variants": [ ...product variants... ],
    "prices": [ ...price levels... ],
    "inventories": [ ...stock info... ]
  }
}
```

---

### Update Product
Modify product details.

**Endpoint:** `PUT /products/:id`

**Authentication:** Required (Admin, Manager)

**Request Body:**
```json
{
  "name": "Premium Face Cream",
  "description": "Updated description",
  "costPrice": 5.50,
  "sellingPrice": 16.00,
  "tax": 5
}
```

---

### Delete Product
Soft delete a product (sets active to false).

**Endpoint:** `DELETE /products/:id`

**Authentication:** Required (Admin)

---

## Sales Endpoints

### Create Sale
Create a new sale/invoice.

**Endpoint:** `POST /sales`

**Authentication:** Required (Cashier, Manager, Admin)

**Request Body:**
```json
{
  "customerId": "customer_id",
  "items": [
    {
      "productId": "prod_id_1",
      "quantity": 2,
      "unitPrice": 15.00,
      "discount": 0,
      "discountPercent": 0
    },
    {
      "productId": "prod_id_2",
      "quantity": 1,
      "unitPrice": 8.00,
      "discount": 1,
      "discountPercent": 0
    }
  ],
  "taxAmount": 2.50,
  "discountAmount": 0,
  "notes": "Customer notes here"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Sale created successfully",
  "data": {
    "id": "sale_id",
    "invoiceNumber": "SALE-2024-001",
    "customerId": "customer_id",
    "status": "ISSUED",
    "subTotal": 38.00,
    "taxAmount": 2.50,
    "discountAmount": 0,
    "totalAmount": 40.50,
    "paidAmount": 0,
    "dueAmount": 40.50,
    "items": [ ...items... ],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get All Sales
Retrieve paginated sales list.

**Endpoint:** `GET /sales`

**Query Parameters:**
- `page` (number): Page number
- `pageSize` (number): Items per page
- `status` (string): Filter by status (DRAFT, ISSUED, PAID, PARTIAL, OVERDUE)
- `search` (string): Search by invoice number or customer name

---

### Get Sale by ID
Retrieve complete sale details.

**Endpoint:** `GET /sales/:id`

---

### Record Payment
Record a payment for a sale.

**Endpoint:** `POST /sales/:id/payments`

**Request Body:**
```json
{
  "method": "CASH",
  "amount": 20.00,
  "transactionId": "txn_123",
  "notes": "Payment received"
}
```

---

### Get Sales Report
Generate sales report for a date range.

**Endpoint:** `GET /sales/report/summary`

**Query Parameters:**
- `startDate` (string): Start date (YYYY-MM-DD)
- `endDate` (string): End date (YYYY-MM-DD)
- `branchId` (string): Optional branch filter

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": 45,
    "totalRevenue": 2450.00,
    "totalPaid": 2350.00,
    "totalPending": 100.00,
    "averageTransaction": 54.44,
    "salesByStatus": {
      "paid": 35,
      "partial": 5,
      "pending": 5
    }
  }
}
```

---

## Inventory Endpoints

### Get Inventory
Retrieve inventory items.

**Endpoint:** `GET /inventory`

**Query Parameters:**
- `page` (number)
- `pageSize` (number)
- `branchId` (string)
- `warehouseId` (string)
- `search` (string)

---

### Get Product Stock
Get stock levels for a specific product.

**Endpoint:** `GET /inventory/product/:productId`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "inv_id",
      "product": { ...product... },
      "quantity": 100,
      "availableQty": 90,
      "reservedQty": 10,
      "minStock": 10,
      "maxStock": 500,
      "warehouse": { ...warehouse... }
    }
  ]
}
```

---

### Record Stock Movement
Create a stock movement (IN, OUT, ADJUSTMENT, TRANSFER).

**Endpoint:** `POST /inventory/movements`

**Request Body:**
```json
{
  "inventoryId": "inv_id",
  "type": "IN",
  "quantity": 50,
  "reason": "Purchase receipt",
  "reference": "PO-2024-001"
}
```

---

### Adjust Stock
Adjust inventory quantity.

**Endpoint:** `POST /inventory/:id/adjust`

**Request Body:**
```json
{
  "quantity": 85,
  "reason": "Physical count adjustment"
}
```

---

### Get Low Stock Items
Retrieve items below minimum stock level.

**Endpoint:** `GET /inventory/alerts/low-stock`

---

### Get Expiry Alerts
Get items expiring soon.

**Endpoint:** `GET /inventory/alerts/expiry`

**Query Parameters:**
- `days` (number): Days until expiry to alert (default: 30)

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized access",
  "statusCode": 401
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "statusCode": 403
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "statusCode": 404
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "statusCode": 500
}
```

---

## Rate Limiting

- **Window**: 15 minutes
- **Limit**: 100 requests per 15 minutes
- **Auth Endpoints**: 5 requests per 15 minutes

Headers returned:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

---

## Pagination

Default pagination parameters:
- **Page**: 1 (first page)
- **Page Size**: 10 items
- **Max Page Size**: 100 items

Response includes:
```json
{
  "page": 1,
  "pageSize": 10,
  "total": 250,
  "pages": 25
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Server Error |

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nethsys.com","password":"password123"}'
```

### Get Products
```bash
curl -X GET http://localhost:3000/api/products?page=1&pageSize=10 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Sale
```bash
curl -X POST http://localhost:3000/api/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{...sale data...}'
```

---

**API Version**: 1.0.0
**Last Updated**: 2024

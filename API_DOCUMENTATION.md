# 📚 Dokumentasi API - Inventory Management System

## 🌐 Base URL
```
http://localhost:3333
```

## 📖 OpenAPI/Swagger Documentation

Aplikasi ini menggunakan **OpenAPI 3.0** (Swagger) untuk dokumentasi API yang lengkap.

### Akses Swagger Documentation
```http
GET /api-docs.json
```

**Response:** OpenAPI 3.0 specification dalam format JSON

### Menggunakan Swagger UI

1. **Import ke Swagger Editor/UI**:
   - Buka https://editor.swagger.io/
   - Klik "File" → "Import URL"
   - Masukkan: `http://localhost:3333/api-docs.json`

2. **Atau gunakan Postman**:
   - Import OpenAPI specification dari `/api-docs.json`
   - Semua endpoints akan otomatis ter-import dengan dokumentasi lengkap

### Fitur Swagger Documentation
- ✅ Semua endpoint ter-dokumentasi dengan lengkap
- ✅ Request/Response schemas
- ✅ Authentication requirements (Bearer Token)
- ✅ Parameter descriptions
- ✅ Example requests dan responses
- ✅ Error response formats

## 🔐 Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "password": "admin123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "fullName": "Administrator",
    "email": "admin@inventaris.com"
  },
  "token": "auth_token_here"
}
```

### Logout
```http
POST /logout
```

---

## 📦 Products API

### Get All Products
```http
GET /api/products?page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nama": "MacBook Pro M2",
      "merk": "Apple",
      "stok": 15,
      "harga": "25000000.00",
      "kategori_id": 1,
      "supplier_id": 1,
      "category": {
        "id": 1,
        "nama": "Electronics"
      }
    }
  ],
  "meta": {
    "total": 7,
    "per_page": 10,
    "current_page": 1,
    "last_page": 1
  }
}
```

### Create Product
```http
POST /api/products
Content-Type: application/json

{
  "nama": "iPhone 15 Pro",
  "merk": "Apple",
  "stok": 25,
  "harga": 18000000,
  "kategori_id": 1,
  "supplier_id": 1
}
```

**Required Fields:**
- `nama` (string): Nama produk
- `harga` (number): Harga produk
- `kategori_id` (number): ID kategori

**Optional Fields:**
- `merk` (string): Merek produk
- `stok` (number): Jumlah stok (default: 0)
- `supplier_id` (number): ID supplier

### Update Product
```http
PUT /api/products/{id}
Content-Type: application/json

{
  "nama": "iPhone 15 Pro Max",
  "merk": "Apple",
  "stok": 30,
  "harga": 20000000,
  "kategori_id": 1
}
```

### Delete Product
```http
DELETE /api/products/{id}
```

### Get Product by Category
```http
GET /api/products/category/{categoryId}
```

### Search Products
```http
GET /api/products/search?search=iPhone&page=1&limit=10
```

---

## 📂 Categories API

### Get All Categories
```http
GET /api/categories?page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nama": "Electronics",
      "products": [
        {
          "id": 1,
          "nama": "MacBook Pro M2",
          "merk": "Apple",
          "stok": 15,
          "harga": "25000000.00"
        }
      ]
    }
  ]
}
```

### Create Category
```http
POST /api/categories
Content-Type: application/json

{
  "nama": "Electronics"
}
```

**Required Fields:**
- `nama` (string): Nama kategori

### Update Category
```http
PUT /api/categories/{id}
Content-Type: application/json

{
  "nama": "Electronics & Gadgets"
}
```

### Delete Category
```http
DELETE /api/categories/{id}
```

### Get Category Stats
```http
GET /api/categories/{id}/stats
```

### Search Categories
```http
GET /api/categories/search?search=Electronics&page=1&limit=10
```

---

## 📋 Transactions API

### Get All Transactions
```http
GET /api/transactions?page=1&limit=10&type=masuk
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "produk_id": 1,
      "tipe": "masuk",
      "jumlah": 5,
      "catatan": "Stock masuk dari supplier",
      "created_at": "2024-01-20T10:00:00.000Z",
      "updated_at": "2024-01-20T10:00:00.000Z",
      "product": {
        "id": 1,
        "nama": "MacBook Pro M2",
        "merk": "Apple",
        "stok": 15,
        "harga": "25000000.00"
      }
    }
  ]
}
```

### Create Transaction
```http
POST /api/transactions
Content-Type: application/json

{
  "produk_id": 1,
  "tipe": "masuk",
  "jumlah": 10,
  "catatan": "Restock dari supplier"
}
```

**Required Fields:**
- `produk_id` (number): ID produk
- `tipe` (string): "masuk" atau "keluar"
- `jumlah` (number): Jumlah transaksi

**Optional Fields:**
- `catatan` (string): Catatan transaksi

**Validation Rules:**
- `tipe` harus berupa "masuk" atau "keluar"
- Untuk transaksi "keluar", stok produk harus mencukupi

### Update Transaction
```http
PUT /api/transactions/{id}
Content-Type: application/json

{
  "produk_id": 1,
  "tipe": "keluar",
  "jumlah": 2,
  "catatan": "Penjualan ke customer"
}
```

### Delete Transaction
```http
DELETE /api/transactions/{id}
```

### Get Transactions by Product
```http
GET /api/transactions/product/{productId}
```

### Get Transaction Stats
```http
GET /api/transactions/stats?dateFrom=2024-01-01&dateTo=2024-01-31
```

**Response:**
```json
{
  "totalTransactions": 15,
  "masukCount": 8,
  "keluarCount": 7,
  "totalMasuk": 50,
  "totalKeluar": 25,
  "netChange": 25
}
```

### Search Transactions
```http
GET /api/transactions/search?search=MacBook&page=1&limit=10
```

---

## 🏢 Suppliers API

### Get All Suppliers
```http
GET /api/suppliers?page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nama": "PT. Tech Solutions Indonesia",
      "alamat": "Jl. Sudirman No. 123, Jakarta Selatan",
      "telepon": "021-12345678",
      "email": "info@techsolutions.co.id",
      "products": [
        {
          "id": 1,
          "nama": "MacBook Pro M2"
        }
      ]
    }
  ]
}
```

### Create Supplier
```http
POST /api/suppliers
Content-Type: application/json

{
  "nama": "PT. Tech Solutions Indonesia",
  "alamat": "Jl. Sudirman No. 123, Jakarta Selatan",
  "telepon": "021-12345678",
  "email": "info@techsolutions.co.id"
}
```

**Required Fields:**
- `nama` (string): Nama supplier

**Optional Fields:**
- `alamat` (string): Alamat supplier
- `telepon` (string): Nomor telepon
- `email` (string): Email supplier

### Update Supplier
```http
PUT /api/suppliers/{id}
Content-Type: application/json

{
  "nama": "PT. Tech Solutions Indonesia Updated",
  "alamat": "Jl. Sudirman No. 456, Jakarta Selatan",
  "telepon": "021-87654321",
  "email": "contact@techsolutions.co.id"
}
```

### Delete Supplier
```http
DELETE /api/suppliers/{id}
```

### Search Suppliers
```http
GET /api/suppliers/search?search=Tech&page=1&limit=10
```

---

## 📊 Dashboard API

### Get Dashboard Statistics
```http
GET /dashboard
```

**Response:**
```json
{
  "stats": {
    "totalProducts": 7,
    "totalCategories": 4,
    "todayTransactions": 3,
    "lowStockItems": 3,
    "recentTransactions": [
      {
        "id": 1,
        "tipe": "masuk",
        "jumlah": 5,
        "created_at": "2024-01-20T10:00:00.000Z",
        "product": {
          "nama": "MacBook Pro M2"
        }
      }
    ],
    "productsByCategory": [
      {
        "id": 1,
        "nama": "Electronics",
        "products": [
          {
            "id": 1,
            "nama": "MacBook Pro M2",
            "merk": "Apple",
            "stok": 15,
            "harga": "25000000.00"
          }
        ]
      }
    ]
  }
}
```

---

## 🔒 Authentication Requirements

Semua endpoint API (kecuali `/api/auth/login` dan `/logout`) memerlukan authentication. Gunakan session-based authentication dengan token yang diperoleh dari login.

## 📝 Error Responses

### Validation Error
```json
{
  "error": "Nama, harga, dan kategori_id harus diisi"
}
```

### Not Found Error
```json
{
  "error": "Record not found"
}
```

### Stock Insufficient Error
```json
{
  "error": "Stok tidak mencukupi"
}
```

### Unauthorized Error
```json
{
  "error": "Unauthorized access"
}
```

## 🚀 Common Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Halaman untuk pagination | 1 |
| `limit` | number | Jumlah item per halaman | 10 |
| `search` | string | Kata kunci pencarian | - |
| `type` | string | Filter tipe transaksi ("masuk" atau "keluar") | - |
| `dateFrom` | string | Tanggal mulai untuk filter (YYYY-MM-DD) | - |
| `dateTo` | string | Tanggal akhir untuk filter (YYYY-MM-DD) | - |

## 💡 Notes

1. **Harga Format**: Harga disimpan sebagai decimal dengan 2 digit desimal
2. **Stock Management**: 
   - Transaksi "keluar" akan mengurangi stock
   - Transaksi "masuk" akan menambah stock
   - Sistem akan memvalidasi ketersediaan stock untuk transaksi keluar
   - Email notification otomatis saat stok menipis (di bawah threshold)
3. **Pagination**: Semua list endpoint mendukung pagination
4. **Search**: Endpoint search mendukung pencarian berdasarkan nama
5. **Relationships**: Data diload dengan relasi yang relevan (category, product, supplier)
6. **Authentication**:
   - **UI Routes**: Menggunakan session-based authentication
   - **API Routes**: Menggunakan JWT token authentication
   - **Public Routes**: Tidak memerlukan authentication
7. **Error Handling**: Semua endpoint mengembalikan error response yang konsisten
8. **Email Notifications**:
   - Otomatis dikirim saat transaksi baru dibuat
   - Otomatis dikirim saat stok produk di bawah threshold
   - Dapat dikirim manual melalui UI
   - Menggunakan Resend API (perlu API key)
9. **Exchange Rate**:
   - Menggunakan ExchangeRate-API (gratis, tanpa API key)
   - Base currency: USD
   - Support 160+ currencies dengan nama negara
10. **API Access Control**:
    - `all`: Full access (create, read, update, delete)
    - `read`: Read-only access
    - `none`: No API access

## 🌐 Public API Endpoints

### Exchange Rate API
```http
GET /api/public/exchange-rate/rate?from=IDR&to=USD
```

**Response:**
```json
{
  "from": "IDR",
  "to": "USD",
  "rate": 0.000064,
  "timestamp": "2024-01-20T10:00:00.000Z"
}
```

### Convert Currency
```http
GET /api/public/exchange-rate/convert?from=IDR&to=USD&amount=1000000
```

**Response:**
```json
{
  "from": "IDR",
  "to": "USD",
  "amount": 1000000,
  "converted": 64.0,
  "rate": 0.000064
}
```

### Get Available Currencies
```http
GET /api/public/exchange-rate/currencies
```

### Public Products (with QR Code)
```http
GET /api/public/products
GET /api/public/products/{id}
GET /api/public/products/{id}/qr-code
```

### Public Categories
```http
GET /api/public/categories
GET /api/public/categories/{id}
```

## 🔐 API Authentication

### Login (API)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@inventaris.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "fullName": "Administrator",
    "email": "admin@inventaris.com",
    "role": "admin",
    "apiAccess": "all"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Profile (API)
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

### Using API Token
Semua protected API endpoints memerlukan token di header:
```http
Authorization: Bearer {your_jwt_token}
```

## 📧 Email Notification API (UI)

### Get Low Stock Products
```http
GET /api/ui/email-notification/low-stock
```
*Requires: Session Authentication (UI Login)*

### Send Low Stock Notification
```http
POST /api/ui/email-notification/low-stock
Content-Type: application/json

{
  "email": "admin@inventaris.com"
}
```

### Get Recent Transactions
```http
GET /api/ui/email-notification/transactions?limit=10
```

### Send Transaction Notification
```http
POST /api/ui/email-notification/transactions
Content-Type: application/json

{
  "email": "admin@inventaris.com",
  "transaction_id": 1
}
```

## 💱 Exchange Rate API (UI)

### Get Exchange Rate
```http
GET /api/ui/exchange-rate?from=IDR&to=USD
```
*Requires: Session Authentication (UI Login)*

### Convert Currency
```http
POST /api/ui/exchange-rate/convert
Content-Type: application/json

{
  "from": "IDR",
  "to": "USD",
  "amount": 1000000
}
```

### Convert Product Price
```http
POST /api/ui/exchange-rate/convert-product
Content-Type: application/json

{
  "product_id": 1,
  "target_currency": "USD"
}
```

### Get Products List
```http
GET /api/ui/exchange-rate/products
```

### Get Available Currencies
```http
GET /api/ui/exchange-rate/currencies
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- MySQL Database
- npm atau yarn

### Installation
```bash
cd api4
npm install
```

### Environment Setup
Copy `.env.example` to `.env` dan konfigurasi:
```env
NODE_ENV=development
PORT=3333
APP_KEY=your-app-key-here
HOST=0.0.0.0
LOG_LEVEL=info
SESSION_DRIVER=cookie
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=inventory_db

# Resend Email API (Optional)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@inventaris.com
LOW_STOCK_THRESHOLD=10
```

### Database Setup
```bash
# Run migrations
node ace migration:run

# Seed admin user
node ace db:seed --files=database/seeders/admin_seeder.ts

# Seed comprehensive data (optional)
node ace db:seed --files=database/seeders/comprehensive_data_seeder.ts
```

### Start Development Server
```bash
npm run dev
```

## 📞 Support

Untuk pertanyaan atau dukungan teknis, silakan hubungi tim development.

---

## 🎨 UI/UX Features

### Modern Design System
- **Glassmorphism**: Modern blur effects seperti Apple design
- **Gradient Backgrounds**: Beautiful gradient color schemes
- **Smooth Animations**: Fade-in, scale-in, dan hover animations
- **Responsive Design**: Mobile-first approach
- **Interactive Elements**: Hover effects dan transitions

### UI Components
- Glass cards dengan backdrop-filter
- Gradient buttons dan badges
- Modern modals dengan blur backdrop
- Toast notifications dengan glassmorphism
- Custom scrollbar dengan gradient

---

**Version**: 2.0.0  
**Last Updated**: December 2025  
**Framework**: AdonisJS 6.x  
**Frontend**: React + Inertia.js  
**UI Design**: Modern Glassmorphism  
**Public APIs**: ExchangeRate-API, Resend Email API

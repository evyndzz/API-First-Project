# API Documentation

## Overview
API untuk sistem manajemen inventory produk elektronik dengan integrasi Exchange Rate API dan QR Code Generator.

## Authentication

### Login
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "User Name",
    "role": "user",
    "apiAccess": "read"
  }
}
```

### Get Profile
**GET** `/api/auth/profile`

Headers:
```
Authorization: Bearer {token}
```

## Public API Endpoints

Semua endpoint di bawah ini memerlukan JWT token di header Authorization.

### Products

#### Get Products List
**GET** `/api/public/products?currency=USD&page=1&limit=10`

Headers:
```
Authorization: Bearer {token}
```

Response includes:
- Product data
- Harga dalam IDR dan mata uang target (USD default)
- QR Code URL untuk setiap produk
- Exchange rate yang digunakan

#### Get Product Detail
**GET** `/api/public/products/:id?currency=USD`

### Exchange Rate

#### Get Exchange Rate
**GET** `/api/public/exchange-rate?from=USD&to=IDR`

#### Convert Currency
**GET** `/api/public/exchange-rate/convert?amount=100&from=USD&to=IDR`

#### Get Available Currencies
**GET** `/api/public/exchange-rate/currencies`

### Categories

#### Get Categories List
**GET** `/api/public/categories`

## API Access Levels

- **all**: Akses penuh ke semua endpoint
- **read**: Hanya akses read (GET)
- **none**: Tidak memiliki akses API

## Swagger Documentation

Swagger JSON specification tersedia di:
**GET** `/api-docs.json`

Untuk melihat dokumentasi interaktif, gunakan Swagger UI dengan mengakses file JSON tersebut.

## External APIs Used

1. **ExchangeRate-API** (https://api.exchangerate-api.com)
   - Untuk konversi mata uang
   - Mendapatkan exchange rate real-time

2. **QR Server** (https://api.qrserver.com)
   - Untuk generate QR code
   - Digunakan untuk produk dan transaksi

## Test Cases

Jalankan test dengan:
```bash
npm test
```

Test cases mencakup:
1. API Authentication - Login dan get token
2. API Authentication - Reject invalid credentials
3. API Authentication - Reject user without API access
4. API Authentication - Get profile with valid token
5. Public API - Get products with exchange rate and QR code
6. Public API - Get exchange rate
7. Public API - Convert currency
8. Public API - Get available currencies
9. Public API - Reject request without token
10. Public API - Reject user without API access

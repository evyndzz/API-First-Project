# Inventaris Management System

Aplikasi manajemen inventaris berbasis web yang dibangun dengan **AdonisJS** (backend) dan **React** (frontend) menggunakan **Inertia.js** untuk integrasi seamless antara keduanya.

**🔗 Repository**: [https://github.com/evyndzz/API-First-Project](https://github.com/evyndzz/API-First-Project)

## 📋 Daftar Isi
1. [Persyaratan Sistem](#persyaratan-sistem)
2. [Tools & Framework yang Diperlukan](#tools--framework-yang-diperlukan)
3. [Instalasi Tools](#instalasi-tools)
4. [Clone Repository](#clone-repository)
5. [Konfigurasi Environment](#konfigurasi-environment)
6. [Setup Database](#setup-database)
7. [Instalasi Dependencies](#instalasi-dependencies)
8. [Menjalankan Aplikasi](#menjalankan-aplikasi)
9. [Fitur Aplikasi](#fitur-aplikasi)
10. [Troubleshooting](#troubleshooting)

---

## 🖥️ Persyaratan Sistem

- **OS**: Windows 10+, macOS 10.15+, atau Linux (Ubuntu 18.04+)
- **RAM**: Minimal 4GB, Recommended 8GB+
- **Disk Space**: Minimal 2GB untuk development setup
- **Internet Connection**: Diperlukan untuk download dependencies

---

## 🛠️ Tools & Framework yang Diperlukan

### 1. **Node.js & npm**
- **Versi**: Node.js 18.x atau lebih tinggi
- **Download**: https://nodejs.org/
- **Versi npm**: Minimal 9.x (biasanya included dengan Node.js)

### 2. **Git**
- **Download**: https://git-scm.com/
- Diperlukan untuk clone repository dari GitHub

### 3. **Database - MySQL 5.7+**
- **Download**: https://dev.mysql.com/downloads/mysql/
- Atau menggunakan XAMPP/WAMP yang sudah include MySQL

### 4. **Text Editor / IDE (Pilih Salah Satu)**
- **VS Code** (Recommended): https://code.visualstudio.com/
  - Extensions yang direkomendasikan:
    - `AdonisJS` (Adonis foundation)
    - `ES7+ React/Redux/React-Native snippets` (dsixlabs)
    - `Tailwind CSS IntelliSense` (bradlc)
    - `Thunder Client` atau `REST Client` (untuk testing API)
    - `SQLTools` (untuk manage database)

- **WebStorm**: https://www.jetbrains.com/webstorm/
- **PhpStorm** atau **IntelliJ IDEA** (dengan plugin Node.js)

---

## 📥 Instalasi Tools

### Windows

#### 1. Install Node.js
```powershell
# Download dari https://nodejs.org/ (LTS version)
# Atau gunakan Chocolatey:
choco install nodejs
```

#### 2. Install Git
```powershell
# Download dari https://git-scm.com/
# Atau gunakan Chocolatey:
choco install git
```

#### 3. Install MySQL (via XAMPP - Recommended untuk Beginner)
```powershell
# Download XAMPP dari https://www.apachefriends.org/
# Atau install MySQL langsung:
choco install mysql
```

#### 4. Verify Installation
```powershell
node --version
npm --version
git --version
mysql --version
```

### macOS

```bash
# Install Node.js via Homebrew
brew install node

# Install Git
brew install git

# Install MySQL
brew install mysql
```

### Linux (Ubuntu)

```bash
# Update package manager
sudo apt update && sudo apt upgrade

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs

# Install Git
sudo apt install git

# Install MySQL
sudo apt install mysql-server

# Verify
node --version && npm --version && git --version && mysql --version
```

---

## 🔄 Clone Repository

```bash
# 1. Buka terminal/command prompt di folder yang diinginkan
# 2. Clone repository
git clone https://github.com/evyndzz/API-First-Project.git

# 3. Masuk ke folder project
cd API-First-Project

# 4. Verify folder structure
# Pastikan ada file: package.json, adonisrc.ts, vite.config.ts, tsconfig.json
```

**Note**: 
- Repository GitHub: https://github.com/evyndzz/API-First-Project
- Folder lokal development: `D:\api4` (atau sesuai lokasi clone Anda)

---

## ⚙️ Konfigurasi Environment

### 1. Copy `.env.example` ke `.env` (jika ada)
```bash
cp .env.example .env
```

Atau buat file `.env` baru dengan isi:

```dotenv
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info

# Application
APP_KEY=76kLeAfJQhegz2Npg0wYfHbRzvRu2I5h
NODE_ENV=development
SESSION_DRIVER=cookie

# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=admin
DB_PASSWORD=admin123
DB_DATABASE=inventaris
```

### 2. Sesuaikan Konfigurasi Database
Edit nilai berikut di file `.env` sesuai setup MySQL Anda:
- `DB_HOST`: Host MySQL (default: `127.0.0.1`)
- `DB_PORT`: Port MySQL (default: `3306` atau `3307` jika XAMPP)
- `DB_USER`: Username MySQL (default: `root` atau `admin`)
- `DB_PASSWORD`: Password MySQL (sesuaikan dengan setup Anda)
- `DB_DATABASE`: Nama database yang akan dibuat (default: `inventaris`)

---

## 🗄️ Setup Database

### 1. Pastikan MySQL Berjalan

**Windows (XAMPP)**:
- Buka XAMPP Control Panel
- Klik `Start` pada MySQL

**Windows (MySQL Standalone)**:
```powershell
# Cek status
Get-Service MySQL80

# Atau start MySQL service jika belum berjalan
Start-Service MySQL80
```

**macOS/Linux**:
```bash
# Start MySQL
brew services start mysql
# atau
sudo systemctl start mysql
```

### 2. Verifikasi Koneksi Database

```bash
# Test koneksi MySQL
mysql -h 127.0.0.1 -u admin -p

# Masukkan password (default: admin123)
# Jika sukses, akan masuk ke MySQL prompt (mysql>)
# Ketik: exit untuk keluar
```

### 3. Jalankan Migration dan Seeder

```bash
# Di folder project, jalankan migration untuk membuat table
node ace migration:run

# Jalankan seeder untuk memasukkan data awal (opsional)
node ace db:seed
```

---

## 📦 Instalasi Dependencies

```bash
# Pastikan sudah di dalam folder project
# Jika clone dari GitHub:
cd API-First-Project

# Atau jika menggunakan folder lokal (D:\api4):
cd D:\api4

# Install semua npm dependencies
npm install

# Tunggu hingga selesai (biasanya 2-5 menit)
```

---

## 🚀 Menjalankan Aplikasi

### Opsi 1: Development Mode (Recommended saat development)

```bash
# Terminal/Tab 1: Start AdonisJS Server
node ace serve --watch

# Terminal/Tab 2 (jika diperlukan): Build Frontend assets
npm run dev
```

Aplikasi akan accessible di: **http://localhost:3333**

### Opsi 2: Production Build

```bash
# Build untuk production
npm run build

# Start production server
node build/bin/server.js
```

### Opsi 3: Hybrid (Full Development dengan Live Reload)

```bash
# Jalankan di satu terminal
npm run dev:full
```

---

## 📱 Fitur Aplikasi

### 🎨 User Interface Modern
- ✨ **Glassmorphism Design**: Desain modern dengan efek blur seperti Apple
- 🎨 **Gradient Backgrounds**: Background gradient yang menarik (indigo → purple → pink)
- 🎭 **Smooth Animations**: Animasi fade-in, scale-in, dan hover effects yang halus
- 📱 **Responsive Design**: Tampilan optimal di desktop, tablet, dan mobile
- 🎯 **Modern Cards**: Card design dengan shadow dan rounded corners
- 🌈 **Color Scheme**: Skema warna modern dengan gradient accents

### 📊 Dashboard
- Overview statistik inventaris dengan glassmorphism cards
- Ringkasan stock terbaru dengan gradient badges
- Recent transactions table dengan hover effects
- Products overview dengan color-coded stock status
- Quick action cards dengan interactive hover

### 📂 Manajemen Kategori
- ✅ Tambah kategori produk dengan modal glassmorphism
- ✅ Edit kategori dengan UI modern
- ✅ Hapus kategori (jika tidak ada produk)
- ✅ Lihat detail kategori dengan card design modern

### 📦 Manajemen Produk
- ✅ CRUD (Create, Read, Update, Delete) produk
- ✅ Kelompokkan berdasarkan kategori
- ✅ Track stock dan harga dengan gradient badges
- ✅ Search produk dengan glassmorphism input
- ✅ Filter berdasarkan kategori
- ✅ Product cards dengan hover effects dan gradient icons

### 🏢 Manajemen Supplier
- ✅ Tambah/Edit/Hapus supplier
- ✅ Kelola informasi kontak
- ✅ Track produk dari supplier tertentu

### 📋 Manajemen Transaksi
- ✅ Catat stock masuk (pembelian dari supplier)
- ✅ Catat stock keluar (penjualan/penggunaan)
- ✅ Filter transaksi berdasarkan tipe
- ✅ View riwayat transaksi
- ✅ **Email Notification Otomatis**: Notifikasi email saat transaksi baru atau stok menipis

### 💱 Exchange Rate Converter
- ✅ Konversi mata uang real-time menggunakan ExchangeRate-API
- ✅ Konversi harga produk ke berbagai mata uang
- ✅ Manual currency conversion dengan format yang benar
- ✅ Daftar mata uang lengkap dengan nama negara

### 📧 Email Notification System
- ✅ Notifikasi email otomatis untuk transaksi baru
- ✅ Notifikasi email otomatis saat stok menipis
- ✅ Manual email notification untuk low stock products
- ✅ Manual email notification untuk recent transactions
- ✅ Menggunakan Resend API untuk pengiriman email

### 🔐 Authentication
- ✅ Login/Logout dengan UI modern
- ✅ Session management
- ✅ Protected routes
- ✅ Password-only login untuk UI

---

## 📺 Testing Aplikasi

### Via Browser
1. Buka browser: `http://localhost:3333`
2. Login dengan akun default:
   - **Email/Username**: admin@example.com (sesuai seeder)
   - **Password**: password (sesuai seeder)

### Via API (Postman/Thunder Client)
1. Import file `POSTMAN_COLLECTION.json` yang ada di root project
2. Set base URL: `http://localhost:3333/api`
3. Test endpoint sesuai dokumentasi API

---

## 📂 Struktur Folder Project

```
API-First-Project/  # atau D:\api4 (folder lokal development)
├── app/
│   ├── controllers/
│   │   └── Http/              # API Controllers (Products, Categories, etc)
│   ├── models/                # Database Models (Lucid ORM)
│   ├── middleware/            # Custom Middleware
│   ├── exceptions/            # Exception Handlers
│   └── Validators/            # Request Validators
├── config/                    # Configuration Files
├── database/
│   ├── migrations/            # Database Schema
│   └── seeders/               # Seed Data
├── inertia/
│   ├── pages/                 # React Pages
│   ├── components/            # React Components
│   ├── css/                   # Stylesheets
│   └── tsconfig.json          # TypeScript Config (Frontend)
├── start/
│   ├── routes.ts              # Route Definitions
│   ├── kernel.ts              # Middleware Stack
│   └── env.ts                 # Environment Validation
├── public/                    # Static Assets
├── tests/                     # Test Files
├── bin/
│   ├── server.ts              # Server Entry Point
│   └── console.ts             # CLI Commands
├── .env                       # Environment Variables (Generate!)
├── package.json               # Dependencies
├── adonisrc.ts                # AdonisJS Configuration
├── vite.config.ts             # Vite Configuration (Frontend Bundler)
├── tsconfig.json              # TypeScript Configuration
├── README.md                  # This file
└── POSTMAN_COLLECTION.json    # API Documentation (Postman)
```

---

## 🔐 Default Credentials (Jika menggunakan seeder)

Jika Anda menjalankan seeder:
```bash
# Jalankan admin seeder
node ace db:seed --files=database/seeders/admin_seeder.ts

# Jalankan comprehensive data seeder (opsional)
node ace db:seed --files=database/seeders/comprehensive_data_seeder.ts
```

Gunakan kredensial berikut untuk login:
- **Email**: admin@inventaris.com
- **Password**: admin123
- **Role**: admin
- **API Access**: all (full access)

**⚠️ Security Note**: Jangan gunakan kredensial default di production. Ubah password setelah first login.

---

## 🐛 Troubleshooting

### 1. **Error: "connect ECONNREFUSED 127.0.0.1:3307"**
- **Masalah**: Database tidak berjalan atau port salah
- **Solusi**:
  ```bash
  # Verifikasi MySQL port di .env
  # Start MySQL service
  # Atau gunakan port yang benar (3306 untuk default MySQL)
  ```

### 2. **Error: "All Inertia requests must receive a valid Inertia response"**
- **Masalah**: Server tidak mengembalikan Inertia response dengan benar
- **Solusi**:
  - Restart server (`node ace serve --watch`)
  - Clear browser cache (Ctrl+Shift+Delete)
  - Pastikan controller returns `response.redirect()` atau `inertia.render()`

### 3. **Error: "ENOENT: no such file or directory" pada migration**
- **Masalah**: Database atau folder belum ada
- **Solusi**:
  ```bash
  # Pastikan database sudah dibuat
  mysql -u admin -p -e "CREATE DATABASE inventaris;"
  # Atau gunakan MySQL GUI (phpMyAdmin/Workbench)
  ```

### 4. **Port 3333 Already In Use**
- **Masalah**: Port sudah dipakai aplikasi lain
- **Solusi**:
  ```bash
  # Gunakan port berbeda
  node ace serve --watch --port 3334
  
  # Atau kill process yang menggunakan port 3333
  # Windows:
  netstat -ano | findstr :3333
  taskkill /PID <PID> /F
  
  # macOS/Linux:
  lsof -i :3333
  kill -9 <PID>
  ```

### 5. **npm install Error (Permission Denied)**
- **Masalah**: Folder project tidak memiliki write permission
- **Solusi**:
  ```bash
  # Windows: Run terminal as Administrator
  # Linux/macOS:
  sudo npm install
  # Atau fix npm permission:
  mkdir ~/.npm-global
  npm config set prefix '~/.npm-global'
  export PATH=~/.npm-global/bin:$PATH
  ```

### 6. **Flash Message Tidak Muncul**
- **Masalah**: Session atau Inertia props tidak ter-set dengan benar
- **Solusi**:
  - Reload page (F5)
  - Check browser DevTools → Network → response untuk X-Inertia header
  - Pastikan controller set session.flash sebelum redirect

### 7. **Edit/Delete Produk Tidak Bekerja**
- **Masalah**: Modal tidak menutup atau data tidak ter-update
- **Solusi**:
  - Check browser Console untuk error messages
  - Lihat Network tab untuk response dari server
  - Pastikan form data di-submit dengan benar

---

## 🌐 API Publik yang Digunakan

Aplikasi ini menggunakan **3 API publik** untuk berbagai fitur:

### 1. Exchange Rate API
- **Nama**: ExchangeRate-API
- **URL**: `https://api.exchangerate-api.com/v4/latest`
- **Fungsi**: Konversi mata uang dan mendapatkan kurs real-time
- **Digunakan untuk**: 
  - Konversi harga produk ke berbagai mata uang
  - Menampilkan exchange rate di halaman Exchange Rate
  - Konversi manual mata uang
- **Dokumentasi**: https://www.exchangerate-api.com/
- **Gratis**: Ya (tanpa API key untuk tier gratis)

### 2. QR Code Generator API
- **Nama**: QR Server API
- **URL**: `https://api.qrserver.com/v1/create-qr-code`
- **Fungsi**: Generate QR code untuk produk dan transaksi
- **Digunakan untuk**: 
  - Generate QR code untuk produk di Public API
  - Tracking produk melalui QR code
- **Dokumentasi**: https://goqr.me/api/
- **Gratis**: Ya (tanpa API key)

### 3. Resend Email API
- **Nama**: Resend API
- **URL**: `https://api.resend.com/emails`
- **Fungsi**: Mengirim email notification
- **Digunakan untuk**: 
  - Email otomatis saat transaksi baru
  - Email notifikasi saat stok menipis
  - Email notification manual dari UI
- **Dokumentasi**: https://resend.com/docs
- **Gratis**: Ya (3,000 email/bulan)
- **Setup**: Perlu API key dari https://resend.com

### Konfigurasi API

Tambahkan ke file `.env`:

```env
# Resend Email API Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@inventaris.com
LOW_STOCK_THRESHOLD=10
```

**Cara mendapatkan Resend API Key:**
1. Daftar di https://resend.com
2. Buat API key di dashboard
3. Verifikasi domain email (untuk production) atau gunakan `onboarding@resend.dev` untuk testing
4. Copy API key ke `.env`

---

## 📚 Dokumentasi Lengkap

### API Documentation
- **OpenAPI/Swagger**: Akses di `http://localhost:3333/api-docs.json`
- **API Documentation**: Lihat file `API_DOCUMENTATION.md` untuk dokumentasi lengkap
- **Postman Collection**: Import `POSTMAN_COLLECTION.json` untuk testing API

### Framework Documentation
- **AdonisJS**: https://docs.adonisjs.com/
- **React**: https://react.dev/
- **Inertia.js**: https://inertiajs.com/
- **Tailwind CSS**: https://tailwindcss.com/docs

### Tools Documentation
- **Vite**: https://vitejs.dev/guide/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Lucid ORM**: https://docs.adonisjs.com/guides/models/introduction

### Public APIs Documentation
- **ExchangeRate-API**: https://www.exchangerate-api.com/
- **Resend Email API**: https://resend.com/docs

---

## 🤝 Kontribusi & Support

Jika menemukan bug atau ingin menambah fitur:
1. Fork repository
2. Buat branch baru (`git checkout -b feature/nama-fitur`)
3. Commit changes (`git commit -m 'Add: deskripsi'`)
4. Push ke branch (`git push origin feature/nama-fitur`)
5. Buat Pull Request

---

## 📝 Lisensi

Project ini menggunakan MIT License. Silakan gunakan sesuai kebutuhan Anda.

---

## 📞 Contact & Support

Jika ada pertanyaan atau butuh bantuan:
- Email: putukelvin70@gmail.com
- GitHub Repository: https://github.com/evyndzz/API-First-Project
- GitHub Issues: https://github.com/evyndzz/API-First-Project/issues

## 📦 Repository Information

- **GitHub Repository**: [https://github.com/evyndzz/API-First-Project](https://github.com/evyndzz/API-First-Project)
- **Folder Lokal Development**: `D:\api4` (atau sesuai lokasi clone Anda)
- **Project Name**: API-First-Project
- **Description**: Inventory Management System dengan API-First Architecture

---

## 🎉 Selamat!

Aplikasi sudah siap dijalankan. Nikmati pengembangan! 🚀

## 🎨 Teknologi UI/UX

### Design System
- **Glassmorphism**: Efek blur dan transparansi modern
- **Gradient Design**: Skema warna dengan gradient (indigo, purple, pink)
- **Smooth Animations**: CSS animations untuk fade-in, scale-in, hover effects
- **Custom Scrollbar**: Scrollbar dengan gradient design
- **Responsive Layout**: Mobile-first approach dengan Tailwind CSS

### Komponen UI
- **Glass Cards**: Cards dengan backdrop-filter blur
- **Gradient Buttons**: Buttons dengan gradient backgrounds
- **Modern Modals**: Modal dengan glassmorphism dan backdrop blur
- **Toast Notifications**: Success toast dengan glassmorphism design
- **Interactive Elements**: Hover effects dan transitions yang halus

### CSS Features
- Custom animations (fade-in, scale-in, blob)
- Glassmorphism utilities (`.glass`, `.glass-dark`)
- Gradient utilities (`.bg-gradient-primary`, `.bg-gradient-secondary`)
- Card hover effects (`.card-hover`)
- Custom scrollbar styling

---

**Last Updated**: December 2025  
**Version**: 2.0.0  
**UI Version**: Modern Glassmorphism Design

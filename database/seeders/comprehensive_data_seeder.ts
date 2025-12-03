import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/kategori'
import Product from '#models/produk'
import Transaction from '#models/transaction'
import Supplier from '#models/supplier'

export default class extends BaseSeeder {
  async run() {
<<<<<<< HEAD
    // Clear existing data
=======
   
>>>>>>> dfea00d (tambahkan)
    await Transaction.query().delete()
    await Product.query().delete()
    await Category.query().delete()
    await Supplier.query().delete()

<<<<<<< HEAD
    // Create suppliers first
=======
>>>>>>> dfea00d (tambahkan)
    const suppliers = await Supplier.createMany([
      {
        nama: 'PT. Tech Solutions Indonesia',
        alamat: 'Jl. Sudirman No. 123, Jakarta Selatan',
        telepon: '021-12345678',
        email: 'info@techsolutions.co.id'
      },
      {
        nama: 'CV. Fashion Store',
        alamat: 'Jl. Kemang Raya No. 456, Jakarta Selatan',
        telepon: '021-87654321',
        email: 'contact@fashionstore.com'
      },
      {
        nama: 'UD. Buku Mandiri',
        alamat: 'Jl. Gatot Subroto No. 789, Jakarta Pusat',
        telepon: '021-11223344',
        email: 'buku@mandiri.co.id'
      }
    ])

<<<<<<< HEAD
    // Create categories
=======
 
>>>>>>> dfea00d (tambahkan)
    const categories = await Category.createMany([
      { nama: 'Electronics' },
      { nama: 'Clothing' },
      { nama: 'Books' },
      { nama: 'Accessories' }
    ])

<<<<<<< HEAD
    // Create products
=======

>>>>>>> dfea00d (tambahkan)
    const products = await Product.createMany([
      {
        nama: 'MacBook Pro M2',
        merk: 'Apple',
        stok: 15,
        harga: 25000000,
        kategori_id: categories[0].id,
        supplier_id: suppliers[0].id
      },
      {
        nama: 'iPhone 15 Pro',
        merk: 'Apple',
        stok: 25,
        harga: 18000000,
        kategori_id: categories[0].id,
        supplier_id: suppliers[0].id
      },
      {
        nama: 'Samsung Galaxy S24',
        merk: 'Samsung',
        stok: 30,
        harga: 15000000,
        kategori_id: categories[0].id,
        supplier_id: suppliers[0].id
      },
      {
        nama: 'Cotton T-Shirt',
        merk: 'Uniqlo',
<<<<<<< HEAD
        stok: 5, // Low stock
=======
        stok: 5, 
>>>>>>> dfea00d (tambahkan)
        harga: 150000,
        kategori_id: categories[1].id,
        supplier_id: suppliers[1].id
      },
      {
        nama: 'Denim Jeans',
        merk: 'Levis',
<<<<<<< HEAD
        stok: 8, // Low stock
=======
        stok: 8, 
>>>>>>> dfea00d (tambahkan)
        harga: 800000,
        kategori_id: categories[1].id,
        supplier_id: suppliers[1].id
      },
      {
        nama: 'JavaScript Guide',
        merk: 'OReilly',
        stok: 12,
        harga: 250000,
        kategori_id: categories[2].id,
        supplier_id: suppliers[2].id
      },
      {
        nama: 'React Handbook',
        merk: 'Packt',
<<<<<<< HEAD
        stok: 7, // Low stock
=======
        stok: 7, 
>>>>>>> dfea00d (tambahkan)
        harga: 300000,
        kategori_id: categories[2].id,
        supplier_id: suppliers[2].id
      }
    ])

<<<<<<< HEAD
    // Create transactions (including today's transactions)
=======
>>>>>>> dfea00d (tambahkan)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)

    await Transaction.createMany([
<<<<<<< HEAD
      // Today's transactions
=======
>>>>>>> dfea00d (tambahkan)
      {
        tipe: 'masuk',
        jumlah: 5,
        catatan: 'Stock masuk dari supplier',
        produk_id: products[0].id,
        created_at: today.toISOString(),
        updated_at: today.toISOString()
      },
      {
        tipe: 'keluar',
        jumlah: 2,
        catatan: 'Penjualan ke customer',
        produk_id: products[1].id,
        created_at: today.toISOString(),
        updated_at: today.toISOString()
      },
      {
        tipe: 'masuk',
        jumlah: 10,
        catatan: 'Restock dari supplier',
        produk_id: products[2].id,
        created_at: today.toISOString(),
        updated_at: today.toISOString()
      },
<<<<<<< HEAD
      // Yesterday's transactions
=======
>>>>>>> dfea00d (tambahkan)
      {
        tipe: 'keluar',
        jumlah: 3,
        catatan: 'Penjualan kemarin',
        produk_id: products[3].id,
        created_at: yesterday.toISOString(),
        updated_at: yesterday.toISOString()
      },
      {
        tipe: 'masuk',
        jumlah: 8,
        catatan: 'Stock masuk kemarin',
        produk_id: products[4].id,
        created_at: yesterday.toISOString(),
        updated_at: yesterday.toISOString()
      },
<<<<<<< HEAD
      // Last week's transactions
=======

>>>>>>> dfea00d (tambahkan)
      {
        tipe: 'keluar',
        jumlah: 1,
        catatan: 'Penjualan minggu lalu',
        produk_id: products[5].id,
        created_at: lastWeek.toISOString(),
        updated_at: lastWeek.toISOString()
      },
      {
        tipe: 'masuk',
        jumlah: 15,
        catatan: 'Bulk order minggu lalu',
        produk_id: products[6].id,
        created_at: lastWeek.toISOString(),
        updated_at: lastWeek.toISOString()
      }
    ])

    console.log('✅ Comprehensive data created successfully!')
    console.log('🏢 Suppliers:', suppliers.length)
    console.log('📂 Categories:', categories.length)
    console.log('📦 Products:', products.length)
    console.log('📋 Transactions:', 7)
    console.log('📊 Today transactions:', 3)
    console.log('⚠️  Low stock items:', 3)
  }
}

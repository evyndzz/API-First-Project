import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Category from '#models/kategori'
import Product from '#models/produk'
import Transaction from '#models/transaction'
import Supplier from '#models/supplier'

export default class extends BaseSeeder {
  async run() {
    // Clear existing data
    await Transaction.query().delete()
    await Product.query().delete()
    await Category.query().delete()
    await Supplier.query().delete()

    // Create suppliers - fokus elektronik
    const suppliers = await Supplier.createMany([
      {
        nama: 'PT. Tech Solutions Indonesia',
        alamat: 'Jl. Sudirman No. 123, Jakarta Selatan',
        telepon: '021-12345678',
        email: 'info@techsolutions.co.id'
      },
      {
        nama: 'CV. Electronic Store',
        alamat: 'Jl. Kemang Raya No. 456, Jakarta Selatan',
        telepon: '021-87654321',
        email: 'contact@electronicstore.com'
      },
      {
        nama: 'PT. Gadget Distributor',
        alamat: 'Jl. Gatot Subroto No. 789, Jakarta Pusat',
        telepon: '021-11223344',
        email: 'sales@gadgetdist.co.id'
      },
      {
        nama: 'UD. Komputer Mandiri',
        alamat: 'Jl. Thamrin No. 321, Jakarta Pusat',
        telepon: '021-55667788',
        email: 'info@komputermandiri.co.id'
      }
    ])

    // Create categories - fokus elektronik
    const categories = await Category.createMany([
      { nama: 'Laptop & Komputer' },
      { nama: 'Smartphone & Tablet' },
      { nama: 'Audio & Headphone' },
      { nama: 'Kamera & Aksesoris' },
      { nama: 'Gaming & Console' },
      { nama: 'Smart Home & IoT' },
      { nama: 'Aksesoris Elektronik' }
    ])

    // Create products - semua produk elektronik
    const products = await Product.createMany([
      // Laptop & Komputer
      {
        nama: 'MacBook Pro M3 14"',
        merk: 'Apple',
        stok: 15,
        harga: 28000000,
        kategori_id: categories[0].id,
        supplier_id: suppliers[0].id
      },
      {
        nama: 'MacBook Air M2 13"',
        merk: 'Apple',
        stok: 20,
        harga: 18000000,
        kategori_id: categories[0].id,
        supplier_id: suppliers[0].id
      },
      {
        nama: 'ASUS ROG Strix G16',
        merk: 'ASUS',
        stok: 8,
        harga: 22000000,
        kategori_id: categories[0].id,
        supplier_id: suppliers[3].id
      },
      {
        nama: 'Lenovo ThinkPad X1 Carbon',
        merk: 'Lenovo',
        stok: 12,
        harga: 25000000,
        kategori_id: categories[0].id,
        supplier_id: suppliers[3].id
      },
      {
        nama: 'Dell XPS 15',
        merk: 'Dell',
        stok: 10,
        harga: 24000000,
        kategori_id: categories[0].id,
        supplier_id: suppliers[3].id
      },
      // Smartphone & Tablet
      {
        nama: 'iPhone 15 Pro Max',
        merk: 'Apple',
        stok: 25,
        harga: 22000000,
        kategori_id: categories[1].id,
        supplier_id: suppliers[0].id
      },
      {
        nama: 'iPhone 15 Pro',
        merk: 'Apple',
        stok: 30,
        harga: 18000000,
        kategori_id: categories[1].id,
        supplier_id: suppliers[0].id
      },
      {
        nama: 'Samsung Galaxy S24 Ultra',
        merk: 'Samsung',
        stok: 18,
        harga: 20000000,
        kategori_id: categories[1].id,
        supplier_id: suppliers[1].id
      },
      {
        nama: 'Samsung Galaxy S24',
        merk: 'Samsung',
        stok: 22,
        harga: 12000000,
        kategori_id: categories[1].id,
        supplier_id: suppliers[1].id
      },
      {
        nama: 'Xiaomi 14 Pro',
        merk: 'Xiaomi',
        stok: 20,
        harga: 15000000,
        kategori_id: categories[1].id,
        supplier_id: suppliers[2].id
      },
      {
        nama: 'iPad Pro 12.9" M2',
        merk: 'Apple',
        stok: 15,
        harga: 18000000,
        kategori_id: categories[1].id,
        supplier_id: suppliers[0].id
      },
      {
        nama: 'Samsung Galaxy Tab S9',
        merk: 'Samsung',
        stok: 12,
        harga: 14000000,
        kategori_id: categories[1].id,
        supplier_id: suppliers[1].id
      },
      // Audio & Headphone
      {
        nama: 'AirPods Pro 2',
        merk: 'Apple',
        stok: 35,
        harga: 4500000,
        kategori_id: categories[2].id,
        supplier_id: suppliers[0].id
      },
      {
        nama: 'Sony WH-1000XM5',
        merk: 'Sony',
        stok: 18,
        harga: 5500000,
        kategori_id: categories[2].id,
        supplier_id: suppliers[2].id
      },
      {
        nama: 'Bose QuietComfort 45',
        merk: 'Bose',
        stok: 15,
        harga: 5000000,
        kategori_id: categories[2].id,
        supplier_id: suppliers[2].id
      },
      {
        nama: 'JBL Flip 6',
        merk: 'JBL',
        stok: 25,
        harga: 2500000,
        kategori_id: categories[2].id,
        supplier_id: suppliers[2].id
      },
      // Kamera & Aksesoris
      {
        nama: 'Canon EOS R6 Mark II',
        merk: 'Canon',
        stok: 8,
        harga: 35000000,
        kategori_id: categories[3].id,
        supplier_id: suppliers[2].id
      },
      {
        nama: 'Sony Alpha A7 IV',
        merk: 'Sony',
        stok: 10,
        harga: 32000000,
        kategori_id: categories[3].id,
        supplier_id: suppliers[2].id
      },
      {
        nama: 'GoPro Hero 12',
        merk: 'GoPro',
        stok: 20,
        harga: 8000000,
        kategori_id: categories[3].id,
        supplier_id: suppliers[2].id
      },
      // Gaming & Console
      {
        nama: 'PlayStation 5',
        merk: 'Sony',
        stok: 12,
        harga: 8500000,
        kategori_id: categories[4].id,
        supplier_id: suppliers[2].id
      },
      {
        nama: 'Xbox Series X',
        merk: 'Microsoft',
        stok: 10,
        harga: 8000000,
        kategori_id: categories[4].id,
        supplier_id: suppliers[2].id
      },
      {
        nama: 'Nintendo Switch OLED',
        merk: 'Nintendo',
        stok: 15,
        harga: 5500000,
        kategori_id: categories[4].id,
        supplier_id: suppliers[2].id
      },
      {
        nama: 'Steam Deck',
        merk: 'Valve',
        stok: 8,
        harga: 12000000,
        kategori_id: categories[4].id,
        supplier_id: suppliers[2].id
      },
      // Smart Home & IoT
      {
        nama: 'Google Nest Hub Max',
        merk: 'Google',
        stok: 20,
        harga: 3500000,
        kategori_id: categories[5].id,
        supplier_id: suppliers[2].id
      },
      {
        nama: 'Amazon Echo Dot 5',
        merk: 'Amazon',
        stok: 30,
        harga: 1500000,
        kategori_id: categories[5].id,
        supplier_id: suppliers[2].id
      },
      {
        nama: 'Philips Hue Starter Kit',
        merk: 'Philips',
        stok: 15,
        harga: 2500000,
        kategori_id: categories[5].id,
        supplier_id: suppliers[2].id
      },
      // Aksesoris Elektronik
      {
        nama: 'Apple Magic Keyboard',
        merk: 'Apple',
        stok: 25,
        harga: 2500000,
        kategori_id: categories[6].id,
        supplier_id: suppliers[0].id
      },
      {
        nama: 'Logitech MX Master 3S',
        merk: 'Logitech',
        stok: 20,
        harga: 1500000,
        kategori_id: categories[6].id,
        supplier_id: suppliers[3].id
      },
      {
        nama: 'Samsung 49" Odyssey G9',
        merk: 'Samsung',
        stok: 5,
        harga: 15000000,
        kategori_id: categories[6].id,
        supplier_id: suppliers[1].id
      },
      {
        nama: 'Anker Power Bank 20000mAh',
        merk: 'Anker',
        stok: 40,
        harga: 500000,
        kategori_id: categories[6].id,
        supplier_id: suppliers[2].id
      }
    ])

    // Create transactions
    const today = DateTime.now()
    const yesterday = DateTime.now().minus({ days: 1 })
    const lastWeek = DateTime.now().minus({ days: 7 })

    // Create transactions with proper dates
    // Today's transactions
    const t1 = await Transaction.create({
      tipe: 'masuk',
      jumlah: 5,
      catatan: 'Stock masuk iPhone 15 Pro dari supplier',
      produk_id: products[6].id,
      supplier_id: suppliers[0].id
    })
    t1.merge({ created_at: today, updated_at: today })
    await t1.save()
    
    const t2 = await Transaction.create({
      tipe: 'keluar',
      jumlah: 2,
      catatan: 'Penjualan MacBook Pro ke customer',
      produk_id: products[0].id
    })
    t2.merge({ created_at: today, updated_at: today })
    await t2.save()
    
    const t3 = await Transaction.create({
      tipe: 'masuk',
      jumlah: 10,
      catatan: 'Restock Samsung Galaxy S24',
      produk_id: products[8].id,
      supplier_id: suppliers[1].id
    })
    t3.merge({ created_at: today, updated_at: today })
    await t3.save()
    
    const t4 = await Transaction.create({
      tipe: 'keluar',
      jumlah: 3,
      catatan: 'Penjualan AirPods Pro',
      produk_id: products[12].id
    })
    t4.merge({ created_at: today, updated_at: today })
    await t4.save()
    
    // Yesterday's transactions
    const t5 = await Transaction.create({
      tipe: 'masuk',
      jumlah: 8,
      catatan: 'Stock masuk PlayStation 5',
      produk_id: products[19].id,
      supplier_id: suppliers[2].id
    })
    t5.merge({ created_at: yesterday, updated_at: yesterday })
    await t5.save()
    
    const t6 = await Transaction.create({
      tipe: 'keluar',
      jumlah: 1,
      catatan: 'Penjualan Canon EOS R6',
      produk_id: products[16].id
    })
    t6.merge({ created_at: yesterday, updated_at: yesterday })
    await t6.save()
    
    const t7 = await Transaction.create({
      tipe: 'masuk',
      jumlah: 15,
      catatan: 'Bulk order Anker Power Bank',
      produk_id: products[29].id,
      supplier_id: suppliers[2].id
    })
    t7.merge({ created_at: yesterday, updated_at: yesterday })
    await t7.save()
    
    // Last week's transactions
    const t8 = await Transaction.create({
      tipe: 'keluar',
      jumlah: 2,
      catatan: 'Penjualan iPad Pro',
      produk_id: products[10].id
    })
    t8.merge({ created_at: lastWeek, updated_at: lastWeek })
    await t8.save()
    
    const t9 = await Transaction.create({
      tipe: 'masuk',
      jumlah: 5,
      catatan: 'Stock masuk Sony WH-1000XM5',
      produk_id: products[13].id,
      supplier_id: suppliers[2].id
    })
    t9.merge({ created_at: lastWeek, updated_at: lastWeek })
    await t9.save()
    
    const t10 = await Transaction.create({
      tipe: 'keluar',
      jumlah: 1,
      catatan: 'Penjualan Xbox Series X',
      produk_id: products[20].id
    })
    t10.merge({ created_at: lastWeek, updated_at: lastWeek })
    await t10.save()

    console.log('✅ Comprehensive electronic data created successfully!')
    console.log('🏢 Suppliers:', suppliers.length, '(Electronic focused)')
    console.log('📂 Categories:', categories.length, '(All electronics)')
    console.log('📦 Products:', products.length, '(All electronic products)')
    console.log('📋 Transactions:', 10)
    console.log('📊 Today transactions:', 4)
    console.log('⚠️  Low stock items:', products.filter(p => p.stok < 10).length)
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/produk'
import Transaction from '#models/transaction'
import { EmailService } from '#services/EmailService'
import User from '#models/user'

const emailService = new EmailService()

export default class EmailNotificationController {
  /**
   * Send low stock notification
   */
  async sendLowStockNotification({ request, response }: HttpContext) {
    try {
      const threshold = request.input('threshold', 10)
      const email = request.input('email')

      if (!email) {
        return response.status(400).json({
          success: false,
          message: 'Email harus diisi'
        })
      }

      // Get products with low stock
      const lowStockProducts = await Product.query()
        .where('stok', '<', threshold)
        .orderBy('stok', 'asc')

      if (lowStockProducts.length === 0) {
        return response.json({
          success: true,
          message: 'Tidak ada produk dengan stok rendah',
          data: { products: [] }
        })
      }

      const products = lowStockProducts.map(p => ({
        nama: p.nama,
        stok: p.stok
      }))

      const result = await emailService.sendLowStockNotification(email, products)

      return response.json({
        success: result.success,
        message: result.success 
          ? 'Notifikasi low stock berhasil dikirim' 
          : 'Gagal mengirim notifikasi',
        data: {
          products,
          emailResult: result
        }
      })
    } catch (error: any) {
      return response.status(500).json({
        success: false,
        message: error.message || 'Gagal mengirim notifikasi low stock'
      })
    }
  }

  /**
   * Send transaction notification
   */
  async sendTransactionNotification({ params, request, response }: HttpContext) {
    try {
      const email = request.input('email')

      if (!email) {
        return response.status(400).json({
          success: false,
          message: 'Email harus diisi'
        })
      }

      const transaction = await Transaction.query()
        .where('id', params.id)
        .preload('product')
        .firstOrFail()

      const result = await emailService.sendTransactionNotification(
        email,
        transaction.tipe as 'masuk' | 'keluar',
        transaction.product?.nama || 'Unknown',
        transaction.jumlah,
        transaction.catatan || undefined
      )

      return response.json({
        success: result.success,
        message: result.success 
          ? 'Notifikasi transaksi berhasil dikirim' 
          : 'Gagal mengirim notifikasi',
        data: {
          transaction: {
            id: transaction.id,
            tipe: transaction.tipe,
            jumlah: transaction.jumlah,
            product: transaction.product?.nama
          },
          emailResult: result
        }
      })
    } catch (error: any) {
      return response.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan'
      })
    }
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts({ request, response }: HttpContext) {
    try {
      const threshold = request.input('threshold', 10)

      const lowStockProducts = await Product.query()
        .where('stok', '<', threshold)
        .orderBy('stok', 'asc')

      return response.json({
        success: true,
        data: lowStockProducts.map(p => ({
          id: p.id,
          nama: p.nama,
          merk: p.merk,
          stok: p.stok,
          harga: p.harga
        }))
      })
    } catch (error: any) {
      return response.status(500).json({
        success: false,
        message: error.message || 'Gagal mengambil data produk low stock'
      })
    }
  }

  /**
   * Get recent transactions
   */
  async getRecentTransactions({ request, response }: HttpContext) {
    try {
      const limit = request.input('limit', 10)

      const transactions = await Transaction.query()
        .preload('product')
        .orderBy('created_at', 'desc')
        .limit(limit)

      return response.json({
        success: true,
        data: transactions.map(t => ({
          id: t.id,
          tipe: t.tipe,
          jumlah: t.jumlah,
          catatan: t.catatan,
          product: t.product?.nama,
          created_at: t.createdAt?.toISO() || t.created_at
        }))
      })
    } catch (error: any) {
      return response.status(500).json({
        success: false,
        message: error.message || 'Gagal mengambil data transaksi'
      })
    }
  }
}


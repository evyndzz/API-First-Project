import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import Product from '#models/produk'
import Supplier from '#models/supplier'
import { EmailService } from '#services/EmailService'
import User from '#models/user'
import env from '#start/env'

const emailService = new EmailService()

export default class TransactionsController {
  /**
   * Display a list of transactions with product relationships
   */
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const type = request.input('type') // 'masuk' or 'keluar'
    
    let query = Transaction.query().preload('product').preload('supplier')
    
    if (type && ['masuk', 'keluar'].includes(type)) {
      query = query.where('tipe', type)
    }
    
    return await query.paginate(page, limit)
  }

  /**
   * Store a new transaction
   */
  async store({ request, response, session }: HttpContext) {
    const data = request.only(['produk_id', 'tipe', 'jumlah', 'catatan', 'supplier_id'])

    if (!data.produk_id || !data.tipe || !data.jumlah) {
      session.flash('error', 'Produk ID, tipe, dan jumlah harus diisi')
      return response.redirect('/transactions')
    }

    if (!['masuk', 'keluar'].includes(data.tipe)) {
      session.flash('error', 'Tipe harus berupa "masuk" atau "keluar"')
      return response.redirect('/transactions')
    }

    const product = await Product.findOrFail(data.produk_id)

    if (data.tipe === 'keluar' && product.stok < data.jumlah) {
      session.flash('error', 'Stok tidak mencukupi')
      return response.redirect('/transactions')
    }

    const transaction = await Transaction.create(data)
    await transaction.load('product')
    await transaction.load('supplier')
    
    const oldStock = product.stok
    if (data.tipe === 'masuk') {
      product.stok += data.jumlah
    } else {
      product.stok -= data.jumlah
    }
    await product.save()
    
    // Send automatic email notification for new transaction
    try {
      const adminEmail = env.get('ADMIN_EMAIL', 'admin@inventaris.com')
      await emailService.sendTransactionNotification(
        adminEmail,
        data.tipe as 'masuk' | 'keluar',
        transaction.product?.nama || 'Unknown',
        transaction.jumlah,
        transaction.catatan || undefined
      )
    } catch (error) {
      console.error('Failed to send transaction email:', error)
      // Don't fail the transaction if email fails
    }
    
    // Check if stock is low and send notification
    const lowStockThreshold = env.get('LOW_STOCK_THRESHOLD', 10)
    if (product.stok < lowStockThreshold && oldStock >= lowStockThreshold) {
      try {
        const adminEmail = env.get('ADMIN_EMAIL', 'admin@inventaris.com')
        await emailService.sendLowStockNotification(adminEmail, [
          { nama: product.nama, stok: product.stok }
        ])
      } catch (error) {
        console.error('Failed to send low stock email:', error)
      }
    }
    
    session.flash('success', 'Transaksi berhasil ditambahkan')
    return response.redirect('/transactions')
  }

  /**
   * Show individual transaction with product relationship
   */
  async show({ params }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('product')
      .preload('supplier')
      .firstOrFail()
    
    return transaction
  }

  /**
   * Update existing transaction
   */
  async update({ params, request, response, session }: HttpContext) {
    try {
      const transaction = await Transaction.findOrFail(params.id)
      const data = request.only(['produk_id', 'tipe', 'jumlah', 'catatan', 'supplier_id'])

      if (!data.produk_id || !data.tipe || !data.jumlah) {
        session.flash('error', 'Produk ID, tipe, dan jumlah harus diisi')
        return response.redirect('/transactions')
      }

      if (!['masuk', 'keluar'].includes(data.tipe)) {
        session.flash('error', 'Tipe harus berupa "masuk" atau "keluar"')
        return response.redirect('/transactions')
      }

      const product = await Product.findOrFail(data.produk_id)

      if (data.tipe === 'keluar' && product.stok < data.jumlah) {
        session.flash('error', 'Stok tidak mencukupi')
        return response.redirect('/transactions')
      }

      transaction.merge(data)
      await transaction.save()
      await transaction.load('product')
      
      session.flash('success', 'Transaksi berhasil diperbarui')
      return response.redirect('/transactions')
    } catch (error) {
      console.error('Update transaction error:', error)
      session.flash('error', 'Terjadi kesalahan saat mengupdate transaksi')
      return response.redirect('/transactions')
    }
  }

  /**
   * Delete transaction
   */
  async destroy({ params, response, session, request }: HttpContext) {
    const transaction = await Transaction.findOrFail(params.id)
    const product = await transaction.related('product').query().firstOrFail()

    if (transaction.tipe === 'masuk') {
      product.stok -= transaction.jumlah
    } else {
      product.stok += transaction.jumlah
    }
    await product.save()
    
    await transaction.delete()
    
    // Check if this is an Inertia request
    if (request.header('X-Inertia')) {
      session.flash('success', 'Transaksi berhasil dihapus')
      return response.redirect('/transactions')
    }
    
    return response.json({ message: 'Transaksi berhasil dihapus' })
  }

  /**
   * Get transactions by product
   */
  async getByProduct({ params }: HttpContext) {
    const transactions = await Transaction.query()
      .where('produk_id', params.productId)
      .preload('product')
      .orderBy('created_at', 'desc')
    
    return transactions
  }

  /**
   * Get transaction statistics
   */
  async stats({ request }: HttpContext) {
    const dateFrom = request.input('dateFrom')
    const dateTo = request.input('dateTo')
    
    let query = Transaction.query()
    
    if (dateFrom) {
      query = query.where('created_at', '>=', dateFrom)
    }
    
    if (dateTo) {
      query = query.where('created_at', '<=', dateTo)
    }
    
    const transactions = await query.preload('product')
    
    const masukCount = transactions.filter(t => t.tipe === 'masuk').length
    const keluarCount = transactions.filter(t => t.tipe === 'keluar').length
    const totalMasuk = transactions
      .filter(t => t.tipe === 'masuk')
      .reduce((sum, t) => sum + t.jumlah, 0)
    const totalKeluar = transactions
      .filter(t => t.tipe === 'keluar')
      .reduce((sum, t) => sum + t.jumlah, 0)
    
    return {
      totalTransactions: transactions.length,
      masukCount,
      keluarCount,
      totalMasuk,
      totalKeluar,
      netChange: totalMasuk - totalKeluar
    }
  }

  /**
   * Search transactions
   */
  async search({ request }: HttpContext) {
    const searchTerm = request.input('search', '')
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    return await Transaction.query()
      .whereHas('product', (productQuery) => {
        productQuery.where('nama', 'like', `%${searchTerm}%`)
      })
      .orWhere('catatan', 'like', `%${searchTerm}%`)
      .preload('product')
      .paginate(page, limit)
  }
}

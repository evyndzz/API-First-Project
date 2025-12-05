import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/kategori'
import Product from '#models/produk'
import Transaction from '#models/transaction'
import { DateTime } from 'luxon'

export default class DashboardController {
  /**
   * Get dashboard statistics
   */
  async index({ inertia }: HttpContext) {
    try {
      // Get total products count
      const totalProductsResult = await Product.query().count('* as total')
      const totalProducts = Number(totalProductsResult[0].$extras.total || 0)
      
      // Get total categories count
      const totalCategoriesResult = await Category.query().count('* as total')
      const totalCategories = Number(totalCategoriesResult[0].$extras.total || 0)
      
      // Get today's transactions count - use Luxon for proper date handling
      const startOfToday = DateTime.now().startOf('day').toSQL()
      const todayTransactionsResult = await Transaction.query()
        .where('created_at', '>=', startOfToday)
        .count('* as total')
      const todayTransactions = Number(todayTransactionsResult[0].$extras.total || 0)
      
      // Get low stock items (stok < 10)
      const lowStockItemsResult = await Product.query()
        .where('stok', '<', 10)
        .count('* as total')
      const lowStockItems = Number(lowStockItemsResult[0].$extras.total || 0)
      
      // Get recent transactions (last 10)
      const recentTransactions = await Transaction.query()
        .preload('product')
        .orderBy('created_at', 'desc')
        .limit(10)
      
      // Serialize transactions with proper date formatting
      const serializedTransactions = recentTransactions.map(transaction => ({
        id: transaction.id,
        tipe: transaction.tipe,
        jumlah: transaction.jumlah,
        created_at: transaction.createdAt?.toISO() || transaction.created_at?.toISO() || new Date().toISOString(),
        product: {
          nama: transaction.product?.nama || 'Unknown'
        }
      }))
      
      // Get products by category for chart data
      const productsByCategory = await Category.query()
        .preload('products')
        .select('id', 'nama')
      
      console.log('Stats being sent:', {
        totalProducts,
        totalCategories,
        todayTransactions,
        lowStockItems,
        transactionsCount: serializedTransactions.length
      })
      
      return inertia.render('dashboard', { 
        stats: {
          totalProducts,
          totalCategories,
          todayTransactions,
          lowStockItems,
          recentTransactions: serializedTransactions,
          productsByCategory: productsByCategory.map(cat => ({
            id: cat.id,
            nama: cat.nama,
            products: cat.products
          }))
        }
      })
    } catch (error) {
      console.error('Dashboard error:', error)
      return inertia.render('dashboard', { 
        stats: {
          totalProducts: 0,
          totalCategories: 0,
          todayTransactions: 0,
          lowStockItems: 0,
          recentTransactions: [],
          productsByCategory: []
        }
      })
    }
  }
}

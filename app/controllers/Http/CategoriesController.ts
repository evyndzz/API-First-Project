import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/kategori'

export default class CategoriesController {
  /**
   * Display a list of categories with their products
   */
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    
    return await Category.query()
      .preload('products')
      .paginate(page, limit)
  }

  /**
   * Store a new category
   */
  async store({ request, response, session }: HttpContext) {
    const data = request.only(['nama'])

    if (!data.nama) {
      session.flash('error', 'Nama kategori harus diisi')
      return response.redirect('/categories')
    }

    const category = await Category.create(data)
    session.flash('success', 'Kategori berhasil ditambahkan')
    return response.redirect('/categories')
  }

  /**
   * Show individual category with its products
   */
  async show({ params }: HttpContext) {
    const category = await Category.query()
      .where('id', params.id)
      .preload('products')
      .firstOrFail()
    
    return category
  }

  /**
   * Update existing category
   */
  async update({ params, request, response, session }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const data = request.only(['nama'])
    
    category.merge(data)
    await category.save()
    
    session.flash('success', 'Kategori berhasil diperbarui')
    return response.redirect('/categories')
  }

  /**
   * Delete category
   */
  async destroy({ params, response, session, request }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const productCount = await category.related('products').query().count('* as total')
    if (productCount[0].total > 0) {
      if (request.header('X-Inertia')) {
        session.flash('error', 'Tidak dapat menghapus kategori yang masih memiliki produk')
        return response.redirect('/categories')
      }
      return response.json({ error: 'Tidak dapat menghapus kategori yang masih memiliki produk' })
    }
    await category.delete()
    
    // Check if this is an Inertia request
    if (request.header('X-Inertia')) {
      session.flash('success', 'Kategori berhasil dihapus')
      return response.redirect('/categories')
    }
    
    return response.json({ message: 'Kategori berhasil dihapus' })
  }

  /**
   * Get category statistics
   */
  async stats({ params }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const products = await category.related('products').query()
    
    const totalProducts = products.length
    const totalStock = products.reduce((sum, product) => sum + product.stok, 0)
    const averagePrice = products.length > 0 
      ? products.reduce((sum, product) => sum + product.harga, 0) / products.length 
      : 0
    
    return {
      category: category,
      stats: {
        totalProducts,
        totalStock,
        averagePrice: Math.round(averagePrice * 100) / 100
      }
    }
  }

  /**
   * Search categories by name
   */
  async search({ request }: HttpContext) {
    const searchTerm = request.input('search', '')
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    return await Category.query()
      .where('nama', 'like', `%${searchTerm}%`)
      .preload('products')
      .paginate(page, limit)
  }
}

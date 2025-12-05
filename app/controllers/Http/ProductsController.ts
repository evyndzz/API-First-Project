import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/produk'

export default class ProductsController {
  /**
   * Display a list of products with pagination and category relationships
   */
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    
    return await Product.query()
      .preload('category')
      .paginate(page, limit)
  }

  /**
   * Store a new product
   */
  async store({ request, response, session }: HttpContext) {
    const data = request.only(['nama', 'merk', 'stok', 'harga', 'kategori_id'])

    if (!data.nama || !data.harga || !data.kategori_id) {
      session.flash('error', 'Nama, harga, dan kategori_id harus diisi')
      return response.redirect('/products')
    }

    const product = await Product.create(data)
    await product.load('category')
    
    session.flash('success', 'Produk berhasil ditambahkan')
    return response.redirect('/products')
  }

  /**
   * Show individual product with category relationship
   */
  async show({ params }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .preload('category')
      .firstOrFail()
    
    return product
  }

  /**
   * Update existing product
   */
  async update({ params, request, response, session }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      const data = request.only(['nama', 'merk', 'stok', 'harga', 'kategori_id'])

      if (data.nama && data.nama.length > 255) {
        session.flash('error', 'Nama produk tidak boleh melebihi 255 karakter')
        return response.redirect('/products')
      }
      if (data.merk && data.merk.length > 255) {
        session.flash('error', 'Nama merk tidak boleh melebihi 255 karakter')
        return response.redirect('/products')
      }
      if (data.stok !== undefined && data.stok < 0) {
        session.flash('error', 'Stok tidak boleh negatif')
        return response.redirect('/products')
      }
      if (data.harga !== undefined && data.harga <= 0) {
        session.flash('error', 'Harga harus lebih dari 0')
        return response.redirect('/products')
      }

      product.merge(data)
      await product.save()
      await product.load('category')
      
      session.flash('success', 'Produk berhasil diperbarui')
      return response.redirect('/products')
    } catch (error) {
      console.error('Error updating product:', error)
      session.flash('error', 'Error mengupdate produk')
      return response.redirect('/products')
    }
  }

  /**
   * Delete product
   */
  async destroy({ params, response, session, request }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    
    // Check if this is an Inertia request
    if (request.header('X-Inertia')) {
      session.flash('success', 'Product berhasil dihapus')
      return response.redirect('/products')
    }
    
    return response.json({ message: 'Product berhasil dihapus' })
  }

  /**
   * Get products by category
   */
  async getByCategory({ params }: HttpContext) {
    const products = await Product.query()
      .where('kategori_id', params.categoryId)
      .preload('category')
    
    return products
  }

  /**
   * Search products by name
   */
  async search({ request }: HttpContext) {
    const searchTerm = request.input('search', '')
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    return await Product.query()
      .where('nama', 'like', `%${searchTerm}%`)
      .orWhere('merk', 'like', `%${searchTerm}%`)
      .preload('category')
      .paginate(page, limit)
  }
}

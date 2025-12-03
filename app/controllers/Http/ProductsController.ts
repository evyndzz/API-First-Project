import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/produk'

export default class ProductsController {
<<<<<<< HEAD
  /**
   * Display a list of products with pagination and category relationships
   */
=======
>>>>>>> dfea00d (tambahkan)
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    
    return await Product.query()
      .preload('category')
      .paginate(page, limit)
  }

<<<<<<< HEAD
  /**
   * Store a new product
   */
  async store({ request }: HttpContext) {
    const data = request.only(['nama', 'merk', 'stok', 'harga', 'kategori_id'])
    
    // Validate required fields
=======
  async store({ request }: HttpContext) {
    const data = request.only(['nama', 'merk', 'stok', 'harga', 'kategori_id'])

>>>>>>> dfea00d (tambahkan)
    if (!data.nama || !data.harga || !data.kategori_id) {
      return { error: 'Nama, harga, dan kategori_id harus diisi' }
    }

    const product = await Product.create(data)
    await product.load('category')
    
    return product
  }

<<<<<<< HEAD
  /**
   * Show individual product with category relationship
   */
=======
>>>>>>> dfea00d (tambahkan)
  async show({ params }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .preload('category')
      .firstOrFail()
    
    return product
  }

<<<<<<< HEAD
  /**
   * Update existing product
   */
  async update({ params, request }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const data = request.only(['nama', 'merk', 'stok', 'harga', 'kategori_id'])
    
    product.merge(data)
    await product.save()
    await product.load('category')
    
    return product
  }

  /**
   * Delete product
   */
=======
  async update({ params, request }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      const data = request.only(['nama', 'merk', 'stok', 'harga', 'kategori_id'])

      if (data.nama && data.nama.length > 255) {
        return { error: 'Product name cannot exceed 255 characters' }
      }
      if (data.merk && data.merk.length > 255) {
        return { error: 'Brand name cannot exceed 255 characters' }
      }
      if (data.stok !== undefined && data.stok < 0) {
        return { error: 'Stock cannot be negative' }
      }
      if (data.harga !== undefined && data.harga <= 0) {
        return { error: 'Price must be greater than 0' }
      }

      product.merge(data)
      await product.save()
      await product.load('category')
      
      return product
    } catch (error) {
      console.error('Error updating product:', error)
      return { error: 'Error updating product' }
    }
  }

>>>>>>> dfea00d (tambahkan)
  async destroy({ params }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    
    return { message: 'Product berhasil dihapus' }
  }

<<<<<<< HEAD
  /**
   * Get products by category
   */
=======
>>>>>>> dfea00d (tambahkan)
  async getByCategory({ params }: HttpContext) {
    const products = await Product.query()
      .where('kategori_id', params.categoryId)
      .preload('category')
    
    return products
  }

<<<<<<< HEAD
  /**
   * Search products by name
   */
=======
>>>>>>> dfea00d (tambahkan)
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

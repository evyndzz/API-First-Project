import type { HttpContext } from '@adonisjs/core/http'
import Supplier from '#models/supplier'

export default class SuppliersController {
  /**
   * Display a list of suppliers
   */
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    
    return await Supplier.query()
      .preload('products')
      .paginate(page, limit)
  }

  /**
   * Store a new supplier
   */
  async store({ request, response, session }: HttpContext) {
    const data = request.only(['nama', 'alamat', 'telepon', 'email'])

    if (!data.nama) {
      session.flash('error', 'Nama supplier harus diisi')
      return response.redirect('/suppliers')
    }

    const supplier = await Supplier.create(data)
    session.flash('success', 'Supplier berhasil ditambahkan')
    return response.redirect('/suppliers')
  }

  /**
   * Show individual supplier with products
   */
  async show({ params }: HttpContext) {
    const supplier = await Supplier.query()
      .where('id', params.id)
      .preload('products')
      .firstOrFail()
    
    return supplier
  }

  /**
   * Update existing supplier
   */
  async update({ params, request, response, session }: HttpContext) {
    const supplier = await Supplier.findOrFail(params.id)
    const data = request.only(['nama', 'alamat', 'telepon', 'email'])
    
    supplier.merge(data)
    await supplier.save()
    
    session.flash('success', 'Supplier berhasil diperbarui')
    return response.redirect('/suppliers')
  }

  /**
   * Delete supplier
   */
  async destroy({ params, response, session, request }: HttpContext) {
    const supplier = await Supplier.findOrFail(params.id)
    const productCount = await supplier.related('products').query().count('* as total')
    if (productCount[0].total > 0) {
      if (request.header('X-Inertia')) {
        session.flash('error', 'Tidak dapat menghapus supplier yang masih memiliki produk')
        return response.redirect('/suppliers')
      }
      return response.json({ error: 'Tidak dapat menghapus supplier yang masih memiliki produk' })
    }
    await supplier.delete()
    
    // Check if this is an Inertia request
    if (request.header('X-Inertia')) {
      session.flash('success', 'Supplier berhasil dihapus')
      return response.redirect('/suppliers')
    }
    
    return response.json({ message: 'Supplier berhasil dihapus' })
  }

  /**
   * Search suppliers by name
   */
  async search({ request }: HttpContext) {
    const searchTerm = request.input('search', '')
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    return await Supplier.query()
      .where('nama', 'like', `%${searchTerm}%`)
      .preload('products')
      .paginate(page, limit)
  }
}

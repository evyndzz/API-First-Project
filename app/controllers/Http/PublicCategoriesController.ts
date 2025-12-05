import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/kategori'

/**
 * @swagger
 * /api/public/categories:
 *   get:
 *     tags:
 *       - Public API
 *     summary: Mendapatkan daftar kategori
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diambil
 */
export default class PublicCategoriesController {
  async index({ response }: HttpContext) {
    try {
      const categories = await Category.query()
        .withCount('products')
        .orderBy('nama')

      const processedCategories = categories.map((category) => ({
        id: category.id,
        nama: category.nama,
        products_count: category.$extras.products_count || 0
      }))

      return response.json({
        success: true,
        data: processedCategories
      })
    } catch (error: any) {
      return response.status(500).json({
        success: false,
        message: error.message || 'Gagal mengambil data kategori'
      })
    }
  }
}


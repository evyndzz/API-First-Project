import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/kategori'

/**
 * @swagger
 * components:
 *   schemas:
 *     PublicCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         nama:
 *           type: string
 *         products_count:
 *           type: number
 */
export default class PublicCategoriesController {
  /**
   * @swagger
   * /api/public/categories:
   *   get:
   *     tags:
   *       - Public API
   *     summary: Mendapatkan daftar kategori
   *     description: Mengembalikan daftar semua kategori dengan jumlah produk
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Daftar kategori berhasil diambil
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/PublicCategory'
   *       401:
   *         description: Unauthorized
   */
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

